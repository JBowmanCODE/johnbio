# Activation Functions and the Vanishing Gradient

> ReLU, sigmoid, tanh and softmax compared, and how vanishing or exploding gradients affect deep network training.

- **Canonical URL**: https://johnb.io/course/activation-functions-vanishing-gradient
- **Markdown URL**: https://johnb.io/course/activation-functions-vanishing-gradient.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 7 min read

A neuron that just multiplies and adds is useless. Activation functions are what make neural networks actually work. And the choice of activation function once made training deep networks practically impossible - until ReLU changed everything.

## What Activation Functions Do and Why They're Needed

Without an activation function, a neural network is just a very complicated way to do linear maths. Layer one does linear operations. Layer two combines those with more linear operations. Layer three combines those. But linear combined with linear is still linear - regardless of how many layers you stack.

Linear operations can't learn interesting patterns. They can't recognise faces in photos, understand language, or find non-obvious relationships in data. You need non-linearity.

An activation function adds non-linearity. It's a simple function applied after each neuron's multiply-and-add step. It squashes, transforms, or filters the output.

So the neuron operation becomes: apply the activation function to (weights times inputs plus bias). This non-linearity lets the network learn complex, curved relationships between inputs and outputs instead of just straight lines.

## The Main Activation Functions

[Sigmoid](https://en.wikipedia.org/wiki/Sigmoid_function) was the classic. It takes any number and squashes it to a value between 0 and 1. Smooth, with useful mathematical properties. The problem: it's almost flat at the extremes. Very high or very low inputs produce near-zero gradients. This is what causes the vanishing gradient problem.

**Tanh** is similar but squashes to between -1 and 1. It's centred at zero, which helps training slightly compared to sigmoid. But it has the same vanishing gradient problem at the extremes.

[ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) (rectified linear unit) is simple: if the input is positive, output it unchanged. If it's negative, output zero. Not smooth, but extremely effective. It doesn't flatten at the extremes - it's either zero or linear. No vanishing gradient.

ReLU became the standard for hidden layers because it's computationally cheap and it works. Sigmoid is still used for output layers in binary classification because its 0-1 range gives a probability. There are ReLU variants - Leaky ReLU, ELU, GELU - but they're refinements. ReLU was the breakthrough that mattered.

## The Vanishing Gradient Problem

When you [backpropagate](https://johnb.io/course/backpropagation) through sigmoid or tanh, you multiply gradients at each layer. The gradient of sigmoid in its flat regions is very small - close to zero. Multiply many small numbers together and you get something extremely small.

Multiply 0.1 by itself ten times: you get 0.0000000001. That's the size of the gradient signal reaching the early layers. The update to each weight is proportional to its gradient, so weights in early layers barely change. Those layers essentially stop learning.

This is the [vanishing gradient problem](https://en.wikipedia.org/wiki/Vanishing_gradient_problem). Deep networks with sigmoid activations couldn't train effectively because the first layers received negligible gradient signals. The network would train fine near the output but be nearly random near the input.

This was a fundamental barrier to deep learning. Networks with more than a few layers couldn't be trained reliably.

## How ReLU Solved It

ReLU's gradient is either 0 (for negative inputs) or 1 (for positive inputs). You don't get multiplying tiny fractions. Gradients pass through ReLU unchanged (for positive activations) or are blocked entirely. No vanishing.

This meant you could train [neural networks](https://johnb.io/course/neural-networks-forward-propagation) with 50, 100, or more layers. Gradients reached the early layers strongly enough to actually update those weights. The early layers learned. Deep networks became trainable.

ReLU also helped on speed. Computing sigmoid requires an exponential function. Computing ReLU is a comparison: is this number greater than zero? That's one of the cheapest operations a processor can do. Large networks with many neurons suddenly became much more computationally feasible.

When deep learning took off around 2012, ReLU was standard. Most of the architectures that followed - ResNets, transformers, the models behind ChatGPT and image generation - use ReLU or one of its variants as the hidden layer activation.

The practical takeaway is simple: use ReLU for hidden layers. It works, it's fast, and the reasons it's better than sigmoid are now historical. You'll encounter sigmoid in output layers for binary classification problems, and softmax for multi-class outputs. But for hidden layers, ReLU is the default.

## How It Works

1. **Sigmoid.** `σ(x) = 1 / (1 + e^(-x))`. Output range: (0, 1). Gradient: `σ(x) * (1 - σ(x))`, which approaches 0 for very large or very small x. This is the source of the vanishing gradient problem.
2. **Tanh.** `tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))`. Output range: (-1, 1). Gradient: `1 - tanh(x)^2`, also approaches 0 at extremes.
3. **ReLU.** `relu(x) = max(0, x)`. Output range: [0, ∞). Gradient: 1 for x > 0, 0 for x < 0, undefined at x = 0 (treated as 0 in practice). No vanishing gradient for positive activations.
4. **Leaky ReLU.** `max(0.01x, x)`. Like ReLU but allows a small negative output, preventing "dead neurons" where a ReLU is permanently zero.

## Key Points

- Activation functions add non-linearity - without them, deep networks can only compute linear functions.
- Sigmoid: squashes output to (0,1). Historically popular, now mostly used for binary output layers.
- Tanh: squashes output to (-1,1). Same vanishing gradient problem as sigmoid.
- ReLU: output is max(0, x). Gradient is 0 or 1. Solved vanishing gradient, computationally cheap.
- Vanishing gradient: when gradients shrink to near-zero across many layers, early layers stop learning.
- ReLU solved this because its gradient doesn't diminish - it's either blocked (0) or passed through (1).
- Practical rule: use ReLU for hidden layers, sigmoid for binary outputs, softmax for multi-class outputs.

## Frequently Asked Questions

### What do activation functions do in neural networks?

Activation functions add non-linearity to neural networks. Without them, stacking layers of multiply-and-add operations would still only compute linear functions - regardless of how many layers you add. Non-linearity allows networks to learn complex, curved relationships between inputs and outputs: recognising faces, understanding language, detecting patterns in arbitrary data.

### What is the vanishing gradient problem?

The vanishing gradient problem occurs when gradients become extremely small as they're propagated backward through many layers. With sigmoid and tanh activation functions, gradients in the flat regions are very small. Multiply many small numbers together and you get something near zero. Early layers of the network receive such tiny gradient signals that they barely learn anything. This made training deep networks with sigmoid/tanh effectively impossible.

### What is ReLU and why is it the standard activation function?

ReLU (rectified linear unit) outputs the input unchanged if it's positive, or zero if it's negative. That's it. Its gradient is either 0 or 1 - never a tiny fraction. This solved the vanishing gradient problem: gradients don't shrink as they pass through ReLU. It's also computationally cheap (just a comparison, no transcendental functions). These properties made training deep networks practical, and ReLU became the default for hidden layers.

### When should you use sigmoid vs ReLU?

Use ReLU (or its variants like Leaky ReLU, GELU) for hidden layers. Use sigmoid for binary classification output layers (where you need a probability between 0 and 1) or similar outputs that need to be constrained to a range. For multi-class classification output, use softmax instead of sigmoid.

## Sources & Primary References

1. Nair, V. & Hinton, G. (2010). Rectified Linear Units Improve Restricted Boltzmann Machines. *ICML 2010*.
2. Glorot, X., Bordes, A. & Bengio, Y. (2011). Deep Sparse Rectifier Neural Networks. *AISTATS 2011*.
3. Hochreiter, S. (1991). Untersuchungen zu dynamischen neuronalen Netzen. (The original vanishing gradient paper, diploma thesis, TU Munich.)

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
