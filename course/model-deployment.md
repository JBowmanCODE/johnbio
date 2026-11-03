# Model Deployment

> Serving machine learning models via REST APIs, batch inference vs real-time endpoints, containerisation and latency trade-offs.

- **Canonical URL**: https://johnb.io/course/model-deployment
- **Markdown URL**: https://johnb.io/course/model-deployment.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 8 · AI in Production
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 11 min read

You've got a trained model sitting on your laptop. Now what? You can't tell millions of users "download this Python file and run it locally." You need to serve the model so that applications can request predictions.

You've got a trained model sitting on your laptop. Now what? You can't tell millions of users "download this Python file and run it locally." You need to serve the model so that applications can request predictions.

That's deployment: taking a model and making it available to the applications that need it. Before deployment, you should have validated it properly using the [model evaluation](https://johnb.io/course/model-evaluation) techniques from earlier in the course.

## What deployment means in the ML context

Deployment is making your model accessible. Someone sends data to your system, your system runs the model on that data, and returns a prediction.

In practice: your model is running on a server somewhere. That server is listening for requests. When a request arrives, the server loads the model (or keeps it in memory), runs inference, and returns the result. The server is available 24/7, handles failures gracefully, and doesn't lose data.

A deployed model is not a one-time prediction job. It's infrastructure that keeps running.

## Serving a model via an API

The standard way to serve a model is through an API - an Application Programming Interface. Another piece of software sends a request to your API, and your API returns a prediction.

The basic flow: 1) Client sends an HTTP request with features - "Here are the customer features, predict if they'll churn." 2) Your server receives the request. 3) Your server loads the model (or uses one already in memory). 4) Your server runs inference on the features. 5) Your server returns the prediction in the response.

