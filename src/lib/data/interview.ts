import type { InterviewQuestion } from "../types";

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "iq_01",
    company: "Google",
    topic: "Pandas",
    difficulty: "Medium",
    title: "Compute rolling 7-day average",
    question: "Given a DataFrame with columns 'date' (datetime) and 'revenue' (float), write a query that adds a column 'revenue_7d_avg' containing the 7-day rolling average of revenue, sorted by date.",
    language: "python",
    starterCode: `import pandas as pd

# Sample data
df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=14),
    'revenue': [120, 135, 110, 145, 160, 130, 155,
                140, 125, 170, 180, 145, 160, 175]
})

# Your solution here
`,
    solutionCode: `import pandas as pd

df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=14),
    'revenue': [120, 135, 110, 145, 160, 130, 155,
                140, 125, 170, 180, 145, 160, 175]
})

df = df.sort_values('date')
df['revenue_7d_avg'] = df['revenue'].rolling(window=7).mean().round(2)
print(df[['date', 'revenue', 'revenue_7d_avg']].to_string(index=False))`,
    expectedOutput: `        date  revenue  revenue_7d_avg
2024-01-01      120             NaN
2024-01-02      135             NaN
2024-01-03      110             NaN
2024-01-04      145             NaN
2024-01-05      160             NaN
2024-01-06      130             NaN
2024-01-07      155          136.43
2024-01-08      140          139.29
2024-01-09      125          137.86
2024-01-10      170          146.43
2024-01-11      180          151.43
2024-01-12      145          149.29
2024-01-13      160          153.57
2024-01-14      175          156.43`,
    testCases: [
      { name: "rolling(7)", description: "Window size must be 7 days" },
      { name: "First 6 rows NaN", description: "Rolling window starts returning values only after 7 data points" },
    ],
  },
  {
    id: "iq_02",
    company: "Amazon",
    topic: "SQL",
    difficulty: "Medium",
    title: "Find second-highest salary per department",
    question: "Write a SQL query to find the second-highest salary in each department. Return department_id, employee_name, and salary. Exclude departments with fewer than 2 employees.",
    language: "sql",
    starterCode: `-- Table: employees(id, name, department_id, salary)
-- Write your SQL here

SELECT
  department_id,
  name,
  salary
FROM employees
-- TODO: add window function and filter`,
    solutionCode: `SELECT department_id, name, salary
FROM (
  SELECT
    department_id,
    name,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department_id
      ORDER BY salary DESC
    ) AS salary_rank
  FROM employees
) ranked
WHERE salary_rank = 2;`,
    expectedOutput: `department_id | name  | salary
--------------+-------+-------
           1  | Carol | 85000
           2  | Dave  | 72000`,
    testCases: [
      { name: "DENSE_RANK", description: "Use DENSE_RANK to handle ties correctly" },
      { name: "PARTITION BY dept", description: "Rank is scoped per department" },
    ],
  },
  {
    id: "iq_03",
    company: "Netflix",
    topic: "ML",
    difficulty: "Hard",
    title: "Explain precision vs recall tradeoff",
    question: "A fraud detection model flags 1000 transactions as fraudulent. Of these, 900 are genuinely fraudulent (true positives) and 100 are legitimate (false positives). There are 200 actual fraud cases that the model missed (false negatives).\n\nCalculate precision, recall, and F1 score. Should Netflix optimise for precision or recall here? Explain your reasoning.",
    language: "python",
    starterCode: `# Calculate the metrics
TP = 900
FP = 100
FN = 200

# TODO: Calculate precision, recall, F1
precision = ___
recall = ___
f1 = ___

print(f"Precision: {precision:.3f}")
print(f"Recall:    {recall:.3f}")
print(f"F1 Score:  {f1:.3f}")
`,
    solutionCode: `TP = 900
FP = 100
FN = 200

precision = TP / (TP + FP)
recall = TP / (TP + FN)
f1 = 2 * (precision * recall) / (precision + recall)

print(f"Precision: {precision:.3f}")
print(f"Recall:    {recall:.3f}")
print(f"F1 Score:  {f1:.3f}")
`,
    expectedOutput: `Precision: 0.900
Recall:    0.818
F1 Score:  0.857`,
    testCases: [
      { name: "Precision = TP/(TP+FP)", description: "900/1000 = 0.9" },
      { name: "Recall = TP/(TP+FN)", description: "900/1100 ≈ 0.818" },
    ],
  },
  {
    id: "iq_04",
    company: "Meta",
    topic: "Python",
    difficulty: "Easy",
    title: "Find duplicates in a list",
    question: "Write a Python function `find_duplicates(lst)` that returns a sorted list of values that appear more than once. Do not use any imported libraries.",
    language: "python",
    starterCode: `def find_duplicates(lst):
    # Your solution here
    pass

# Tests
print(find_duplicates([1, 2, 3, 2, 4, 3, 5]))  # [2, 3]
print(find_duplicates([10, 20, 30]))             # []
print(find_duplicates([1, 1, 1, 2]))             # [1]
`,
    solutionCode: `def find_duplicates(lst):
    counts = {}
    for item in lst:
        counts[item] = counts.get(item, 0) + 1
    return sorted([k for k, v in counts.items() if v > 1])

print(find_duplicates([1, 2, 3, 2, 4, 3, 5]))
print(find_duplicates([10, 20, 30]))
print(find_duplicates([1, 1, 1, 2]))
`,
    expectedOutput: `[2, 3]
[]
[1]`,
    testCases: [
      { name: "Basic duplicates", description: "[1,2,3,2,4,3,5] → [2,3]" },
      { name: "No duplicates", description: "[10,20,30] → []" },
      { name: "Multiple occurrences", description: "[1,1,1,2] → [1] (not [1,1])" },
    ],
  },
  {
    id: "iq_05",
    company: "Uber",
    topic: "Statistics",
    difficulty: "Hard",
    title: "A/B test significance",
    question: "You run an A/B test on Uber's surge pricing copy. Control (A): 10,000 rides, 1,200 accepted surge. Treatment (B): 10,000 rides, 1,350 accepted surge. Is the result statistically significant at α=0.05?\n\nConduct a two-proportion z-test and interpret the result.",
    language: "python",
    starterCode: `import math

# Group A
n_a = 10000
x_a = 1200  # successes

# Group B
n_b = 10000
x_b = 1350

# TODO: Calculate pooled proportion, z-statistic, and determine significance
p_a = x_a / n_a
p_b = x_b / n_b
p_pool = ___
z = ___
significant = abs(z) > 1.96

print(f"p_A = {p_a:.4f}")
print(f"p_B = {p_b:.4f}")
print(f"Z-stat = {z:.4f}")
print(f"Significant: {significant}")
`,
    solutionCode: `import math

n_a, x_a = 10000, 1200
n_b, x_b = 10000, 1350

p_a = x_a / n_a
p_b = x_b / n_b
p_pool = (x_a + x_b) / (n_a + n_b)
se = math.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
z = (p_b - p_a) / se
significant = abs(z) > 1.96

print(f"p_A = {p_a:.4f}")
print(f"p_B = {p_b:.4f}")
print(f"Z-stat = {z:.4f}")
print(f"Significant: {significant}")
`,
    expectedOutput: `p_A = 0.1200
p_B = 0.1350
Z-stat = 3.2026
Significant: True`,
    testCases: [
      { name: "Pooled proportion", description: "(1200+1350)/20000 = 0.1275" },
      { name: "Z > 1.96", description: "Reject null hypothesis at α=0.05" },
    ],
  },
];
