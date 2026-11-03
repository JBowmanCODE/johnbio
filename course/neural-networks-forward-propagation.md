# Neural Networks and Forward Propagation

> How input features flow through input, hidden and output layers via matrix multiplication and non-linear activations.

- **Canonical URL**: https://johnb.io/course/neural-networks-forward-propagation
- **Markdown URL**: https://johnb.io/course/neural-networks-forward-propagation.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 7 min read

Neural networks look mysterious until you realise they're just a chain of arithmetic operations. Multiply. Add. Apply a function. Repeat. The mechanism is boring. The result is interesting. Here's what's actually happening.

## The Basic Structure of a Neural Network

A neural network has three types of layers: input, hidden, and output.

The input layer isn't really a layer of neurons - it's your data. If you're feeding in a 28x28 pixel image of a handwritten digit, that's 784 input values. The concepts here connect directly to how [biological neurons differ from artificial ones](https://johnb.io/course/biological-vs-artificial-neurons).

Hidden layers do the actual computation. Each neuron in a hidden layer takes all inputs from the previous layer, multiplies each by a weight, adds them up, adds a bias, and produces a number. That number goes through an activation function. The result is what that neuron outputs.

If you have three hidden layers with 128 neurons each, you get 128 numbers flowing out of the first hidden layer, which become inputs to the second hidden layer. Same operation repeats.

The output layer is the final prediction. For recognising handwritten digits, you'd have 10 output neurons - one for each digit (0-9). Each produces a number. Usually the highest number is your prediction.

## What a Neuron Does Computationally

Say a neuron has three inputs: x1, x2, x3. It has three weights: w1, w2, w3. And one bias: b.

The neuron computes:

```
output = activation_function((w1 * x1) + (w2 * x2) + (w3 * x3) + b)
```

That's it. Multiply, add, apply a function. Nothing magic.

Before training, weights and biases are random. Training adjusts them so that the network's outputs match correct answers - a process called [backpropagation](https://johnb.io/course/backpropagation). The weights and biases are the only things that change during training - everything else (the network architecture, the number of layers and neurons) is fixed.

## What Forward Propagation Means

Forward propagation is moving data through the network from input to output.

You have some data. The input layer passes it to the first hidden layer. Each neuron in the first hidden layer does its multiply-and-add. The results flow to the second hidden layer. Same operation. Then to the third. Then to the output.

The name "forward propagation" distinguishes it from "backward propagation," where errors flow backward to adjust the weights. Forward propagation is just the straightforward path: data in, prediction out. The activation functions that shape each neuron's output are explained in [the activation functions lesson](https://johnb.io/course/activation-functions-vanishing-gradient).

When you give a trained network an image, you're doing forward propagation. The network outputs numbers representing the probability of each class. Pick the biggest one. That's your prediction.

## Weights and Biases Explained Plainly

Weights control how much each input matters to a neuron's output.

If a weight is close to zero, that input barely influences the neuron. If it's a large positive number, the input has a big positive effect. If it's negative, that input pushes the output down.

The bias is a constant added before the activation function. It's useful because sometimes you want a neuron to have a baseline - to always fire at least a little bit, or to require a threshold before activating.

Weights let you turn inputs up or down. Bias lets you shift everything up or down. Together, they give the network enough flexibility to map any input pattern to any output.

When training is complete, the weights encode what the network has learned. Each weight is just a number, but collectively, millions of weights encode the difference between an untrained network that produces random outputs and a trained one that can recognise dogs in photos or translate between languages. Once a network is trained like this, it can be studied in the context of the [broader family of ML models](https://johnb.io/course/key-ml-algorithms).

## Why Neural Networks Aren't Mysterious

Neural networks sound complicated because they're described as if something sophisticated is happening. "Deep learning." "Neural architecture." "Non-linear function approximation." The jargon makes it sound profound. [Wikipedia's neural network article](https://en.wikipedia.org/wiki/Artificial_neural_network) cuts through some of that jargon well.

But it's not. It's multiply, add, apply a function, repeat. The profound part is that stacking these boring operations correctly and training them on enough data somehow produces systems that recognise faces, translate languages, and generate text. That's the interesting bit.

The mechanism isn't the magic. The result is.

People build it up as mysterious because mystery sells. Once you understand a neural network as a massive chain of arithmetic - one you can write in a hundred lines of Python - most of [deep learning](https://johnb.io/course/ml-deep-learning-neural-networks) becomes comprehensible. Hard sometimes, but comprehensible.

## How It Works

1. **Step.** In matrix form, a full hidden layer can be computed as: `output = activation(W * x + b)`, where W is the weight matrix, x is the input vector, and b is the bias vector. This matrix multiplication computes all neuron outputs simultaneously, which is why GPUs (optimised for matrix maths) make neural networks so much faster to train.
2. **Step.** For a network with multiple layers, the output of one layer becomes the input to the next: `h1 = activation(W1 * x + b1)`, `h2 = activation(W2 * h1 + b2)`, and so on. The final output layer often uses a different activation (softmax for classification, linear for regression) suited to the prediction task.

## Key Points

- Neural networks have input, hidden, and output layers.
- Each neuron: multiply each input by its weight, sum everything, add bias, apply activation function.
- Weights and biases are the only things that change during training - architecture stays fixed.
- Forward propagation: data flows from input layer through hidden layers to output - one pass, one prediction.
- Weights encode learned knowledge: what patterns in inputs predict which outputs.
- Bias lets a neuron have a baseline activation independent of input values.
- The mechanism (multiply, add, repeat) is simple. The magic is in what trained weights can represent.

## Frequently Asked Questions

### What is the basic structure of a neural network?

A neural network has three types of layers: input (your raw data), hidden layers (where the actual computation happens), and output (the final prediction). Each hidden layer contains neurons that take all values from the previous layer, multiply each by a weight, add them up, add a bias, and pass the result through an activation function.

### What does a single artificial neuron do?

A single neuron takes multiple inputs, multiplies each by its corresponding weight, adds all those products together, adds a bias value, and passes the result through an activation function. That's it: multiply, add, apply a function. The weights and bias are what the network learns during training.

### What is forward propagation in a neural network?

Forward propagation is passing data through the network from input to output. Data enters the input layer, flows through each hidden layer (where neurons apply their multiply-add-activate operations), and reaches the output layer which produces a prediction. It's called "forward" to distinguish it from backpropagation, where errors flow backward to update the weights.

### What are weights and biases in a neural network?

Weights control how much each input influences a neuron's output. A large positive weight means that input has a big positive effect; near-zero means it barely matters; negative means it pushes the output down. Bias is a constant that shifts the neuron's baseline output. Together, weights and biases are what the network adjusts during training to improve its predictions.

## Sources & Primary References

1. LeCun, Y., Bengio, Y. & Hinton, G. (2015). Deep learning. *Nature*, 521, 436-444.
2. Goodfellow, I., Bengio, Y. & Courville, A. (2016). *Deep Learning*. MIT Press. (Free at deeplearningbook.org)
3. Nielsen, M. (2015). *Neural Networks and Deep Learning*. (Free at neuralnetworksanddeeplearning.com)

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
