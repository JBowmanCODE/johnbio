# NumPy and Pandas

> Vectorised array operations in NumPy and tabular data cleaning, filtering and aggregation with Pandas.

- **Canonical URL**: https://johnb.io/course/numpy-pandas
- **Markdown URL**: https://johnb.io/course/numpy-pandas.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 4
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 9 min read

NumPy and Pandas aren't AI libraries - they're data libraries. But every AI project loads, cleans, and prepares data before training a model. That means NumPy and Pandas are part of every AI pipeline whether you think about them or not.

## What NumPy Is and Why Arrays Matter

NumPy stands for "Numerical Python." It's a library for working with arrays - ordered collections of numbers organised in a grid. The [NumPy documentation](https://numpy.org/doc/stable/) is thorough and worth bookmarking.

Why not just use Python lists? Lists work fine for ten numbers. For a million, they get slow. NumPy arrays are fast because they're optimised for numerical operations. Every element is the same type, so the computer can process them efficiently.

```
import numpy as np

scores = np.array([85, 92, 78, 88, 95])

scores + 10        # adds 10 to every score
scores > 85        # returns [False, True, False, True, True]
scores.mean()      # returns 87.6
scores.std()       # returns standard deviation
```

With a Python list, you'd loop through each item. With NumPy, you write the operation once and it applies to all items simultaneously - faster and cleaner.

