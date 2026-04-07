/* ================================================
   course-data.js — Single source of truth for the AI Course
   Units, lessons and exam question bank (60 questions)
   ================================================ */

const COURSE_UNITS = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    desc: "Cover the fundamental concepts behind modern AI, from the Turing Test to narrow, general, and super-intelligent systems.",
    img: "what-is-ai.webp",
    lessons: [
      {
        id: "1-1",
        slug: "what-is-ai",
        title: "What is AI? — History, definitions & the Turing Test",
        duration: "8 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon. Below is a summary of what this lesson covers.</p>
          <h2>What is Artificial Intelligence?</h2>
          <p>Artificial Intelligence is the simulation of human intelligence by machines. This lesson covers the origins of AI, key definitions, and the famous Turing Test — Alan Turing's 1950 proposal for measuring machine intelligence.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The history of AI from the 1950s to today</li>
            <li>Definitions of intelligence and what makes something "AI"</li>
            <li>The Turing Test and its limitations</li>
            <li>John McCarthy and the Dartmouth Conference (1956)</li>
          </ul>
        `
      },
      {
        id: "1-2",
        slug: "categories-of-ai",
        title: "Categories of AI — Narrow, General & Super AI",
        duration: "6 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Three Categories of AI</h2>
          <p>AI is commonly divided into three categories based on capability: Narrow AI (what exists today), Artificial General Intelligence (theoretical), and Artificial Super Intelligence (hypothetical).</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Narrow AI — what it is and real-world examples</li>
            <li>AGI — what it would mean and why it doesn't exist yet</li>
            <li>ASI — the hypothetical future and debates around it</li>
            <li>Weak AI vs Strong AI</li>
          </ul>
        `
      },
      {
        id: "1-3",
        slug: "how-ai-learns",
        title: "How AI Learns — Supervised, Unsupervised & Reinforcement Learning",
        duration: "10 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Three Learning Paradigms</h2>
          <p>Machine learning systems learn in fundamentally different ways. This lesson explains supervised, unsupervised and reinforcement learning — the three core paradigms that power modern AI.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Supervised learning — labelled data and prediction</li>
            <li>Unsupervised learning — finding patterns without labels</li>
            <li>Reinforcement learning — rewards, penalties and agents</li>
            <li>When to use each approach</li>
          </ul>
        `
      },
      {
        id: "1-4",
        slug: "ai-vs-augmented-intelligence",
        title: "AI vs. Augmented Intelligence",
        duration: "5 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>AI as a Tool, Not a Replacement</h2>
          <p>Augmented intelligence reframes AI as a technology that enhances human decision-making rather than replaces it. This lesson examines the distinction and its practical implications.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The difference between AI and augmented intelligence</li>
            <li>Human-in-the-loop systems</li>
            <li>Where augmented intelligence is already being used</li>
            <li>Why the framing matters for adoption</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 2,
    title: "The Modern AI Landscape",
    desc: "Understand where AI stands today — generative models, LLMs, NLP, computer vision, and the 2026 AI market.",
    img: "traditional-vs-generative-ai.webp",
    lessons: [
      {
        id: "2-1",
        slug: "traditional-vs-generative-ai",
        title: "Traditional AI vs. Generative AI — Architecture differences",
        duration: "9 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Two Very Different Approaches</h2>
          <p>Traditional AI systems follow rules or learn to classify and predict. Generative AI creates new content. This lesson breaks down the architectural differences between the two.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Rule-based vs. statistical AI</li>
            <li>Discriminative vs. generative models</li>
            <li>What makes generative AI different</li>
            <li>Practical examples of each</li>
          </ul>
        `
      },
      {
        id: "2-2",
        slug: "ml-deep-learning-neural-networks",
        title: "Machine Learning, Deep Learning & Neural Networks — How they relate",
        duration: "10 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Nested Relationship</h2>
          <p>AI contains machine learning. Machine learning contains deep learning. Deep learning uses neural networks. This lesson maps out how these fields relate and where each one starts and ends.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The AI → ML → DL hierarchy</li>
            <li>What makes something "deep" learning</li>
            <li>Biological inspiration for neural networks</li>
            <li>Why deep learning became dominant after 2012</li>
          </ul>
        `
      },
      {
        id: "2-3",
        slug: "key-ai-subfields",
        title: "Key AI Subfields — NLP, Computer Vision & Edge AI",
        duration: "8 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Specialised Branches of AI</h2>
          <p>Modern AI has branched into specialised fields. This lesson covers Natural Language Processing, Computer Vision and Edge AI — three of the most commercially important.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>NLP — how machines understand and generate text</li>
            <li>Computer Vision — how machines interpret images and video</li>
            <li>Edge AI — running models on local devices</li>
            <li>Real-world applications of each</li>
          </ul>
        `
      },
      {
        id: "2-4",
        slug: "ai-tools-platforms-2026",
        title: "AI Tools & Platforms — LLMs, Agents, RAG & the 2026 market",
        duration: "10 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Current AI Tool Landscape</h2>
          <p>Large Language Models, AI agents and Retrieval-Augmented Generation have reshaped the AI market since 2022. This lesson maps the current landscape and key players.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>What LLMs are and how they work at a high level</li>
            <li>AI agents — autonomous systems that take actions</li>
            <li>RAG — grounding AI in real, up-to-date information</li>
            <li>Key platforms: OpenAI, Anthropic, Google, Meta and others</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 3,
    title: "Ethics, Governance & Responsible AI",
    desc: "Explore the risks, failures, and governance frameworks shaping responsible AI development.",
    img: "ai-failures-ethics.webp",
    lessons: [
      {
        id: "3-1",
        slug: "ai-failures-ethics",
        title: "Real-World AI Failures & Why Ethics Matter",
        duration: "9 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>When AI Gets It Wrong</h2>
          <p>From biased hiring tools to fatal autonomous vehicle incidents, AI failures have real consequences. This lesson examines documented cases and what they teach us.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Case studies of AI failures (Amazon hiring tool, COMPAS, healthcare bias)</li>
            <li>Why ethics must be built in, not bolted on</li>
            <li>Stakeholder harm and reputational risk</li>
            <li>The cost of ignoring responsible AI practices</li>
          </ul>
        `
      },
      {
        id: "3-2",
        slug: "ai-hallucinations-bias-ip",
        title: "Hallucinations, Bias & Intellectual Property",
        duration: "8 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Three Big Risk Areas</h2>
          <p>Hallucinations, bias and IP infringement are among the most commercially significant risks in deploying AI. This lesson covers each in practical terms.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>What causes AI hallucinations and how to reduce them</li>
            <li>Types of bias and how they enter AI systems</li>
            <li>Intellectual property risks in training data and outputs</li>
            <li>Practical mitigations for each</li>
          </ul>
        `
      },
      {
        id: "3-3",
        slug: "ai-governance-frameworks",
        title: "AI Governance Frameworks & Enterprise Guidelines",
        duration: "10 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Governing AI at Scale</h2>
          <p>Organisations are developing governance frameworks to manage AI risk. This lesson covers major regulatory approaches and how enterprises build AI guidelines.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The EU AI Act and risk classification</li>
            <li>GDPR and data protection in AI systems</li>
            <li>ISO/IEC standards for AI</li>
            <li>Building an enterprise AI policy</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 4,
    title: "Python for AI",
    desc: "Get up to speed with Python — the language, data structures, NumPy, and Pandas for AI work.",
    img: "python-essentials-for-ai.webp",
    lessons: [
      {
        id: "4-1",
        slug: "python-essentials-for-ai",
        title: "Python Essentials for AI — Variables, data structures & control flow",
        duration: "12 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Python as the Language of AI</h2>
          <p>Python is the dominant language for AI and data science. This lesson covers the core building blocks you need before working with AI libraries.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Variables and data types</li>
            <li>Lists, tuples, sets and dictionaries</li>
            <li>Control flow — if/else, for loops, while loops</li>
            <li>Functions and scope</li>
          </ul>
        `
      },
      {
        id: "4-2",
        slug: "numpy-pandas",
        title: "Data Analysis with NumPy & Pandas",
        duration: "12 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Foundation of Data Work in Python</h2>
          <p>NumPy and Pandas are the bedrock of data analysis in Python. This lesson covers arrays, DataFrames and the operations you'll use constantly in AI work.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>NumPy arrays and vectorised operations</li>
            <li>Pandas DataFrames and Series</li>
            <li>Loading, cleaning and slicing data</li>
            <li>Basic statistical analysis</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 5,
    title: "Machine Learning",
    desc: "Build your ML toolkit — regression, classification, model evaluation, and the key algorithms in use today.",
    img: "linear-regression-gradient-descent.webp",
    lessons: [
      {
        id: "5-1",
        slug: "linear-regression-gradient-descent",
        title: "Linear Regression & Gradient Descent",
        duration: "11 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Starting Point for ML</h2>
          <p>Linear regression is the simplest supervised learning model. Gradient descent is the optimisation engine that makes learning possible. Together they underpin almost all modern ML.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The equation of a line and loss functions</li>
            <li>How gradient descent minimises loss</li>
            <li>Learning rate and convergence</li>
            <li>Implementing linear regression in Python</li>
          </ul>
        `
      },
      {
        id: "5-2",
        slug: "logistic-regression-classification",
        title: "Logistic Regression & Classification",
        duration: "10 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Predicting Categories, Not Numbers</h2>
          <p>Logistic regression is the go-to starting point for binary classification problems. Despite the name, it's a classification algorithm, not a regression one.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>The sigmoid function and probability outputs</li>
            <li>Decision boundaries</li>
            <li>Binary vs. multi-class classification</li>
            <li>Practical implementation with Scikit-learn</li>
          </ul>
        `
      },
      {
        id: "5-3",
        slug: "model-evaluation",
        title: "Model Evaluation — Validation, Overfitting & Metrics",
        duration: "11 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>Knowing Whether Your Model Actually Works</h2>
          <p>A model that scores 99% on training data can be useless in production. This lesson covers how to properly evaluate ML models and avoid common pitfalls.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Train, validation and test splits</li>
            <li>Overfitting and underfitting</li>
            <li>Accuracy, precision, recall and F1</li>
            <li>Confusion matrices and ROC curves</li>
          </ul>
        `
      },
      {
        id: "5-4",
        slug: "key-ml-algorithms",
        title: "Key ML Algorithms — Decision Trees, SVMs & More",
        duration: "12 min",
        content: `
          <p class="lesson-placeholder-notice">Full lesson content coming soon.</p>
          <h2>The Toolkit Beyond Linear Models</h2>
          <p>Decision trees, random forests, SVMs and k-nearest neighbours are essential tools. This lesson covers when to use each and how they work.</p>
          <h2>Key topics in this lesson</h2>
          <ul>
            <li>Decision trees and random forests</li>
            <li>Support Vector Machines</li>
            <li>k-Nearest Neighbours</li>
            <li>Choosing the right algorithm for your problem</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 6,
    title: "Deep Learning & Neural Networks",
    desc: "Go deep — from biological neurons to CNNs, RNNs, and the transformer architecture powering modern LLMs.",
    img: "biological-vs-artificial-neurons.webp",
    lessons: [
      {
        id: "6-1",
        slug: "biological-vs-artificial-neurons",
        title: "Biological vs. Artificial Neurons",
        duration: "7 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Where the Inspiration Came From</h2><p>Artificial neural networks are loosely inspired by the structure of the human brain. This lesson examines the parallels and where they break down.</p><h2>Key topics</h2><ul><li>How biological neurons work</li><li>The perceptron model</li><li>Weights, biases and activation</li><li>The limits of the biological analogy</li></ul>`
      },
      {
        id: "6-2",
        slug: "neural-networks-forward-propagation",
        title: "Artificial Neural Networks & Forward Propagation",
        duration: "9 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>How a Neural Network Computes</h2><p>Forward propagation is the process by which input data travels through a network to produce an output. This lesson walks through the maths and the mechanics.</p><h2>Key topics</h2><ul><li>Input, hidden and output layers</li><li>Weights and biases</li><li>Matrix multiplication in neural networks</li><li>Activation functions introduction</li></ul>`
      },
      {
        id: "6-3",
        slug: "backpropagation",
        title: "Backpropagation & How Neural Networks Learn",
        duration: "11 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>The Algorithm That Made Deep Learning Work</h2><p>Backpropagation computes gradients and updates weights throughout the network using the chain rule of calculus. This lesson demystifies how it works.</p><h2>Key topics</h2><ul><li>Loss functions</li><li>The chain rule and gradient calculation</li><li>Weight updates</li><li>Why backpropagation is computationally expensive</li></ul>`
      },
      {
        id: "6-4",
        slug: "activation-functions-vanishing-gradient",
        title: "Activation Functions & the Vanishing Gradient Problem",
        duration: "9 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Non-Linearity and Its Problems</h2><p>Activation functions introduce non-linearity into neural networks, enabling them to learn complex patterns. But some choices cause training to collapse.</p><h2>Key topics</h2><ul><li>Sigmoid, Tanh and ReLU</li><li>The vanishing gradient problem</li><li>Why ReLU became the default</li><li>Leaky ReLU and other variants</li></ul>`
      },
      {
        id: "6-5",
        slug: "tensorflow-pytorch-keras",
        title: "Deep Learning Libraries — TensorFlow, PyTorch & Keras",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>The Tools of the Trade</h2><p>TensorFlow, PyTorch and Keras are the three dominant frameworks for building deep learning models. This lesson compares them and explains when to use each.</p><h2>Key topics</h2><ul><li>TensorFlow — Google's production-ready framework</li><li>PyTorch — Meta's research-first framework</li><li>Keras — high-level API built on TensorFlow</li><li>Which to learn first</li></ul>`
      },
      {
        id: "6-6",
        slug: "cnns-with-keras",
        title: "Convolutional Neural Networks (CNNs) with Keras",
        duration: "12 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>How AI Sees Images</h2><p>CNNs are the architecture behind image recognition, object detection and most computer vision systems. This lesson covers how they work and builds one with Keras.</p><h2>Key topics</h2><ul><li>Convolutions and feature maps</li><li>Pooling layers</li><li>Building a CNN in Keras</li><li>Transfer learning with pre-trained CNNs</li></ul>`
      },
      {
        id: "6-7",
        slug: "rnns-transformers-autoencoders",
        title: "RNNs, Transformers & Autoencoders",
        duration: "13 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Architectures That Changed AI</h2><p>Recurrent networks handle sequences. Transformers handle everything. Autoencoders compress and reconstruct. This lesson covers the three architectures that shaped modern AI.</p><h2>Key topics</h2><ul><li>RNNs and the problem of long-range dependencies</li><li>The Transformer and attention mechanisms</li><li>Autoencoders and latent space representations</li><li>Why Transformers replaced RNNs for most tasks</li></ul>`
      }
    ]
  },
  {
    id: 7,
    title: "Generative AI & Practical Applications",
    desc: "Master generative AI — GANs, diffusion models, prompt engineering, RAG, and fine-tuning in practice.",
    img: "generative-ai-models.webp",
    lessons: [
      {
        id: "7-1",
        slug: "generative-ai-models",
        title: "Generative AI Models — VAEs, GANs & Diffusion",
        duration: "11 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Three Approaches to Generation</h2><p>Variational Autoencoders, Generative Adversarial Networks and Diffusion Models each take a different approach to generating new data. This lesson compares them.</p><h2>Key topics</h2><ul><li>How VAEs learn to generate by encoding and decoding</li><li>The GAN adversarial game — generator vs. discriminator</li><li>Diffusion models — learning to reverse noise</li><li>Which approach powers which real products</li></ul>`
      },
      {
        id: "7-2",
        slug: "prompt-engineering-ai-agents",
        title: "Prompt Engineering & AI Agents",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Getting the Best from LLMs</h2><p>How you communicate with an AI model dramatically affects its output. This lesson covers prompt engineering techniques and the emerging world of AI agents.</p><h2>Key topics</h2><ul><li>Zero-shot, few-shot and chain-of-thought prompting</li><li>System prompts and role definition</li><li>What AI agents are and how they work</li><li>Practical prompt engineering for real tasks</li></ul>`
      },
      {
        id: "7-3",
        slug: "rag-finetuning-enterprise-ai",
        title: "RAG, Fine-Tuning & Enterprise AI Strategy",
        duration: "11 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Customising AI for Your Context</h2><p>RAG and fine-tuning are the two main approaches to making a general LLM useful for a specific business context. This lesson explains both and when to use each.</p><h2>Key topics</h2><ul><li>What RAG is and how it grounds AI in real data</li><li>Fine-tuning — when it's worth the cost</li><li>Build vs. buy in enterprise AI</li><li>Deploying AI responsibly in an organisation</li></ul>`
      }
    ]
  },
  {
    id: 8,
    title: "AI in Production",
    desc: "Take models to production — MLOps, deployment, monitoring, and CI/CD for machine learning pipelines.",
    img: "intro-to-mlops.webp",
    lessons: [
      {
        id: "8-1",
        slug: "intro-to-mlops",
        title: "Introduction to MLOps — From notebook to production",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>The Gap Between Research and Reality</h2><p>Most ML models never make it to production. MLOps exists to close that gap. This lesson introduces the principles and practices of machine learning operations.</p><h2>Key topics</h2><ul><li>Why notebooks aren't enough for production</li><li>The ML lifecycle</li><li>Versioning data, code and models</li><li>Key MLOps tools and platforms</li></ul>`
      },
      {
        id: "8-2",
        slug: "model-deployment",
        title: "Model Deployment — APIs, containers & cloud services",
        duration: "11 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Getting Your Model Into the World</h2><p>Deploying a model means making it accessible and reliable. This lesson covers REST APIs, containerisation with Docker and cloud deployment options.</p><h2>Key topics</h2><ul><li>Serving predictions via REST APIs</li><li>Docker and containerisation basics</li><li>Cloud platforms — AWS SageMaker, GCP Vertex, Azure ML</li><li>Serverless vs. always-on deployment</li></ul>`
      },
      {
        id: "8-3",
        slug: "monitoring-drift",
        title: "Monitoring & Drift — Keeping models healthy in the real world",
        duration: "9 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Models Degrade in Production</h2><p>Data distributions change, user behaviour shifts and the world moves on. This lesson covers how to detect and respond to model drift before it causes real problems.</p><h2>Key topics</h2><ul><li>Data drift vs. concept drift</li><li>Performance monitoring strategies</li><li>Alerting and retraining pipelines</li><li>Tools for production monitoring</li></ul>`
      },
      {
        id: "8-4",
        slug: "cicd-for-ml",
        title: "CI/CD for ML — Automating the machine learning pipeline",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Bringing Software Engineering Discipline to ML</h2><p>Continuous Integration and Continuous Deployment practices, adapted for the unique challenges of ML, reduce errors and speed up delivery.</p><h2>Key topics</h2><ul><li>CI/CD concepts applied to ML</li><li>Automated testing for ML pipelines</li><li>GitHub Actions for ML workflows</li><li>Feature stores and model registries</li></ul>`
      }
    ]
  },
  {
    id: 9,
    title: "AI Strategy & Business Applications",
    desc: "Apply AI at scale — adoption strategy, build vs. buy decisions, and cross-industry applications.",
    img: "ai-adoption-journey.webp",
    lessons: [
      {
        id: "9-1",
        slug: "ai-adoption-journey",
        title: "How Organisations Adopt AI — The adoption journey & ROI frameworks",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>AI Adoption in Practice</h2><p>Most organisations adopt AI gradually. This lesson maps the adoption journey from experimentation to scaled deployment and the frameworks used to measure ROI.</p><h2>Key topics</h2><ul><li>Maturity models for AI adoption</li><li>Common failure modes in AI projects</li><li>Calculating ROI for AI initiatives</li><li>Change management and culture</li></ul>`
      },
      {
        id: "9-2",
        slug: "build-vs-buy",
        title: "Build vs. Buy — Evaluating AI tools as a business",
        duration: "8 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>The Most Important AI Decision You'll Make</h2><p>Building custom AI is expensive and slow. Buying off-the-shelf is fast but limiting. This lesson provides a practical framework for making the right call.</p><h2>Key topics</h2><ul><li>When building makes sense</li><li>Evaluating vendor solutions</li><li>Total cost of ownership</li><li>Lock-in risks and exit strategies</li></ul>`
      },
      {
        id: "9-3",
        slug: "ai-across-industries",
        title: "AI Across Industries — Healthcare, marketing, finance & beyond",
        duration: "10 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>AI in the Real Economy</h2><p>AI is transforming industries at different speeds and in different ways. This lesson surveys practical deployments across healthcare, marketing, finance and other sectors.</p><h2>Key topics</h2><ul><li>AI in healthcare — diagnostics, drug discovery and patient care</li><li>AI in marketing — personalisation, targeting and content</li><li>AI in finance — fraud detection, risk and trading</li><li>Sector-specific regulatory considerations</li></ul>`
      },
      {
        id: "9-4",
        slug: "business-case-for-ai",
        title: "Making the Business Case for AI",
        duration: "9 min",
        content: `<p class="lesson-placeholder-notice">Full lesson content coming soon.</p><h2>Selling AI Internally</h2><p>Even good AI projects fail without organisational buy-in. This lesson covers how to identify the right use cases, build a compelling case and get stakeholder support.</p><h2>Key topics</h2><ul><li>Identifying high-value AI use cases</li><li>Structuring a business case document</li><li>Addressing executive concerns</li><li>Piloting before scaling</li></ul>`
      }
    ]
  }
];

/* =====================================================
   EXAM QUESTION BANK — 60 questions
   Exam draws 30 at random each attempt
   answer: index of correct option (0 = A, 1 = B, etc.)
   ===================================================== */

const EXAM_QUESTIONS = [
  // --- Unit 1: Introduction to AI ---
  {
    id: 1,
    unit: 1,
    question: "Who is credited with coining the term 'Artificial Intelligence' at the Dartmouth Conference in 1956?",
    options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Geoffrey Hinton"],
    answer: 1
  },
  {
    id: 2,
    unit: 1,
    question: "In what year did Alan Turing publish 'Computing Machinery and Intelligence', proposing what became known as the Turing Test?",
    options: ["1950", "1956", "1945", "1969"],
    answer: 0
  },
  {
    id: 3,
    unit: 1,
    question: "Which type of AI is designed to perform only a single specific task?",
    options: ["Artificial General Intelligence", "Artificial Super Intelligence", "Narrow AI", "Cognitive AI"],
    answer: 2
  },
  {
    id: 4,
    unit: 1,
    question: "What does the Turing Test primarily assess in a machine?",
    options: ["Processing speed", "Ability to exhibit intelligent behaviour indistinguishable from a human", "Memory capacity", "Ability to learn new tasks autonomously"],
    answer: 1
  },
  {
    id: 5,
    unit: 1,
    question: "Which type of AI remains theoretical and does not currently exist?",
    options: ["Rule-based AI", "Narrow AI", "Weak AI", "Artificial General Intelligence"],
    answer: 3
  },
  {
    id: 6,
    unit: 1,
    question: "In reinforcement learning, how does an agent learn?",
    options: ["By analysing labelled datasets", "By receiving rewards and penalties through trial and error", "By clustering similar data points", "By copying human demonstrations directly"],
    answer: 1
  },
  {
    id: 7,
    unit: 1,
    question: "Supervised learning requires which type of data to train?",
    options: ["Unlabelled data only", "No data", "Labelled training data", "A reward signal from an environment"],
    answer: 2
  },
  {
    id: 8,
    unit: 1,
    question: "The concept of 'augmented intelligence' suggests AI should primarily:",
    options: ["Replace human decision-making entirely", "Operate fully independently of humans", "Enhance and support human capabilities", "Simulate full human consciousness"],
    answer: 2
  },
  // --- Unit 2: Modern AI Landscape ---
  {
    id: 9,
    unit: 2,
    question: "What is the key difference between traditional AI and generative AI?",
    options: ["Traditional AI is always faster", "Generative AI can create new content rather than only classify or predict", "Traditional AI uses more training data", "Generative AI requires less computing power"],
    answer: 1
  },
  {
    id: 10,
    unit: 2,
    question: "Which of the following correctly describes the relationship between AI, Machine Learning and Deep Learning?",
    options: ["They are three unrelated fields", "ML and DL are separate from AI", "Deep Learning is a subset of ML, which is a subset of AI", "AI is a subset of Deep Learning"],
    answer: 2
  },
  {
    id: 11,
    unit: 2,
    question: "What does NLP stand for in the context of AI?",
    options: ["Neural Learning Protocols", "Natural Language Processing", "Network Layer Processing", "Normalised Learning Patterns"],
    answer: 1
  },
  {
    id: 12,
    unit: 2,
    question: "What does RAG stand for in modern AI applications?",
    options: ["Recursive Aggregation Graph", "Retrieval-Augmented Generation", "Randomised Attention Grouping", "Rapid Algorithm Generation"],
    answer: 1
  },
  {
    id: 13,
    unit: 2,
    question: "What is a Large Language Model (LLM)?",
    options: ["A database of large text files", "A deep learning model trained on large text datasets to generate and understand language", "A rule-based grammar checking system", "A computer vision model for image captioning"],
    answer: 1
  },
  {
    id: 14,
    unit: 2,
    question: "What is Edge AI?",
    options: ["AI that runs exclusively on cloud servers", "AI that analyses social media trends", "AI that runs on local devices rather than in the cloud", "AI used only at network perimeters for security"],
    answer: 2
  },
  {
    id: 15,
    unit: 2,
    question: "What is an AI agent?",
    options: ["A human who trains AI models", "An AI system that can perceive its environment and take actions to achieve goals", "A software tool for writing AI prompts", "A type of convolutional neural network"],
    answer: 1
  },
  {
    id: 16,
    unit: 2,
    question: "Computer vision primarily enables AI to do what?",
    options: ["Understand and generate speech", "Process and interpret visual information", "Translate between human languages", "Perform high-speed numerical calculations"],
    answer: 1
  },
  // --- Unit 3: Ethics & Responsible AI ---
  {
    id: 17,
    unit: 3,
    question: "What is AI hallucination?",
    options: ["A visual rendering bug in AI-generated images", "When an AI generates confident but factually incorrect information", "A type of adversarial attack on AI models", "An AI system that mimics human dreaming patterns"],
    answer: 1
  },
  {
    id: 18,
    unit: 3,
    question: "Algorithmic bias in AI most commonly originates from:",
    options: ["Hardware faults in training servers", "Biased or unrepresentative training data", "Network connectivity issues during training", "Incorrect Python syntax in the model code"],
    answer: 1
  },
  {
    id: 19,
    unit: 3,
    question: "What does GDPR primarily protect?",
    options: ["Intellectual property of AI companies", "The personal data and privacy of EU citizens", "Software copyright in commercial applications", "Trade secrets of technology firms"],
    answer: 1
  },
  {
    id: 20,
    unit: 3,
    question: "Which of the following best describes an AI governance framework?",
    options: ["A technical specification for building neural networks", "A set of policies and processes to guide responsible AI development and use", "A hardware standard for AI processors", "A programming language designed for AI systems"],
    answer: 1
  },
  {
    id: 21,
    unit: 3,
    question: "Intellectual property concerns in AI most commonly arise when:",
    options: ["AI models run too slowly in production", "Models are trained on copyrighted material without authorisation", "AI writes code that contains bugs", "Models are deployed on public cloud infrastructure"],
    answer: 1
  },
  {
    id: 22,
    unit: 3,
    question: "The EU AI Act classifies AI systems into risk categories. What is the highest risk category called?",
    options: ["Critical risk", "High risk", "Extreme risk", "Unacceptable risk"],
    answer: 3
  },
  // --- Unit 4: Python for AI ---
  {
    id: 23,
    unit: 4,
    question: "Which Python library is primarily used for numerical computing and array operations?",
    options: ["Pandas", "Matplotlib", "NumPy", "Scikit-learn"],
    answer: 2
  },
  {
    id: 24,
    unit: 4,
    question: "Which Python data structure maps keys to values?",
    options: ["List", "Tuple", "Set", "Dictionary"],
    answer: 3
  },
  {
    id: 25,
    unit: 4,
    question: "What does the Pandas library primarily handle in Python?",
    options: ["Image processing and computer vision", "Data manipulation and analysis using DataFrames", "Neural network training and deployment", "Audio signal processing"],
    answer: 1
  },
  {
    id: 26,
    unit: 4,
    question: "Which Python construct is used to repeat a block of code for each item in a sequence?",
    options: ["if/else statement", "try/except block", "for loop", "def keyword"],
    answer: 2
  },
  // --- Unit 5: Machine Learning ---
  {
    id: 27,
    unit: 5,
    question: "What is overfitting in machine learning?",
    options: ["When a model trains too slowly on the hardware", "When a model performs well on training data but poorly on unseen data", "When a model uses excessive memory during inference", "When the training dataset is too large to process"],
    answer: 1
  },
  {
    id: 28,
    unit: 5,
    question: "What is the purpose of gradient descent in machine learning?",
    options: ["To visualise high-dimensional data", "To split data into training and test sets", "To minimise a model's loss function during training", "To normalise input features before training"],
    answer: 2
  },
  {
    id: 29,
    unit: 5,
    question: "What does a confusion matrix measure?",
    options: ["How ambiguous the training data is", "The performance of a classification model showing true/false positives and negatives", "The complexity of a neural network architecture", "The speed of model training on a GPU"],
    answer: 1
  },
  {
    id: 30,
    unit: 5,
    question: "What is regularisation used for in machine learning?",
    options: ["To speed up model training", "To increase model complexity", "To prevent overfitting", "To clean and normalise training data"],
    answer: 2
  },
  {
    id: 31,
    unit: 5,
    question: "In a binary classification problem, logistic regression outputs:",
    options: ["A continuous numerical value", "A probability between 0 and 1", "A cluster assignment label", "A ranked list of predictions"],
    answer: 1
  },
  {
    id: 32,
    unit: 5,
    question: "What is the main purpose of a validation set during model training?",
    options: ["To train the model's weights", "To provide the final benchmark for model performance", "To tune hyperparameters and monitor training without using the test set", "To augment the training data"],
    answer: 2
  },
  // --- Unit 6: Deep Learning ---
  {
    id: 33,
    unit: 6,
    question: "What is backpropagation in neural network training?",
    options: ["Running a network in reverse to generate new data", "The algorithm that calculates gradients and updates weights by propagating errors backward", "A method for loading data into a neural network efficiently", "A technique for visualising what each layer has learned"],
    answer: 1
  },
  {
    id: 34,
    unit: 6,
    question: "What is the vanishing gradient problem?",
    options: ["When gradients disappear from the training logs", "When gradients become extremely small, making it difficult to train early layers of deep networks", "When a neural network loses previously learned information", "When training loss suddenly becomes negative"],
    answer: 1
  },
  {
    id: 35,
    unit: 6,
    question: "Which activation function is most commonly used in hidden layers of modern neural networks?",
    options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
    answer: 2
  },
  {
    id: 36,
    unit: 6,
    question: "What are Convolutional Neural Networks (CNNs) primarily designed for?",
    options: ["Text generation tasks", "Time series prediction", "Image recognition and computer vision", "Tabular data analysis"],
    answer: 2
  },
  {
    id: 37,
    unit: 6,
    question: "What is the key innovation of the Transformer architecture introduced in 2017?",
    options: ["Using far more layers than previous networks", "The attention mechanism, allowing the model to focus on relevant parts of input", "Removing the need for any training data", "Using convolutional layers to process text sequences"],
    answer: 1
  },
  {
    id: 38,
    unit: 6,
    question: "What is an autoencoder designed to do?",
    options: ["Automatically write and debug code", "Generate images from text descriptions", "Learn a compressed representation of input data and reconstruct it", "Classify images into predefined categories"],
    answer: 2
  },
  {
    id: 39,
    unit: 6,
    question: "Which deep learning library was developed by Meta (Facebook)?",
    options: ["TensorFlow", "Keras", "PyTorch", "Scikit-learn"],
    answer: 2
  },
  {
    id: 40,
    unit: 6,
    question: "Recurrent Neural Networks (RNNs) are particularly well-suited for which type of data?",
    options: ["Static image classification", "Sequential data such as text and time series", "Tabular data regression problems", "Generating 3D models from 2D images"],
    answer: 1
  },
  {
    id: 41,
    unit: 6,
    question: "What does the softmax activation function do in the output layer of a classification network?",
    options: ["Introduces non-linearity into the layer", "Converts raw outputs into probabilities that sum to 1", "Prevents overfitting in the output layer", "Reduces the dimensionality of the output"],
    answer: 1
  },
  {
    id: 42,
    unit: 6,
    question: "In deep learning, what is one complete pass through the entire training dataset called?",
    options: ["A batch", "An iteration", "An epoch", "A step"],
    answer: 2
  },
  // --- Unit 7: Generative AI ---
  {
    id: 43,
    unit: 7,
    question: "What does GAN stand for?",
    options: ["Generalised Attention Network", "Generative Adversarial Network", "Gradient Averaging Node", "Global Autoencoder Network"],
    answer: 1
  },
  {
    id: 44,
    unit: 7,
    question: "In a GAN architecture, what is the role of the discriminator?",
    options: ["To generate realistic synthetic data", "To distinguish between real and generated data", "To compress data into a latent space", "To translate text prompts into images"],
    answer: 1
  },
  {
    id: 45,
    unit: 7,
    question: "What is prompt engineering?",
    options: ["Writing Python code for AI training pipelines", "Designing the architecture of neural networks", "Crafting effective inputs to guide AI model outputs", "Training large language models from scratch"],
    answer: 2
  },
  {
    id: 46,
    unit: 7,
    question: "What is fine-tuning in the context of large language models?",
    options: ["Adjusting the learning rate partway through initial training", "Updating a pre-trained model on a smaller, task-specific dataset", "Removing layers from a neural network to reduce size", "Testing a deployed model on production data"],
    answer: 1
  },
  {
    id: 47,
    unit: 7,
    question: "What is a diffusion model in generative AI?",
    options: ["A model that spreads information across a distributed network", "A generative model that learns to reverse a noise-adding process to create data", "A model for predicting the spread of diseases", "A type of recurrent neural network for sequence generation"],
    answer: 1
  },
  {
    id: 48,
    unit: 7,
    question: "What does VAE stand for?",
    options: ["Variable Activation Engine", "Vectorised Attention Encoder", "Variational Autoencoder", "Visual Attention Estimator"],
    answer: 2
  },
  // --- Unit 8: AI in Production ---
  {
    id: 49,
    unit: 8,
    question: "What does MLOps stand for?",
    options: ["Multiple Layers of Operations", "Machine Learning Operations — practices for deploying and maintaining ML models", "Model Lifecycle and Optimisation Processes", "Managed Learning Operations"],
    answer: 1
  },
  {
    id: 50,
    unit: 8,
    question: "What is model drift?",
    options: ["A model migrating between cloud servers automatically", "When a model's performance degrades over time because real-world data has changed", "A bug caused by floating point precision errors", "When a model is retrained too frequently on the same data"],
    answer: 1
  },
  {
    id: 51,
    unit: 8,
    question: "What is the primary purpose of containerisation (e.g. Docker) in ML deployment?",
    options: ["To speed up model inference on CPUs", "To package a model and its dependencies for consistent deployment across environments", "To encrypt model weights for security", "To visualise training metrics during development"],
    answer: 1
  },
  {
    id: 52,
    unit: 8,
    question: "What does CI/CD stand for in software and ML engineering?",
    options: ["Customer Integration / Customer Deployment", "Continuous Integration / Continuous Deployment", "Core Intelligence / Core Data", "Centralised Input / Centralised Data"],
    answer: 1
  },
  {
    id: 53,
    unit: 8,
    question: "What is a REST API commonly used for in ML production systems?",
    options: ["Speeding up model training on distributed systems", "Serving model predictions over HTTP requests to applications", "Storing and versioning training datasets", "Visualising model performance over time"],
    answer: 1
  },
  {
    id: 54,
    unit: 8,
    question: "Why is ongoing monitoring important after a model is deployed to production?",
    options: ["To keep the model warm on the server", "To detect performance degradation, data drift and failures before they cause problems", "To retrain the model automatically every hour", "To reduce cloud infrastructure costs"],
    answer: 1
  },
  // --- Unit 9: AI Strategy ---
  {
    id: 55,
    unit: 9,
    question: "What does ROI stand for in the context of AI business decisions?",
    options: ["Rate of Improvement", "Return on Investment", "Risk of Implementation", "Reliability of Infrastructure"],
    answer: 1
  },
  {
    id: 56,
    unit: 9,
    question: "The 'build vs. buy' decision in enterprise AI refers to:",
    options: ["Whether to use Python or R for modelling", "Whether to develop AI capabilities in-house or purchase existing tools and platforms", "Whether to buy more GPUs or build your own hardware", "Whether to hire AI specialists or train existing staff"],
    answer: 1
  },
  {
    id: 57,
    unit: 9,
    question: "Which of the following is a key challenge when adopting AI in healthcare?",
    options: ["There is too much available public data", "Data privacy, patient consent and regulatory compliance", "Lack of computing power in the sector", "No suitable AI tools exist for healthcare applications"],
    answer: 1
  },
  {
    id: 58,
    unit: 9,
    question: "What is the primary purpose of an AI use case framework within a business?",
    options: ["To write AI code more efficiently", "To identify, prioritise and evaluate where AI can deliver business value", "To fully replace human workers with automation", "To train machine learning models on business data"],
    answer: 1
  },
  {
    id: 59,
    unit: 9,
    question: "When making a business case for AI, which factor is most important to establish first?",
    options: ["The AI vendor or platform to use", "A clear problem definition and expected ROI", "The programming language the team will use", "The number of staff who will need retraining"],
    answer: 1
  },
  {
    id: 60,
    unit: 9,
    question: "AI adoption maturity models typically measure which of the following?",
    options: ["How fast a company's computers process data", "How well a company has integrated AI into its strategy, operations and culture", "The number of AI patents a company holds", "The physical size of a company's data centre"],
    answer: 1
  }
];

/* Helper — flat list of all lessons in order */
function getAllLessons() {
  return COURSE_UNITS.flatMap(u =>
    u.lessons.map(l => ({ ...l, unitId: u.id, unitTitle: u.title }))
  );
}

/* Helper — total lesson count */
function getTotalLessons() {
  return COURSE_UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
}
