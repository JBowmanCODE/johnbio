# TensorFlow, PyTorch and Keras

> Practical comparison of PyTorch, TensorFlow and Keras for research prototyping and production deep learning.

- **Canonical URL**: https://johnb.io/course/tensorflow-pytorch-keras
- **Markdown URL**: https://johnb.io/course/tensorflow-pytorch-keras.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 7 min read

These three libraries don't compete equally. Keras isn't even a separate choice anymore - it's part of TensorFlow. And PyTorch is winning with researchers. But which one should you actually learn first? That's where it gets interesting.

Most deep learning courses list TensorFlow, PyTorch and Keras as if they're three separate options you need to pick between. That's not quite right. Understanding what each one actually is makes the choice much clearer. This lesson assumes you've covered [NumPy and Pandas](https://johnb.io/course/numpy-pandas) already, since those underpin every ML project.

## What Each Library Is and Who Made It

**TensorFlow** was built by Google and released in 2015. It's a framework for building and training neural networks. It handles the maths operations - matrix multiplication, [backpropagation](https://johnb.io/course/activation-functions-vanishing-gradient) and so on - efficiently, runs on CPUs or GPUs, and lets you define networks in Python.

**PyTorch** was built by Meta (formerly Facebook) and released in 2016. It does the same job as TensorFlow but with a different philosophy. It's more Pythonic, more dynamic, and generally feels less clunky if you know Python.

**Keras** was originally a separate library by François Chollet, built on top of TensorFlow. In 2019, Google integrated it into TensorFlow as the official high-level API. Now Keras is just "how you use TensorFlow nicely" rather than a separate library.

So really, you're choosing between TensorFlow (with Keras as the interface) and PyTorch.

## How Keras Relates to TensorFlow

Keras is the simple, friendly way to use TensorFlow. You write code like `model.add(Dense(128))` and `model.compile(optimizer='adam', loss='categorical_crossentropy')` and it handles the complexity underneath.

TensorFlow is the full framework. If you need more control, you can drop down and write custom operations, manage computational graphs directly, and do things Keras doesn't expose. Most beginners will never need that lower level. The [TensorFlow API documentation](https://www.tensorflow.org/api_docs) is the reference for when you do.

So when you hear "learn TensorFlow," it mostly means "learn the Keras API that ships with TensorFlow."

## The Practical Differences for a Beginner

PyTorch feels more like writing Python. Operations happen immediately - eager execution by default. If you write `x = some_tensor * 2`, you get a result right then. This is good for debugging because you can print intermediate values and see what's happening at each step.

TensorFlow with Keras is simpler for standard tasks. You define a model, compile it, and fit it to data. There's more abstraction, which means less control but also less boilerplate. For image classification or basic text tasks, Keras is faster to get working.

PyTorch requires more explicit thinking. You often write training loops by hand - more verbose, but it gives you more control and teaches you what's actually happening.

