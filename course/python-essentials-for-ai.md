# Python Essentials for AI

> Core Python data structures, functions, comprehensions and environment management required for machine learning workflows.

- **Canonical URL**: https://johnb.io/course/python-essentials-for-ai
- **Markdown URL**: https://johnb.io/course/python-essentials-for-ai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 4
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

Everyone says Python is beginner-friendly. That's true but incomplete. Here's what you actually need to know about Python before you touch any machine learning library - and what you can safely skip.

Python didn't become the dominant AI language just because it's easy to learn. There are real structural reasons. Understanding them helps you understand why the Python you learn here transfers directly to ML work - and what you can skip.

## Why Python Became the Language of AI

The math libraries came early. [NumPy and SciPy](https://johnb.io/course/numpy-pandas) were built in the 2000s when AI research was getting serious. They made numerical computing efficient in Python - which shouldn't be possible, because Python is slow. But these libraries run C under the hood, so they're actually fast. Once those existed, everything else could build on top.

Then academic researchers adopted Python. Machine learning papers came with code in Python. Everyone who wanted to replicate results learned Python. Momentum is everything, and Python had it.

Honest take: you don't strictly need Python to do AI. You can do it in R, Julia, or JavaScript. The tools are better in Python because everyone uses Python. If everyone switched to R tomorrow, R would become just as good. But if you're starting from nothing, learn Python. The ecosystem is there, the examples are there, and you'll find answers when you're stuck.

## Variables and Data Types

A variable is a container for information. You put something in, give it a name, and later ask for it by name.

```
price = 19.99
name = "Alice"
is_available = True
```

`price` holds a number. `name` holds text. `is_available` holds a true/false value. Python figures out the type from what you put in - you don't have to declare it.

Why does this matter for AI? Because data comes in types. A feature in your model might be a number (age, income) or text (country, category). A model expects numbers, so if you have text categories, you have to convert them first. Knowing your data types is where that process starts.

Python's core types:

**Integers** and **floats** are numbers. Integers are whole (5). Floats have decimals (5.2). In AI work, you'll mostly use floats because real-world measurements are rarely whole numbers.

**Strings** are text. When you're working with categorical data ("red", "blue", "green"), you're working with strings, and you'll eventually convert them to numbers so a model can use them.

**Booleans** are true/false. They're useful for filtering: "show me all rows where age > 18" produces a list of true/false values you then use to filter your data.

## Lists and Dictionaries: How Data Gets Organised

A list is an ordered collection. You create it with square brackets.

```
ages = [25, 30, 22, 45]
temperatures = [72.5, 68.3, 75.1]
```

You access items by their position (starting from 0):

```
ages[0]  # gives you 25
ages[2]  # gives you 22
```

In AI, datasets are often lists. A column in a spreadsheet becomes a list. You loop through it, do something with each item, and build results. Lists are everywhere.

A dictionary is unordered, but items have names. You create it with curly braces.

```
person = {
    "name": "Alice",
    "age": 28,
    "city": "Portland"
}
```

You access items by their key:

```
person["name"]  # gives you "Alice"
person["age"]   # gives you 28
```

Real data has structure. A row in a dataset isn't just a list of numbers - it's "this person has age 28, income 50000, and education level 3." Dictionaries let you organise that logically. In [pandas](https://johnb.io/course/numpy-pandas), dictionaries become DataFrames. Understanding them now makes DataFrames make sense later.

## Loops and Conditionals: The Logic of Programming

A loop repeats code. The simplest is a `for` loop.

```
ages = [25, 30, 22, 45]
for age in ages:
    print(age)
```

This prints each age, one per line. You've written code once but applied it to every item. In AI, this is how you process data - loop through a list of records, and for each one you clean it, validate it, or extract features from it.

A conditional makes decisions:

```
if age > 30:
    print("Over 30")
else:
    print("30 or under")
```

Combine loops and conditionals and you can do real work:

```
ages = [25, 30, 22, 45, 28]
older_people = []

for age in ages:
    if age > 30:
        older_people.append(age)
```

Now `older_people` contains only `[45]`. You've filtered a list based on a condition. In machine learning, you'll write loops that load training examples, check if they're valid, extract features, and feed them to the model. This is how models learn - one piece of data at a time, in a loop.

## A Worked Example: Building a Feature from Raw Data

Say you have customer data: names, ages, and annual spending. You want to create a feature called `high_value` that's true if someone spent more than £1000.

```
customers = [
    {"name": "Alice", "age": 28, "spending": 1500},
    {"name": "Bob", "age": 35, "spending": 800},
    {"name": "Charlie", "age": 22, "spending": 2000}
]

for customer in customers:
    if customer["spending"] > 1000:
        customer["high_value"] = True
    else:
        customer["high_value"] = False
```

Now each customer has a `high_value` field. This is the kind of work you do constantly in ML. Raw data comes in, you create features, and you feed those features to a model.

This example uses everything above: a list of dictionaries, a loop, a conditional, and a comparison. That's the core of data processing.

## How Deep Do You Actually Need to Go?

You need to be comfortable with the basics - variables, lists, loops, conditionals. You need to understand what code is doing. But you don't need to be a Python expert.

I've seen people do serious ML work without understanding object-oriented programming, decorators, or metaclasses. Those are advanced Python features you probably won't need. What you will need is the ability to read code, debug simple problems, and write basic scripts that manipulate data.

The mistake beginners make is thinking they need to learn Python perfectly before touching ML. You don't. Learn the basics, then jump into [NumPy and pandas](https://johnb.io/course/numpy-pandas). You'll learn the rest as you need it.

## How It Works

1. **Step.** Python is an interpreted language, meaning code runs line by line rather than being compiled before execution. Each variable you create is stored in memory under a name, and Python dynamically assigns a type based on the value you provide.
2. **Step.** Lists are stored as contiguous blocks of references in memory, making index-based access fast. Dictionaries use a hash table internally - Python converts the key into a number (a hash), uses that to find the storage location, and returns the value. This makes dictionary lookup very fast regardless of how many items are in it.
3. **Step.** For loops iterate through sequences by requesting items one at a time. The loop body runs once per item, and Python manages the iteration automatically. This is the same pattern used internally by pandas when processing DataFrame columns - which is why understanding Python loops helps you understand what pandas is doing under the hood.

## Key Points

- Python dominates AI because NumPy/SciPy gave it fast numerical computing early, and academic researchers built momentum around it
- Variables store data; Python infers the type automatically from what you assign
- Floats (decimal numbers) are more common than integers in AI because real-world measurements are rarely whole numbers
- Lists are ordered collections accessed by position; dictionaries are named collections accessed by key
- For loops let you apply the same operation to every item in a list - the core pattern for processing training data
- You don't need advanced Python (OOP, decorators, metaclasses) for most machine learning work
- The goal isn't to master Python first - learn the basics and dive into pandas and NumPy, picking up extra Python as you need it

## Frequently Asked Questions

### Why do AI developers use Python instead of other languages?

Python became dominant in AI for three reasons: the core math libraries (NumPy, SciPy) were built early and are fast because they run C under the hood; academic researchers adopted Python and published their code in it, creating momentum; and Python is genuinely readable, which matters when you're debugging models. You could do AI in R or Julia, but the tools and examples are all in Python, so that's where you'll find answers when stuck.

### What Python concepts do you actually need for machine learning?

You need variables and data types (integers, floats, strings, booleans), lists and dictionaries for organising data, for loops to process records, and if/else conditionals to make decisions. You don't need object-oriented programming, decorators, or metaclasses for most ML work. Learn the basics, then jump into pandas and NumPy - you'll pick up anything else as you need it.

### What is the difference between a Python list and a dictionary?

A list is an ordered collection accessed by position: `ages[0]` gives you the first item. A dictionary is a collection where each item has a name (key): `person['age']` gives you the age. In machine learning, lists represent columns of data (a list of values), while dictionaries represent individual records (a row with named fields). Understanding both is essential because pandas DataFrames are built on top of them.

### Do you need to be an expert in Python before learning machine learning?

No. You need to be comfortable with the basics - variables, lists, loops, conditionals - and able to read and debug simple scripts. The mistake beginners make is thinking they need to master Python before touching ML. Learn the basics, then jump into pandas and NumPy. You'll learn the rest as you need it.

## Sources & Primary References

1. [Python Official Tutorial](https://docs.python.org/3/tutorial/index.html) - the definitive beginner reference for Python
2. [NumPy for Absolute Beginners](https://numpy.org/doc/stable/user/absolute_beginners.html) - official NumPy introduction
3. [Pandas Getting Started Tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html) - official pandas introduction
4. [Scikit-learn Getting Started](https://scikit-learn.org/stable/getting_started.html) - the main ML library built on NumPy and pandas

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
