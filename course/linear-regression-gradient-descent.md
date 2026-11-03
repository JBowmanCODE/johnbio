# Linear Regression and Gradient Descent

> How linear regression models continuous outcomes and how gradient descent iteratively minimises a loss function.

- **Canonical URL**: https://johnb.io/course/linear-regression-gradient-descent
- **Markdown URL**: https://johnb.io/course/linear-regression-gradient-descent.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 5
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

Linear regression is the simplest machine learning model. But the ideas behind it - loss functions, gradient descent, convergence - are the same ideas behind every other model. Getting this right makes everything else easier.

## What Linear Regression Is and What It's Trying to Do

Linear regression is the simplest machine learning model. It draws a line through data.

You have data points. Each has an input (x) and an output (y): house size and price, years of experience and salary, temperature and ice cream sales. The model's job is to find the line that best predicts y from x. Once you have it, give it any x and it predicts y.

Why start here? Because it's interpretable - you can understand why it made a prediction. It's fast. It works well when the relationship is actually linear. And the concepts transfer to every other model: deep learning, random forests, [neural networks](https://johnb.io/course/neural-networks-forward-propagation) all try to find a function that maps inputs to outputs. Linear regression is the simplest function. Everything else is more complicated.

## The Line of Best Fit Without Heavy Maths

You define "distance" mathematically. If the line predicts `y_predicted` and the actual value is `y_actual`, the error is the difference. You can't just add errors up - positives and negatives would cancel. So you square them (squared error is always positive) and add them all up. This is mean squared error (MSE).

The computer's job: find the line that minimises MSE. A line is defined by slope (m) and intercept (b): `y = mx + b`. The search is for values of m and b that make MSE as small as possible. That search is gradient descent. [Scikit-learn's linear model docs](https://scikit-learn.org/stable/modules/linear_model.html) show how this looks in practice.

## What Gradient Descent Is: The Hill-Walking Analogy

Imagine you're lost in fog on a hill. You can't see the bottom, but you can feel the slope under your feet. If you always walk downhill, you'll eventually reach the bottom. Gradient descent is that algorithm.

Start with random values for m and b. Compute the error. Ask: if I change m slightly, does the error get smaller or bigger? If smaller, move that way. Adjust m and b a little. Ask again. Keep doing this - always moving in the direction of smaller error - until moving in any direction makes things worse. That's the bottom. That's your best fit.

The gradient is the slope of the error surface. The direction the gradient points is where error increases fastest. Moving opposite to the gradient means moving towards lower error.

The learning rate controls step size. Big steps are fast but risky - you might overshoot. Small steps are slow but safe. You pick a learning rate and tune it experimentally.

## How Gradient Descent Finds the Best Model

In practice:

1. Start with random m and b
2. Compute the error (MSE)
3. Compute the gradient - the direction to change m and b to reduce error
4. Take a small step in that direction
5. Repeat hundreds or thousands of times

After many iterations, m and b stop changing meaningfully. You've converged. That's your trained model.

This is the basic training loop for almost every machine learning model. Neural networks have way more parameters to adjust, but the idea is identical: define what "good" means (loss function), compute the gradient, take steps to reduce loss. The [backpropagation](https://johnb.io/course/backpropagation) lesson extends this to deep networks.

For linear regression, the mathematics guarantees the error surface is bowl-shaped - convex, with one minimum. Gradient descent finds it reliably. For more complex models the surface can be bumpier, which is why training neural networks is more involved.

## Why This Matters as a Foundation for Everything Else

Every model you build later has the same structure: a loss function (how to measure wrong), parameters to adjust, an optimisation algorithm (usually gradient descent or a variant), and validation to check whether the model generalises. See [model evaluation](https://johnb.io/course/model-evaluation) for how to do that validation properly.

In [logistic regression](https://johnb.io/course/logistic-regression-classification), you're still minimising a loss function with gradient descent. In neural networks, same thing - just with way more parameters. In random forests, you're still measuring how well predictions match reality.

Understanding linear regression gives you intuition for why those models work. And it's often the right tool. When you have a big complicated dataset with fancy models available, sometimes the simplest thing that works is a linear regression. Compare it to the [full range of ML algorithms](https://johnb.io/course/key-ml-algorithms) to see where it fits. It's interpretable, fast, and deployable. If a deep learning model gets 2% higher accuracy but you can't explain its predictions, the linear regression might be the better choice.

You don't need to derive gradient formulas by hand. But you should understand what a loss function is, why you minimise it, how gradient descent navigates the error surface, and what convergence means. That understanding is the difference between calling `fit()` as magic and actually being able to debug when training goes wrong.

## How It Works

1. **Step.** Linear regression fits a model of the form `y = w1*x1 + w2*x2 + ... + b`, where the w values are weights (slopes) and b is the bias (intercept). Training adjusts these parameters to minimise mean squared error (MSE) across all training examples.
2. **Step.** Gradient descent computes the partial derivative of MSE with respect to each parameter. This gives the direction of steepest ascent on the error surface. Moving in the opposite direction (steepest descent) reduces error. The update rule is: `parameter = parameter - learning_rate * gradient`. This repeats until gradients are near zero (convergence).
3. **Step.** For linear regression specifically, the loss surface is convex - bowl-shaped with one global minimum. This guarantees gradient descent converges to the optimal solution (given a suitable learning rate). For non-convex models like neural networks, this guarantee doesn't hold.

## Key Points

- Linear regression finds the line that minimises mean squared error between predictions and actual values.
- MSE squares errors before summing to avoid positive and negative errors cancelling each other out.
- Gradient descent: start with random parameters, compute gradient (slope of error surface), take small steps in direction of decreasing error, repeat until convergence.
- Learning rate: too large = overshoot minimum; too small = slow convergence.
- For linear regression, the error surface is convex - one global minimum, guaranteed to be found.
- The training loop (loss function + gradient descent) is the same for logistic regression, neural networks, and almost every ML model.
- Linear regression is interpretable, fast, and often the right tool - don't skip it for fancier models without trying it first.

## Frequently Asked Questions

### What is linear regression in machine learning?

Linear regression is the simplest machine learning model. It finds a line (or plane, in multiple dimensions) that best predicts an output value from input values. It works by minimising mean squared error - the sum of squared differences between predictions and actual values. It's useful when the relationship between input and output is roughly linear, and it's the foundation for understanding how more complex models work.

### What is gradient descent?

Gradient descent is an optimisation algorithm that finds the model parameters that minimise a loss function. Imagine standing in fog on a hill - you can feel the slope but can't see the bottom. If you always step in the direction that feels downhill, you'll eventually reach the lowest point. Gradient descent does this mathematically: it computes the slope of the error surface (the gradient) and adjusts parameters in the direction of decreasing error.

### What is a learning rate in gradient descent?

The learning rate controls how large each step is during gradient descent. A large learning rate means faster training but risks overshooting the minimum. A small learning rate is safer but training takes longer. Finding the right learning rate is usually done experimentally. Modern deep learning frameworks have adaptive learning rate methods (like Adam) that adjust the rate automatically during training.

### Why should beginners understand linear regression and gradient descent?

Because the same patterns appear in every other machine learning model: a loss function (how to measure wrong), parameters to adjust, an optimisation algorithm (usually gradient descent), and validation to check generalisation. Neural networks, random forests, and logistic regression all share this structure. Understanding linear regression gives you intuition for why those models work and how to debug them when they don't.

## Sources & Primary References

1. Hastie, T., Tibshirani, R. & Friedman, J. (2009). *The Elements of Statistical Learning* (2nd ed.). Springer. (Free PDF at web.stanford.edu/~hastie/ElemStatLearn/)
2. Ruder, S. (2016). An overview of gradient descent optimisation algorithms. *arXiv*:1609.04747.
3. Ng, A. Machine Learning course lecture notes. Stanford University / Coursera.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
