import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Profile {
  wallet_address: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  wallet_address: string;
  content: string;
  created_at: string;
  profile?: Profile;
  vote_count?: number;
  comment_count?: number;
  user_vote?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  wallet_address: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface Job {
  id: string;
  wallet_address: string;
  title: string;
  description: string;
  skills: string[];
  budget: string | null;
  job_type: string;
  is_open: boolean;
  created_at: string;
  profile?: Profile;
}

export function useCommunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureProfile = useCallback(async (wallet: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("wallet_address")
      .eq("wallet_address", wallet)
      .single();
    if (!data) {
      await supabase.from("profiles").insert({ wallet_address: wallet });
    }
  }, []);

  const fetchPosts = useCallback(async (wallet?: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profile:profiles(wallet_address, username, bio, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return [];

    const posts = data as Post[];

    const enriched = await Promise.all(
      posts.map(async (post) => {
        const { data: votes } = await supabase
          .from("votes")
          .select("value, wallet_address")
          .eq("post_id", post.id);
        const { count } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        const vote_count = votes?.reduce((sum, v) => sum + v.value, 0) ?? 0;
        const user_vote = wallet
          ? (votes?.find((v) => v.wallet_address === wallet)?.value ?? 0)
          : 0;
        return { ...post, vote_count, comment_count: count ?? 0, user_vote };
      })
    );
    return enriched;
  }, []);

  const createPost = useCallback(async (wallet: string, content: string) => {
    if (!content.trim()) return false;
    setLoading(true);
    setError(null);
    try {
      await ensureProfile(wallet);
      const { error } = await supabase.from("posts").insert({
        wallet_address: wallet,
        content: content.trim(),
      });
      if (error) throw error;
      return true;
    } catch (e: unknown) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ensureProfile]);

  const votePost = useCallback(async (wallet: string, postId: string, value: 1 | -1) => {
    await ensureProfile(wallet);
    const { data: existing } = await supabase
      .from("votes")
      .select("value")
      .eq("post_id", postId)
      .eq("wallet_address", wallet)
      .single();

    if (existing?.value === value) {
      await supabase.from("votes").delete()
        .eq("post_id", postId).eq("wallet_address", wallet);
    } else {
      await supabase.from("votes").upsert({
        post_id: postId,
        wallet_address: wallet,
        value,
      });
    }
  }, [ensureProfile]);

  const fetchComments = useCallback(async (postId: string) => {
    const { data } = await supabase
      .from("comments")
      .select("*, profile:profiles(wallet_address, username, bio, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    return (data as Comment[]) ?? [];
  }, []);

  const createComment = useCallback(async (wallet: string, postId: string, content: string) => {
    if (!content.trim()) return false;
    setLoading(true);
    try {
      await ensureProfile(wallet);
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        wallet_address: wallet,
        content: content.trim(),
      });
      if (error) throw error;
      return true;
    } catch (e: unknown) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ensureProfile]);

  const fetchJobs = useCallback(async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*, profile:profiles(wallet_address, username, bio, avatar_url)")
      .eq("is_open", true)
      .order("created_at", { ascending: false });
    return (data as Job[]) ?? [];
  }, []);

  const createJob = useCallback(async (
    wallet: string,
    job: { title: string; description: string; skills: string[]; budget: string; job_type: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await ensureProfile(wallet);
      const { error } = await supabase.from("jobs").insert({
        wallet_address: wallet,
        ...job,
      });
      if (error) throw error;
      return true;
    } catch (e: unknown) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ensureProfile]);

  const applyJob = useCallback(async (wallet: string, jobId: string, coverLetter: string) => {
    setLoading(true);
    setError(null);
    try {
      await ensureProfile(wallet);
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobId,
        wallet_address: wallet,
        cover_letter: coverLetter,
      });
      if (error) throw error;
      return true;
    } catch (e: unknown) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ensureProfile]);

  return {
    loading,
    error,
    fetchPosts,
    createPost,
    votePost,
    fetchComments,
    createComment,
    fetchJobs,
    createJob,
    applyJob,
  };
}