# ML, Deep Learning and Neural Networks

> How classical machine learning, multi-layer neural networks and deep learning fit together and when simpler models outperform deep networks.

- **Canonical URL**: https://johnb.io/course/ml-deep-learning-neural-networks
- **Markdown URL**: https://johnb.io/course/ml-deep-learning-neural-networks.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 2
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

These three terms get thrown around as if they mean the same thing. They don't. They're nested categories - like vehicles, cars, and sedans. Getting this straight changes how you read everything else about AI.

## The Hierarchy: ML, Neural Networks, Deep Learning

**Machine learning** is the broadest term. It means any system that learns patterns from data instead of following explicit rules written by a developer.

If someone writes code that says "if email contains 'free money' flag as spam," that's a rule - not machine learning. If you feed the system thousands of emails and it learns what spam looks like, that's machine learning. Machine learning includes decision trees, random forests, linear regression, support vector machines, and neural networks. See the [key ML algorithms](https://johnb.io/course/key-ml-algorithms) lesson for a tour of these.

**Neural networks** are a subset of machine learning. Loosely inspired by how brains work (and only loosely), they consist of interconnected layers of simple processing units that learn to recognise patterns. Every neural network is machine learning. Not all machine learning uses neural networks.

**Deep learning** is neural networks with many layers. The word "deep" refers to depth - how many layers the network has. An older neural network might have 2-3 layers. A deep learning network might have 50, 100, or over 1,000. ChatGPT, image generation, self-driving cars - all deep learning.

Visually, the relationship looks like this:

```
MACHINE LEARNING (everything that learns from data)
├── Decision Trees
├── Random Forests
├── Support Vector Machines
├── Linear/Logistic Regression
└── NEURAL NETWORKS (interconnected layers)
    ├── Shallow Neural Networks (2-3 layers)
    └── DEEP LEARNING (many layers, usually 10+)
        ├── Convolutional Neural Networks (images)
        ├── Recurrent Neural Networks (sequences)
        ├── Transformers (language models)
        └── Diffusion Models (image generation)
```

## Why the Confusion Exists

The terminology evolved historically, and some of the vagueness is deliberate.

In the 1980s, neural networks were a niche research area. When they came back in the 2010s - with more computing power and bigger datasets - people marketing these systems realised "neural networks" sounded better to investors than "machine learning." So they rebranded the same core idea as "deep learning" and made it sound revolutionary.

It's not wrong to say deep learning is a subset of neural networks, which is a subset of machine learning. But the terminology explosion - "artificial neural networks," "connectionist systems," "representation learning" - obscures the fact that it's the same fundamental idea with different marketing around it.

This matters in practice. When someone tells you they've built an "AI-powered" product, the useful question is: what's actually under the hood? A simple decision tree? A shallow neural network? A full deep learning system? All three get called "AI" or "machine learning." The labels don't help you understand what you're dealing with.

## Why Layers Matter

A shallow neural network (2-3 layers) can learn simple patterns. It can draw curved lines between categories. Decent, not impressive.

A deep neural network learns hierarchical patterns. Earlier layers learn basic features. Later layers combine those into more complex ones. Higher layers work with increasingly abstract concepts.

In image recognition, the first layer might detect edges. The next detects corners and curves. The one after that detects shapes. Higher layers detect textures and patterns. The final layer says "this is a dog."

More layers mean more complexity can be learned. They also mean more parameters to tune, which means more data and computing power needed.

The breakthrough that made deep learning practical was finding that with the right techniques - specifically [backpropagation](https://johnb.io/course/backpropagation) and a function called ReLU activation - you could train networks with 50+ layers. Before that, training deep networks was effectively impossible. The maths didn't work: errors would shrink to nothing as they passed back through many layers, so early layers never learned. ReLU fixed this.

## How This Maps to Modern AI

Everything impressive in AI right now is deep learning - specifically deep neural networks with specialised architectures.

**Transformers** power language models like ChatGPT and Claude. They're deep neural networks built for sequence data, using an attention mechanism that lets them weigh the relevance of different parts of an input when generating each output token. The ["Attention Is All You Need" paper](https://arxiv.org/abs/1706.03762) introduced this architecture in 2017.

[Convolutional neural networks (CNNs)](https://johnb.io/course/cnns-with-keras) power image recognition. They're deep networks with filters that scan across an image, picking up spatial patterns regardless of where they appear.

**Diffusion models** power image generation tools like DALL-E and Midjourney. They're deep networks trained to reverse a noise process - starting from random pixels and gradually refining them into a coherent image.

When someone says "AI" in 2026, they almost always mean deep learning. When they say "machine learning," they might mean the broader category - which includes traditional techniques like random forests that still work well for many business problems - or they might mean deep learning specifically. Industry doesn't use these terms consistently.

My view: the confusion serves people selling AI services. Blurring the line between "we built a well-tuned decision tree" and "we have cutting-edge deep learning" is commercially useful if most of your customers won't notice the difference. If you're evaluating an AI system, push for specifics. The [categories of AI](https://johnb.io/course/categories-of-ai) lesson gives you the vocabulary to do that. Not all problems need deep learning. Sometimes a simpler approach is faster, cheaper, and more reliable.

## How It Works

1. **A neural network is organised into layers.** The input layer receives raw data (pixels, word tokens, numbers). Hidden layers transform that data through learned weights and activation functions. The output layer produces a prediction or decision.
2. **During training, backpropagation adjusts the weights.** The network makes a prediction, compares it to the correct answer, and measures the error. That error signal is passed backwards through the layers, adjusting each connection's weight slightly to reduce the mistake. Repeat millions of times across a training dataset.
3. **Deep networks learn hierarchical representations.** Early layers learn raw features. Later layers combine them into higher-level concepts. This hierarchical learning is what makes deep learning effective at tasks like image recognition and language understanding.

## Key Points

- **Machine learning, neural networks, and deep learning are nested categories** - not separate things.
- **Machine learning** = any system that learns from data (includes decision trees, random forests, neural networks).
- **Neural networks** = a subset of machine learning using interconnected layers of processing units.
- **Deep learning** = neural networks with many layers (10+), enabling hierarchical pattern learning.
- **Backpropagation + ReLU activation** made training deep networks practical in the 2010s.
- **All current headline AI** (ChatGPT, image generation, self-driving) uses deep learning.
- **Transformers, CNNs, and diffusion models** are all deep learning architectures for different data types.
- **The terminology is genuinely confused in industry** - always ask what's actually under the hood.

## Frequently Asked Questions

### What is the difference between machine learning and deep learning?

Machine learning is the broad category - any system that learns patterns from data. Deep learning is a specific subset: neural networks with many layers (typically 10 or more). All deep learning is machine learning, but not all machine learning is deep learning.

### What makes deep learning "deep"?

The word "deep" refers to the number of layers in the network. A shallow neural network might have 2-3 layers. A deep learning network has many more - sometimes 50, 100, or over 1,000 layers. More layers allow the network to learn increasingly abstract, hierarchical patterns from data.

### Why did deep learning take off in the 2010s?

Two things made it practical: backpropagation (an efficient way to train deep networks by passing error signals backwards through layers) and ReLU activation functions (which solved a training instability problem called the vanishing gradient). Combined with more computing power and bigger datasets, these unlocked networks with 50+ layers.

### What is a neural network in simple terms?

A neural network is a machine learning system made up of interconnected layers of simple processing units. Each unit takes inputs, applies a mathematical operation, and passes a result forward. The network learns by adjusting the strength of those connections until its outputs match the expected answers on training data.

## Sources & Primary References

1. LeCun, Y., Bengio, Y. & Hinton, G. (2015). Deep learning. *Nature*, 521, 436-444.
2. Goodfellow, I., Bengio, Y. & Courville, A. (2016). *Deep Learning*. MIT Press.
3. Rumelhart, D.E., Hinton, G.E. & Williams, R.J. (1986). Learning representations by back-propagating errors. *Nature*, 323, 533-536.
4. He, K. et al. (2015). Deep Residual Learning for Image Recognition. *arXiv*:1512.03385.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
