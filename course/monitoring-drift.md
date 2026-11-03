# Monitoring and Drift

> Detecting data drift, concept drift and silent performance degradation in production ML and LLM pipelines.

- **Canonical URL**: https://johnb.io/course/monitoring-drift
- **Markdown URL**: https://johnb.io/course/monitoring-drift.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 8 · AI in Production
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

You deploy a model. It's tested. It works. You put it in production on a Monday.

You deploy a model. It's tested. It works. You put it in production on a Monday.

By Friday it's performing badly. Not because you changed it. Because the world changed. The data your model sees in production is different from the data it trained on. This is drift and it's normal - and it's what kills most ML systems in production.

## Why a model that worked at launch can stop working

A model learns patterns from training data. Those patterns are true for that data at that time. In production, the conditions change.

An example: you build a model to predict whether someone will buy a product based on their browsing behaviour. You trained it on data from 2024. You deploy it in January 2025. There's a new marketing campaign that changes browsing patterns. Suddenly your model is wrong about what user behaviour means.

Or simpler: you train on historical data that includes 40% of a specific user segment. In production, that segment is 10% of your traffic. The distribution changed, and the model's predictions aren't calibrated for the new distribution.

The model doesn't change. The data it's receiving changed. So performance degrades. This is inevitable - you can't train on data that doesn't exist yet. The only question is how fast you notice and how you respond.

## What data drift is

Data drift is when the input data distribution changes. The features your model sees in production are statistically different from the features it saw in training.

You trained on data where customer age ranged from 18 to 65. In production, you're seeing users from 15 to 85. That's drift. You trained on mobile and desktop users equally. In production, 80% are mobile. Drift. You trained on products in three categories. A new category launched and now 30% of your predictions are on that category. Drift.

