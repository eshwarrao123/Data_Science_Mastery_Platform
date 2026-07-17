# Domain 13 — AI Agents & Agentic AI

| Field | Value |
|---|---|
| Course slug | `agentic-ai` |
| Order | 13 |
| Category | Agents |
| Difficulty | Advanced |
| Estimated hours | 10 |
| Prerequisites | RAG + Function Calling (from Generative AI) |

Agent loops, tools, memory, and multi-agent trade-offs — with guardrails and
evaluation treated as first-class, not afterthoughts.

## Learning outcomes

- Explain the agent loop (observe → think → act) and the ReAct pattern
- Wire tools/function calls into an agent safely
- Design short- and long-term memory for agent tasks
- Evaluate agent behavior and know when NOT to use an agent
- Compare single-agent vs multi-agent architectures honestly

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `fundamentals` | Agent Fundamentals |
| 2 | `building` | Building Agents |
| 3 | `projects` | Agent Projects |

## Lessons — module `fundamentals`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 13.1 | What Is an AI Agent? | `what-is-an-ai-agent` | Advanced | 30 min | 90 | `generative-ai.apis.function-calling-tool-use` | agent loop, autonomy spectrum, when agents fit | planned |
| 13.2 | The ReAct Pattern | `the-react-pattern` | Advanced | 30 min | 100 | `agentic-ai.fundamentals.what-is-an-ai-agent` | reasoning + acting, thought/action/observation | planned |
| 13.3 | Tool Use & Function Calling | `tool-use-and-function-calling` | Advanced | 35 min | 100 | `agentic-ai.fundamentals.the-react-pattern` | tool schemas, execution loops, error handling | planned |
| 13.4 | Memory: Short- & Long-Term | `memory-short-and-long-term` | Advanced | 30 min | 100 | `agentic-ai.fundamentals.tool-use-and-function-calling` | context memory, vector memory, summarization | planned |
| 13.5 | Agent Evaluation | `agent-evaluation` | Advanced | 30 min | 110 | `agentic-ai.fundamentals.memory-short-and-long-term` | task success metrics, traces, guardrails | planned |

## Lessons — module `building`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 13.6 | Single-Agent Architectures | `single-agent-architectures` | Advanced | 30 min | 100 | `agentic-ai.fundamentals.the-react-pattern` | planning, reflection, structured workflows | planned |
| 13.7 | Multi-Agent Systems | `multi-agent-systems` | Advanced | 35 min | 110 | `agentic-ai.building.single-agent-architectures` | orchestration, specialization, cost trade-offs | planned |
| 13.8 | Human-in-the-Loop | `human-in-the-loop` | Advanced | 25 min | 100 | `agentic-ai.building.single-agent-architectures` | approval gates, escalation, oversight design | planned |
| 13.9 | Frameworks: LangGraph & AutoGen | `frameworks-langgraph-autogen` | Advanced | 30 min | 100 | `agentic-ai.building.multi-agent-systems` | graph orchestration, framework trade-offs | planned |

## Lessons — module `projects`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 13.10 | 🏗 Project: Data Analysis Agent | `project-data-analysis-agent` | Advanced | 90 min | 300 | `agentic-ai.building.multi-agent-systems` | agent that queries + summarizes data | planned |
| 13.11 | 🏗 Project: Multi-Agent Research Workflow | `project-multi-agent-research` | Advanced | 120 min | 500 | `agentic-ai.projects.project-data-analysis-agent` | orchestrated multi-agent pipeline | planned |

Domain status: 0/11 implemented. Exercise ID prefix: `agt01`–`agt11`.
