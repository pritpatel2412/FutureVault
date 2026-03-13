import IdeaCard from "./IdeaCard";
import { Idea } from "@/lib/db";

export default function InfiniteRow({ ideas, reverse = false, newIdeaId }: { ideas: Idea[]; reverse?: boolean; newIdeaId?: string | null }) {
  if (!ideas || ideas.length === 0) return null;

  // Duplicate ideas exactly once to create a seamless infinite loop width without visible clones
  const duplicatedIdeas = [...ideas, ...ideas]; 

  const animationClass = reverse ? "animate-scroll-reverse" : "animate-scroll";

  return (
    <div className="w-full overflow-hidden flex pause-on-hover py-4">
      <div className={`flex space-x-6 min-w-max ${animationClass}`}>
        {duplicatedIdeas.map((idea, idx) => (
          <IdeaCard key={`${idea.id}-${idx}`} idea={idea} isNew={idea.id === newIdeaId} />
        ))}
      </div>
    </div>
  );
}
