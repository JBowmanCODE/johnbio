# Key ML Algorithms

> Decision trees, random forests, gradient boosting, support vector machines (SVMs) and k-nearest neighbours compared.

- **Canonical URL**: https://johnb.io/course/key-ml-algorithms
- **Markdown URL**: https://johnb.io/course/key-ml-algorithms.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 5
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

There are many machine learning algorithms. This lesson covers the ones you'll encounter most often: decision trees, random forests, SVMs, KNN, and Naive Bayes. Each has a different strength, a different weakness, and a different situation where it's the right tool.

## Decision Trees: How They Work and Why They're Intuitive

Decision trees are probably the most intuitive machine learning model. A human can look at a trained decision tree and understand exactly what it's doing.

The idea: you ask a series of yes/no questions about the data, and each answer narrows down the prediction. Is the email long? If yes, branch A. If no, branch B. In branch A, does it contain certain words? If yes, probably spam. This is how you'd manually build a flowchart. The [scikit-learn user guide](https://scikit-learn.org/stable/user_guide.html) has good practical examples of all these algorithms. A decision tree is that flowchart, built automatically from data.

Mathematically, the tree is built by recursively splitting the data. At each node, the algorithm finds the single question that splits data into two groups as homogeneously as possible - the same kind of process that underpins [how AI learns](https://johnb.io/course/how-ai-learns) - where "homogeneous" means all items in each group belong to the same class. The algorithm measures this with Gini impurity or entropy, and keeps splitting until groups are pure or a stopping condition is met.

Why are trees intuitive? You can trace any prediction back to the rule that produced it: "This email is spam because it's long and contains the word 'prize'." You can argue with the tree. You can understand why it learned that rule. This is in stark contrast to neural networks, which produce a prediction with no auditable explanation.

The downside: single trees tend to overfit. They'll learn very specific rules that fit the training data but don't generalise. That's where random forests come in.

## Random Forests: An Extension of Decision Trees

A random forest is hundreds of decision trees trained slightly differently. You train each tree on a random subset of the data and a random subset of the features. Then you predict by having all trees vote. If 300 trees say "spam" and 200 say "not spam," predict spam.

Why does voting help? Because the trees are diverse. Each overfits in a different way. The errors average out. The ensemble is more robust than any individual tree - and usually more accurate than a single tree by a significant margin.

Random forests are widely used and a strong default for most structured data problems. They're less interpretable than a single tree (you can't point to "the rule"), but far more accurate. [Wikipedia's random forest article](https://en.wikipedia.org/wiki/Random_forest) covers the statistical foundations in more depth. The trade-off: single trees for interpretability, forests for accuracy.

## Support Vector Machines: The Core Idea

SVMs try to find the best decision boundary between two classes. Imagine two groups of points in 2D space. SVM finds the line that separates them, but not just any line - the one with the largest margin, the biggest gap between the boundary and the nearest points of each class.

A larger margin means better generalisation. A line that barely separates training data is fragile - new points will likely land on the wrong side. A line with a wide gap is more robust.

When data isn't linearly separable, SVMs use the kernel trick: they transform data into a higher-dimensional space where a linear boundary does work, without explicitly doing the transformation. Mathematically elegant, a bit abstract in practice. For practical evaluation of how well any of these perform, see the [model evaluation](https://johnb.io/course/model-evaluation) lesson.

SVMs work well on small to medium structured datasets. Training gets slow for large datasets. They also require feature scaling - if features aren't normalised to similar ranges, the algorithm gets confused about what matters.

## KNN and Naive Bayes

**K-nearest neighbours (KNN)** is simple: to predict a new point, find the k nearest points in training data and let them vote. To predict whether an email is spam, find the 5 most similar emails in training data and check how many are spam.

Pros: easy to understand, often works. Cons: slow at prediction time (compare to every training example), struggles with high-dimensional data (in high dimensions, all points are roughly equidistant from each other, so "nearest" loses meaning), and doesn't learn anything - it's just storing training data.

**Naive Bayes** uses probability. Given an email's features, what's the probability it's spam? It uses Bayes' theorem with one simplifying assumption: features are independent of each other. That's almost always false (spam words tend to co-occur), hence "naive." Despite the bad assumption, it works surprisingly well and is very fast.

Naive Bayes is a strong baseline for text classification. If your fancy model barely beats Naive Bayes, the extra complexity probably isn't worth it.

## When to Use Which Algorithm

**Decision trees:** when interpretability matters - you need to explain decisions to humans or regulators. Also useful when exploring data to understand which features matter.

**Random forests:** the default for most structured data problems. Fast, robust, accurate, and needs little tuning.

**SVMs:** clean, structured data where performance matters more than interpretability. Less common in industry now because random forests are easier and deep learning gets the headlines, but still mathematically sound and worth knowing.

**KNN:** as a quick baseline or when the problem is simple enough that memorisation works. Rarely your main model.

**Naive Bayes:** text and document classification as a fast, strong baseline.

**Logistic regression:** simple, interpretable, fast, and surprisingly often good enough.

**Neural networks:** when you have lots of data and compute, and simpler models aren't working - or when dealing with images, audio, and sequences where deep architectures genuinely shine.

Start with [logistic regression](https://johnb.io/course/logistic-regression-classification) or decision trees. They teach the fundamentals. Random forests are an immediate practical extension. The temptation is to jump to neural networks because they're famous. Resist it. Once you understand how simpler models work and what can go wrong, [neural networks](https://johnb.io/course/neural-networks-forward-propagation) make sense. Before that, they're black boxes and you'll waste time debugging things you don't understand.

## How It Works

1. **Decision trees.** are built recursively. At each node, the algorithm evaluates every possible feature and threshold, picks the split that minimises impurity (Gini or entropy), and creates two child nodes. This continues until a stopping criterion (max depth, min samples, or pure nodes) is met.
2. **Random forests.** use bagging (bootstrap aggregating): each tree trains on a random sample of the training data with replacement, and at each split only a random subset of features is considered. This decorrelates the trees, ensuring diverse errors that cancel when averaged.
3. **SVMs.** solve a convex optimisation problem to find the maximum-margin hyperplane. The kernel function (linear, polynomial, RBF) determines how the feature space is implicitly extended. The key parameters are C (trade-off between margin and classification errors) and the kernel choice.

## Key Points

- Decision trees: interpretable, intuitive, but overfit easily. Good for explainability.
- Random forests: ensemble of many trees, errors average out. Strong default for structured data.
- SVMs: maximise the margin between classes. Kernel trick handles non-linear boundaries. Slow on large datasets.
- KNN: predict by majority vote of k nearest training examples. Simple but slow and doesn't generalise well in high dimensions.
- Naive Bayes: fast probabilistic classifier. Excellent baseline for text classification despite the independence assumption.
- Algorithm selection guide: interpretability → decision trees; accuracy on structured data → random forests; text → Naive Bayes; limited data → logistic regression; images/sequences → neural networks.
- Learn simpler models first. Neural networks make sense after you understand what can go wrong in simpler ones.

## Frequently Asked Questions

### What is a decision tree in machine learning?

A decision tree is a machine learning model that makes predictions through a series of yes/no questions about input features. At each node, it finds the question that best separates the classes. The result is interpretable: you can trace any prediction back to the rules that produced it. Decision trees tend to overfit, which is why random forests (many trees voting together) are more commonly used in practice.

### What is a random forest?

A random forest is an ensemble of hundreds of decision trees, each trained on a random subset of the data and features. Predictions are made by majority vote. Because the trees are diverse (each overfits in a different way), their errors average out and the ensemble is more accurate and robust than any individual tree. Random forests are a strong default for most structured data problems.

### What is a support vector machine (SVM)?

An SVM finds the decision boundary with the largest margin - the biggest gap between the boundary and the nearest training points of each class. A larger margin generalises better to new data. When classes aren't linearly separable, SVMs use the kernel trick to implicitly map data into a higher-dimensional space where a linear boundary works. SVMs perform well on small to medium structured datasets.

### Which machine learning algorithm should beginners learn first?

Start with logistic regression or decision trees. Logistic regression teaches loss functions, gradient descent, and probability - concepts that transfer to every other model. Decision trees teach overfitting, feature importance, and the bias-variance trade-off intuitively. Then learn random forests as an extension. Resist jumping to neural networks first - you'll spend weeks debugging things you don't understand.

## Sources & Primary References

1. Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5-32.
2. Cortes, C. & Vapnik, V. (1995). Support-vector networks. *Machine Learning*, 20, 273-297.
3. Hastie, T., Tibshirani, R. & Friedman, J. (2009). *The Elements of Statistical Learning*. Springer.
4. Geron, A. (2022). *Hands-On Machine Learning* (3rd ed.). O'Reilly Media.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
