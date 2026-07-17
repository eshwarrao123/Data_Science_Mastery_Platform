# Domain 12 — RAG & Vector Databases

| Field | Value |
|---|---|
| Course slug | `rag` |
| Order | 12 |
| Category | RAG |
| Difficulty | Advanced |
| Estimated hours | 10 |
| Prerequisites | Generative AI (embeddings are an LLM concept) |

Retrieval-augmented generation done properly: embeddings, chunking,
retrieval quality, and the evaluation discipline that separates demos from
production systems.

## Learning outcomes

- Generate and compare embeddings with appropriate distance metrics
- Choose and use a vector database
- Design chunking and retrieval strategies for real documents
- Evaluate RAG quality end to end and name the classic anti-patterns
- Build a document Q&A system

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `embeddings` | Embeddings |
| 2 | `retrieval` | Retrieval |
| 3 | `production` | RAG in Production |

## Lessons — module `embeddings`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 12.1 | What Are Embeddings? | `what-are-embeddings` | Advanced | 30 min | 90 | `generative-ai.fundamentals.tokenization-and-embeddings` | semantic vectors, similarity intuition | planned |
| 12.2 | Generating Embeddings | `generating-embeddings` | Advanced | 30 min | 90 | `rag.embeddings.what-are-embeddings` | embedding models/APIs, normalization | planned |
| 12.3 | Similarity & Distance Metrics | `similarity-and-distance-metrics` | Advanced | 30 min | 90 | `rag.embeddings.generating-embeddings` | cosine, dot product, euclidean, when each | planned |
| 12.4 | Vector Databases | `vector-databases` | Advanced | 35 min | 100 | `rag.embeddings.similarity-and-distance-metrics` | ANN indexes, metadata filtering, options | planned |

## Lessons — module `retrieval`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 12.5 | RAG Architecture | `rag-architecture` | Advanced | 30 min | 90 | `rag.embeddings.vector-databases` | ingest → retrieve → augment → generate | planned |
| 12.6 | Chunking Strategies | `chunking-strategies` | Advanced | 30 min | 100 | `rag.retrieval.rag-architecture` | chunk size/overlap, structure-aware splitting | planned |
| 12.7 | Retrieval Methods | `retrieval-methods` | Advanced | 35 min | 100 | `rag.retrieval.chunking-strategies` | dense, keyword, hybrid, top-k tuning | planned |
| 12.8 | Reranking & Context Assembly | `reranking-and-context` | Advanced | 30 min | 110 | `rag.retrieval.retrieval-methods` | rerankers, context budgets, citation | planned |

## Lessons — module `production`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 12.9 | Evaluating RAG Systems | `evaluating-rag-systems` | Advanced | 35 min | 100 | `rag.retrieval.reranking-and-context` | retrieval metrics, faithfulness, answer quality | planned |
| 12.10 | RAG Anti-Patterns | `rag-anti-patterns` | Advanced | 25 min | 100 | `rag.production.evaluating-rag-systems` | naive chunking, over-retrieval, stale indexes | planned |
| 12.11 | 🏗 Project: Document Q&A System | `project-document-qa` | Advanced | 90 min | 300 | `rag.production.rag-anti-patterns` | full RAG build with evaluation | planned |

Domain status: 0/11 implemented. Exercise ID prefix: `rag01`–`rag11`.
