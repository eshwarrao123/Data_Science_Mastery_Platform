import type { Lesson } from "@/lib/curriculum/types";

export const packageManagement: Lesson = {
  meta: {
    id: "python.python-ds-tools.package-management",
    slug: "package-management",
    title: "Package Management (pip, venv, conda)",
    description:
      "How NumPy and pandas actually reach your machine: pip installs, virtual environments that isolate projects, requirements.txt that makes work reproducible, and where conda fits.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["python.foundations.variables-and-data-types"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "ModuleNotFoundError: No module named 'pandas'. Every data scientist has hit this wall — and half the fixes people try (reinstalling Python, sudo pip, copying files around) make it worse. The actual fix is a mental model: where packages live, who installs them, and why each project deserves its own sealed box.",
        what: "pip is Python's installer — it downloads packages from PyPI (the Python Package Index) into an environment. A virtual environment (venv) is an isolated folder holding one project's Python + packages. requirements.txt is the manifest that lets anyone rebuild that environment. conda is an alternative installer + environment manager popular in data science.",
        why: "The data stack is third-party code: NumPy, pandas, matplotlib, scikit-learn — none ship with Python. Without isolation, projects fight over versions (project A needs pandas 1.x, project B needs 2.x) and 'works on my machine' becomes your job title. Environments + manifests turn setup from folklore into one command.",
        whereUsed:
          "Starting any project, onboarding teammates, deploying jobs to servers, reproducing a colleague's analysis, and every Dockerfile and CI pipeline you'll ever read.",
        objectives: [
          "Explain what pip installs and where packages actually go",
          "Create and activate a venv, and know when it's active",
          "Freeze dependencies into requirements.txt and rebuild from it",
          "Diagnose ModuleNotFoundError as an environment question, not a code bug",
          "Know when conda is the better tool and when it isn't",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Thousands of isolated notebook environments",
            detail:
              "Netflix's internal notebook platform provisions a dedicated dependency environment per project so a data scientist upgrading pandas can't break a colleague's recommendation model.",
          },
          {
            company: "Anaconda",
            headline: "conda built for the scientific stack",
            detail:
              "conda exists because early NumPy/SciPy builds needed compiled C and Fortran libraries pip couldn't ship; conda packages the binaries too, which is why it dominates in heavy scientific computing.",
          },
          {
            company: "GitHub",
            headline: "requirements.txt as onboarding",
            detail:
              "Open any popular data science repo: setup is 'create a venv, pip install -r requirements.txt'. The manifest file IS the onboarding doc — new contributors are running in minutes.",
          },
        ],
      },
    },

    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "text",
          content:
            "Python's superpower is its ecosystem: PyPI hosts over half a million packages, and pip is the client that fetches them. pip install pandas downloads pandas (and everything pandas itself needs — NumPy, dateutil, pytz) into your environment's site-packages folder. From then on, import pandas finds it. The key question behind every install problem: WHICH environment did it land in?",
        },
        {
          type: "code-note",
          code: "# Terminal, not Python — these are shell commands\npython -m venv .venv          # create an isolated environment in .venv/\nsource .venv/bin/activate     # activate it (Mac/Linux)\n# .venv\\Scripts\\activate      # activate it (Windows)\n\npip install pandas numpy      # installs INTO .venv only\npip list                      # see what's installed here",
          content:
            "python -m venv .venv creates a self-contained folder with its own Python and its own site-packages. Activating it rewires your shell so python and pip point inside that folder. The (.venv) prefix in your prompt is the tell that it's active. Deactivate with the deactivate command.",
        },
        {
          type: "analogy",
          title: "A toolbox per job site",
          content:
            "Installing everything globally is one communal toolbox for every job site: the plumber swaps in a metric wrench set and the electrician's imperial project breaks. A venv is a per-site toolbox: each project gets exactly the tools (and tool VERSIONS) it needs, sealed in its own box. requirements.txt is the packing list taped to the lid — hand it to anyone and they can assemble an identical box. Nobody's job breaks because of someone else's tools.",
        },
        {
          type: "keypoint",
          title: "requirements.txt: the reproducibility contract",
          content:
            "pip freeze > requirements.txt writes every installed package with its exact version (pandas==2.2.1). pip install -r requirements.txt rebuilds that set anywhere — teammate's laptop, CI server, production. This one file is the difference between 'clone and run' and a week of version archaeology. Commit it to git; regenerate it when you add or upgrade packages.",
        },
        {
          type: "code-note",
          code: "# requirements.txt — exact pins from pip freeze\nnumpy==1.26.4\npandas==2.2.1\npython-dateutil==2.9.0\npytz==2024.1\n\n# rebuild anywhere:\n# pip install -r requirements.txt",
          content:
            "Note that pandas' own dependencies appear too — freeze captures the whole tree. The == pins mean everyone gets identical versions. Looser specs exist (pandas>=2.0) and trade reproducibility for flexibility; for analyses you want to reproduce, exact pins win.",
        },
        {
          type: "keypoint",
          title: "Diagnosing ModuleNotFoundError",
          content:
            "It is almost never 'Python is broken.' The import failed because the RUNNING interpreter's environment lacks the package. Check three things: 1) is your venv active (prompt prefix)? 2) does pip list show the package HERE? 3) is the script running with the same interpreter you installed into (an IDE pointed at the wrong environment is the classic cause)? python -m pip install ... sidesteps a whole class of mismatch by guaranteeing pip belongs to the python you're invoking.",
        },
        {
          type: "expandable",
          title: "Where conda fits",
          content:
            "conda is both an installer and an environment manager (conda create -n proj python=3.11 pandas), and its packages bundle compiled non-Python libraries — historically crucial for NumPy/SciPy, still valuable for GPU stacks (CUDA), geospatial (GDAL), and other binary-heavy dependencies. Modern pip wheels have closed much of the gap for mainstream packages. Practical guidance: venv + pip is the lightweight default and what most production deployments use; conda (or its faster sibling mamba) shines when a dependency won't pip-install cleanly on your OS. Do not mix installers inside one environment casually — pick one per project. You may also meet Poetry, pipenv, and uv: same concepts (environment + lockfile), different ergonomics.",
        },
        {
          type: "warning",
          title: "Habits that prevent environment pain",
          content:
            "1) One venv per project, created in the project folder as .venv (and .gitignore it — commit requirements.txt, never the environment itself). 2) Never sudo pip install — installing into the system Python can break OS tools. 3) Never install into the global Python 'just this once' — that's how version conflicts start. 4) After adding a package, refresh requirements.txt in the same commit as the code that needs it. 5) When an environment gets confused, deleting .venv and rebuilding from requirements.txt is cheap and safe — that's the point of the manifest.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "From PyPI to import pandas",
        caption:
          "The supply chain of a package: index → installer → environment → your script. Click each stage.",
        nodes: [
          {
            id: "pypi",
            label: "PyPI",
            sublabel: "the package index",
            detail:
              "The public warehouse of Python packages — over half a million projects. pip downloads from here by default. conda uses its own channels (defaults, conda-forge) instead.",
            x: 15,
            y: 15,
            accent: false,
          },
          {
            id: "pip",
            label: "pip install pandas",
            sublabel: "the installer",
            detail:
              "Resolves the dependency tree (pandas needs numpy, dateutil, pytz), downloads wheels, and unpacks them into the ACTIVE environment's site-packages. python -m pip guarantees it's the right environment's pip.",
            x: 50,
            y: 15,
            accent: true,
          },
          {
            id: "venv",
            label: ".venv/",
            sublabel: "isolated environment",
            detail:
              "A folder with its own python and site-packages. Activation rewires the shell to use it. One per project = no version fights between projects. Delete and rebuild freely — the manifest makes it disposable.",
            x: 85,
            y: 15,
            accent: false,
          },
          {
            id: "script",
            label: "import pandas",
            sublabel: "your code",
            detail:
              "The import searches the running interpreter's site-packages. ModuleNotFoundError = the running environment lacks the package — an environment question, not a code bug.",
            x: 85,
            y: 65,
            accent: false,
          },
          {
            id: "reqs",
            label: "requirements.txt",
            sublabel: "the manifest",
            detail:
              "pip freeze captures exact versions out; pip install -r replays them in. Commit this file — it turns your environment from personal folklore into a reproducible artifact.",
            x: 50,
            y: 65,
            accent: false,
          },
          {
            id: "teammate",
            label: "teammate / server / CI",
            sublabel: "reproduction",
            detail:
              "Anyone with the manifest rebuilds an identical environment in two commands: python -m venv .venv && pip install -r requirements.txt. This is how analyses travel between machines.",
            x: 15,
            y: 65,
            accent: false,
          },
        ],
        edges: [
          { from: "pypi", to: "pip", label: "downloads from" },
          { from: "pip", to: "venv", label: "installs into" },
          { from: "venv", to: "script", label: "serves imports" },
          { from: "venv", to: "reqs", label: "pip freeze" },
          { from: "reqs", to: "teammate", label: "pip install -r" },
        ],
      },
    },

    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Which Python am I running?",
          scenario:
            "The first diagnostic for any environment confusion — ask Python where it lives and what it can import.",
          steps: [
            {
              code: "import sys\n\nprint(sys.executable)\nprint(sys.version.split()[0])",
              explanation:
                "sys.executable is the exact interpreter path — if it points inside .venv, your venv is live; if it points at a system path, your install and your run are probably different environments. This one print solves most 'but I installed it!' mysteries.",
            },
          ],
          output: "/home/ada/project/.venv/bin/python\n3.11.9",
        },
        {
          difficulty: "Easy",
          title: "Prove a package is (or isn't) available",
          scenario:
            "Check for a dependency at runtime and fail with a helpful message instead of a bare traceback.",
          steps: [
            {
              code: "try:\n    import pandas\n    print(f'pandas {pandas.__version__} ready')\nexcept ModuleNotFoundError:\n    print('pandas missing — activate the venv and run: pip install -r requirements.txt')",
              explanation:
                "The try/except from the error-handling module, aimed at imports. __version__ tells you WHICH pandas — version mismatches cause subtler bugs than absence. Real scripts often print exactly this at startup.",
            },
          ],
          output: "pandas 2.2.1 ready",
        },
        {
          difficulty: "Medium",
          title: "A project's full setup, start to finish",
          scenario:
            "The exact terminal session that starts every well-run data project — worth memorizing as a unit.",
          steps: [
            {
              code: "# terminal (Mac/Linux; Windows: .venv\\Scripts\\activate)\n# mkdir sales-analysis && cd sales-analysis\n# python -m venv .venv\n# source .venv/bin/activate\n# pip install pandas matplotlib\n# pip freeze > requirements.txt\nprint('project initialized')",
              explanation:
                "Create folder → create venv → activate → install → freeze. Five commands and the project is isolated AND documented. The (.venv) prompt prefix confirms activation before any install.",
            },
            {
              code: "# .gitignore should contain:\n# .venv/\n# committed to git: your code + requirements.txt\nprint('commit code + requirements.txt, never .venv/')",
              explanation:
                "The environment is a build artifact — hundreds of megabytes of rebuildable files. The manifest is the source of truth. Committing .venv is the package-management equivalent of committing compiled binaries.",
            },
          ],
          output:
            "project initialized\ncommit code + requirements.txt, never .venv/",
        },
        {
          difficulty: "Hard",
          title: "Reading a version conflict",
          scenario:
            "Two projects, one shared global Python — the failure isolation prevents. Watch it happen in miniature.",
          steps: [
            {
              code: "installed = {'pandas': '1.5.3'}\n\nproject_a_needs = {'pandas': '1.5.3'}\nproject_b_needs = {'pandas': '2.2.1'}\n\nfor name, need in project_b_needs.items():\n    have = installed.get(name)\n    print(f'B needs {name}=={need}, global has {have}')",
              explanation:
                "Project B upgrades global pandas to 2.2.1 to fix this... and project A — written against 1.x APIs — starts failing in ways nobody connects to B's upgrade last Tuesday. Shared mutable state, the environment edition.",
            },
            {
              code: "envs = {\n    'a/.venv': {'pandas': '1.5.3'},\n    'b/.venv': {'pandas': '2.2.1'},\n}\nfor env, pkgs in envs.items():\n    print(f'{env}: pandas=={pkgs[\"pandas\"]}')",
              explanation:
                "With one venv per project, both versions coexist on the same machine, each project pinned by its own requirements.txt. The 'conflict' stops existing — there is no shared state to fight over.",
            },
          ],
          output:
            "B needs pandas==2.2.1, global has 1.5.3\na/.venv: pandas==1.5.3\nb/.venv: pandas==2.2.1",
        },
        {
          difficulty: "Industry Example",
          title: "Reproducing a teammate's analysis",
          scenario:
            "A colleague shares a repo: analysis.py + requirements.txt. This is the professional round-trip — their environment, rebuilt on your machine, byte-for-byte versions.",
          steps: [
            {
              code: "manifest = \"\"\"numpy==1.26.4\npandas==2.2.1\npython-dateutil==2.9.0\"\"\"\n\nfor line in manifest.strip().split('\\n'):\n    name, version = line.split('==')\n    print(f'installing {name} {version}')",
              explanation:
                "What pip install -r does conceptually: read each pin, fetch that exact version. Because versions are exact, your rebuilt environment matches theirs — same numbers out of the same code.",
            },
            {
              code: "# the actual commands on your machine:\n# git clone <repo> && cd <repo>\n# python -m venv .venv && source .venv/bin/activate\n# pip install -r requirements.txt\n# python analysis.py\nprint('environment rebuilt; analysis runs identically')",
              explanation:
                "Four lines from clone to running code. When results MUST match (regulated industries, published research), teams pin further — Python version via .python-version files, OS via Docker — but the requirements.txt habit is the foundation of all of it.",
            },
          ],
          output:
            "installing numpy 1.26.4\ninstalling pandas 2.2.1\ninstalling python-dateutil 2.9.0\nenvironment rebuilt; analysis runs identically",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "env_doctor.py",
        instructions:
          "Build a tiny environment doctor: given required = {'numpy': '1.26.4', 'pandas': '2.2.1', 'matplotlib': '3.8.4'} and installed = {'numpy': '1.26.4', 'pandas': '2.0.0'}, report each requirement as OK (versions match), WRONG VERSION (present but different), or MISSING. Finish by printing the pip command to fix the gaps: pip install followed by each non-OK 'name==version' pin, space-separated, in the dict's order.",
        starterCode: `required = {'numpy': '1.26.4', 'pandas': '2.2.1', 'matplotlib': '3.8.4'}
installed = {'numpy': '1.26.4', 'pandas': '2.0.0'}

# TODO 1: for each required package, print '<name>: OK',
# '<name>: WRONG VERSION (have <v>, need <v>)', or '<name>: MISSING'
___

# TODO 2: collect non-OK pins as 'name==version' and print
# 'fix: pip install <pins joined by spaces>'
___`,
        solutionCode: `required = {'numpy': '1.26.4', 'pandas': '2.2.1', 'matplotlib': '3.8.4'}
installed = {'numpy': '1.26.4', 'pandas': '2.0.0'}

to_fix = []
for name, need in required.items():
    have = installed.get(name)
    if have == need:
        print(f'{name}: OK')
    elif have is None:
        print(f'{name}: MISSING')
        to_fix.append(f'{name}=={need}')
    else:
        print(f'{name}: WRONG VERSION (have {have}, need {need})')
        to_fix.append(f'{name}=={need}')

print(f"fix: pip install {' '.join(to_fix)}")`,
        expectedOutput:
          "numpy: OK\npandas: WRONG VERSION (have 2.0.0, need 2.2.1)\nmatplotlib: MISSING\nfix: pip install pandas==2.2.1 matplotlib==3.8.4",
        hints: [
          "installed.get(name) returns None for missing packages — the .get default from the dictionaries lesson",
          "Three branches: have == need → OK; have is None → MISSING; else → WRONG VERSION",
          "Append f'{name}=={need}' to a list for both non-OK cases",
          "' '.join(to_fix) assembles the pip command's arguments",
        ],
      },
    },

    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "py32_mcq_01",
          difficulty: "Easy",
          question: "What does pip install pandas actually do?",
          options: [
            "Adds pandas to the Python language",
            "Downloads pandas and its dependencies from PyPI and unpacks them into the active environment's site-packages, where import can find them",
            "Compiles pandas from source every time",
            "Installs pandas for every Python on the machine",
          ],
          correctIndex: 1,
          explanation:
            "pip is a downloader + unpacker targeting ONE environment — whichever is active. That 'whichever is active' clause is the root of most install confusion.",
        },
        {
          type: "mcq",
          id: "py32_mcq_02",
          difficulty: "Easy",
          question: "Why create a virtual environment per project?",
          options: [
            "Python requires it",
            "It makes code run faster",
            "Each project gets its own isolated package versions, so upgrading a library for one project can't break another",
            "It encrypts your dependencies",
          ],
          correctIndex: 2,
          explanation:
            "A global install is shared mutable state between projects. Isolation means project A's pandas 1.x and project B's pandas 2.x coexist peacefully on one machine.",
        },
        {
          type: "mcq",
          id: "py32_mcq_03",
          difficulty: "Medium",
          question:
            "You ran pip install pandas successfully, but your script still raises ModuleNotFoundError. Most likely cause?",
          options: [
            "pandas is broken",
            "The script is running under a different interpreter/environment than the one pip installed into — check sys.executable and whether the venv is active",
            "You must restart the computer",
            "requirements.txt is missing",
          ],
          correctIndex: 1,
          explanation:
            "Install and run must target the SAME environment. IDEs pointed at a different interpreter are the classic culprit; python -m pip install ties the install to a specific python.",
        },
        {
          type: "scenario",
          id: "py32_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate clones your analysis repo, creates a venv, and asks 'now what do I install?' Your repo contains only .py files — you've been installing packages as needed and never wrote them down.",
          question: "What was missing from your workflow?",
          options: [
            "You should have committed your .venv folder",
            "pip freeze > requirements.txt after each install — the committed manifest would let them run pip install -r requirements.txt and rebuild your exact environment",
            "You should have emailed them your site-packages",
            "They should guess from the import statements",
          ],
          correctIndex: 1,
          explanation:
            "The manifest is the reproducibility contract. Committing .venv ships megabytes of rebuildable artifacts; guessing from imports loses the VERSIONS, which is where the subtle bugs live.",
        },
        {
          type: "coding",
          id: "py32_code_01",
          difficulty: "Medium",
          prompt:
            "Given manifest = 'numpy==1.26.4\\npandas==2.2.1\\npytz==2024.1', parse each line and print '<name> pinned to <version>'. Expected:\nnumpy pinned to 1.26.4\npandas pinned to 2.2.1\npytz pinned to 2024.1",
          starterCode:
            "manifest = 'numpy==1.26.4\\npandas==2.2.1\\npytz==2024.1'\n# Your code here\n",
          solutionCode:
            "manifest = 'numpy==1.26.4\\npandas==2.2.1\\npytz==2024.1'\nfor line in manifest.split('\\n'):\n    name, version = line.split('==')\n    print(f'{name} pinned to {version}')",
          expectedOutput:
            "numpy pinned to 1.26.4\npandas pinned to 2.2.1\npytz pinned to 2024.1",
          tests: [
            {
              name: "Line iteration",
              description: "Splits the manifest on newlines and processes each line",
            },
            {
              name: "Pin parsing",
              description: "Splits each line on '==' into name and version",
            },
          ],
        },
        {
          type: "mcq",
          id: "py32_mcq_04",
          difficulty: "Hard",
          question: "When is conda the better choice over venv + pip?",
          options: [
            "Always — conda is newer",
            "Never — pip replaced it",
            "When dependencies include heavy compiled non-Python libraries (CUDA, GDAL, MKL) that pip wheels don't cover cleanly on your platform",
            "Only on Windows",
          ],
          correctIndex: 2,
          explanation:
            "conda packages ship non-Python binaries pip historically couldn't. Modern wheels cover mainstream packages fine, so venv + pip is the lightweight default; conda earns its weight when the binary stack gets exotic.",
        },
        {
          type: "coding",
          id: "py32_code_02",
          difficulty: "Hard",
          prompt:
            "Simulate an environment check: required = ['numpy', 'pandas', 'requests'], installed = {'numpy', 'pandas'}. Print '<name>: ok' or '<name>: MISSING' for each requirement in order, then 'environment ready' if nothing is missing or 'missing <n> package(s)' otherwise. Expected:\nnumpy: ok\npandas: ok\nrequests: MISSING\nmissing 1 package(s)",
          starterCode:
            "required = ['numpy', 'pandas', 'requests']\ninstalled = {'numpy', 'pandas'}\n# Your code here\n",
          solutionCode:
            "required = ['numpy', 'pandas', 'requests']\ninstalled = {'numpy', 'pandas'}\n\nmissing = 0\nfor name in required:\n    if name in installed:\n        print(f'{name}: ok')\n    else:\n        print(f'{name}: MISSING')\n        missing += 1\n\nif missing == 0:\n    print('environment ready')\nelse:\n    print(f'missing {missing} package(s)')",
          expectedOutput:
            "numpy: ok\npandas: ok\nrequests: MISSING\nmissing 1 package(s)",
          tests: [
            {
              name: "Set membership",
              description: "Uses 'in' against the installed set per requirement",
            },
            {
              name: "Summary logic",
              description: "Counts misses and branches the final line on the count",
            },
          ],
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "Walk me through how you set up the Python environment for a new data project, and why each step exists.",
          answer:
            "Create the project folder, then python -m venv .venv inside it — an isolated interpreter + site-packages so this project's versions can't collide with any other's. Activate it (source .venv/bin/activate, or Scripts\\activate on Windows) and confirm via the prompt prefix or sys.executable. Install with python -m pip install pandas numpy — the -m form guarantees pip belongs to the interpreter I'm using. Immediately pip freeze > requirements.txt and commit it alongside the code; add .venv/ to .gitignore because the environment is a rebuildable artifact, not source. From then on the loop is: add a package → refresh the manifest in the same commit. The payoff shows at handoff: any teammate, CI runner, or server rebuilds my exact environment with python -m venv .venv && pip install -r requirements.txt. If the environment ever gets into a weird state, I delete .venv and rebuild from the manifest — two minutes, zero risk, which is precisely the property the manifest exists to provide.",
        },
        {
          question:
            "A script that worked last month now crashes with an AttributeError inside pandas. Nothing in the script changed. What's your diagnosis path?",
          answer:
            "Unchanged code + new failure points at a changed ENVIRONMENT. First: was this running in a pinned venv, or against a global/shared Python someone may have upgraded? Check pandas.__version__ (and sys.executable to confirm which environment is even running) against what the code was written for — an AttributeError inside a library is the classic symptom of an API that moved between major versions, e.g. pandas 1.x methods removed in 2.x. If there's a requirements.txt, diff pip freeze against it: any drift means the environment no longer matches the contract, and pip install -r requirements.txt (or rebuilding the venv from scratch) restores it. If there ISN'T a manifest, that's the root cause — the fix is to pin the working versions once found, so this class of failure becomes impossible. The general principle I'd state: 'nothing changed' almost never includes the environment, so version-drift is hypothesis #1 whenever untouched code breaks — and pinned, per-project environments are the prevention, not better debugging.",
        },
        {
          question:
            "What problem do virtual environments actually solve, and what happens on teams that skip them?",
          answer:
            "They solve shared mutable state at the dependency level. One global site-packages means every project reads and writes the same package set: project B upgrading pandas to 2.x silently breaks project A written against 1.x, installing a new tool pulls transitive dependencies that conflict with existing ones, and on some systems sudo pip installs can break OS tooling that depends on the system Python. Teams that skip isolation accumulate the symptoms: 'works on my machine' disputes (each laptop has a unique, undocumented package soup), onboarding measured in days of dependency archaeology, un-reproducible analyses (nobody knows which versions produced last quarter's numbers), and fear-driven ops — nobody dares upgrade anything because the blast radius is unknown. Environments make dependencies per-project and DISPOSABLE (delete and rebuild from the manifest), and the manifest makes them reproducible across machines and time. The same idea scales up the stack: Docker images and lockfile tools (Poetry, uv) are the industrial-strength versions of venv + requirements.txt — same principle, stronger guarantees.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Installing into whatever Python is ambient — always check the venv is active first. 2) sudo pip install — can break system tools; never needed with venvs. 3) Committing .venv/ to git — commit requirements.txt instead. 4) Installing packages and never freezing — the manifest drifts from reality. 5) Mixing conda install and pip install in one environment carelessly — pick a primary installer per project. 6) 'Fixing' ModuleNotFoundError by reinstalling Python — it's an environment mismatch, not a broken interpreter. 7) One giant shared venv for all projects — that's global installs with extra steps.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me on the venv setup commands until I can type them cold.' • 'My import works in the terminal but not in my IDE — walk me through the diagnosis.' • 'Explain what pip freeze captures that reading my imports wouldn't.' • 'When would you pick conda over venv? Give me three concrete cases.' • 'Interview mode: ask me the unchanged-code-now-crashes question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "pip — Python's package installer. PyPI — the public package index pip downloads from. site-packages — the folder inside an environment where installed packages live. venv — a per-project isolated environment (python -m venv .venv). activate — rewire the shell to use a venv's python/pip. pip freeze — list installed packages with exact versions. requirements.txt — the committed manifest that rebuilds an environment. pin (==) — an exact version requirement. conda — alternative installer/environment manager that also ships non-Python binaries. wheel — pip's prebuilt package format. sys.executable — the running interpreter's path, the #1 diagnostic.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the Python Packaging User Guide's 'Installing packages' tutorial — the official walkthrough of venv + pip. • Read: pip's 'Requirements files' documentation page — what -r actually supports. • Practice: create a throwaway venv, install two packages, freeze, delete the venv, and rebuild it from the manifest — the full lifecycle in ten minutes. • Next in DSM: with the stack installable, NumPy Operations goes deep on the library that powers all of it — ufuncs, axes, reshaping, and broadcasting.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ pip installs from PyPI into ONE environment — whichever is active.\n✓ One venv per project: python -m venv .venv, activate, confirm via prompt or sys.executable.\n✓ pip freeze > requirements.txt after every install; commit the manifest, .gitignore the venv.\n✓ pip install -r requirements.txt rebuilds the environment anywhere — environments are disposable, manifests are precious.\n✓ ModuleNotFoundError = environment mismatch: check active venv, pip list, sys.executable.\n✓ conda earns its place when compiled non-Python dependencies get heavy; venv + pip is the default.\n\nNext up: NumPy Operations. The stack is installed — now master its foundation: ufuncs, aggregations along axes, reshape, and the broadcasting rules behind every vectorized pipeline.",
    },
  ],
};