Data drift is relatively easy to detect. You log the features you see in production. You compare them to the training data distribution. If the statistics are significantly different, you have drift. Calculate means, variances, percentiles of features in a recent production window and compare to training data. Statistical tests like the Kolmogorov-Smirnov test or Wasserstein distance can quantify the difference. Tools like [Evidently AI](https://docs.evidentlyai.com/) automate this monitoring.

## What concept drift is and how it differs

Concept drift is different. It's when the relationship between features and the target changes. The features look the same but they mean different things.

You train a model: "If a user visits a product page for 10 seconds, they're likely to buy." You deploy it. In production, people are reading reviews more carefully and time on page means something different. The relationship changed even though the feature is the same.

Or: you train on data from a recession. Now the economy is different. Economic patterns that predicted buying behaviour then don't predict it now.

Concept drift is harder to detect than data drift. You can see data drift immediately - the input distribution changed. With concept drift, you only notice when performance metrics degrade over time. That's slower feedback, and slower feedback means more damage before you notice.

## How to detect drift

You need to monitor your model's inputs and outputs.

For inputs: log the features and track their distributions. Set thresholds for how much change is acceptable. If feature distributions change significantly compared to training data, you have data drift.

For outputs: log predictions and track the distribution. If the model suddenly predicts "yes" 90% of the time when it used to predict 50%, something's wrong. Crude but catches obvious issues fast.

For performance: this is the hard part. You need ground truth labels to measure performance. In some domains you get them quickly - if you're predicting credit default, you know in months. The right performance metrics to track come from [model evaluation](https://johnb.io/course/model-evaluation). In others it's slow. Identify where you can measure performance and monitor it actively.

Most teams set up a monitoring dashboard: input distributions, output distributions, performance metrics if labels are available. Set alerts that fire when things deviate significantly from baseline.

## What to do when drift is detected

You have a few options.

**Investigate first.** Understand what changed. Are your assumptions about the problem still valid? Did the business change? Did user behaviour change? Did your data pipeline break? Understanding the cause matters because it determines the solution.

**Retrain.** Most commonly, you retrain on newer data. If drift is detected, gather recent data, retrain, and [deploy a new model](https://johnb.io/course/model-deployment). Ideally this is automated - drift detection triggers retraining which triggers evaluation which triggers deployment if the new model is better.

**Accept it.** Sometimes drift is acceptable. If your model is degrading slowly and retraining is expensive, the cost may not be worth it. A business decision, not a technical one.

**Change the problem.** Sometimes drift signals that your original assumption is wrong. If the business has fundamentally changed, you might need a different model for a different problem.

**Fix the pipeline.** Sometimes drift happens because your data pipeline is broken. You're supposed to log customer demographics but they're not being logged correctly. Fix the pipeline and drift might disappear.

## How seriously most teams take monitoring

Not seriously enough.

Most teams log some metrics and maybe watch a dashboard occasionally. But they don't have automated alerts. They don't have processes for responding to drift. When a model starts failing, they discover it because customers complain or because a business metric tanks.

Good practices: automated drift detection with alerts. Someone on-call who responds to alerts. An automated retraining pipeline - the kind covered in [CI/CD for ML](https://johnb.io/course/cicd-for-ml) - that tests new models before deploying. Monitoring that covers inputs, outputs, and performance.

This is hard. It requires infrastructure and maintenance. But it's the difference between a model that degrades gracefully and one that crashes and burns. The [intro to MLOps](https://johnb.io/course/intro-to-mlops) lesson puts this monitoring work in the context of the full production system. The teams that are good at ML in production treat monitoring the same as running any service. Observability matters. You plan for failure and you have processes to respond. You don't ship and forget.

## How It Works

1. **Detecting data drift:.** At training time, record baseline statistics for each feature (mean, standard deviation, quartiles, value counts for categoricals). At serving time, maintain a rolling window of recent predictions. Periodically compute the same statistics on the window and compare. Statistical tests like KS test (for continuous features) or chi-squared (for categorical features) quantify how different the distributions are.
2. **Detecting concept drift:.** Requires labels. Track accuracy, precision, recall, or domain-specific metrics on a rolling window. If performance is significantly below the training baseline, concept drift is likely. Shadow mode - running a challenger model in parallel and comparing - can also surface concept drift before it affects production users.
3. **Automated retraining pipelines:.** Drift alert triggers data collection. New labelled data is assembled. A new model trains. Evaluation gate compares new model vs current production model on a holdout set. If the new model wins, it's deployed gradually (10%, 50%, 100%). If it loses, the alert is escalated to a human.

## Key Points

- Drift is inevitable - the world changes, training data doesn't update automatically
- Data drift: input feature distributions shift - detectable immediately by comparing statistics
- Concept drift: the feature-target relationship changes - only visible through performance degradation
- Monitor inputs (feature distributions), outputs (prediction distributions), and performance (if labels available)
- KS test and Wasserstein distance are standard statistical tools for quantifying distribution differences
- Drift detection should trigger automated alerts, not wait for customer complaints
- Response options: retrain, accept degradation, change the problem, or fix the pipeline
- Most teams don't monitor seriously enough - they find out about drift from business metrics, not ML metrics

## Frequently Asked Questions

### What is data drift in machine learning?

Data drift is when the statistical distribution of input features in production changes compared to training. The model was trained on one distribution, but in production it sees a different one. This is detectable immediately by comparing feature statistics - means, variances, percentiles - between a recent production window and the training baseline.

### What is concept drift and how does it differ from data drift?

Concept drift is when the relationship between features and the target changes, even if the features themselves look the same. The data may look identical but what it means has changed. Concept drift is harder to detect because you need ground truth labels to see it - you only notice it when performance metrics degrade over time.

### How do you detect model drift?

For data drift: log input features in production, track their distributions over time, and compare to training data using statistical tests (Kolmogorov-Smirnov, Wasserstein distance). For output drift: track prediction distributions - if the model starts predicting one class 90% of the time when it used to predict 50%, something changed. For performance drift: compare predictions to ground truth labels as they become available.

### What should you do when drift is detected?

First investigate: understand what changed and why. Then choose a response: retrain on newer data (most common), accept the degradation if it's minor, change the problem definition if the business has fundamentally changed, or fix the data pipeline if the drift is caused by a broken ingestion step. Drift detection should be automated and should trigger a defined response process.

## Sources & Primary References

1. Gama, J. et al. (2014). A Survey on Concept Drift Adaptation. *ACM Computing Surveys*.
2. Klaise, J. et al. (2020). Alibi Detect: Algorithms for Outlier, Adversarial and Drift Detection. *JMLR*.
3. Ackerman, S. et al. (2021). Machine Learning Monitoring. *arXiv*.
4. Evidently AI. (2024). Open-Source ML Monitoring. *evidentlyai.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
