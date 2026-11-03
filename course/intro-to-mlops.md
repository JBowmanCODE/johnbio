# Intro to MLOps

> Bridging the gap between Jupyter notebook experiments and reproducible, monitored production machine learning systems.

- **Canonical URL**: https://johnb.io/course/intro-to-mlops
- **Markdown URL**: https://johnb.io/course/intro-to-mlops.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 8 · AI in Production
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 10 min read

You build a model in a notebook. It works. You get 87% accuracy. You're happy. You deploy it to production.

You build a model in a notebook. It works. You get 87% accuracy. You're happy. You deploy it to production.

Three months later it's performing at 64% accuracy. You didn't touch it. The data changed. The users changed. The world changed. And now your model is broken in ways that are hard to debug because production is messier than your notebook.

That gap - between a notebook experiment and an actual working system - is where MLOps lives.

## The gap between notebook and production

A notebook is a controlled environment. You have a dataset. You split it into train and test. You train once, evaluate once, iterate. When you're done, you have a model file.

Production is chaos. Data arrives continuously. It's different from your training data. Your model makes predictions on it. Those predictions affect real decisions. Sometimes they're wrong and you need to understand why.

Your notebook didn't have to handle: new data arriving every minute, data in different formats or with different distributions, multiple models running in parallel, needing to roll back if a new model is bad, monitoring whether the model still works, retraining when performance degrades, version control for data, models, and code, compliance and audit requirements, or budget and compute constraints.

