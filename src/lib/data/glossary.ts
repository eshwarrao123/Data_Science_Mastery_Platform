import type { Glossary } from "../types";

/* Hover-tooltip definitions for dotted-underline terms in lesson theory. */
export const glossary: Glossary = {
  variable:
    "A named box in the computer's memory that stores a value you want to use later.",
  "data type":
    "The kind of value something is — a number, text, a true/false flag — which decides what you can do with it.",
  string: "Text data, wrapped in quotes. 'hello' and \"42\" are both strings.",
  integer: "A whole number with no decimal point, like 7 or -3.",
  float: "A number with a decimal point, like 3.14 or -0.5.",
  boolean: "A value that is either True or False. Used for yes/no decisions.",
  list: "Python's built-in ordered collection. It can hold anything and grow or shrink at any time.",
  array:
    "A fixed-type grid of numbers stored side-by-side in memory, making math on it extremely fast.",
  vectorization:
    "Applying one operation to an entire array at once instead of looping element by element.",
  DataFrame:
    "A 2-D table of data with labeled rows and columns — pandas' core structure.",
  Series:
    "A single labeled column of data in pandas. A DataFrame is a dict of Series.",
  index:
    "The row labels of a DataFrame or Series. Lets you look rows up by name, not just position.",
  NaN: "'Not a Number' — pandas' marker for a missing value in a dataset.",
  CSV: "Comma-Separated Values — a plain-text spreadsheet format, one row per line.",
  loop: "A block of code that repeats — once per item in a collection, or while a condition holds.",
  function:
    "A named, reusable block of code that takes inputs (arguments) and returns an output.",
  argument: "A value you pass into a function when you call it.",
  mutable: "Can be changed in place after creation. Lists are mutable.",
  immutable: "Cannot be changed after creation. Strings and tuples are immutable.",
  dtype: "The single data type shared by every element of a NumPy array.",
  broadcast:
    "NumPy's rule for stretching a smaller array across a bigger one so shapes line up during math.",
  median: "The middle value when the data is sorted — half above, half below.",
  mean: "The average: sum of the values divided by how many there are.",
  outlier:
    "A data point far away from the rest. It can be a data-entry error or the most interesting row in the set.",
  "null hypothesis":
    "The default assumption in a statistical test — usually 'there is no effect'.",
  "p-value":
    "The probability of seeing data at least this extreme if the null hypothesis were true.",
  overfitting:
    "When a model memorizes training data instead of learning the pattern — great in training, useless in production.",
  feature:
    "An input column your model learns from — e.g. 'age' or 'total_spend'.",
  label: "The answer column your model is trying to predict.",
  "train/test split":
    "Holding back part of your data so you can grade the model on rows it has never seen.",
  regression: "Predicting a continuous number, like a price or a temperature.",
  classification: "Predicting a category, like spam vs. not-spam.",
  clustering:
    "Grouping similar rows together without any labels to learn from.",
  epoch: "One full pass of the training data through a neural network.",
  embedding:
    "A list of numbers that captures the meaning of text, images, or items so similar things sit close together.",
  token:
    "A chunk of text (roughly a word-piece) that a language model reads and writes.",
  API: "A contract that lets one program ask another program to do something.",
  container:
    "A lightweight, portable box holding your app and everything it needs to run identically anywhere.",
  pipeline:
    "A fixed sequence of processing steps data flows through — clean, transform, model, output.",
  schema: "The defined structure of a table: its columns and their types.",
  "primary key": "A column that uniquely identifies each row in a table.",
  join: "Combining rows from two tables based on a matching column.",
  aggregation:
    "Collapsing many rows into one summary value — a sum, count, or average.",
  groupby:
    "Split rows into groups by a key, apply a calculation per group, combine the results.",
};
