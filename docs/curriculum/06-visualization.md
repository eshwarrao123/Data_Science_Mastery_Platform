# Domain 6 — Data Visualization

| Field | Value |
|---|---|
| Course slug | `visualization` |
| Order | 6 |
| Category | Visualization |
| Difficulty | Beginner → Intermediate |
| Estimated hours | 12 |
| Prerequisites | Data Analysis (pandas DataFrames as data source) |

Charts that answer questions: matplotlib mechanics, seaborn statistics,
plotly interactivity, and the storytelling judgment on top.

## Learning outcomes

- Build and style the core chart types in matplotlib
- Use seaborn for fast statistical graphics
- Create interactive charts and a basic dashboard
- Choose the right chart for the question and audience
- Recognize and avoid misleading visualization patterns

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `matplotlib` | Matplotlib |
| 2 | `seaborn` | Seaborn |
| 3 | `plotly` | Plotly (Interactive) |
| 4 | `storytelling` | Storytelling with Data |

## Lessons — module `matplotlib`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 6.1 | Matplotlib Fundamentals | `matplotlib-fundamentals` | Beginner | 30 min | 60 | `data-analysis.pandas-core.pandas-dataframes` | figure/axes, plot anatomy, pyplot vs OO API | planned |
| 6.2 | Line, Bar & Scatter Plots | `line-bar-scatter` | Beginner | 30 min | 60 | `visualization.matplotlib.matplotlib-fundamentals` | core chart types, when each fits | planned |
| 6.3 | Histograms & Box Plots | `histograms-and-boxplots` | Beginner | 25 min | 60 | `visualization.matplotlib.line-bar-scatter` | distributions, bins, quartile reading | planned |
| 6.4 | Subplots & Figure Layout | `subplots-and-layout` | Intermediate | 30 min | 70 | `visualization.matplotlib.histograms-and-boxplots` | subplots grid, shared axes, small multiples | planned |
| 6.5 | Styling & Customization | `styling-and-customization` | Intermediate | 25 min | 60 | `visualization.matplotlib.subplots-and-layout` | labels, legends, annotations, styles | planned |

## Lessons — module `seaborn`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 6.6 | Seaborn for Statistical Visualization | `seaborn-statistical-viz` | Intermediate | 30 min | 70 | `visualization.matplotlib.matplotlib-fundamentals` | seaborn model, long-form data, themes | planned |
| 6.7 | Distribution Plots | `distribution-plots` | Intermediate | 25 min | 60 | `visualization.seaborn.seaborn-statistical-viz` | histplot, kdeplot, ecdf | planned |
| 6.8 | Categorical Plots | `categorical-plots` | Intermediate | 25 min | 60 | `visualization.seaborn.distribution-plots` | bar/box/violin/strip by category | planned |
| 6.9 | Heatmaps & Pair Plots | `heatmaps-and-pairplots` | Intermediate | 30 min | 70 | `visualization.seaborn.categorical-plots` | correlation heatmaps, pairplot scanning | planned |

## Lessons — module `plotly`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 6.10 | Plotly Express | `plotly-express` | Intermediate | 30 min | 70 | `visualization.matplotlib.matplotlib-fundamentals` | px API, hover data, facets | planned |
| 6.11 | Interactive Charts | `interactive-charts` | Intermediate | 30 min | 70 | `visualization.plotly.plotly-express` | zoom/hover/select, animation frames | planned |
| 6.12 | Dashboards with Dash (Intro) | `dashboards-intro` | Intermediate | 35 min | 80 | `visualization.plotly.interactive-charts` | layout, callbacks, dashboard thinking | planned |

## Lessons — module `storytelling`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 6.13 | Choosing the Right Chart | `choosing-the-right-chart` | Intermediate | 25 min | 60 | `visualization.matplotlib.line-bar-scatter` | chart-type decision tree, question mapping | planned |
| 6.14 | Designing for an Audience | `designing-for-an-audience` | Intermediate | 25 min | 70 | `visualization.storytelling.choosing-the-right-chart` | hierarchy, decluttering, executive vs technical | planned |
| 6.15 | Avoiding Misleading Visualizations | `misleading-visualizations` | Intermediate | 25 min | 70 | `visualization.storytelling.designing-for-an-audience` | axis truncation, cherry-picking, ethics | planned |
| 6.16 | 🏗 Project: Executive Visualization Dashboard | `project-visualization-dashboard` | Intermediate | 90 min | 300 | `visualization.storytelling.misleading-visualizations` | KPI dashboard, narrative, design review | planned |

Domain status: 0/16 implemented. Exercise ID prefix: `viz01`–`viz16`.
