import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const useSupabase = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = useSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Fallback JSON DB setup
const FILE_PATH = path.join(process.cwd(), "ideas.json");

export type Idea = {
  id: string;
  title: string;
  domain: string;
  problem: string;
  solution: string;
  whyNow: string;
  submittedBy: string;
  submittedAt: string;
  implementationScore: number;
  scoreDetails: string;
  approved: boolean;
};

import { SEED_IDEAS } from "./seeds";

export async function getIdeas(): Promise<Idea[]> {
  let result: Idea[] = [];
  let success = false;

  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("approved", true)
      .order("implementationScore", { ascending: false });

    if (!error && data) {
      result = data as Idea[];
      success = true;
    } else {
      console.warn("Supabase GET error (falling back to JSON):", error?.message);
    }
  }

  // Fallback to JSON
  if (!success) {
    try {
      if (fs.existsSync(FILE_PATH)) {
        const contents = fs.readFileSync(FILE_PATH, "utf8");
        const ideas: Idea[] = JSON.parse(contents);
        result = ideas
          .filter((i) => i.approved)
          .sort((a, b) => b.implementationScore - a.implementationScore);
      }
    } catch (e) {
      // Return empty safely later
    }
  }

  // If we have fewer than 8 ideas, pad with unique seeds so that the UI marquee doesn't cluster real ideas
  if (result.length < 8) {
    const existingTitles = new Set(result.map(r => r.title));
    const toAdd = SEED_IDEAS.filter(s => !existingTitles.has(s.title));
    const needed = 8 - result.length;
    result = [...result, ...toAdd.slice(0, needed)].sort((a, b) => b.implementationScore - a.implementationScore);
  }

  return result;
}

export async function addIdea(idea: Idea): Promise<Idea> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from("ideas").insert([idea]).select();
    if (!error && data) {
      return data[0] as Idea;
    } else {
      console.warn("Supabase POST error (falling back to JSON):", error?.message);
    }
  }

  // Fallback to JSON
  let ideas: Idea[] = [];
  try {
    if (fs.existsSync(FILE_PATH)) {
      ideas = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }
  } catch (e) {
    // ignore
  }
  ideas.push(idea);
  fs.writeFileSync(FILE_PATH, JSON.stringify(ideas, null, 2));
  return idea;
}
