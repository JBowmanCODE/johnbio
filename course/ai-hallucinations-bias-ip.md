# Hallucinations, Bias and IP

> Why large language models hallucinate, how training data bias propagates into decisions, and copyright and intellectual property considerations.

- **Canonical URL**: https://johnb.io/course/ai-hallucinations-bias-ip
- **Markdown URL**: https://johnb.io/course/ai-hallucinations-bias-ip.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 3
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

Three distinct problems in AI, often confused. Hallucinations are confident false outputs. Bias is skewed outputs that look correct. IP ownership of AI-generated content is legally unresolved. Each requires different thinking.

## What AI Hallucinations Actually Are

An [AI hallucination](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)) is when an AI confidently outputs something completely false.

You ask ChatGPT for the name of a famous biologist from the 1800s. It gives you a detailed answer about "Dr Margaret Livingston" with a full biographical paragraph. Sounds great. Completely made up. The person never existed.

Or you ask for a specific study. The model generates a perfectly formatted academic reference that sounds real, uses actual researchers' names, but the study itself doesn't exist. The model didn't remember the study - it invented one. The format was convincing enough that people have cited these fake papers in real academic work.

This happens because language models don't "know" things the way you do. They predict the next word based on patterns in training data. If the pattern suggests a plausible-sounding next word, they pick it. There's no internal fact-checker running in parallel, no system that says "wait, is this actually true?"

The confidence is the real danger. The AI doesn't hedge or say "I'm not sure." It states things like it knows. A humble wrong answer is less harmful than a confident hallucination. Approaches like [RAG](https://johnb.io/course/rag-finetuning-enterprise-ai) help by grounding responses in real documents rather than pure pattern prediction.

## The Difference Between Hallucination and Bias

Hallucinations are false outputs. Bias is skewed outputs. They're different problems.

A hallucination is generating a study that doesn't exist. Bias is recommending different job candidates based on their names when both have identical qualifications. One output is invented. The other is a real pattern - but the wrong one to apply.

Bias happens because training data contains human biases and the AI learns those patterns. If historical hiring data shows men got hired more often, the model learns "being male correlates with getting hired." It can't distinguish between "male applicants were better qualified" and "the company discriminated." From the model's perspective, it's just a pattern.

That's actually harder to catch than hallucinations, because biased outputs look reasonable. A hiring algorithm recommending mostly men might not trigger alarms - until you check and find it's doing so at a rate matching historical discrimination, not actual applicant quality. Hallucinations feel like bugs. Bias feels like how the system is supposed to work, even when it isn't.

## Where Bias Comes From and What It Produces

