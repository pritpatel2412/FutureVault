import { Idea } from "@/lib/db";
import ScoreRing from "./ScoreRing";
import { formatDistanceToNow } from "date-fns";

export default function IdeaCard({ idea, isNew }: { idea: Idea; isNew?: boolean }) {
  const domainColors: Record<string, string> = {
    AI: "var(--accent)",
    HealthTech: "var(--accent2)",
    CleanTech: "#10B981",
    FinTech: "#F59E0B",
    EdTech: "#8B5CF6",
    SpaceTech: "var(--accent3)",
    FoodTech: "#F43F5E",
    Other: "var(--text-muted)",
  };

  const domainColor = domainColors[idea.domain] || "var(--accent)";

  return (
    <div className="glass-card relative flex flex-col w-[350px] min-h-[220px] p-5 rounded-2xl group overflow-hidden cursor-pointer shrink-0">
      {isNew && (
        <span className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-black uppercase bg-[var(--accent)] rounded-bl-lg shadow-[0_0_10px_var(--accent)] z-20 animate-pulse-glow">
          NEW
        </span>
      )}
      <div className="flex justify-between items-start mb-3 z-10">
        <span
          className="px-2 py-1 text-xs font-mono font-semibold rounded-md"
          style={{ backgroundColor: `${domainColor}20`, color: domainColor, border: `1px solid ${domainColor}50` }}
        >
          {idea.domain}
        </span>
        <ScoreRing score={idea.implementationScore} />
      </div>

      <h3 className="text-xl font-syne font-bold mb-2 text-[var(--text-primary)] leading-tight z-10 transition-colors group-hover:text-[var(--accent)]">
        {idea.title}
      </h3>

      <div className="text-sm text-[var(--text-muted)] mt-1 mb-4 flex-grow relative z-10">
        <p className="line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {idea.solution}
        </p>
      </div>

      <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-64 transition-all duration-500 overflow-hidden text-xs space-y-2 mt-2 z-10">
        <div>
          <strong className="text-[var(--text-primary)] block">The Problem:</strong>
          <span className="text-[var(--text-muted)] block">{idea.problem}</span>
        </div>
        <div>
          <strong className="text-[var(--text-primary)] block">Why Now?</strong>
          <span className="text-[var(--text-muted)] block">{idea.whyNow}</span>
        </div>
        <div className="bg-[rgba(0,0,0,0.5)] p-2 rounded-lg border border-[var(--border)] mt-2">
          <strong className="text-[var(--text-primary)] block text-xs">Implementation Search:</strong>
          <span className="text-[var(--text-muted)] block italic">
            "{idea.scoreDetails}"
          </span>
        </div>
      </div>

      <div className="text-xs font-mono text-[var(--text-muted)] flex justify-between mt-4 border-t border-[var(--border)] pt-3 z-10">
        <span className="truncate max-w-[150px]">By {idea.submittedBy}</span>
        <span>{formatDistanceToNow(new Date(idea.submittedAt), { addSuffix: true })}</span>
      </div>

      {/* Subtle background glow effect */}
      <div 
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: domainColor }}
      />
    </div>
  );
}
