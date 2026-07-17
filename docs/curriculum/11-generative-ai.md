# Domain 11 — Generative AI

| Field | Value |
|---|---|
| Course slug | `generative-ai` |
| Order | 11 |
| Category | Generative AI |
| Difficulty | Advanced |
| Estimated hours | 12 |
| Prerequisites | Deep Learning transformers module (BERT/GPT concepts) |

Technically grounded LLM literacy — tokens, prompting, APIs, tool use, and
fine-tuning — without hype and without coupling core lessons to one paid
provider.

## Learning outcomes

- Explain how LLMs generate text: tokens, context windows, sampling
- Design prompts and few-shot setups that hold up in production
- Call LLM APIs with structured outputs and tool/function calling
- Manage cost, latency, and hallucination risk deliberately
- Decide when to fine-tune and do it with Hugging Face/PEFT

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `fundamentals` | LLM Fundamentals |
| 2 | `apis` | LLM APIs |
| 3 | `fine-tuning` | Fine-Tuning |

## Lessons — module `fundamentals`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 11.1 | What Are LLMs? | `what-are-llms` | Advanced | 30 min | 90 | `deep-learning.transformers.bert-and-gpt-concepts` | pretraining, instruction tuning, capabilities/limits | planned |
| 11.2 | Tokenization & Embeddings | `tokenization-and-embeddings` | Advanced | 35 min | 100 | `generative-ai.fundamentals.what-are-llms` | tokens, vocabularies, embedding space | planned |
| 11.3 | Prompt Engineering | `prompt-engineering` | Advanced | 30 min | 90 | `generative-ai.fundamentals.what-are-llms` | instructions, context, formats, iteration | planned |
| 11.4 | Few-Shot & Zero-Shot Learning | `few-shot-and-zero-shot` | Advanced | 25 min | 90 | `generative-ai.fundamentals.prompt-engineering` | in-context examples, when shots help | planned |
| 11.5 | LLM Limitations | `llm-limitations` | Advanced | 30 min | 110 | `generative-ai.fundamentals.tokenization-and-embeddings` | hallucination, context limits, knowledge cutoffs | planned |

## Lessons — module `apis`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 11.6 | LLM APIs (OpenAI & Claude) | `openai-and-claude-apis` | Advanced | 35 min | 90 | `generative-ai.fundamentals.what-are-llms` | chat APIs, roles, temperature/sampling params | planned |
| 11.7 | Structured Outputs | `structured-outputs` | Advanced | 30 min | 90 | `generative-ai.apis.openai-and-claude-apis` | JSON outputs, schemas, validation | planned |
| 11.8 | Function Calling & Tool Use | `function-calling-tool-use` | Advanced | 35 min | 100 | `generative-ai.apis.structured-outputs` | tool definitions, call loops, safety | planned |
| 11.9 | Cost Optimization & Caching | `cost-optimization-and-caching` | Advanced | 25 min | 90 | `generative-ai.apis.openai-and-claude-apis` | token economics, caching, model tiers | planned |

## Lessons — module `fine-tuning`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 11.10 | When to Fine-Tune | `when-to-fine-tune` | Advanced | 25 min | 90 | `generative-ai.apis.openai-and-claude-apis` | prompting vs RAG vs fine-tuning decision | planned |
| 11.11 | Fine-Tuning with Hugging Face | `fine-tuning-with-huggingface` | Advanced | 40 min | 110 | `generative-ai.fine-tuning.when-to-fine-tune` | datasets, trainers, evaluation loop | planned |
| 11.12 | PEFT & LoRA | `peft-and-lora` | Advanced | 35 min | 110 | `generative-ai.fine-tuning.fine-tuning-with-huggingface` | adapters, low-rank updates, efficiency | planned |
| 11.13 | Evaluating LLM Outputs | `evaluating-llm-outputs` | Advanced | 30 min | 100 | `generative-ai.fine-tuning.fine-tuning-with-huggingface` | eval sets, LLM-as-judge, human review | planned |

Domain status: 0/13 implemented. Exercise ID prefix: `gai01`–`gai13`.