Bias starts with [training data](https://johnb.io/course/how-ai-learns), but it's not always obvious where.

If you train a medical AI on data from hospitals serving wealthy populations, it works well for those people. Deploy it in a clinic serving a completely different population - different genetics, lifestyle factors, disease presentations - and it fails. That's data bias: the training data didn't represent the real world the model has to handle.

Sometimes it's inherited from human writing. Train a language model on internet text and it absorbs every bias, stereotype, and harmful pattern that exists in human communication. The model can't distinguish "this reflects reality" from "this is a harmful stereotype." It just learns the pattern.

What gets produced? Wrong decisions that appear systematic. Résumé-screening that filters out qualified candidates. [Criminal justice algorithms](https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing) that recommend longer sentences based on demographic factors. Loan approval systems that vary by postcode after controlling for credit score.

The scary part is how well these biases hide. You deploy an algorithm, it works on your test set, and you never check whether it's working differently for different groups. The problem only surfaces if someone specifically looks for demographic disparities. Most deployments don't check. These are the kinds of [real-world AI failures](https://johnb.io/course/ai-failures-ethics) that governance frameworks are supposed to prevent.

## The Intellectual Property Question

You use AI to write a song, generate art, or produce code. Who owns it? You, who prompted it? The AI company that built the model? The original creators whose work the model was trained on?

There isn't a clear answer yet, and companies are betting you won't figure this out quickly.

Some AI companies claim the user owns the output - convenient for them, as they take no liability. Others claim the company retains rights. Many are deliberately vague. Courts haven't settled major cases definitively, which means everyone's in a legal grey area right now. The UK government has published [guidance on copyright in AI-generated works](https://www.gov.uk/guidance/copyright-in-ai-generated-works).

The situation for original creators is genuinely unjust. AI companies trained on millions of images from photographers, artists, and illustrators without explicit permission. Those creators didn't consent to their work being used to train something that would compete with them.

But the counterpoint: if you personally prompt an AI and it generates something original-looking, saying the original artists "own" your specific output because the model trained on their work is also a stretch. The line is blurry on purpose - nobody wants to be the one who draws it.

If you're creating AI-generated content to sell or monetise, you're taking a legal risk right now. Some jurisdictions are starting to move - the EU is exploring requirements for AI companies to disclose training data, which would at least let creators see whether their work was used. That's a start, not a resolution.

## How It Works

1. **Hallucinations.** arise from the nature of language model generation. The model samples from a probability distribution over possible next tokens. It has no external memory, no fact database, and no truth-checking mechanism. When asked about something not clearly in its training data, it generates the statistically most plausible continuation - which can be entirely fabricated but formatted to look credible.
2. **Bias.** propagates through training data. If a dataset over-represents one demographic in positive contexts, the model learns that association. Standard validation metrics (overall accuracy, F1 score) can miss this entirely if the biased subgroup is small relative to the overall dataset. Proper bias auditing requires disaggregated evaluation - checking performance separately for each demographic group.
3. **IP issues.** arise because AI models are trained on copyrighted content at scale. The legal framework for copyright was built around human creators copying from identifiable sources - it doesn't map cleanly onto statistical pattern learning from billions of training examples.

## Key Points

- AI hallucinations: models generate confident false information because they predict likely word sequences, not verified facts.
- The confidence of hallucinations makes them dangerous - they're indistinguishable from correct answers without external verification.
- AI bias: models learn skewed patterns from biased training data and reproduce them in outputs.
- Bias differs from hallucination: biased outputs look correct, matching learned patterns, until demographic analysis reveals the skew.
- Bias sources: historical data reflecting past discrimination, proxy variables that correlate with protected characteristics, lack of representation in training data.
- IP ownership of AI-generated content is legally unresolved - users, companies, and original creators all have potential claims.
- If monetising AI-generated content, you're currently taking a legal risk. Monitor developments in your jurisdiction.

## Frequently Asked Questions

### What is an AI hallucination?

An AI hallucination is when an AI system confidently outputs something completely false. Language models predict the next word based on statistical patterns - they have no internal fact-checker. So when a plausible-sounding answer exists in the pattern space, the model generates it whether or not it's true. The danger is the confidence: the AI doesn't hedge or admit uncertainty, it states falsehoods as fact.

### What is the difference between AI hallucination and AI bias?

Hallucinations are false outputs - the AI invented something that doesn't exist. Bias is skewed outputs - the AI produces real patterns but wrong ones. A hiring algorithm that recommends fewer women isn't inventing things; it learned a pattern from biased historical data and replicates it. Bias is often harder to detect because biased outputs can look entirely reasonable until you check demographic breakdowns.

### Who owns AI-generated content?

This is legally unsettled. Different AI companies take different positions - some say the user owns it, some claim the company retains rights, many are deliberately vague. Courts haven't definitively resolved major cases yet. If you're creating AI-generated content to sell or monetise, you're currently in a legal grey area. The situation around whether original creators whose work trained AI models have rights is also unresolved.

### Why is AI bias hard to detect?

Biased AI outputs often look reasonable on the surface. A hiring algorithm recommending mostly men, a loan algorithm approving fewer applications from certain postcodes - these can pass validation on aggregate metrics while hiding systematic disparities. You only find the bias if you specifically look for it by comparing outcomes across demographic groups. Most deployments don't do this check at all.

## Sources & Primary References

1. Ji, Z. et al. (2023). Survey of Hallucination in Natural Language Generation. *ACM Computing Surveys*, 55(12).
2. Bender, E. et al. (2021). On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? *FAccT 2021*.
3. Mehrabi, N. et al. (2021). A Survey on Bias and Fairness in Machine Learning. *ACM Computing Surveys*, 54(6).
4. Andersen v. Stability AI Ltd (N.D. Cal. 2023) - landmark AI copyright case.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
