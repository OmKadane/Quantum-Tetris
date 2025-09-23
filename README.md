# 🧩 Quantum Tetris

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=flat-square)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff&style=flat-square)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=222&style=flat-square)](https://developer.mozilla.org/docs/Web/JavaScript)
[![CI/CD Status](https://github.com/OmKadane/Quantum-Tetris/actions/workflows/cd.yml/badge.svg)](https://github.com/OmKadane/Quantum-Tetris/actions/workflows/cd.yml)

---

A modern, visually appealing Tetris game built with JavaScript, HTML5, and CSS3. Enjoy classic gameplay with a quantum twist, smooth controls, and a beautiful UI!

---
## 🚀 CI/CD Automation

This project is configured with a fully automated CI/CD pipeline using **GitHub Actions**, **Docker**, and **Google Cloud Run**.

* **Continuous Integration (CI)**: On every pull request to the `main` branch, the pipeline automatically lints and validates the HTML and JavaScript code using `htmlhint` and `jshint`. This ensures code quality before merging.
* **Continuous Deployment (CD)**: When changes are merged into the `main` branch, the application is:
    1.  Containerized into a Docker image using Nginx.
    2.  Pushed to a secure Google Artifact Registry.
    3.  Automatically deployed to Google Cloud Run for hosting.

**Live Staging URL:** [quantum_tetris](https://quantum-tetris-dnztkjg54q-uc.a.run.app/)

---

## 🎮 Screenshots

**Screenshot 1** <img src="assets/screenshot1.png" width="90%" alt="Quantum Tetris Screenshot 1"/>

**Screenshot 2** <img src="assets/screenshot2.png" width="90%" alt="Quantum Tetris Screenshot 2"/>

---

## ✨ Features

- Responsive and animated UI
- Pause/Resume and Game Over overlays
- Next piece preview
- High score tracking (local storage)
- Sound effects for moves, clears, and game over

---

## 🚀 Getting Started

### Run Locally with Docker
1.  Ensure you have Docker installed.
2.  Clone the repository: `git clone https://github.com/OmKadane/Quantum-Tetris.git`
3.  Navigate to the root directory: `cd Quantum-Tetris`
4.  Build the Docker image: `docker build -t quantum-tetris .`
5.  Run the container: `docker run -d -p 8080:80 quantum-tetris`
6.  Open your browser to `http://localhost:8080`.

### Run Locally (Without Docker)
1.  Clone the repo.
2.  Open `index.html` in your browser.

---

## 📄 License

Distributed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

[Om Kadane](https://github.com/OmKadane)