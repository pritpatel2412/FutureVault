import type { NextApiRequest, NextApiResponse } from "next";
import { moderateIdea } from "@/lib/gemini";
import { scoreIdea } from "@/lib/tavily";
import { addIdea, getIdeas, Idea } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Simple in-memory rate limiting (max 3 per IP per hour)
const rateLimiter = new Map<string, { count: number; expiresAt: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const ideas = await getIdeas();
    res.status(200).json(ideas);
    return;
  }

  if (req.method === "POST") {
    // Basic rate limit
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const hr = 60 * 60 * 1000;
    const now = Date.now();

    const record = rateLimiter.get(ip);
    if (!record || record.expiresAt < now) {
      rateLimiter.set(ip, { count: 1, expiresAt: now + hr });
    } else {
      if (record.count >= 3) {
        return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
      }
      record.count++;
    }

    try {
      const { title, domain, problem, solution, whyNow, submittedBy } = req.body;
      if (!title || !domain || !solution) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Step 1: Content Moderation
      const moderation = await moderateIdea(title, domain, solution);
      if (!moderation.approved) {
        return res.status(400).json({ error: `Not approved: ${moderation.reason}` });
      }

      // Step 2: Scoring
      const { score, scoreDetails } = await scoreIdea(title, domain, problem, solution);

      // Step 3: Save to DB
      const newIdea: Idea = {
        id: uuidv4(),
        title: String(title).substring(0, 100).replace(/</g, "&lt;"),
        domain: String(domain).substring(0, 50).replace(/</g, "&lt;"),
        problem: String(problem).substring(0, 500).replace(/</g, "&lt;"),
        solution: String(solution).substring(0, 500).replace(/</g, "&lt;"),
        whyNow: String(whyNow).substring(0, 500).replace(/</g, "&lt;"),
        submittedBy: String(submittedBy || "Anonymous").substring(0, 50).replace(/</g, "&lt;"),
        submittedAt: new Date().toISOString(),
        implementationScore: score,
        scoreDetails: scoreDetails,
        approved: true,
      };

      await addIdea(newIdea);
      return res.status(201).json(newIdea);
    } catch (e: any) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
