"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Database, ExternalLink, ChevronDown, Code2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["All", "Mini", "Intermediate", "Advanced", "Capstone"] as const;
const DOMAINS = ["All", "Tabular", "NLP", "CV", "Time Series", "MLOps", "Analytics"] as const;

type DiffFilter = (typeof DIFFICULTIES)[number];
type DomainFilter = (typeof DOMAINS)[number];

const diffVariant: Record<string, "default" | "success" | "warning" | "error" | "muted"> = {
  Mini: "success",
  Intermediate: "warning",
  Advanced: "error",
  Capstone: "default",
};

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={diffVariant[project.difficulty] ?? "default"}>
              {project.difficulty}
            </Badge>
            <Badge variant="muted">{project.domain}</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] shrink-0">
            <Clock className="h-3.5 w-3.5" />
            {project.estimatedHours}h
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{project.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{project.summary}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.skills.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)]">
              {s}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded"
          aria-expanded={expanded}
        >
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
          {expanded ? "Hide" : "View"} project details
        </button>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-color)] p-6 flex flex-col gap-6">
              {/* Problem statement */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Problem Statement</div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.problemStatement}</p>
              </div>

              {/* Architecture pipeline */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Architecture Pipeline</div>
                <div className="flex flex-wrap items-center gap-1">
                  {project.architecture.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                        {stage}
                      </span>
                      {i < project.architecture.length - 1 && (
                        <span className="text-[var(--text-muted)]">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Step-by-Step Guide</div>
                <div className="flex flex-col gap-2">
                  {project.steps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{step.title}</div>
                        <div className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repo tree */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Repository Structure</div>
                <pre className="text-xs font-mono text-[#d4d4d4] bg-[#1e1e1e] p-4 rounded-lg leading-6 overflow-x-auto">
                  {project.repoTree.join("\n")}
                </pre>
              </div>

              {/* Dataset + Resume */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Dataset</div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
                    <Database className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {project.datasetName}
                  </div>
                  <a href={project.datasetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline flex items-center gap-1 mt-1">
                    Open dataset <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Resume Bullet</div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                    &ldquo;{project.resumeDescription}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsPage() {
  const [diffFilter, setDiffFilter] = React.useState<DiffFilter>("All");
  const [domainFilter, setDomainFilter] = React.useState<DomainFilter>("All");

  const filtered = projects.filter(
    (p) =>
      (diffFilter === "All" || p.difficulty === diffFilter) &&
      (domainFilter === "All" || p.domain === domainFilter),
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Projects</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            Build. Deploy. Get Hired.
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Industry-grade projects with step-by-step guides, datasets, and ready-made resume bullets. Every project is designed to go on your portfolio.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[10px] text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Difficulty</div>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-ring",
                    diffFilter === d
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)]"
                      : "bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Domain</div>
            <div className="flex flex-wrap gap-1.5">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomainFilter(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-ring",
                    domainFilter === d
                      ? "bg-[var(--text-primary)] text-[var(--bg-base)]"
                      : "bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)]">
              No projects match the selected filters.
            </div>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
