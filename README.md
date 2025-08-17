# React_2048_game

This is a React-based implementation of the classic 2048 game featuring smooth animations and intuitive controls. The game logic is fully handled on the frontend in JavaScript, eliminating backend dependencies. Styled with Tailwind CSS, it offers a responsive and modern UI. The clean architecture enables easy setup and future enhancements.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [How to Play](#how-to-play)
- [Project Structure](#project-structure)
- [Customization and Extensions](#customization-and-extensions)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

2048 is a sliding tile puzzle game where the player combines tiles to reach the 2048 tile. This clone recreates the gameplay in React and JavaScript, ensuring smooth performance and easy extensibility.

---

## How It Works

- The board is a 4x4 grid.
- On each move, tiles shift up, down, left, or right.
- Tiles with the same number merge into one with double the value.
- After each move, a new tile (2 or 4) is added randomly.
- The game ends when no more moves are possible.
- Score increases with every merge; best score is saved in your browser.
- Supports keyboard controls, button clicks, and mobile swipe gestures.
- Undo functionality lets you revert the last move once per turn.

---

## Features

- Fully client-side—no backend required.
- Smooth Framer Motion animations.
- Responsive Tailwind CSS UI.
- Best score saved in localStorage.
- Undo last move.
- Keyboard & touch controls.
- Overlays for win (2048) and game over.
- Easy new game button.

---

## Tech Stack

- **React** for UI
- **JavaScript** for logic/state
- **Framer Motion** for animation
- **Tailwind CSS** for styling
- **Vite** for build and dev server

---

## Setup and Installation

1. **Clone the repository**
git clone https://github.com/yuvnahr/React_2048_game.git
  cd React_2048_game

2. **Install dependencies**
  npm install

3. **Start the development server**
  npm run dev

Visit `http://localhost:5173` in your browser.

Production files will be in the `dist` folder.

---

## How to Play
- Use arrow keys or WASD to move tiles.
- You can also swipe on mobile or click buttons.
- Merge tiles to reach 2048 and beyond.
- Undo your last move using the Undo button or "U" key.
- Start a new game anytime with the New Game button.

---

## Project Structure
- `src/` — React components & game logic    
  - `App.jsx` — Main UI and game state  
  - `game.js` — Board logic and move functions  
  - `index.css` — Styling  
  - `main.jsx` — React DOM rendering entry point  
  - `index.js` — (if present) CSS or supporting imports  
- `index.html` — Entry point  
- `package.json` — Dependencies and scripts  
- `package-lock.json` — Lockfile for consistency  
- `postcss.config.js` — PostCSS configuration  
- `tailwind.config.js` — Tailwind CSS configuration  
- `.gitignore` — Specifies files/folders to ignore in Git

---

## Customization and Extensions
- Change board size by editing `SIZE` in `game.js`.
- Edit tile colors and styles in `App.jsx` or modify Tailwind CSS config.
- Add features like a leaderboard or AI agent easily; the architecture is modular and clean.

---

## Contributing
Pull requests and issues are welcome—please maintain coding style and test features before submitting.

---

## License
MIT License. See `LICENSE` for details.

---

Enjoy playing and customizing your 2048 React game!