Simple in concept. You write a small web service - usually in Flask or [FastAPI](https://fastapi.tiangolo.com/) - that loads your model and accepts requests. When it gets a request, it preprocesses the features, runs the model, postprocesses the output, and returns it.

Why this works: any application that can make HTTP requests can use your model. You don't have to ship the model to different applications. You maintain one serving infrastructure.

The trade-off: your model is now a network service, so there's latency. Every request goes over the network. If you need sub-millisecond response times, an API might be too slow. For most use cases, the latency is fine.

## What Docker containers are and why they matter

A container is a packaged application environment. You take your code, your dependencies, your model, and package them into a container image. That image can run anywhere - on your laptop, on a server, in the cloud. [Docker's documentation](https://docs.docker.com/) is the standard reference for getting started.

Why this matters for ML: reproducibility and portability.

You develop and test your serving code in a container locally. Then you deploy the exact same container to production. No "but it works on my machine" problems. No dependency version mismatches. No confusion about what Python version or system libraries are needed.

Docker is the container technology that became standard. You write a Dockerfile that describes your environment, Docker builds an image, and that image runs on any system with Docker installed. A minimal Dockerfile for model serving looks like:

```
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY model.pkl .
COPY app.py .
CMD ["python", "app.py"]
```

You put your model, your serving code, and your dependencies in the container. Then you run it anywhere.

The benefits compound. You can run multiple containers on the same server. You can update a container image and deploy the new one without downtime. You can scale - run ten copies of the same container to handle more traffic. Containers made deploying ML models dramatically easier. Before them, setting up servers and managing conflicting dependency versions was a serious operational burden.

## Cloud deployment options

Cloud providers offer services specifically for deploying models.

AWS SageMaker lets you upload a model and it handles serving, scaling, and monitoring. GCP has Vertex AI, Azure has Machine Learning - all similar ideas. You provide the model, they provide the serving infrastructure.

These services handle a lot: scaling, load balancing, monitoring, logging. If you have spiky traffic, they scale up. If traffic drops, they scale down. You pay for what you use.

The trade-off: less control. You're constrained by what the service supports. If your model needs custom preprocessing or special hardware, you might not be able to do it.

You can also deploy containers directly to cloud infrastructure - Kubernetes on AWS, Cloud Run on GCP, Container Instances on Azure. You manage the infrastructure but you get more control.

For beginners: start with a managed service. Upload your model, get a serving endpoint, call it. When you hit limitations, move to containers and infrastructure management. The broader picture of managing models in production is [MLOps](https://johnb.io/course/intro-to-mlops).

## Where beginners go wrong with deployment

**They don't think about latency.** A model that takes 5 seconds to run works fine in batch processing. It doesn't work as an API serving real-time predictions. Measure inference time early.

**They don't plan for failure.** What happens when the model service crashes? What happens during a cloud outage? You need redundancy and monitoring. A model that occasionally returns errors is worse than no model at all for some applications.

**They put the model weights in Git.** Models are large binary files. Git is for code. You need a separate system - a model registry - for versioning, storing, and loading models. Don't put a 500MB model file in your repository.

**They forget about monitoring.** A deployed model that's not monitored is a black box. Is it still working? Is the data different from training? How are predictions performing? You need to log predictions and monitor performance. The [monitoring and drift](https://johnb.io/course/monitoring-drift) lesson covers this properly.

**They don't think about updates.** What happens when you want to deploy a new model? Can you do it without downtime? Can you roll back if the new model is worse? Rolling out to 10% of traffic first, measuring performance, then expanding is standard practice. [CI/CD for ML](https://johnb.io/course/cicd-for-ml) automates this rollout process.

Deployment is running a service. Services need monitoring, updates, and maintenance.

## How It Works

1. **REST API serving:.** A web framework (Flask, FastAPI) loads the model on startup and keeps it in memory. Incoming POST requests carry the input features as JSON. The handler deserialises the request, runs preprocessing, calls model.predict(), postprocesses the output, and returns JSON. FastAPI is preferred for new projects because of automatic OpenAPI documentation and async support.
2. **Containers:.** Docker builds an image from a Dockerfile. The image contains OS, Python runtime, installed packages, model file, and serving code. Running the image creates a container - an isolated process with its own filesystem. Kubernetes orchestrates multiple containers across servers, handling load balancing, scaling, and restarts.
3. **Gradual rollouts:.** Don't deploy a new model to 100% of traffic immediately. Roll out to 10%, monitor performance vs the old model, expand if metrics improve, roll back if they don't. This pattern (A/B testing or canary deployment) limits the blast radius of a bad model update.

## Key Points

- Deployment means making a model accessible via a network interface, not just running it locally
- REST APIs are the standard serving mechanism: HTTP request in, prediction response out
- Flask and FastAPI are the most common Python frameworks for model serving
- Docker containers package code, model, and dependencies for reproducible deployment anywhere
- Managed cloud services (SageMaker, Vertex AI, Azure ML) handle infrastructure but limit flexibility
- Kubernetes gives more control for container orchestration at scale
- Model weights belong in a model registry, not in Git
- Gradual rollouts (canary, A/B) reduce risk when deploying new model versions
- Deployment is an ongoing operational responsibility, not a one-time step

## Frequently Asked Questions

### What does it mean to deploy an ML model?

Deploying a model means making it accessible to applications that need predictions. Your model runs on a server, listens for HTTP requests containing input data, runs inference, and returns a prediction. A deployed model is not a one-time job - it's infrastructure that keeps running and needs monitoring, updates, and maintenance.

### What is a Docker container and why is it used for ML deployment?

A Docker container packages your code, model, and dependencies into a single image that runs identically anywhere. For ML this solves reproducibility: you develop and test in a container locally, then deploy the exact same container to production with no dependency version mismatches or "works on my machine" problems.

### Which cloud services can host ML models?

AWS SageMaker, GCP Vertex AI, and Azure Machine Learning all provide managed model serving. You upload your model and they handle serving, scaling, and monitoring. For more control you can deploy containers directly to Kubernetes or serverless container platforms. Beginners should start with managed services and move to custom infrastructure only when they hit specific limitations.

### What is the most common mistake when deploying ML models?

Treating deployment as a one-time step. A deployed model is a running service that needs monitoring, updates, and a strategy for rolling out new versions without downtime. Other common mistakes: not planning for failure, storing model weights in Git instead of a model registry, and not logging predictions.

## Sources & Primary References

1. FastAPI Documentation. (2024). *fastapi.tiangolo.com*.
2. Docker Documentation. (2024). *docs.docker.com*.
3. AWS. (2024). Amazon SageMaker Model Deployment. *docs.aws.amazon.com*.
4. Sato, D. et al. (2019). Continuous Delivery for Machine Learning. *martinfowler.com*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
