# CI/CD for ML

> Automated testing, data validation, model registry versioning and continuous delivery pipelines for machine learning.

- **Canonical URL**: https://johnb.io/course/cicd-for-ml
- **Markdown URL**: https://johnb.io/course/cicd-for-ml.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 8 · AI in Production
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 10 min read

In regular software, CI/CD is standard practice. You push code, tests run automatically, if tests pass your code gets deployed. It's automated, reliable, and happens dozens of times a day.

In regular software, CI/CD is standard practice. You push code, tests run automatically, if tests pass your code gets deployed. It's automated, reliable, and happens dozens of times a day.

ML teams mostly don't have this. They have notebooks, manual steps, and occasional production deployments that are stressful events. The broader context for why is covered in [intro to MLOps](https://johnb.io/course/intro-to-mlops).

CI/CD for ML means automating the pipeline from raw data to a [deployed model](https://johnb.io/course/model-deployment). When things change - when new data arrives, when code changes, when a bug is fixed - the system automatically tests, trains, evaluates, and deploys. No manual steps.

## Why ML pipelines need their own version of CI/CD

Regular software CI/CD is about code. You change code, tests run, code gets deployed.

ML CI/CD is about three things: code, data, and models. You need to test that your code changes work. You need to test that your data hasn't corrupted. You need to test that your model is actually better than the previous one before deploying it.

This is more complex. A test for code is straightforward: does the function return the right answer? A test for an ML model is: is the accuracy better? Better by the metrics covered in [model evaluation](https://johnb.io/course/model-evaluation)? Better than what? Better than the previous model? Better than a baseline? Better by a statistically significant margin?

You also need reproducibility. If someone asks "why did this model perform this way?" you need to know exactly what code, data, and hyperparameters created it. Reproducibility also depends on using the right [deep learning framework](https://johnb.io/course/tensorflow-pytorch-keras) with version pinning. Every model needs lineage - what data trained it, what code was used, what parameters were set. Regular software has this for code through version control. ML needs it for code, data, and models. That's the additional complexity.

## What ML CI/CD covers

**Data validation.** When new data arrives, validate it. Are the column names correct? Are the data types what we expect? Are there missing values where we expect them? Are the value ranges reasonable? If data doesn't match schema, flag it and don't proceed. A corrupted dataset that silently trains a broken model is worse than a pipeline that fails loudly.

**Feature engineering.** Transform raw data into features. This runs automatically as part of the pipeline - code that generates features from raw data, versioned and reproducible.

**Training runs.** Automatically train models when code or data changes. Log hyperparameters, results, and training time. Keep track of which training run corresponds to which data and code version.

**Model testing.** Evaluate the new model. Does it perform better than the current production model? Does it meet minimum performance standards? Is the performance improvement statistically significant? Different metrics for different use cases.

**Deployment.** If the model passes tests, deploy it. Gradually roll it out - 10% of traffic, then 50%, then 100% - so you can catch issues before they affect everyone.

Data comes in, gets validated, gets transformed, trains a model, evaluates the model, deploys if good, monitors in production. That's the pipeline.

## Tools in this space

Jenkins is a general-purpose CI/CD system. You can configure it to run ML pipelines. It's not specific to ML but it works and a lot of teams use it.

[GitHub Actions](https://docs.github.com/en/actions) integrates directly with GitHub. You write workflows that run on code changes. Teams use it for ML pipelines - train models, evaluate, commit results back to the repo. It's accessible and has good community support.

Apache Airflow is a workflow orchestration tool. You define a directed acyclic graph (DAG) of tasks - data loading, preprocessing, training, evaluation. Airflow schedules and monitors those tasks. Complex to set up but powerful for production workloads.

DVC (Data Version Control) addresses the ML-specific problem. It versions code, data, and models together. It integrates with Git and tracks how data flows through a pipeline. Running dvc repro reruns only the pipeline stages that have changed.

[MLflow](https://mlflow.org/docs/latest/index.html) tracks experiments. You log parameters, metrics, and models. You can compare experiments and reproduce runs. It has a model registry component for versioning what's in production.

The landscape is fragmented. There's no universal standard yet. Different teams use different combinations depending on their infrastructure and scale. Most production systems I'm aware of stitch together two or three of these tools.

## How mature ML automation is right now

Honest answer: less mature than regular software CI/CD.

Good companies have automated retraining. New data arrives, a pipeline trains a model, tests it, and maybe deploys it. But they had to build a lot of it themselves or integrate multiple tools. It wasn't a matter of following a standard playbook.

Most companies don't have this. They retrain manually. Someone gets data, runs training code, evaluates results, decides if it's worth deploying, manually deploys. Slow and error-prone.

The tools exist. The knowledge exists. But it's not as standardised and straightforward as software CI/CD.

My view: if you're building ML systems, prioritise automation. Don't manually retrain models. Don't manually evaluate. Don't manually deploy. Build a pipeline that does this. The infrastructure investment pays off immediately in reliability and speed - and in the ability to respond quickly when [drift is detected](https://johnb.io/course/monitoring-drift).

The maturity gap is biggest at small companies. A startup building an ML system probably doesn't have the engineering resources to build a sophisticated pipeline, so they do things manually and accept the messiness. Larger companies can invest in infrastructure. Eventually the tools will be good enough that even small teams can have mature practices without building everything from scratch.

## How It Works

1. **A typical ML CI/CD pipeline:.**
2. **Step.** 1. Trigger (new data, code commit, scheduled run). 2. Data validation: check schema, value ranges, missing values - fail loudly if data is corrupt. 3. Feature engineering: run transformation code, version the output. 4. Training: launch a training run, log to MLflow or equivalent. 5. Evaluation: compare new model vs current production model on a held-out evaluation set. 6. Gate: if new model meets performance threshold AND beats current model, proceed. Otherwise, alert a human. 7. Deployment: roll out to 10% of traffic, monitor, expand to 100% or roll back. 8. Monitor: log inputs, outputs, performance in production.
3. **Lineage tracking:.** Every model in a registry should have: the git commit hash of the code that trained it, a pointer to the exact dataset version used, the hyperparameter configuration, and the evaluation metrics. Without this, you can't reproduce a model or debug why it behaved a certain way.

## Key Points

- Most ML teams still rely on manual retraining - CI/CD is less standard in ML than in software
- ML CI/CD covers code, data, and models - three things to version, test, and track
- Data validation should fail loudly before training starts, not silently produce a broken model
- Model testing means comparing new model vs current production model, not just checking code syntax
- Lineage tracking: every model should trace back to its exact code, data, and parameters
- Common tools: GitHub Actions, Airflow, DVC, MLflow - often used in combination
- The landscape is fragmented - no universal standard for ML CI/CD yet
- Automation pays off immediately in reliability and speed of response to drift

## Frequently Asked Questions

### What is CI/CD for machine learning?

CI/CD for ML means automating the pipeline from raw data to a deployed model. When code, data, or requirements change, the system automatically validates data, trains a model, evaluates it against the current production model, and deploys it if performance improves. This replaces manual steps that are slow and error-prone.

### How does ML CI/CD differ from regular software CI/CD?

Regular software CI/CD is about code: you change code, tests run, it gets deployed. ML CI/CD covers three things: code, data, and models. You need to validate data hasn't corrupted, test that the new model is actually better than the current one, and track the lineage of every model (what data, what code, what parameters created it). This requires additional tooling beyond standard CI/CD.

### What tools are used for ML CI/CD?

Common tools include GitHub Actions (for ML workflows triggered by code changes), Apache Airflow (workflow orchestration with DAGs), DVC (Data Version Control - versions code, data, and models together), and MLflow (experiment tracking - logs parameters, metrics, and model artefacts). The landscape is fragmented; different teams use different combinations depending on their infrastructure.

### How mature is ML automation in 2026?

Less mature than regular software CI/CD. Good companies have automated retraining pipelines but typically built them themselves or stitched together multiple tools. Most companies still retrain manually. The tools exist and the knowledge exists, but standardisation is behind. Teams building ML systems should prioritise automation - the investment pays off immediately in reliability and speed.

## Sources & Primary References

1. Sato, D. et al. (2019). Continuous Delivery for Machine Learning. *martinfowler.com*.
2. DVC Documentation. (2024). *dvc.org*.
3. MLflow Documentation. (2024). *mlflow.org*.
4. Huyen, C. (2022). *Designing Machine Learning Systems*. O'Reilly.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
