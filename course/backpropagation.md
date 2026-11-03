# Backpropagation

> How neural networks learn by applying the chain rule of calculus to propagate error gradients backward through layers.

- **Canonical URL**: https://johnb.io/course/backpropagation
- **Markdown URL**: https://johnb.io/course/backpropagation.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 7 min read

Forward propagation gets you a prediction. Backpropagation gets you from "that prediction was wrong" to "here's how to adjust every weight." It's the chain rule from calculus, applied over and over. Here's what's actually happening.

## The Problem Backpropagation Is Solving

After [forward propagation](https://johnb.io/course/neural-networks-forward-propagation), you have a prediction. Usually it's wrong. You measure how wrong using a [loss function](https://en.wikipedia.org/wiki/Loss_function) - a number representing how bad the mistake was.

Now comes the hard part. You have thousands or millions of weights. Which ones caused the mistake? How much should you change each one? Moving weights in the wrong direction would make things worse.

You could try random adjustments, but that's incredibly inefficient with millions of weights. You need to know: for each weight, if I increase it slightly, does the loss go up or down? By how much?

Backpropagation solves this. It calculates the gradient - the direction and magnitude of change - for every single weight in the network, efficiently, in one pass backward through the network.

Without backpropagation, training deep networks would be computationally impossible. That's why when people adopted it in the 1980s, it was a genuine breakthrough.

## The Chain Rule Without Heavy Calculus

Backpropagation is the [chain rule from calculus](https://en.wikipedia.org/wiki/Backpropagation), applied over and over.

The chain rule says: if you have a function made up of functions stacked together, the rate of change of the output depends on the rate of change at each step, multiplied together.

Simple case: the output of neuron C depends on the output of neuron B, which depends on the output of neuron A. How much does A affect C? Multiply (how much does B change when A changes) by (how much does C change when B changes). That product is your answer.

In a neural network, you have hundreds of these chains. The loss depends on the output layer, which depends on the previous layer, which depends on the one before, all the way back to the inputs. Backpropagation computes all of these multiplications together, starting from the loss and working backward. At each step it asks: "How much should we blame this weight for the error?" That blame is the gradient.

## How Errors Flow Backward Through the Network

Here's the flow:

1. Make a prediction (forward pass)
2. Measure the loss - how wrong you were
3. Compute the gradient of the loss with respect to the output layer weights - straightforward calculus, the output is right there
4. Work backward: using the chain rule, compute how the loss changes with respect to the previous layer's weights
5. Keep going backward, layer by layer
6. Once you have gradients for every weight, update them: move each weight slightly in the direction opposite to its gradient (this is [gradient descent](https://johnb.io/course/linear-regression-gradient-descent))

The beautiful part is that you can do this for the entire network in a single backward pass. The chain rule lets you reuse computations from each layer as you move backward, rather than computing each weight's gradient independently. This efficiency is why backpropagation works for networks with millions of weights.

## Why This Was a Breakthrough

Backpropagation was discovered before the 1980s, but only became widely used then. That's when people realised: with this, we can train networks with multiple hidden layers using [activation functions](https://johnb.io/course/activation-functions-vanishing-gradient) like sigmoid, and they work better than shallow ones.

Before it became standard, training deep networks meant guessing which weights to adjust and by how much. Results were poor. Backpropagation gave a systematic, efficient method to improve every weight in the right direction. Deep networks became trainable.

In the 1980s and 1990s, this drove a period of excitement about neural networks. But computers weren't fast enough yet, and data was scarce. Deep learning went quiet again until GPUs made the computation feasible around 2012. Backpropagation plus [stochastic gradient descent](https://en.wikipedia.org/wiki/Stochastic_gradient_descent) plus large datasets: that combination is what made modern deep learning possible.

Conceptually, what you need to understand: start from the loss. Move backward through the network. At each step, use the chain rule to figure out how much each weight is responsible for the error. Update weights to reduce that error. That's most of what you need to know to work with neural networks. The calculus gets involved when you implement it, but the concept is about blame and feedback.

## How It Works

1. **Step.** For a network layer with weights W, inputs x, and outputs y = activation(Wx + b), backpropagation computes *dL/dW* (how the loss L changes with each weight in W) using: *dL/dW = dL/dy * dy/dW*. The *dL/dy* term comes from the next layer's computation (or directly from the loss if this is the output layer). The *dy/dW* term is the derivative of the activation function times the input.
2. **Step.** This is applied layer by layer moving backward. The key insight is that each layer's *dL/dy* input can be computed from the next layer's gradients - so you only need one backward pass, not a separate computation per weight. This is called dynamic programming applied to gradient computation.

## Key Points

- Backpropagation computes gradients for every weight in the network in a single backward pass.
- It applies the chain rule from calculus: multiply rates of change at each step, working backward from the loss.
- Flow: forward pass → measure loss → compute output layer gradients → work backward layer by layer → update all weights.
- Efficiency: the chain rule allows reuse of computations, making this feasible for millions of weights.
- The gradient tells you: if I increase this weight, does the loss go up or down, and by how much?
- Weights are updated by moving in the direction opposite to their gradient (towards lower loss).
- Backpropagation was the key that made training deep networks possible - before it, gradient computation was intractable.

## Frequently Asked Questions

### What is backpropagation?

Backpropagation is the algorithm that computes gradients (the direction and amount to adjust each weight) for every weight in a neural network, in a single backward pass. It works by applying the chain rule from calculus: starting at the loss function and working backward through the network, computing how much each weight contributed to the error.

### How do errors flow backward in a neural network?

After a forward pass produces a prediction, you measure the loss (how wrong it was). Then you compute the gradient of the loss with respect to the output layer weights (straightforward calculus). Using the chain rule, you work backward through each layer, computing how the loss changes with respect to that layer's weights. Each step reuses computations from the previous step, making this efficient even for large networks.

### What is the chain rule in backpropagation?

The chain rule says: if you have functions stacked together, the rate of change of the final output with respect to an early input equals the product of the rates of change at each step. In a neural network, to find how changing a weight in layer 1 affects the final loss, you multiply together how that weight affects its layer's output, how that output affects the next layer, and so on up to the loss. Backpropagation applies this chain rule efficiently across all layers simultaneously.

### Why was backpropagation a breakthrough?

Before backpropagation became standard practice in the 1980s, there was no efficient way to compute gradients for networks with multiple hidden layers. Without efficient gradients, training deep networks meant guessing which weights to adjust - which produced poor results. Backpropagation gave a systematic way to improve every weight correctly, making deep networks trainable for the first time.

## Sources & Primary References

1. Rumelhart, D.E., Hinton, G.E. & Williams, R.J. (1986). Learning representations by back-propagating errors. *Nature*, 323, 533-536.
2. Goodfellow, I., Bengio, Y. & Courville, A. (2016). *Deep Learning*. MIT Press. Chapter 6.
3. Nielsen, M. (2015). How the backpropagation algorithm works. *Neural Networks and Deep Learning*. Chapter 2.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