A notebook solves exactly one problem: build a model. Production needs to solve dozens more. [Model evaluation](https://johnb.io/course/model-evaluation) is one of those problems - and it looks different in production than it does in a notebook.

## What MLOps is and why it exists

MLOps is the infrastructure and practices that turn a model into a system that works reliably in production.

It's borrowed from DevOps - the practices that make software deployable and maintainable. But ML adds complexity because your system has three moving parts: code, data, and models. In traditional software, the code is the source of truth. In ML, the code matters less than the data and the model weights. Tools like [MLflow](https://mlflow.org) and [Kubeflow](https://www.kubeflow.org/docs/) exist specifically to manage these three parts together.

MLOps exists because ML in production fails in different ways than regular software. A regular application can be fully tested before deployment. An ML system can never be fully tested - and that's true regardless of the [framework](https://johnb.io/course/tensorflow-pytorch-keras) used - you'll always encounter data distributions you didn't see in training. A regular application is deterministic - the same input always produces the same output. An ML system is probabilistic - it makes mistakes, and those mistakes change over time as data changes.

You need different tools and practices for this reality.

## The key stages: data, training, deployment, monitoring

**Data management.** You need to know what data your model was trained on. You need to track data quality. You need to catch when the data distribution shifts. You need to version datasets so that when a model breaks, you can recreate the exact conditions that created it.

**Training.** You need to be able to retrain models automatically. You need to track hyperparameters and results. You need to run experiments in parallel and compare them. You need to version models and know which version is in production.

**Deployment.** You need to [serve models](https://johnb.io/course/model-deployment) with low latency and high availability. You need to be able to roll out new models gradually and roll back if something breaks. You need to handle multiple versions running simultaneously.

**Monitoring.** You need to track model performance on real data over time. You need to notice when performance degrades and alert the right people. You need to log predictions so you can debug failures. You need to know when to retrain.

These stages feed back into each other. Monitoring tells you when to retrain. Training produces a new model. Deployment puts it in production. Monitoring checks if it works. The cycle continues.

## Why ML fails differently in production

A regular application usually fails because of bugs. The code has a flaw, you fix it, you deploy the fix. ML systems fail because the world changed.

Your model learned patterns from training data. In production, the data is different. Not in format - usually the same format. But the distribution is different. Users behave differently. Products change. Campaigns succeed or fail. The patterns the model learned aren't true any more.

This is called drift and it's inevitable. You can't prevent it. You can only detect it and handle it. The [monitoring and drift](https://johnb.io/course/monitoring-drift) lesson covers how in detail.

A regular application is also deterministic - you can test every branch. An ML model is probabilistic. You can't test every possible input. You don't know in advance what mistakes it will make. You can only observe mistakes in production and try to learn from them.

This is why monitoring matters so much in ML. You can't catch all errors before deployment. You have to catch them after and respond.

## Do data scientists need to care about MLOps?

They don't need to become MLOps engineers - that's a different skill. But they should understand the basics. How models go from notebook to production. What happens when data distribution changes. How to instrument a model so it's debuggable.

The companies that are good at ML have data scientists and MLOps engineers who work together. The data scientist doesn't have to implement the monitoring system, but they should understand what needs to be monitored and why. [CI/CD for ML](https://johnb.io/course/cicd-for-ml) is the next step after understanding these foundations. They should think about edge cases that might not show up in training data. They should care that their model is reliable, not just accurate.

## How It Works

1. **Step.** MLOps combines three areas: infrastructure for running ML workloads, processes for managing the ML lifecycle, and monitoring for keeping models healthy in production.
2. **Step.** A mature MLOps setup has: a feature store (centralised, versioned features for training and serving), an experiment tracker (MLflow, Weights & Biases - logs params, metrics, and model artefacts), a model registry (stores model versions with their lineage), a serving infrastructure (APIs, containers, or managed services), and a monitoring system (tracks input distributions, output distributions, and performance metrics).
3. **Step.** When things work well: new data triggers a pipeline, models retrain automatically, evaluation gates compare new vs old, deployment is gradual (A/B or canary), and alerts fire before customers notice problems.

## Key Points

- The gap between notebook experiment and production system is where most ML projects fail
- Production requirements notebooks don't handle: continuous data, version control, rollback, monitoring, retraining
- MLOps is DevOps adapted for ML's three moving parts: code, data, and models
- ML fails in production because data distributions drift, not just because of code bugs
- The four MLOps stages: data management, training, deployment, monitoring - forming a cycle
- ML systems can't be fully tested before deployment - some errors only emerge with real data
- Monitoring is not optional - it's how you detect drift before it causes visible business damage
- Data scientists don't need to build the infrastructure but should understand what it does and why

## Frequently Asked Questions

### What is MLOps?

MLOps is the infrastructure and practices that turn a trained model into a system that works reliably in production. It borrows from DevOps but adds complexity because ML systems have three moving parts: code, data, and model weights. A regular application's source of truth is the code; an ML system's source of truth is the data and model.

### Why do ML models fail in production?

ML models fail in production primarily because the world changes. The model learned patterns from training data, but in production the data distribution shifts - users behave differently, products change, markets move. This is called drift and it's inevitable. Unlike regular software bugs that you fix once, drift is ongoing and requires continuous monitoring and retraining.

### What are the four stages of the ML lifecycle?

Data management (versioning, quality, distribution tracking), training (reproducible experiments, hyperparameter tracking, model versioning), deployment (serving with low latency and high availability, gradual rollouts), and monitoring (tracking performance on real data, detecting drift, alerting on degradation). These stages feed back into each other in a continuous cycle.

### Do data scientists need to learn MLOps?

They don't need to become MLOps engineers, but they should understand the basics. How models go from notebook to production. What happens when data distribution changes. How to instrument a model so it's debuggable. The companies that are good at ML have data scientists who care that their models work reliably, not just that they score well on a held-out test set.

## Sources & Primary References

1. Sculley, D. et al. (2015). Hidden Technical Debt in Machine Learning Systems. *NeurIPS*.
2. Shankar, S. et al. (2022). Operationalizing Machine Learning: An Interview Study. *arXiv*.
3. Google. (2022). MLOps: Continuous delivery and automation pipelines in machine learning. *cloud.google.com*.
4. Kleppmann, M. (2017). *Designing Data-Intensive Applications*. O'Reilly.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
