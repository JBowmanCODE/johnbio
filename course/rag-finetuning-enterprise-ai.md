# RAG, Fine-tuning and Enterprise AI

> When to use Retrieval-Augmented Generation (RAG) with vector search versus fine-tuning weights for enterprise AI systems.

- **Canonical URL**: https://johnb.io/course/rag-finetuning-enterprise-ai
- **Markdown URL**: https://johnb.io/course/rag-finetuning-enterprise-ai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 7 · Generative AI & Practical Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 11 min read

A language model knows stuff about the world up until its training cutoff. After that, it's making things up. Ask it about private company data and it's hallucinating. Ask it about a document it never saw, and it doesn't have the information.

A language model knows stuff about the world up until its training cutoff. After that, it's making things up. Ask it about private company data and it's hallucinating. Ask it about a document it never saw, and it doesn't have the information.

Enterprises need their AI systems to work with current, private data. That means feeding context to the model beyond what it was trained on. You have two main strategies: retrieval-augmented generation and fine-tuning. They solve different problems.

## The problem RAG is solving

A language model is like someone who read a lot in school and then never read anything new. Ask it about something after its training cutoff and it'll confidently make something up. Ask it about an internal document it never saw, and it either hasn't seen it or confabulates details.

That's hallucination. It's not malice or stupidity - the model does what it was trained to do, predict plausible text. But plausible isn't the same as true.

