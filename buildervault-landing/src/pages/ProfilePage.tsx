import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Edit3, Check, X, Loader2, ThumbsUp, ThumbsDown, MessageSquare, Link2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useCommunity, Post, Profile } from "@/hooks/useCommunity";
import { supabase } from "@/lib/supabase";

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  return Math.floor(h / 24) + "d";
}

function AvatarCircle({ profile, size = "lg" }: { profile: Profile | null; size?: "sm" | "md" | "lg" }) {
  const addr = profile?.wallet_address ?? "0x0000";
  const colors = ["#6EE7B7", "#22D3EE", "#7C3AED", "#F59E0B", "#EC4899"];
  const color = colors[parseInt(addr.slice(2, 4), 16) % colors.length];
  const sizeClass = size === "lg" ? "h-24 w-24 text-2xl" : size === "md" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt="avatar"
        className={`${sizeClass} rounded-full object-cover border-4 border-[#0A0F1E]`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold border-4 border-[#0A0F1E] text-[#0A0F1E]`}
      style={{ backgroundColor: color }}
    >
      {addr.slice(2, 4).toUpperCase()}
    </div>
  );
}

export function ProfilePage() {
  const { address: paramAddress } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { address: myAddress, connect } = useWallet();

  // isOwn: true if no param (own profile route) OR addresses match case-insensitively
  const isOwn = !paramAddress || (!!myAddress && myAddress.toLowerCase() === paramAddress.toLowerCase());
  const targetAddress = paramAddress ?? myAddress ?? "";

  const { fetchPosts, votePost } = useCommunity();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", targetAddress.toLowerCase())
      .single();

    if (!data) {
      await supabase.from("profiles").insert({ wallet_address: targetAddress.toLowerCase() });
      const { data: newData } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", targetAddress.toLowerCase())
        .single();
      data = newData;
    }

    setProfile(data as Profile);
    setEditUsername(data?.username ?? "");
    setEditBio(data?.bio ?? "");

    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following", targetAddress.toLowerCase());

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower", targetAddress.toLowerCase());

    setFollowerCount(followers ?? 0);
    setFollowingCount(following ?? 0);

    if (myAddress && !isOwn) {
      const { data: followData } = await supabase
        .from("follows")
        .select("follower")
        .eq("follower", myAddress.toLowerCase())
        .eq("following", targetAddress.toLowerCase())
        .single();
      setIsFollowing(!!followData);
    }

    setLoading(false);
  }, [targetAddress, myAddress, isOwn]);

  const loadPosts = useCallback(async () => {
    if (!targetAddress) return;
    const all = await fetchPosts(myAddress ?? undefined);
    const mine = all.filter((p) => p.wallet_address.toLowerCase() === targetAddress.toLowerCase());
    setPosts(mine);
  }, [fetchPosts, targetAddress, myAddress]);

  useEffect(() => {
    const run = async () => {
      await loadProfile();
      await loadPosts();
    };
    void run();
  }, [loadProfile, loadPosts]);

  const handleSave = async () => {
    if (!myAddress) return;
    await supabase
      .from("profiles")
      .update({ username: editUsername.trim() || null, bio: editBio.trim() || null })
      .eq("wallet_address", myAddress.toLowerCase());
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    void loadProfile();
    navigate("/community");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !myAddress) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${myAddress.toLowerCase()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("wallet_address", myAddress.toLowerCase());
      void loadProfile();
    }
    setUploading(false);
  };

  const handleFollow = async () => {
    if (!myAddress) { connect(); return; }
    if (isFollowing) {
      await supabase.from("follows").delete()
        .eq("follower", myAddress.toLowerCase()).eq("following", targetAddress.toLowerCase());
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await supabase.from("follows").insert({
        follower: myAddress.toLowerCase(),
        following: targetAddress.toLowerCase()
      });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  };

  const handleVote = async (postId: string, value: 1 | -1) => {
    if (!myAddress) { connect(); return; }
    await votePost(myAddress, postId, value);
    void loadPosts();
  };

  const copyAddress = () => {
    void navigator.clipboard.writeText(targetAddress);
  };

  // If no wallet connected and no param, show connect prompt
  if (!targetAddress) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-sm">Connect your wallet to view your profile</p>
        <button onClick={connect} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-6 py-2.5 text-sm font-bold text-[#0A0F1E]">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] pt-20 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#6EE7B7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-16">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <div className="sticky top-16 z-10 bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/community")} className="rounded-full p-2 hover:bg-white/5 transition-colors text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-white">{profile?.username ?? shortAddr(targetAddress)}</h2>
            <p className="text-xs text-white/40">{posts.length} posts</p>
          </div>
        </div>

        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#6EE7B7]/30 via-[#22D3EE]/20 to-[#7C3AED]/30" />

        {/* Profile Header */}
        <div className="px-4 pb-4 border-b border-white/5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <AvatarCircle profile={profile} size="lg" />
              {isOwn && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Upload photo"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#0A0F1E] border-2 border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin text-white" /> : <Camera size={14} className="text-white" />}
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-[#6EE7B7] flex items-center gap-1">
                  <Check size={12} /> Saved!
                </span>
              )}
              {isOwn ? (
                editing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(false); }}
                      className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/60 hover:bg-white/5 flex items-center gap-1.5"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={() => void handleSave()}
                      className="rounded-full bg-white text-[#0A0F1E] px-4 py-1.5 text-sm font-bold flex items-center gap-1.5"
                    >
                      <Check size={14} /> Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/5 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                )
              ) : (
                <button
                  onClick={() => void handleFollow()}
                  className={`rounded-full px-5 py-1.5 text-sm font-bold transition-all ${
                    isFollowing
                      ? "border border-white/20 text-white hover:border-red-400/50 hover:text-red-400"
                      : "bg-white text-[#0A0F1E] hover:bg-white/90"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Display Name</label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Your name"
                  maxLength={30}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell builders about yourself..."
                  maxLength={160}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none resize-none"
                />
                <p className="text-right text-xs text-white/30 mt-1">{editBio.length}/160</p>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setEditing(false)} className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 hover:bg-white/5">
                  Cancel
                </button>
                <button onClick={() => void handleSave()} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-6 py-2 text-sm font-bold text-[#0A0F1E]">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-white">
                {profile?.username ?? shortAddr(targetAddress)}
              </h1>
              <button onClick={copyAddress} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 mt-0.5 transition-colors">
                <Link2 size={12} />
                {shortAddr(targetAddress)}
              </button>
              {profile?.bio && (
                <p className="mt-3 text-[15px] text-white/80 leading-relaxed">{profile.bio}</p>
              )}
              {isOwn && !profile?.username && !profile?.bio && (
                <p className="mt-3 text-sm text-white/30 italic">
                  Click "Edit Profile" to add your name and bio
                </p>
              )}
            </div>
          )}

          <div className="flex gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{followingCount}</span>
              <span className="text-sm text-white/50">Following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{followerCount}</span>
              <span className="text-sm text-white/50">Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{posts.length}</span>
              <span className="text-sm text-white/50">Posts</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <div className="border-b border-white/5 px-4 py-3">
            <h3 className="font-bold text-white text-sm">Posts</h3>
          </div>
          {posts.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              {isOwn ? "You haven't posted yet. Share what you're building!" : "No posts yet."}
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-white/5 px-4 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex gap-3">
                  <AvatarCircle profile={profile} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{profile?.username ?? shortAddr(targetAddress)}</span>
                      <span className="text-white/30 text-xs">·</span>
                      <span className="text-white/40 text-xs">{timeAgo(post.created_at)}</span>
                    </div>
                    <p className="mt-1 text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
                    <div className="flex items-center gap-5 mt-3">
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-[#6EE7B7] transition-colors">
                        <MessageSquare size={15} />
                        <span className="text-xs">{post.comment_count ?? 0}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => void handleVote(post.id, 1)}
                          className={`p-1 rounded transition-colors ${post.user_vote === 1 ? "text-[#6EE7B7]" : "text-white/40 hover:text-[#6EE7B7]"}`}
                        >
                          <ThumbsUp size={15} />
                        </button>
                        <span className="text-xs text-white/40 min-w-[20px] text-center">{post.vote_count ?? 0}</span>
                        <button
                          onClick={() => void handleVote(post.id, -1)}
                          className={`p-1 rounded transition-colors ${post.user_vote === -1 ? "text-red-400" : "text-white/40 hover:text-red-400"}`}
                        >
                          <ThumbsDown size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}