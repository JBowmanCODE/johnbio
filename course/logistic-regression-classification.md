# Logistic Regression and Classification

> Binary and multi-class classification using the sigmoid function, log-loss optimisation and decision thresholds.

- **Canonical URL**: https://johnb.io/course/logistic-regression-classification
- **Markdown URL**: https://johnb.io/course/logistic-regression-classification.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 5
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

Logistic regression isn't regression - it's classification. The name is a historical accident. It predicts probabilities rather than numbers, and it's faster and more interpretable than almost anything else. It's also chronically underused.

## Regression Predicts Numbers, Classification Predicts Categories

**Regression** predicts a continuous number. Given a house's size, predict its price. Given an animal's age, predict its weight. The output is a real number on a number line.

**Classification** predicts a category. Given an email, is it spam or not? Given an image, is it a dog or a cat? The output is one of a discrete set of possibilities.

Linear regression predicts numbers. Logistic regression predicts categories. The names are similar - confusingly so. "Logistic regression" isn't regression; it's classification. Someone named it regression because it borrows the regression framework. It stuck.

You can't just use linear regression for classification. If you train it to predict whether an email is spam (0 for not spam, 1 for spam), it'll happily predict 2.5 for some emails. That doesn't make sense. An email is either spam or it isn't. Logistic regression fixes that.

## What Logistic Regression Does

Logistic regression outputs a probability. Instead of predicting "spam" or "not spam," it predicts "99% chance this is spam" or "5% chance this is spam."

The maths transforms the linear regression output (which can be any number) into a probability between 0 and 1. Then you set a threshold. Probabilities above 0.5? Predict the positive class. Below 0.5? Predict the negative class.

Probabilities are more informative than hard decisions. If the model says "87% chance spam," you're confident. If it says "51% chance spam," you're less sure. You can adjust your threshold based on the cost of being wrong. If false positives are expensive, only mark emails as spam at 95% or higher. If missing spam is more costly, lower the threshold to 30%.

