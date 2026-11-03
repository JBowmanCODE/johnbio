# Model Evaluation

> Measuring model performance with accuracy, precision, recall, F1-score, confusion matrices, ROC-AUC and cross-validation.

- **Canonical URL**: https://johnb.io/course/model-evaluation
- **Markdown URL**: https://johnb.io/course/model-evaluation.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 5
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

Training accuracy is the most misleading number in machine learning. A 99% training score can mean you've built something useless. Here's how to evaluate models honestly - including the mistakes almost everyone makes at the start.

## What Overfitting Is and Why It's the Most Common ML Mistake

Overfitting is when a model memorises training data instead of learning patterns.

You're training a model to predict house prices - a classic example of [linear regression](https://johnb.io/course/linear-regression-gradient-descent). The training set has 100 houses. Your model has 10,000 parameters. Mathematically, it has way more capacity than it needs. Instead of learning "big houses cost more," it learns "houses on streets with three-syllable names cost £5,000 more." It fits the training data perfectly.

Then you test it on new houses. It fails spectacularly. It memorised noise that doesn't generalise.

The overfitting trap is subtle because training accuracy looks great. Your model got 99% right! Then you test on new data and it's 60% right. Training accuracy is 95%, validation accuracy is 65%. That gap is overfitting - the model learned noise in training data that doesn't exist in new data.

You're not trying to avoid overfitting entirely - you're trying to find the sweet spot between fitting too little (underfitting) and fitting too much. Everyone encounters this. It's not a sign you're bad at machine learning. It's a sign you're doing machine learning.

## Training, Validation, and Test Sets

To evaluate properly, you need three separate datasets.

**Training set (60-70%):** The model trains on this. It sees this data, learns from it, updates its parameters. This is the only data the model learns from.

**Validation set (15-20%):** You don't train on this, but you use it to tune the model. Should I use more regularisation? Decrease the learning rate? You train, check validation performance, adjust, and retrain. The validation set answers "how well does it generalise?" without using your final test data.

**Test set (15-20%):** You don't touch this until the very end. Train on training data, tune on validation data, and only at the end evaluate on test data. This is your final honest assessment. Like a final exam - you don't study the exam questions; you study the material, then take the exam. If you tune your model to perform well on test data, the result is meaningless.

The process: train, check validation metrics, adjust, retrain, check validation again. Repeat until validation metrics stop improving. Then evaluate once on the test set.

## Key Metrics: Accuracy, Precision, Recall, F1

**Accuracy**: what fraction of predictions were correct? If you predicted 100 emails and got 95 right, accuracy is 95%. Easy to understand, easy to misuse.

**Precision**: of everything I predicted as positive, how many were actually positive? If you flag 50 emails as spam and 40 were spam, precision is 80%. Precision measures false positives - how often you cry wolf.