In machine learning, your data arrives as arrays. A dataset with 10,000 rows and 50 columns is a 10,000 by 50 array. A trained model is mostly arrays of numbers (weights and biases). NumPy is how you manipulate all of that. These arrays feed directly into [gradient descent](https://johnb.io/course/linear-regression-gradient-descent) during training.

## What Pandas Is and What a DataFrame Is

Pandas builds on NumPy. While NumPy is great for numbers, it doesn't understand that one column represents ages and another represents postcodes. Pandas does. The [Pandas documentation](https://pandas.pydata.org/docs/) covers every method in detail.

A DataFrame is like a spreadsheet. It has rows and columns. Each column has a name. Each row represents one record.

```
import pandas as pd

df = pd.read_csv('employees.csv')

df['age']           # gives you just the age column
df['salary'] * 1.1  # salary with a 10% increase
df[df['age'] > 30]  # only rows where age > 30
df.groupby('department')['salary'].mean()  # avg salary per dept
```

This is the actual work of machine learning. You load messy data, explore it, clean it, and prepare it for a model. Most of that work is pandas.

## Loading and Inspecting Data with Pandas

When you get a dataset, the first thing you do is look at it.

```
df = pd.read_csv('data.csv')
df.head()          # shows first 5 rows
df.shape           # shows (10000, 50) - 10000 rows, 50 columns
df.info()          # shows column names and data types
df.describe()      # shows statistics for each numeric column
```

This takes two minutes and teaches you a lot. How many rows? What types are the columns? Are there missing values? What's the range of each number?

`head()` is your first move when exploring. It shows actual data, not just statistics. You can spot obvious problems: dates formatted oddly, numbers stored as text, text that should be numbers.

Missing values are common. `info()` shows which columns have missing entries. Then you decide: drop those rows, or fill them with something reasonable?

```
df.isnull().sum()  # how many missing values per column
df.dropna()        # remove rows with any missing values
df.fillna(0)       # replace missing values with 0
```

Simple operations, but these are the foundation of real work.

## Basic Operations: Filtering, Grouping, Summarising

**Filtering** selects a subset of rows based on conditions:

```
df[df['age'] > 30]
df[df['country'] == 'UK']
df[(df['age'] > 25) & (df['salary'] > 50000)]
```

**Grouping** organises rows by category and aggregates them:

```
df.groupby('department')['salary'].mean()  # avg salary per dept
df.groupby('country').size()               # headcount per country
```

**Summarising** condenses data into key statistics:

```
df['age'].mean()         # average age
df['salary'].max()       # highest salary
df['age'].value_counts() # count at each age
```

These look simple but they're powerful. What's the average salary per department? Which products have the highest defect rate? How many customers bought something last month? Real machine learning work is mostly these operations: load, filter, group, summarise, clean, prepare, train. That's the loop.

## Why Both Libraries Appear in Every AI Project

NumPy handles numerical operations at scale. When a model trains, it's doing millions of NumPy operations underneath. When you evaluate performance, you use NumPy to compute accuracy, loss, and other metrics - the ones explained in the [model evaluation](https://johnb.io/course/model-evaluation) lesson.

Pandas handles the human side. Real data is messy - CSVs with missing values, wrong column types, duplicates. Pandas lets you explore, clean, and prepare before anything goes near a model.

Whether you're training with scikit-learn, [TensorFlow, or PyTorch](https://johnb.io/course/tensorflow-pytorch-keras), you'll use both. They're not optional extras. They're part of the pipeline.

The learning curve isn't steep. You need maybe 20 Pandas functions to be productive: `read_csv`, `head`, `info`, `describe`, boolean indexing, `groupby`, `agg`, `dropna`, `fillna`. Learn those and you can handle most data preparation tasks. You'll pick up others as you need them. The harder skill is learning to think systematically about what your data actually contains and what it means. That thinking is also what separates good from mediocre work in [Python for AI](https://johnb.io/course/python-essentials-for-ai).

## How It Works

1. **Step.** NumPy achieves its speed through vectorisation. Instead of executing a Python loop (which has interpreter overhead per iteration), NumPy operations are compiled C code that applies to the entire array in a single call. A NumPy operation on a million-element array can be hundreds of times faster than an equivalent Python loop.
2. **Step.** Pandas DataFrames are built on top of NumPy arrays. Each column is stored as a typed NumPy array under the hood. The DataFrame layer adds the column names, index, and the higher-level API for grouping, merging, and reshaping. When you call `groupby().mean()`, Pandas is ultimately delegating to NumPy operations on the underlying arrays.

## Key Points

- NumPy arrays are optimised for numerical operations - faster than Python lists for large datasets.
- Operations like `array + 10` or `array.mean()` apply to the entire array at once (vectorisation).
- Machine learning datasets and model weights are stored as NumPy arrays.
- Pandas DataFrames are spreadsheet-like tables with named columns, built on top of NumPy.
- Key Pandas operations: load (`read_csv`), inspect (`head`, `info`, `describe`), filter, group, summarise, handle missing values.
- Real ML work is mostly data preparation: load, explore, clean, and prepare before training.
- Both libraries are part of every ML pipeline regardless of the framework used (scikit-learn, TensorFlow, PyTorch).
- Learn ~20 Pandas functions and you're productive for most data prep tasks.

## Frequently Asked Questions

### What is NumPy and why is it used in AI?

NumPy (Numerical Python) is a library for working with arrays of numbers. It's used in AI because it performs numerical operations much faster than standard Python lists - it processes entire arrays at once rather than looping through items. Machine learning datasets and model weights are arrays of numbers, so NumPy is the foundation of nearly every AI pipeline.

### What is a Pandas DataFrame?

A Pandas DataFrame is a table-like data structure with named columns and rows, similar to a spreadsheet. Each column can hold a different type of data (numbers, text, dates). DataFrames make it easy to load, inspect, filter, group, and clean data before passing it to a machine learning model.

### What is the difference between NumPy and Pandas?

NumPy is optimised for pure numerical operations on arrays. Pandas builds on NumPy and adds structure for working with labelled, mixed-type data. NumPy is what happens inside models during training. Pandas is what you use to load, explore, and clean your data before it goes anywhere near a model.

### Is NumPy and Pandas hard to learn?

Not particularly. Pandas has many functions but you only need around 20 to be productive: how to load data (read_csv), inspect it (head, info, describe), filter it (boolean indexing), group and summarise it (groupby, agg), and handle missing values (dropna, fillna). NumPy basics are straightforward for array creation and arithmetic. The harder skill is thinking systematically about your data.

## Sources & Primary References

1. Harris, C.R. et al. (2020). Array programming with NumPy. *Nature*, 585, 357-362.
2. McKinney, W. (2010). Data Structures for Statistical Computing in Python. *Proceedings of the 9th Python in Science Conference*.
3. VanderPlas, J. (2016). *Python Data Science Handbook*. O'Reilly Media. (Open access at jakevdp.github.io)

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