Training is the same process as [linear regression](https://johnb.io/course/linear-regression-gradient-descent): gradient descent minimising a loss function. The loss function is different - cross-entropy loss rather than mean squared error - but the training loop is identical.

## The Sigmoid Function

The sigmoid function is the mathematical transformation that turns any number into a probability between 0 and 1. Very negative inputs map close to 0. Very positive inputs map close to 1. Zero maps to 0.5. It produces an S-shaped curve.

You don't need to memorise the formula. Intuitively: data points from two classes are scattered on a 2D plot. Linear regression draws a straight line through the middle. Logistic regression bends that line into a curve where the probability transitions smoothly from "mostly class A" to "mostly class B."

The sigmoid constrains outputs to the valid range for probabilities. That's the whole job.

## Real Examples of Classification Problems

**Email filtering**: spam or not spam. Binary classification (two classes). This is the classic classification problem, covered in the context of [how AI learns](https://johnb.io/course/how-ai-learns).

**Medical diagnosis**: does the patient have disease X? Doctors sometimes want probabilities rather than hard decisions: "85% confident this is pneumonia." That maps directly to logistic regression output.

**Credit approval**: approve or deny. Companies often output a score or probability rather than a hard yes/no, so humans can review borderline cases. [Scikit-learn's logistic regression docs](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression) show how this is implemented in practice.

**Image recognition**: is this a cat, dog, bird, or fish? Multi-class classification. Logistic regression extends to this with softmax - a generalisation of sigmoid that produces probabilities across multiple classes simultaneously.

**Fraud detection**: is this transaction fraudulent? Binary classification where both false positives (blocking legitimate transactions) and false negatives (missing fraud) are costly. Adjusting the decision threshold lets you control the balance between them.

All of these share the same structure: input data, model predicts probability, apply a threshold, make a decision.

## When Logistic Regression Beats Fancier Models

Logistic regression is underrated. People jump to [neural networks](https://johnb.io/course/neural-networks-forward-propagation) without trying it first. That's a mistake.

It wins when the problem is approximately linearly separable - when the two classes naturally separate with a linear boundary. Adding complexity doesn't help. It wins with limited data: simpler models generalise better on small datasets, where a fancy model would overfit - as the [model evaluation](https://johnb.io/course/model-evaluation) lesson explains. It wins when you need explainability: you can look at the trained weights and understand exactly which features push predictions in which direction. Try explaining that with a deep neural network. And it wins on speed: logistic regression makes predictions in microseconds.

When does it lose? When the decision boundary is complicated - curves in ways a linear boundary can't capture. Random forests and neural networks model those curves. Logistic regression can't.

My advice: always try logistic regression first. It's your baseline. If it solves the problem, use it. If not, understand why - is it accuracy, speed, or something else? Then choose the next model based on that gap, not based on what sounds impressive. The [key ML algorithms](https://johnb.io/course/key-ml-algorithms) lesson covers what to try next.

## How It Works

1. **Step.** Logistic regression applies a linear combination of input features: `z = w1*x1 + w2*x2 + ... + b`. This value z is then passed through the sigmoid function: `p = 1 / (1 + e^(-z))`, producing a probability. If `p > 0.5`, predict class 1; otherwise predict class 0.
2. **Step.** Training minimises cross-entropy loss (also called log loss): `L = -[y*log(p) + (1-y)*log(1-p)]`. This penalises confident wrong predictions heavily. Gradient descent adjusts weights to minimise this loss over the training data, exactly as in linear regression.
3. **Step.** For multi-class problems (more than two categories), the softmax function generalises sigmoid: it produces a probability distribution over all classes simultaneously, ensuring probabilities sum to 1. The class with the highest probability is the prediction.

## Key Points

- Regression predicts numbers; classification predicts categories. Different problems, different models.
- Logistic regression is a classification model despite the name - historical naming accident.
- Output is a probability (0 to 1), not a hard class decision. You apply a threshold to get the decision.
- The sigmoid function maps any number to (0, 1) - this is how probabilities are produced.
- Training uses gradient descent with cross-entropy loss, same structure as linear regression.
- Logistic regression advantages: fast, interpretable, works with limited data, no hyperparameter tuning.
- It loses when the decision boundary is genuinely non-linear - random forests and neural networks handle those cases.
- Always use logistic regression as your baseline before trying more complex models.

## Frequently Asked Questions

### What is the difference between regression and classification?

Regression predicts a continuous number - house prices, salary, temperature. Classification predicts a category - spam or not spam, cat or dog, fraudulent or legitimate. They need different models. Linear regression predicts numbers. Logistic regression predicts categories by outputting a probability that you then threshold into a class decision.

### What does logistic regression actually output?

Logistic regression outputs a probability between 0 and 1. It uses the sigmoid function to transform the linear regression output (which can be any number) into this probability range. You then apply a threshold - typically 0.5 - to turn the probability into a class prediction. The threshold can be adjusted based on the cost of different types of errors.

### What is the sigmoid function?

The sigmoid function maps any real number to a value between 0 and 1. Very negative inputs map close to 0, very positive inputs map close to 1, and 0 maps to 0.5. It produces an S-shaped curve. In logistic regression, it transforms the linear output into a valid probability. In neural networks, it was historically used as an activation function (though ReLU is now more common).

### When should you use logistic regression instead of a neural network?

Use logistic regression when: you need to explain predictions to humans or regulators (it's interpretable), you have limited training data (simpler models generalise better), speed matters in production (it's orders of magnitude faster than deep models), or the problem is approximately linearly separable. Always try logistic regression as a baseline before moving to more complex models.

## Sources & Primary References

1. Hosmer, D.W. & Lemeshow, S. (2000). *Applied Logistic Regression* (2nd ed.). Wiley.
2. Hastie, T., Tibshirani, R. & Friedman, J. (2009). *The Elements of Statistical Learning*. Springer.
3. Bishop, C.M. (2006). *Pattern Recognition and Machine Learning*. Springer.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
