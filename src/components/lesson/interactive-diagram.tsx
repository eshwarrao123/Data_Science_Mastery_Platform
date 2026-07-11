"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { LessonVisual, DiagramNode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InteractiveDiagramProps {
  visual: LessonVisual;
}

export function InteractiveDiagram({ visual }: InteractiveDiagramProps) {
  const [selected, setSelected] = React.useState<DiagramNode | null>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [animated, setAnimated] = React.useState(false);

  // Animate nodes sequentially on mount
  React.useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const nodeById = React.useMemo(
    () => new Map(visual.nodes.map((n) => [n.id, n])),
    [visual.nodes],
  );

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden">
      {/* Title bar */}
      <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{visual.title}</h4>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{visual.caption}</p>
      </div>

      <div className="relative">
        {/* SVG diagram */}
        <svg
          viewBox="0 0 100 100"
          className="w-full"
          style={{ height: "clamp(280px, 45vw, 440px)" }}
          aria-label={`Interactive diagram: ${visual.title}`}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill="var(--border-color)" />
            </marker>
          </defs>

          {/* Edges */}
          {visual.edges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const x1 = from.x;
            const y1 = from.y;
            const x2 = to.x;
            const y2 = to.y;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const isActive =
              hovered === edge.from ||
              hovered === edge.to ||
              selected?.id === edge.from ||
              selected?.id === edge.to;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <motion.path
                  d={`M ${x1} ${y1} Q ${mx} ${my - 6} ${x2} ${y2}`}
                  fill="none"
                  stroke={isActive ? "var(--success)" : "var(--border-color)"}
                  strokeWidth="0.4"
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
                {edge.label && (
                  <text
                    x={mx}
                    y={my - 3}
                    fontSize="2"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    className="pointer-events-none select-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {visual.nodes.map((node, idx) => {
            const isSelected = selected?.id === node.id;
            const isHovered = hovered === node.id;
            const isActive = isSelected || isHovered;

            return (
              <motion.g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={animated ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: idx * 0.07, type: "spring", stiffness: 280, damping: 22 }}
                onClick={() =>
                  setSelected((prev) => (prev?.id === node.id ? null : node))
                }
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                role="button"
                aria-label={`${node.label}: ${node.detail}`}
                aria-expanded={isSelected}
              >
                {/* Node circle */}
                <motion.circle
                  r={5}
                  fill={
                    isActive
                      ? node.accent
                        ? "var(--success)"
                        : "var(--bg-subtle)"
                      : node.accent
                      ? "rgba(16,185,129,0.15)"
                      : "var(--bg-subtle)"
                  }
                  stroke={
                    isActive
                      ? "var(--success)"
                      : node.accent
                      ? "rgba(16,185,129,0.4)"
                      : "var(--border-color)"
                  }
                  strokeWidth="0.6"
                  animate={{ r: isActive ? 6 : 5 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                />

                {/* Label */}
                <text
                  textAnchor="middle"
                  dy="-7"
                  fontSize="2.8"
                  fontWeight="600"
                  fill={isActive ? "var(--text-primary)" : "var(--text-secondary)"}
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>

                {/* Sublabel */}
                {node.sublabel && (
                  <text
                    textAnchor="middle"
                    dy="10"
                    fontSize="2"
                    fill="var(--text-muted)"
                    className="pointer-events-none select-none"
                  >
                    {node.sublabel}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 inset-x-0 bg-[var(--bg-elevated)] border-t border-[var(--border-color)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    {selected.label}
                    {selected.sublabel && (
                      <span className="ml-2 text-xs font-mono text-[var(--text-muted)]">
                        {selected.sublabel}
                      </span>
                    )}
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {selected.detail}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close detail"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 focus-ring rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
