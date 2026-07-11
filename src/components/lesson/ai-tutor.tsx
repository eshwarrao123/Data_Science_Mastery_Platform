"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, FileText, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/store/progress";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock AI responses keyed to quick prompts                           */
/* ------------------------------------------------------------------ */
const QUICK_PROMPTS = [
  { label: "Explain like I'm 5", key: "eli5" },
  { label: "Summarize lesson", key: "summary" },
  { label: "Debug my code", key: "debug" },
  { label: "Generate quiz", key: "quiz" },
];

function mockResponse(input: string, lessonTitle: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("eli5") || lower.includes("explain like")) {
    return `Okay, imagine you're a chef. A **variable** is like a labeled jar in your pantry — the label says "sugar", and inside is whatever sugar you put there. You can take it out, add more, or pour it into something else. Data types are just the *kind* of thing in the jar: flour (numbers), water (decimals), a note (text), or a yes/no sticky (True/False). That's all Python variables and types are — labeled jars for your ingredients!`;
  }
  if (lower.includes("summar")) {
    return `**${lessonTitle} — Quick Summary**\n\n• Variables are named labels pointing to values in memory.\n• Python has 4 primitive types: int, float, str, bool.\n• Use type() to inspect any value at runtime.\n• Arithmetic mixes int + float → float automatically.\n• Type conversion: int(), float(), str() cast between types.\n• = assigns; == compares. Never confuse them.`;
  }
  if (lower.includes("debug") || lower.includes("error") || lower.includes("fix")) {
    return `Let me help you debug! The most common issues in this lesson are:\n\n1. **TypeError** — usually means you're trying to do math on a string. Check: did your input come from input()? Convert it first with int() or float().\n2. **NameError** — the variable doesn't exist yet. Make sure you assigned it before using it.\n3. **SyntaxError: expected ':'** — you wrote an if/for/def without a colon at the end.\n\nPaste your error message and I'll pinpoint it exactly.`;
  }
  if (lower.includes("quiz")) {
    return `Here are 3 quick quiz questions:\n\n**Q1.** What does \`type(3.0)\` return?\n→ \`<class 'float'>\`\n\n**Q2.** Which operator *assigns* a value vs *compares*?\n→ \`=\` assigns, \`==\` compares.\n\n**Q3.** What happens when you add an int to a float in Python?\n→ Python returns a float (upcasts automatically).`;
  }
  // Generic fallback
  return `Great question! In the context of **${lessonTitle}**: ${input.length > 60 ? input.slice(0, 60) + "…" : input}\n\nCould you tell me more about what specifically is confusing? For example:\n• Are you stuck on a particular concept in the theory section?\n• Is there a piece of code that isn't behaving as expected?\n• Or do you want a deeper explanation of one of the examples?\n\nI'm here to help — just ask!`;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  id: number;
}

function AiChat({ lessonTitle, lessonSlug }: { lessonTitle: string; lessonSlug: string }) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      id: 0,
      content: `Hi! I'm your AI tutor for **${lessonTitle}**. Ask me anything — a concept, an analogy, help debugging — or pick a quick action below.`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, id: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const reply = mockResponse(text, lessonTitle);
    setMessages((m) => [...m, { role: "assistant", content: reply, id: Date.now() + 1 }]);
    setLoading(false);
  };

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Simple markdown bold / bullets renderer */
  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
          )}
        </span>
      );
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-0">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "assistant"
                  ? "bg-emerald-500/20"
                  : "bg-[var(--bg-subtle)] border border-[var(--border-color)]",
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <User className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed",
                msg.role === "assistant"
                  ? "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                  : "bg-[var(--text-primary)] text-[var(--bg-base)]",
              )}
            >
              {renderContent(msg.content)}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="bg-[var(--bg-subtle)] rounded-xl px-3 py-2.5 flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p.key}
            onClick={() => send(p.label)}
            disabled={loading}
            className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border-color)]">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-muted)] transition-colors"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            variant="primary"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="h-9 w-9 shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notes Tab                                                           */
/* ------------------------------------------------------------------ */
function NotesTab({ lessonSlug }: { lessonSlug: string }) {
  const note = useProgress((s) => s.notes[lessonSlug] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const bookmarks = useProgress((s) => s.bookmarks);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const isBookmarked = bookmarks.includes(lessonSlug);

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <button
        onClick={() => toggleBookmark(lessonSlug)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors focus-ring",
          isBookmarked
            ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
            : "border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
        )}
      >
        <Bookmark className={cn("h-3.5 w-3.5", isBookmarked && "fill-current")} />
        {isBookmarked ? "Bookmarked" : "Bookmark this lesson"}
      </button>
      <textarea
        value={note}
        onChange={(e) => setNote(lessonSlug, e.target.value)}
        placeholder="Take notes here… they're saved automatically."
        className="flex-1 resize-none bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-muted)] transition-colors leading-relaxed min-h-[200px]"
      />
      <p className="text-[10px] text-[var(--text-muted)]">
        <FileText className="h-3 w-3 inline mr-1" />
        Notes are saved to your browser. View all notes in Profile → Notes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Right sidebar container                                             */
/* ------------------------------------------------------------------ */
export function AiTutorSidebar({
  lessonTitle,
  lessonSlug,
}: {
  lessonTitle: string;
  lessonSlug: string;
}) {
  return (
    <div className="h-full flex flex-col border-l border-[var(--border-color)] bg-[var(--bg-elevated)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)]">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
        <span className="text-xs font-semibold text-[var(--text-primary)]">AI Tutor & Notes</span>
      </div>
      <Tabs
        className="flex-1 min-h-0"
        tabs={[
          {
            id: "tutor",
            label: (
              <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5" />
                Tutor
              </span>
            ),
            content: (
              <div className="h-[calc(100vh-12rem)] flex flex-col">
                <AiChat lessonTitle={lessonTitle} lessonSlug={lessonSlug} />
              </div>
            ),
          },
          {
            id: "notes",
            label: (
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Notes
              </span>
            ),
            content: (
              <div className="h-[calc(100vh-12rem)] flex flex-col">
                <NotesTab lessonSlug={lessonSlug} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
