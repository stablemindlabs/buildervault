import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Bell, Users, MessageSquare, Briefcase,
  ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Loader2, Plus, X, Image
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useCommunity, Post, Job, Comment } from "@/hooks/useCommunity";

type Tab = "home" | "explore" | "notifications" | "following" | "messages" | "jobs";

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

function Avatar({ addr, size = 10 }: { addr: string; size?: number }) {
  const colors = ["#6EE7B7", "#22D3EE", "#7C3AED", "#F59E0B", "#EC4899"];
  const color = colors[parseInt(addr.slice(2, 4), 16) % colors.length];
  return (
    <div
      className={`h-${size} w-${size} shrink-0 rounded-full flex items-center justify-center text-[#0A0F1E] text-xs font-bold`}
      style={{ backgroundColor: color }}
    >
      {addr.slice(2, 4).toUpperCase()}
    </div>
  );
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Search },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "following", label: "Following", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "jobs", label: "Jobs", icon: Briefcase },
] as const;

export function CommunityPage() {
  const [tab, setTab] = useState<Tab>("home");
  const { isConnected, connect, address } = useWallet();
  const {
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
  } = useCommunity();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchPosts(address ?? undefined);
    setPosts(data);
    setRefreshing(false);
  }, [fetchPosts, address]); 

  const loadJobs = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchJobs();
    setJobs(data);
    setRefreshing(false);
  }, [fetchJobs]); 

  useEffect(() => {
    const run = async () => {
      if (tab === "home" || tab === "explore") await loadPosts();
      else if (tab === "jobs") await loadJobs();
    };
    void run();
  }, [tab, loadPosts, loadJobs]);

  const handleVote = async (postId: string, value: 1 | -1) => {
    if (!address) { connect(); return; }
    await votePost(address, postId, value);
    void loadPosts();
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-16">
      <div className="mx-auto flex max-w-6xl">
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-64 flex-col gap-1 px-3 py-6 sticky top-16 h-[calc(100vh-4rem)] shrink-0">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-4 rounded-full px-4 py-3 text-left text-[15px] font-medium transition-all hover:bg-white/5 ${
                tab === id ? "text-white" : "text-white/60"
              }`}
            >
              <Icon size={22} className={tab === id ? "text-[#6EE7B7]" : ""} />
              {label}
              {tab === id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" />}
            </button>
          ))}

          {/* Profile Card */}
          {isConnected && address ? (
            <button
              onClick={() => navigate(`/profile/${address}`)}
              className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors text-left w-full"
            >
              <Avatar addr={address} size={10} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{shortAddr(address)}</p>
                <p className="text-xs text-white/40">View Profile</p>
              </div>
            </button>
          ) : (
            <button
              onClick={connect}
              className="mt-4 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-5 py-2.5 text-sm font-semibold text-[#0A0F1E]"
            >
              Connect Wallet
            </button>
          )}
        </aside>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 inset-x-0 z-40 flex md:hidden border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
          {NAV_ITEMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex justify-center py-3 ${tab === id ? "text-[#6EE7B7]" : "text-white/40"}`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        {/* Main Feed */}
        <main className="flex-1 min-w-0 border-x border-white/5">
          <div className="sticky top-16 z-10 border-b border-white/5 bg-[#0A0F1E]/90 backdrop-blur-xl px-4 py-3">
            <h2 className="text-lg font-bold text-white">
              {NAV_ITEMS.find((n) => n.id === tab)?.label}
            </h2>
          </div>

          <div className="pb-20 md:pb-0">
            {(tab === "home" || tab === "explore") && (
              <FeedView
                posts={posts}
                address={address}
                isConnected={isConnected}
                connect={connect}
                handleVote={handleVote}
                loading={loading}
                refreshing={refreshing}
                createPost={createPost}
                fetchComments={fetchComments}
                createComment={createComment}
                loadPosts={loadPosts}
                navigate={navigate}
              />
            )}
            {tab === "jobs" && (
              <JobsView
                jobs={jobs}
                address={address}
                isConnected={isConnected}
                connect={connect}
                createJob={createJob}
                applyJob={applyJob}
                loading={loading}
                refreshing={refreshing}
                loadJobs={loadJobs}
              />
            )}
            {(tab === "notifications" || tab === "following" || tab === "messages") && (
              <div className="flex flex-col items-center justify-center py-24 text-white/30">
                <div className="text-5xl mb-4">
                  {tab === "notifications" ? "🔔" : tab === "following" ? "👥" : "💬"}
                </div>
                <p className="text-sm">Coming soon</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel */}
        <aside className="hidden lg:block w-80 shrink-0 px-4 py-6 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="font-bold text-white mb-3">Builder Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Posts</span>
                <span className="text-white font-medium">{posts.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Open Jobs</span>
                <span className="text-white font-medium">{jobs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Network</span>
                <span className="text-[#6EE7B7] font-medium">OPN Testnet</span>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="font-bold text-white mb-3">Who to Follow</h3>
            <p className="text-sm text-white/40">Connect your wallet to see suggestions</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FeedView({ posts, address, isConnected, connect, handleVote, loading, refreshing, createPost, fetchComments, createComment, loadPosts, navigate }: {
  posts: Post[];
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  handleVote: (id: string, v: 1 | -1) => void;
  loading: boolean;
  refreshing: boolean;
  createPost: (wallet: string, content: string) => Promise<boolean>;
  fetchComments: (id: string) => Promise<Comment[]>;
  createComment: (wallet: string, postId: string, content: string) => Promise<boolean>;
  loadPosts: () => void;
  navigate: (path: string) => void;
}) {
  const [content, setContent] = useState("");

  const handlePost = async () => {
    if (!address || !content.trim()) return;
    const ok = await createPost(address, content);
    if (ok) { setContent(""); void loadPosts(); }
  };

  return (
    <div>
      {isConnected && address ? (
        <div className="border-b border-white/5 px-4 py-4">
          <div className="flex gap-3">
            <button onClick={() => navigate(`/profile/${address}`)}>
              <Avatar addr={address} size={10} />
            </button>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are you building?"
                rows={3}
                className="w-full bg-transparent text-white placeholder:text-white/30 text-[15px] resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                <button className="text-[#6EE7B7] hover:bg-[#6EE7B7]/10 rounded-full p-2 transition-colors">
                  <Image size={18} />
                </button>
                <button
                  onClick={() => void handlePost()}
                  disabled={loading || !content.trim()}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-5 py-1.5 text-sm font-bold text-[#0A0F1E] disabled:opacity-50"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b border-white/5 px-4 py-6 text-center">
          <p className="text-white/50 text-sm mb-3">Connect wallet to join the conversation</p>
          <button onClick={connect} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-6 py-2 text-sm font-bold text-[#0A0F1E]">
            Connect Wallet
          </button>
        </div>
      )}

      {refreshing ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#6EE7B7]" /></div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center text-white/30 text-sm">No posts yet. Be the first!</div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            address={address}
            isConnected={isConnected}
            connect={connect}
            handleVote={handleVote}
            fetchComments={fetchComments}
            createComment={createComment}
            navigate={navigate}
          />
        ))
      )}
    </div>
  );
}

function PostCard({ post, address, isConnected, connect, handleVote, fetchComments, createComment, navigate }: {
  post: Post;
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  handleVote: (id: string, v: 1 | -1) => void;
  fetchComments: (id: string) => Promise<Comment[]>;
  createComment: (wallet: string, postId: string, content: string) => Promise<boolean>;
  navigate: (path: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await fetchComments(post.id);
    setComments(data);
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments) void loadComments();
    setShowComments((v) => !v);
  };

  const handleComment = async () => {
    if (!address || !commentText.trim()) return;
    const ok = await createComment(address, post.id, commentText);
    if (ok) { setCommentText(""); void loadComments(); }
  };

  const displayName = post.profile?.username ?? shortAddr(post.wallet_address);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/5 px-4 py-4 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex gap-3">
        <button onClick={() => navigate(`/profile/${post.wallet_address}`)}>
          <Avatar addr={post.wallet_address} size={10} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${post.wallet_address}`)}
              className="font-bold text-white text-[15px] hover:underline"
            >
              {displayName}
            </button>
            <span className="text-white/40 text-sm font-mono">{shortAddr(post.wallet_address)}</span>
            <span className="text-white/30 text-sm">·</span>
            <span className="text-white/40 text-sm">{timeAgo(post.created_at)}</span>
          </div>
          <p className="mt-1 text-[15px] text-white/90 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>

          <div className="flex items-center gap-6 mt-3">
            <button onClick={toggleComments} className="flex items-center gap-2 text-white/40 hover:text-[#6EE7B7] transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-[#6EE7B7]/10 transition-colors">
                <MessageSquare size={16} />
              </div>
              <span className="text-sm">{post.comment_count ?? 0}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote(post.id, 1)}
                className={`flex items-center gap-1.5 group transition-colors ${post.user_vote === 1 ? "text-[#6EE7B7]" : "text-white/40 hover:text-[#6EE7B7]"}`}
              >
                <div className="p-1.5 rounded-full group-hover:bg-[#6EE7B7]/10 transition-colors">
                  <ThumbsUp size={16} />
                </div>
              </button>
              <span className="text-sm text-white/40 min-w-[20px] text-center">{post.vote_count ?? 0}</span>
              <button
                onClick={() => handleVote(post.id, -1)}
                className={`flex items-center gap-1.5 group transition-colors ${post.user_vote === -1 ? "text-red-400" : "text-white/40 hover:text-red-400"}`}
              >
                <div className="p-1.5 rounded-full group-hover:bg-red-400/10 transition-colors">
                  <ThumbsDown size={16} />
                </div>
              </button>
            </div>

            <button onClick={toggleComments} className="flex items-center gap-1 text-white/30 hover:text-white/60 text-xs transition-colors ml-auto">
              {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showComments && (
            <div className="mt-3 border-t border-white/5 pt-3 space-y-3">
              {loadingComments ? (
                <Loader2 size={16} className="animate-spin text-[#6EE7B7] mx-auto" />
              ) : comments.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-2">No replies yet</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <button onClick={() => navigate(`/profile/${c.wallet_address}`)}>
                      <Avatar addr={c.wallet_address} size={7} />
                    </button>
                    <div className="flex-1 bg-white/[0.03] rounded-2xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/profile/${c.wallet_address}`)}
                          className="text-xs font-bold text-white hover:underline"
                        >
                          {c.profile?.username ?? shortAddr(c.wallet_address)}
                        </button>
                        <span className="text-[10px] text-white/30">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isConnected && address ? (
                <div className="flex gap-2 items-center">
                  <Avatar addr={address} size={7} />
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") void handleComment(); }}
                    placeholder="Reply..."
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none"
                  />
                  <button
                    onClick={() => void handleComment()}
                    disabled={!commentText.trim()}
                    className="rounded-full bg-[#6EE7B7]/15 px-3 py-2 text-xs font-bold text-[#6EE7B7] hover:bg-[#6EE7B7]/25 disabled:opacity-40"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <button onClick={connect} className="text-xs text-[#6EE7B7] hover:underline">Connect to reply</button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function JobsView({ jobs, address, isConnected, connect, createJob, applyJob, loading, refreshing, loadJobs }: {
  jobs: Job[];
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  createJob: (wallet: string, job: { title: string; description: string; skills: string[]; budget: string; job_type: string }) => Promise<boolean>;
  applyJob: (wallet: string, jobId: string, coverLetter: string) => Promise<boolean>;
  loading: boolean;
  refreshing: boolean;
  loadJobs: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [budget, setBudget] = useState("");
  const [jobType, setJobType] = useState("contract");

  const handleCreate = async () => {
    if (!address) return;
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const ok = await createJob(address, { title, description, skills, budget, job_type: jobType });
    if (ok) {
      setTitle(""); setDescription(""); setSkillsInput(""); setBudget("");
      setShowForm(false);
      loadJobs();
    }
  };

  return (
    <div>
      <div className="border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <p className="text-sm text-white/50">Open positions for builders</p>
        {isConnected ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-4 py-1.5 text-sm font-bold text-[#0A0F1E]"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? "Cancel" : "Post Job"}
          </button>
        ) : (
          <button onClick={connect} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-4 py-1.5 text-sm font-bold text-[#0A0F1E]">
            Connect
          </button>
        )}
      </div>

      {showForm && (
        <div className="border-b border-white/5 px-4 py-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" className="w-full bg-transparent border-b border-white/10 py-2 text-white text-lg font-bold placeholder:text-white/20 focus:outline-none focus:border-[#6EE7B7]/40" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the role..." className="w-full bg-transparent text-white/80 text-sm placeholder:text-white/20 resize-none focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Skills: Solidity, React..." className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none" />
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget: 500 OPN" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none" />
          </div>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="rounded-xl border border-white/10 bg-[#0A0F1E] px-3 py-2 text-sm text-white focus:outline-none">
            <option value="contract">Contract</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="bounty">Bounty</option>
          </select>
          <div className="flex justify-end">
            <button onClick={() => void handleCreate()} disabled={loading || !title.trim()} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-5 py-2 text-sm font-bold text-[#0A0F1E] disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Post Job
            </button>
          </div>
        </div>
      )}

      {refreshing ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#6EE7B7]" /></div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center text-white/30 text-sm">No open positions yet</div>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} address={address} isConnected={isConnected} connect={connect} applyJob={applyJob} />)
      )}
    </div>
  );
}

function JobCard({ job, address, isConnected, connect, applyJob }: {
  job: Job;
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  applyJob: (wallet: string, jobId: string, coverLetter: string) => Promise<boolean>;
}) {
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!address) return;
    setApplying(true);
    const ok = await applyJob(address, job.id, coverLetter);
    if (ok) { setApplied(true); setShowApply(false); }
    setApplying(false);
  };

  const isOwner = address === job.wallet_address;
  const displayName = job.profile?.username ?? shortAddr(job.wallet_address);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 px-4 py-5 hover:bg-white/[0.02] transition-colors">
      <div className="flex gap-3">
        <Avatar addr={job.wallet_address} size={10} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">{job.title}</span>
                <span className="rounded-full border border-[#6EE7B7]/30 bg-[#6EE7B7]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6EE7B7]">
                  {job.job_type}
                </span>
              </div>
              <p className="text-sm text-white/40 mt-0.5">by {displayName} · {timeAgo(job.created_at)}</p>
            </div>
            {job.budget && (
              <span className="text-sm font-bold text-[#6EE7B7] shrink-0">{job.budget}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{job.description}</p>
          {job.skills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.skills.map((s) => (
                <span key={s} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-white/50">{s}</span>
              ))}
            </div>
          )}
          {!isOwner && (
            <div className="mt-3">
              {applied ? (
                <span className="text-sm text-[#6EE7B7] font-medium">Applied!</span>
              ) : showApply ? (
                <div className="space-y-2">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you the right builder?"
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowApply(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60">Cancel</button>
                    <button onClick={() => void handleApply()} disabled={applying} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-4 py-1.5 text-xs font-bold text-[#0A0F1E] disabled:opacity-50">
                      {applying && <Loader2 size={12} className="animate-spin" />}
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => isConnected ? setShowApply(true) : connect()}
                  className="rounded-full border border-[#6EE7B7]/40 px-4 py-1.5 text-sm font-medium text-[#6EE7B7] hover:bg-[#6EE7B7]/10 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}