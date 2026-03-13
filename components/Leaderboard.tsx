import { Idea } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

export default function Leaderboard({ ideas }: { ideas: Idea[] }) {
  if (!ideas.length) return null;

  // Assume ideas are already sorted by implementationScore DESC
  const topIdeas = ideas.slice(0, 5);
  const medals = ["🥇", "🥈", "🥉", "4.", "5."];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-syne font-bold mb-8 text-[var(--accent)] text-center tracking-wider uppercase">
        Top Ranked Concepts
      </h2>
      <div className="space-y-4">
        {topIdeas.map((idea, index) => (
          <div
            key={idea.id}
            className="glass-card flex items-center justify-between p-4 rounded-xl relative overflow-hidden group hover:border-[var(--accent3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--surface)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-4">
              <span className="text-2xl font-bold font-syne w-8 text-center" style={{ color: index < 3 ? "var(--accent)" : "var(--text-muted)" }}>
                {medals[index]}
              </span>
              <div>
                <h3 className="font-syne font-bold group-hover:text-[var(--accent3)] transition-colors text-lg">
                  {idea.title} <span className="text-xs font-mono ml-2 text-[var(--text-muted)] opacity-60 px-2 border border-[var(--border)] rounded">{idea.domain}</span>
                </h3>
                <p className="text-sm font-mono text-[var(--text-muted)] line-clamp-1 mt-1">
                  {idea.solution}
                </p>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-end whitespace-nowrap">
              <div className="text-3xl font-mono font-bold tracking-tighter" style={{ color: "var(--accent2)" }}>
                {idea.implementationScore}
                <span className="text-sm text-[var(--text-muted)] tracking-normal">/100</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)] opacity-50 block mt-1">By {idea.submittedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
