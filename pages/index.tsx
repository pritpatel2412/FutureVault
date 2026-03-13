import { useEffect, useState } from "react";
import Head from "next/head";
import InfiniteRow from "@/components/InfiniteRow";
import SubmitDrawer from "@/components/SubmitDrawer";
import Leaderboard from "@/components/Leaderboard";
import Lightning from "@/components/Lightning";
import { Idea } from "@/lib/db";
import { motion } from "framer-motion";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [newIdeaId, setNewIdeaId] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
    const interval = setInterval(fetchIdeas, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data);
    } catch (e) {
      console.error("Failed to fetch ideas", e);
    }
  };

  const handleIdeaSuccess = (idea: Idea) => {
    setDrawerOpen(false);
    setIdeas((prev) => [idea, ...prev].sort((a, b) => b.implementationScore - a.implementationScore));
    setNewIdeaId(idea.id);
    setTimeout(() => setNewIdeaId(null), 10000); // Highlight as new for 10s
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>💡 FutureVault | Ideas Running 24/7</title>
      </Head>

      <div className="relative min-h-screen pb-20 w-full overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]">
          <Lightning hue={162} speed={0.8} intensity={0.5} size={1} />
        </div>
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--bg)] to-transparent z-10 pointer-events-none" />
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] z-0 pointer-events-none" />

        <main className="relative z-20 pt-24 px-4 flex flex-col items-center min-h-[50vh] justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glitch-wrapper text-6xl md:text-8xl lg:text-9xl font-syne font-black tracking-tighter"
          >
            <h1 className="glitch-text" data-text="FUTUREVAULT">FUTUREVAULT</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl mt-6 font-mono text-[var(--accent)] tracking-widest max-w-2xl mx-auto"
          >
            "Every great company was once just an idea. What's yours?"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center bg-[rgba(0,0,0,0.4)] px-6 py-2 rounded-full border border-[var(--border)] gap-2 text-[var(--text-primary)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent2)] animate-pulse" />
            <span className="font-mono text-sm">
              <span className="text-[var(--accent3)] font-bold">{ideas.length}</span> ideas and counting
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: "spring" }}
            onClick={() => setDrawerOpen(true)}
            className="mt-12 px-8 py-4 bg-[var(--accent)] text-black font-syne font-bold text-xl rounded-2xl hover:-translate-y-2 hover:shadow-[0_0_30px_var(--accent)] transition-all duration-300 relative group"
          >
            <span className="relative z-10">
              <span className="mr-2 text-2xl font-light opacity-50">+</span>
              Submit Your Idea <span className="ml-2">&rarr;</span>
            </span>
            <div className="absolute inset-0 w-full h-full bg-white rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-md" />
          </motion.button>
        </main>

        <section className="relative z-20 mt-20 mb-32 w-full overflow-hidden">
          <InfiniteRow ideas={ideas.slice(0, Math.ceil(ideas.length / 2))} newIdeaId={newIdeaId} />
          <InfiniteRow ideas={ideas.slice(Math.ceil(ideas.length / 2))} newIdeaId={newIdeaId} reverse />
        </section>

        <section className="relative z-20">
          <Leaderboard ideas={ideas} />
        </section>

        <footer className="relative z-20 border-t border-[var(--border)] mt-32 py-12 text-center text-[var(--text-muted)] font-mono text-xs px-6">
          <p className="mb-2">FutureVault runs 24/7. No login. No gatekeeping. Just ideas.</p>
          <p className="opacity-60 max-w-lg mx-auto">
            Scoring algorithm processes ideas against 2020-2024 global business databases to estimate market saturation. Modded by GenAI. 100 = Saturation. 0 = Uncharted.
          </p>
        </footer>

        <SubmitDrawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSuccess={handleIdeaSuccess}
        />
      </div>
    </>
  );
}