For a beginner trying to classify handwritten digits or build a basic image classifier, [Keras](https://keras.io/api/) is fine. You'll learn the core concepts faster because there's less scaffolding to write. If you want to understand what's happening at every step, PyTorch's explicit loops will teach you more.

## How the Landscape Has Shifted

Five years ago, TensorFlow dominated. Every serious ML job used it. Every course taught it.

Now [PyTorch](https://pytorch.org/docs/stable/index.html) dominates in research and increasingly in production at major companies. Researchers prefer PyTorch because it's easier to prototype with. Production teams increasingly follow because, if all your researchers are building in PyTorch, it makes sense to keep that consistent.

TensorFlow is still widely used - it hasn't disappeared - but it's lost the assumed dominance. Last I checked, new research papers were more likely to use PyTorch than TensorFlow. This shift happened because PyTorch is genuinely nicer to use. It's not that TensorFlow is bad; PyTorch is just more intuitive for people who think like programmers rather than dataflow engineers.

## Which One to Learn First and Why

Learn PyTorch.

PyTorch teaches you the actual mechanics better because you have to write more explicitly. You'll understand [backpropagation](https://johnb.io/course/activation-functions-vanishing-gradient) better if you write your own training loop instead of calling `model.fit()`. You'll understand gradients better if you compute them yourself.

The job market increasingly asks for PyTorch. If you learn PyTorch first, picking up TensorFlow later is just "oh, this does the same thing with more abstraction." The reverse is harder - if you've only used Keras, PyTorch's approach feels more unfamiliar. After this lesson, [CNNs with Keras](https://johnb.io/course/cnns-with-keras) puts these frameworks to work on a real image classification problem.

PyTorch's eager execution is also better for debugging while learning. You'll get less confused by mysterious behaviour you can't inspect.

The downside: PyTorch is slightly more verbose. You'll write more code to accomplish the same thing. But that's actually good for learning - it forces you to think about what each step is doing.

If you're in a job that requires TensorFlow, or want to learn Keras's high-level API first and worry about backpropagation later, that's a valid choice. But starting from scratch and wanting to actually understand what's happening? PyTorch first, TensorFlow second. Then take what you learn into [model deployment](https://johnb.io/course/model-deployment) - getting these trained models into production.

## How It Works

1. **Step.** Both TensorFlow and PyTorch work by defining tensors (multi-dimensional arrays) and operations on them. When you build a neural network, you're defining a sequence of mathematical operations that transform inputs into outputs. Both libraries track these operations so they can compute gradients automatically - this is called automatic differentiation or autograd.
2. **Step.** TensorFlow originally used a static computation graph: you defined the graph first, then ran data through it. PyTorch uses dynamic graphs (eager execution) by default - the graph is built as operations execute. This makes PyTorch easier to debug and experiment with.
3. **Step.** Keras adds a layer of abstraction. Instead of defining individual operations, you stack pre-built layers. A Dense layer, a Conv2D layer, a pooling layer - each is a reusable component. Keras handles the wiring between them and provides sensible defaults so you can get a working model quickly without writing every detail yourself.

## Key Points

- Keras is not a standalone library - since 2019 it is TensorFlow's official high-level API
- The real choice is between TensorFlow (with Keras) and PyTorch - both are mature, production-ready frameworks
- PyTorch now dominates research; new papers are more likely to use PyTorch than TensorFlow
- PyTorch uses eager execution by default, making it easier to debug intermediate values
- Keras is faster to get working for standard tasks - define, compile, fit - but hides what's happening underneath
- Learning PyTorch first gives you a stronger foundation; picking up TensorFlow afterwards is easier than the reverse

## Frequently Asked Questions

### What is the difference between TensorFlow, PyTorch and Keras?

TensorFlow is a deep learning framework built by Google, released in 2015. PyTorch is a competing framework built by Meta, released in 2016. Keras is not a separate library - it is the official high-level API for TensorFlow, integrated in 2019. So the real choice is between TensorFlow (using Keras as the interface) and PyTorch.

### Should I learn PyTorch or TensorFlow first?

Learn PyTorch first. It teaches the actual mechanics better because you write more explicitly - including your own training loops. PyTorch's eager execution is easier to debug. The job market increasingly asks for PyTorch. Once you know PyTorch, TensorFlow is straightforward to pick up.

### What is Keras and is it still worth learning?

Keras is the high-level API that ships with TensorFlow. It lets you define models with simple commands like model.add() and model.fit(). It is still widely used, especially for teaching and for standard tasks like image classification. Most beginners who use TensorFlow are actually using Keras without realising it.

### Why has PyTorch become more popular than TensorFlow?

PyTorch is more intuitive for people who think like programmers. It uses eager execution by default, meaning operations run immediately and you can print intermediate values. Research papers now cite PyTorch more than TensorFlow. As researchers build in PyTorch, production teams follow because it simplifies the research-to-deployment pipeline.

## Sources & Primary References

1. [TensorFlow official documentation](https://www.tensorflow.org/) - Google's deep learning framework
2. [PyTorch official documentation](https://pytorch.org/) - Meta's deep learning framework
3. [Keras official documentation](https://keras.io/) - TensorFlow's high-level API
4. [Papers With Code - Framework Trends](https://paperswithcode.com/trends) - tracks which frameworks research papers use

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