**Recall**: of all actual positives, how many did I catch? If 100 emails are actually spam and you caught 40, recall is 40%. [Scikit-learn's model evaluation docs](https://scikit-learn.org/stable/modules/model_evaluation.html) show how to compute all of these in code. Recall measures false negatives - how often you miss the real thing.

They trade off. Perfect recall is easy: predict everything as positive. You'll catch all the spam but flag everything. Perfect precision is also achievable: predict almost nothing as positive. You'll rarely be wrong, but you'll miss most spam.

**F1 score**: the harmonic mean of precision and recall, balancing both into one number. If precision is 80% and recall is 40%, F1 is about 53%.

When to use which: **accuracy** when false positives and false negatives are equally bad (rare). **Precision** when false positives are expensive - fraud detection where false alarms waste investigator time. **Recall** when false negatives are expensive - medical diagnosis where missing a disease is dangerous. **F1** when you want a single balanced number and aren't sure which error type matters more.

## Why Accuracy Alone Is Misleading

If 99% of patients don't have a rare disease, and your model predicts "no disease" for everyone, accuracy is 99%. The model catches zero actual cases. Medically useless, statistically impressive.

Accuracy is meaningful only when classes are balanced. With 50% disease and 50% healthy, 92% accuracy means something. With 99% healthy and 1% disease, you need to think much harder about what your accuracy number actually means. This matters especially in [logistic regression](https://johnb.io/course/logistic-regression-classification) for classification tasks.

Always look at precision and recall, or a confusion matrix. Accuracy hides problems in imbalanced datasets, which describes most real business problems.

## What Beginners Always Get Wrong

The biggest mistake: tuning on the test set. You train a model, get 95% test accuracy, ship it, and it fails in production. The [key ML algorithms](https://johnb.io/course/key-ml-algorithms) lesson covers why simpler models are less prone to this specific mistake. You measured yourself against the exam paper while studying. That's not an honest evaluation.

Ignoring class imbalance is the second. 10,000 negative examples, 50 positive. The model predicts negative for everything, gets 99% accuracy, and you declare victory. Recall is near zero. You haven't solved the problem.

Training and validation sets from different distributions is the third. Train on 2020 data, validate on 2019 data. The model passes validation but fails in production because real data is different. This is distribution shift, and it's common.

Not looking at error cases is the fourth. You check an 85% accuracy number and move on. Instead: what does the confusion matrix look like? Which class does it struggle with? Why? Those errors teach you something. The summary number doesn't.

All of these are about skipping evaluation rigour. Machine learning is hard. The evaluation process keeps you honest. Skip it and you'll ship broken models with confidence. Once deployed, [monitoring for drift](https://johnb.io/course/monitoring-drift) continues that same discipline in production.

## How It Works

1. **confusion matrix.** A **confusion matrix** shows the full picture of a classifier's performance. For binary classification, it has four cells: true positives (correctly predicted positive), true negatives (correctly predicted negative), false positives (predicted positive but actually negative), and false negatives (predicted negative but actually positive). Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1 = 2 * (Precision * Recall) / (Precision + Recall).
2. **Step.** Overfitting is caused by a model with too much capacity relative to the amount of training data. Common fixes: collect more data, reduce model complexity, use regularisation (L1/L2 penalties on parameters), use dropout (for neural networks), or use early stopping (halt training when validation loss stops improving).

## Key Points

- Overfitting: model memorises training data, performs well on training but poorly on new data.
- Sign of overfitting: large gap between training accuracy and validation accuracy.
- Three data splits: training (learn), validation (tune), test (final honest evaluation - use once).
- Never tune on test data - it invalidates the evaluation.
- Accuracy is misleading with imbalanced classes - use precision, recall, or F1 instead.
- Precision: low false positives. Recall: low false negatives. F1: balanced between both.
- Choose metrics based on the cost of different error types, not convenience.
- Always look at error cases and confusion matrices, not just summary numbers.

## Frequently Asked Questions

### What is overfitting in machine learning?

Overfitting is when a model memorises training data instead of learning generalisable patterns. It fits perfectly to the training examples - including noise and quirks that don't appear in new data. A sign of overfitting: training accuracy is high (95%) but validation accuracy is much lower (65%). The gap between those two numbers is the overfitting signal.

### What is the difference between training, validation, and test sets?

Training set (60-70%): the model learns from this data. Validation set (15-20%): used to tune the model without touching test data - you check how well the model generalises and adjust hyperparameters. Test set (15-20%): used only once, at the end, for the final honest assessment. Tuning on test data invalidates it - it becomes just another form of training.

### What is the difference between precision and recall?

Precision: of everything the model predicted as positive, how many were actually positive? High precision means few false positives. Recall: of all actual positives, how many did the model catch? High recall means few false negatives. They trade off - you can improve one by sacrificing the other. F1 score balances both into a single number.

### Why is accuracy alone a misleading metric?

Accuracy is misleading when classes are imbalanced. If 99% of patients don't have a rare disease, a model that predicts "no disease" for everyone is 99% accurate but catches zero actual cases. Accuracy only means something when classes are roughly balanced. Always check precision, recall, or a confusion matrix to understand what the model is actually doing.

## Sources & Primary References

1. Hastie, T., Tibshirani, R. & Friedman, J. (2009). *The Elements of Statistical Learning*. Springer.
2. Provost, F. & Fawcett, T. (2013). *Data Science for Business*. O'Reilly Media.
3. Geron, A. (2022). *Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow* (3rd ed.). O'Reilly.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