RAG solves this by giving the model access to relevant context before it answers. You ask a question, RAG finds relevant documents or database entries, and feeds those to the model along with your question. Now the model has actual facts to work with. [Hugging Face's training documentation](https://huggingface.co/docs/transformers/training) is the standard reference for implementing this in practice.

## How RAG works: retrieve then generate

The process has two steps. First, retrieve. You take the user's query and search a database of documents to find relevant ones. Usually by embedding the query and finding documents with similar embeddings - semantic similarity, not keyword matching.

Then generate. You take the retrieved documents and the original query and feed them both to a language model. The model generates an answer with those documents as context. If the documents contain the answer, the model can usually find it.

This works well. The model doesn't have to know the answer - it has to be able to read and synthesise information from documents. That's something language models do well.

The limitations are real. If retrieval gets the wrong documents, generation works from bad context. If your documents are poorly structured or low quality, retrieval won't help. If the answer requires combining information across many documents in complex ways, even a good model might struggle.

## What fine-tuning is and when it's actually needed

Fine-tuning means taking a pre-trained model and training it further on your specific data. You're adapting the model's weights to your domain. The [generative AI models](https://johnb.io/course/generative-ai-models) lesson covers what models are available to fine-tune.

It's expensive. You need lots of labelled examples - usually hundreds or thousands of good training pairs. You need compute. It takes time. And you end up with a model that's different from the base model, which your tools and infrastructure need to handle.

Fine-tuning makes sense when you have a very specific style or format the model needs to match, specialised terminology the base model handles poorly, consistent patterns your data follows that a model can learn, and enough labelled examples to train on.

What doesn't make sense: fine-tuning to make a model "know" your private data. A model can't memorise its way to better knowledge tasks. Fine-tuning helps with style, format, and specialised language. It doesn't turn a model into a domain expert.

That's where the confusion happens. People think: "I'll fine-tune on our documents so it knows our data." But models don't work that way. Fine-tuning with documents mostly teaches the model the style of your documents, not their content. For content, you need retrieval.

## Why most enterprises should try RAG first

RAG should be your first move. Every time. The [prompt engineering](https://johnb.io/course/prompt-engineering-ai-agents) lesson is worth reading alongside this - prompts shape what RAG retrieves.

RAG is cheaper. It's faster to set up. You don't need to train anything. You don't need labelled data. You can iterate and improve retrieval without retraining. If your documents are bad, you fix the documents instead of retraining a model.

RAG scales. Add new documents and the system immediately has access to them. No retraining, no waiting.

The only real downside is latency. Retrieval takes time. If you need sub-100ms response times, RAG is harder. For most enterprise applications, that's not a constraint.

Should you eventually fine-tune on top of RAG? Maybe. If you have specific style requirements or a lot of domain-specific terminology, fine-tuning a model to use within your RAG system could help. But that's a second step. Start with RAG. Get it working. Then instrument to see where it's failing. Then optimise based on real data about where it breaks.

## The build, buy, or use-an-API decision

You can build your own RAG system using open-source components. You can buy a commercial RAG platform. You can use API-based RAG from an LLM provider. The [AI tools and platforms](https://johnb.io/course/ai-tools-platforms-2026) lesson covers what's available from major providers.

Building means you own everything and can customise everything. It also means you're responsible for everything - security, availability, monitoring. You need ML and engineering expertise in house.

Buying a platform means someone else handles the infrastructure. But you're paying per query or per month, and you're locked into their choices about retrieval algorithms and embedding models.

Using an API (like file upload features from OpenAI or Anthropic) is easy to start with but can get expensive and gives you less control.

For most businesses: buy or use an API first. Once you understand your requirements better, then consider building something custom. Don't build the infrastructure before you understand the problem. Once you do build, you'll need [proper deployment infrastructure](https://johnb.io/course/model-deployment) to serve it.

## Where most businesses get it wrong

Mistake one: trying to do everything with fine-tuning instead of retrieval. People have 200 documents and think the solution is to fine-tune a model on them. That won't work well. Fine-tuning teaches the model about those documents in aggregate, not what's in them.

Mistake two: building before understanding the problem. Teams build elaborate RAG systems with custom retrieval logic and complex architectures before they've validated that RAG is even the right solution. Start simple. Retrieve with vector search, generate with an API, iterate from there.

Mistake three: assuming quality data. Your RAG system is only as good as your documents. If they're outdated, poorly structured, or low quality, RAG won't fix that. Audit your data first.

Most businesses build too much, too early. Get a RAG system working with open-source tools and APIs. See where it breaks. Then optimise. Then maybe build custom pieces. The default should be "use what exists" not "build something custom." The same logic applies in the [build vs buy](https://johnb.io/course/build-vs-buy) lesson.

## How It Works

1. **RAG pipeline:.** 1) Index your documents by embedding them and storing the embeddings in a vector database. 2) At query time, embed the user's question. 3) Search the vector database for documents with similar embeddings. 4) Take the top k results and concatenate them with the question in the model's context. 5) The model generates an answer with those documents visible.
2. **Fine-tuning:.** Start with a pre-trained model. Assemble a dataset of input-output pairs that demonstrate the behaviour you want. Train for additional epochs on that dataset, updating the model's weights. The result is a new model checkpoint adapted to your domain style and format.
3. **When to combine them:.** RAG + fine-tuning can work together. Fine-tune a model to adopt your domain's tone and terminology, then use it as the generator in a RAG system. The retrieval handles factual accuracy; the fine-tuning handles style consistency.

## Key Points

- Language models hallucinate about post-cutoff events and private data they've never seen
- RAG retrieves relevant documents at query time and gives them to the model as context
- RAG uses semantic similarity (embeddings) rather than keyword matching for retrieval
- Fine-tuning adapts a model's style, format, and terminology - not its factual knowledge
- Fine-tuning on documents teaches document style, not document content
- RAG is cheaper, faster to deploy, and doesn't require labelled data
- New documents become immediately available in a RAG system - no retraining needed
- Most businesses should try RAG first, fine-tune second if needed
- The most common mistake: fine-tuning to make a model "know" your data
- Start simple: vector search + API. Validate. Then optimise.

## Frequently Asked Questions

### What is Retrieval-Augmented Generation (RAG)?

RAG is a technique that connects a language model to a document database. When a user asks a question, relevant documents are retrieved first (usually via semantic similarity search), then passed to the model along with the question. The model generates an answer using those documents as context. This solves the training cutoff problem and allows models to reason over private data without retraining.

### When should you use fine-tuning instead of RAG?

Fine-tuning makes sense when you have a specific style or format the model needs to match consistently, specialised terminology the base model handles poorly, or enough labelled training examples. It doesn't make sense for making a model "know" your documents - fine-tuning teaches style, not content. For content, use RAG.

### What are the main ways to deploy RAG?

You can build your own RAG pipeline using open-source components (full control, full responsibility), buy a commercial RAG platform (managed infrastructure, less control), or use an API with file upload features from an LLM provider (easiest to start, can get expensive). For most businesses: use an API or buy a platform first. Build custom only when you understand your specific requirements.

### What is the most common mistake businesses make with RAG?

Trying to use fine-tuning instead of retrieval to make a model "know" company data. Fine-tuning 200 documents doesn't make a model remember what's in them - it teaches the model the aggregate style of those documents. The second most common mistake is building a complex custom system before validating that a simpler approach works.

## Sources & Primary References

1. Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
2. Hu, E. et al. (2022). LoRA: Low-Rank Adaptation of Large Language Models. *ICLR*.
3. Gao, L. et al. (2024). Retrieval-Augmented Generation for Large Language Models: A Survey. *arXiv*.
4. Anthropic. (2024). Building Effective Agents. *anthropic.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
