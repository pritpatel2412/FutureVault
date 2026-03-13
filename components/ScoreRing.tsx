import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScoreRing({ score }: { score: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Delay animation slightly on mount for effect
    const timer = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let color = "var(--accent)"; // Green
  if (score < 40) color = "var(--accent2)"; // Red
  else if (score < 70) color = "#FFD166"; // Yellow

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="var(--border)"
          strokeWidth="3"
          fill="transparent"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <span className="absolute font-mono text-sm font-bold" style={{ color }}>{score}</span>
    </div>
  );
}
