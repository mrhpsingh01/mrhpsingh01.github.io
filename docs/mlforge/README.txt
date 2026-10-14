MLFORGE
=======
Folder:  projects/mlforge
Type:    Interactive machine-learning engineering lab (teaching app)
Stack:   React + Vite + TypeScript. Every model is implemented from scratch
         in TypeScript (src/ml/); runs entirely in the browser, no backend.
Runs on: http://localhost:3008  (container "web", static files served)

WHAT IT IS
----------
"Don't read about ML. Manipulate it." Seventy-five topics in ten tracks
(foundations, maths and statistics, deep learning, LLMs, MLOps and more).
Each topic follows the same loop: plain-words explanation, an interactive
lab you can move, the maths, a pure-Python implementation, the NumPy
version, the scikit-learn / PyTorch version, a "break it on purpose" quiz,
real-world use cases, how it runs in production, and interview questions.
Code cells are read-only; a guide shows how to run them on Colab or locally.
Progress is tracked per lesson in the browser.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png        Landing page: "Learn how machines learn from data", what
                   you will learn, and the roadmap.
02-learn.png       The curriculum: ten tracks, 75 topics, learning paths.
03-labs.png        All labs in one grid.
04-projects.png    Twenty end-to-end projects and how one evolves (fraud
                   detection example).
05-interview.png   Interview prep in the same interactive style.
06-progress.png    Your map: which lessons are complete.
07-lesson-linear-regression.png
                   A lesson page: sidebar sections (plain words, play with
                   it, math, build it, break it, in the wild, interview).
11-linear-regression-lab.png
                   The linear-regression lab with its controls.
08-lesson-neural-network.png
12-neural-network-lab.png
                   The neural-network playground: choose a dataset, set the
                   hidden layers, and watch the decision surface and the
                   loss curve update while it trains. Train and test
                   accuracy are shown live.
13-neural-network-spiral.png
                   Switching the dataset to Spiral.
09-lesson-kmeans.png   K-Means lesson.
10-lesson-attention.png  Attention (Q, K, V) lesson.

HOW TO RUN
----------
From the mydocker dashboard: type "mlforge" then "up", then "open".
