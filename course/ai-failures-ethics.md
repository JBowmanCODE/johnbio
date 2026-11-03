# AI Failures and Ethics

> Real-world case studies of AI deployment failures and the ethical governance principles needed to prevent harm.

- **Canonical URL**: https://johnb.io/course/ai-failures-ethics
- **Markdown URL**: https://johnb.io/course/ai-failures-ethics.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 3
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

AI companies talk about breakthroughs. They don't advertise the times their systems failed spectacularly and hurt real people. This lesson covers documented failures, the accountability gap they expose, and what genuine ethics in AI requires.

## The Concrete Problems

In 2020, an innocent Black man was arrested in Detroit because the police department's [facial recognition system misidentified him](https://www.nytimes.com/2020/06/24/technology/facial-recognition-arrest.html). The technology had a documented error rate of around 35% when identifying Black faces, compared to less than 1% for white faces. This wasn't a philosophical debate about bias - it was a person spending hours in jail for something an algorithm got wrong.

Amazon's hiring algorithm, built in 2014, was trained on historical hiring data from an industry (tech) that's massively male-dominated. The system learned that pattern and started automatically downranking female applicants' resumes. Amazon scrapped it eventually, but only after the problem became public. How many qualified women didn't get a chance before then?

Medical AI has similar problems. A [widely-used algorithm for allocating healthcare resources](https://www.science.org/doi/10.1126/science.aax2342) systematically recommended fewer services to Black patients because it used healthcare spending as a proxy for need. Sicker patients cost more to treat. Since Black Americans face systemic barriers to healthcare access, they spent less - so the algorithm concluded they needed less help. The mathematical logic was sound. The results were discriminatory.

## Why "The AI Made a Mistake" Isn't an Excuse

When a human makes a bad hiring decision, they're accountable. When a doctor misdiagnoses a patient, there's a paper trail and responsibility. When an algorithm does it, suddenly everyone's hands are clean.

"The AI made the decision" gets treated like an act of nature rather than the act of people who built it, trained it, deployed it, and chose not to audit it properly. This is a direct consequence of how [AI systems are built](https://johnb.io/course/what-is-ai) - and the opacity that follows. Companies use opacity as a shield. They can say "it's too complex to explain why it failed" when what they really mean is "we didn't think hard about whether it would work fairly."

Amazon retired its hiring algorithm with a quiet press release. Detroit's police department faced some scrutiny. The man who was arrested had to prove his innocence. The accountability is almost entirely one-directional: towards the person harmed, not towards the organisation that deployed the system.

## The Gap Between "AI Said So" and Accountability

A loan approval system denies you credit. Can you ask why? Usually not. There's no equivalent to asking a human loan officer to justify their decision. When an AI's decision affects your life and you can't appeal to any logic, something's broken about how we're using these tools.

Medical devices are slightly better because of regulatory oversight, but not by much. A hospital implements an algorithm validated on one dataset, then uses it on a different population. When outcomes are worse, who's liable? The algorithm developer? The hospital? Nobody's figured that out yet.

Companies love AI's plausible deniability. They can say "we didn't program it to discriminate" - and technically, they didn't. The system learned discrimination from the data. That's both true and completely insufficient as an excuse. The [hallucinations and bias](https://johnb.io/course/ai-hallucinations-bias-ip) lesson covers the mechanics of how this happens. The people who chose the training data, chose not to audit for demographic disparities, and chose to deploy anyway - they made decisions.

## What Companies Are Actually Doing

Some organisations have started taking this seriously. Microsoft published a responsible AI playbook. Google made bias detection tools public. The [AI governance frameworks](https://johnb.io/course/ai-governance-frameworks) lesson covers what regulation is actually doing about this. Better than nothing. But better than nothing isn't good.

Most companies still treat ethics as a PR move, not a design requirement. They audit models after deployment rather than before. They talk about transparency while keeping training data proprietary. They hire ethics teams and then ignore them when there's a deadline.

Deploying an AI system that affects people's opportunities, health, or freedom without rigorous [bias testing](https://johnb.io/course/model-evaluation) should be treated the same way as using an untested drug on patients. It isn't. Companies get years of market advantage before anyone holds them accountable. By then, the biased decisions have affected thousands of people and become normalised.

Real ethics in AI means building slower, testing harder, and accepting that sometimes you don't deploy because the risk is too high. It means admitting when you don't know if something works fairly. I'm sceptical that happens on its own without external pressure - regulatory or otherwise.

## How It Works

1. **Training data bias.** Algorithmic bias typically arises through three mechanisms. **Training data bias**: the model learns from data that reflects existing inequalities - historical hiring patterns, healthcare access disparities, or policing practices. **Proxy variables**: the model uses a neutral-seeming variable (like postcode or healthcare spending) that correlates with a protected characteristic (like race or income). **Feedback loops**: biased predictions influence real-world outcomes, which generate more biased training data in future iterations.
2. **Step.** Facial recognition systems have higher error rates for darker skin tones because most benchmark datasets historically over-represented lighter-skinned faces. When models train on these datasets, they learn finer distinctions for the overrepresented group and coarser distinctions for the rest.

## Key Points

- Real AI failures include wrongful arrests from facial recognition, discriminatory hiring algorithms, and biased healthcare resource allocation.
- Bias in AI comes from training data that reflects historical inequalities - the system learns and replicates those patterns.
- The accountability gap: organisations deploy AI, harm occurs, but nobody is clearly responsible because "the algorithm decided."
- Companies use opacity as a shield - keeping training data proprietary makes independent bias auditing impossible.
- Ethics in AI is not philosophy: it's the difference between auditing for bias before deployment versus after people are harmed.
- Most companies treat ethics as PR rather than a design requirement - auditing after deployment instead of before.
- Systems affecting people's opportunities, health, or freedom need the same rigorous pre-deployment testing as medical devices.

## Frequently Asked Questions

### What are real-world examples of AI failures?

A Detroit man was wrongfully arrested in 2020 after facial recognition misidentified him - the system had a ~35% error rate on Black faces. Amazon's hiring algorithm downranked women because it learned from male-dominated hiring history. A healthcare algorithm recommended fewer services to Black patients because it used spending as a proxy for need, ignoring that access barriers had suppressed that spending.

### Why is there an accountability gap in AI?

When a human makes a bad decision, there's a person accountable. When an AI does it, companies use the complexity of the system as a shield - "the algorithm decided" becomes a way to avoid responsibility. This is made worse by opacity: companies often keep training data and model behaviour proprietary, making independent auditing impossible.

### What should companies actually do about AI ethics?

Ethics in AI means testing for bias before deployment, not after. It means building slower when the stakes are high, accepting that sometimes you don't deploy because the risk is too great. It means treating an AI system that affects people's opportunities or freedom the way you'd treat an untested medical device - with rigorous pre-deployment validation, not a quiet post-launch fix when things go wrong.

### How does AI bias relate to training data?

AI systems learn patterns from their training data. If that data reflects historical discrimination - male-dominated hiring, underfunded healthcare in certain communities, racially biased criminal justice records - the model learns those patterns and replicates them. The system didn't choose to discriminate; it learned a pattern that produces discriminatory outputs. That's why auditing training data is as important as auditing the model.

## Sources & Primary References

1. Buolamwini, J. & Gebru, T. (2018). Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. *FAccT 2018*.
2. Dastin, J. (2018). Amazon scraps secret AI recruiting tool that showed bias against women. *Reuters*.
3. Obermeyer, Z. et al. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science*, 366(6464).
4. Hill, K. (2020). Wrongfully Accused by an Algorithm. *New York Times*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
