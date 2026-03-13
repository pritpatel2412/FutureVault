import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";

type SubmitDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (idea: any) => void;
};

export default function SubmitDrawer({ isOpen, onClose, onSuccess }: SubmitDrawerProps) {
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setLoadingStep("Checking content (Gemini)...");
    setError(null);

    try {
      // Simulate step delays for effect
      await new Promise(r => setTimeout(r, 1000));
      setLoadingStep("Searching the web (Tavily)...");
      await new Promise(r => setTimeout(r, 1000));
      setLoadingStep("Calculating score...");

      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setLoadingStep(null);
      form.reset();
      onSuccess(result);
    } catch (err: any) {
      setError(err.message);
      setLoadingStep(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-[var(--bg)] border-t border-l border-r border-[var(--border)] rounded-t-3xl p-8 z-50 shadow-[0_-10px_40px_rgba(0,255,178,0.1)] h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-syne font-bold mb-6 text-[var(--accent)]">Launch Idea into the Vault 🚀</h2>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Idea Title *</label>
                  <input required name="title" className="w-full p-3 rounded-lg" placeholder="AI Therapist for Pets" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Domain *</label>
                  <select required name="domain" className="w-full p-3 rounded-lg">
                    <option value="AI">AI</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="FinTech">FinTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="SpaceTech">SpaceTech</option>
                    <option value="FoodTech">FoodTech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">The Problem It Solves *</label>
                <textarea required name="problem" rows={3} className="w-full p-3 rounded-lg" placeholder="Pets get lonely and anxious..." />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Your Solution (Description) *</label>
                <textarea required name="solution" rows={3} className="w-full p-3 rounded-lg" placeholder="An embedded collar mic and speaker that uses small language models..." />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Why Now? *</label>
                <textarea required name="whyNow" rows={2} className="w-full p-3 rounded-lg" placeholder="Llama 3 runs on edge devices..." />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Your Name</label>
                <input name="submittedBy" className="w-full p-3 rounded-lg" placeholder="Anonymous" defaultValue="Anonymous" />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingStep !== null}
                  className="w-full py-4 rounded-xl font-syne font-bold text-xl bg-[var(--accent)] text-black hover:bg-white hover:shadow-[0_0_20px_var(--accent)] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loadingStep ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="animate-pulse">{loadingStep}</span>
                    </>
                  ) : (
                    <span>Add to Vault &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
