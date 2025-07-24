# Target Rush

## Project info

Target Rush is a web-based reaction speed and accuracy training game designed for players aged 5 and up, with scalable difficulty for older players. The game is inspired by the rhythm game "Osu" but simplified without music, focusing purely on mouse reaction training.


### Core Gameplay
The game presents players with a grid where exactly one cell is highlighted as the target at any time. Players must click the highlighted target as quickly as possible, and upon successful clicks, the target instantly moves to a new random position. The goal is to achieve the highest score (number of successful clicks) within the selected time limit.

### Implemented Features

1. **Difficulty Selection System**
   - Easy: 3×3 grid (9 cells) - Perfect for young children
   - Medium: 4×4 grid (16 cells) - Intermediate challenge
   - Hard: 5×5 grid (25 cells) - Advanced players
   - Visual difficulty selection with icons and color-coded buttons

2. **Game Duration Options**
   - 30 seconds: Quick practice sessions
   - 1 minute: Standard game length
   - 2 minutes: Extended challenge mode
   - All durations available for every difficulty level

3. **Dynamic Game Grid**
   - Responsive grid layout that adapts to selected difficulty
   - Visual target highlighting with pulsing animation and 🎯 emoji
   - Hover effects and smooth transitions
   - Anti-repetition logic (target never appears in the same cell twice in a row)
   - **Variable Target Appearance:** Option to enable/disable variable target size (toggle in settings). Target changes size each time it appears.

4. **Audio-Visual Feedback System**
   - Correct clicks: Green flash + pleasant chime sound
   - Incorrect clicks: Red flash + distinctive error tone (Web Audio API)
   - Score animation: Bounce effect on successful hits
   - Target animation: Pulsing and scaling effects

5. **Game State Management**
   - Difficulty Selection: Choose settings before playing
   - Game Start: Introduction screen with instructions
   - Active Playing: Live gameplay with all features active
   - Results Screen: Final score with performance feedback
   - **Pause / Resume:** Pause button to stop timer and grid, with overlay and resume option.

6. **User Interface Components**
   - Game Timer
     - Large, prominent countdown display (MM:SS format)
     - Visual progress bar showing elapsed time
     - Color gradient progression
   - Score Display
     - Real-time score counter
     - Animation feedback on score increases
     - Large, readable numbers
   - Game Controls
     - Restart: Reset current game with same settings
     - Quit: Return to difficulty selection
     - Accessible during gameplay
     - **Confirmation Prompts:** Dialogs for restart/quit to avoid accidental exits.
   - Results Screen
     - Final score display with celebratory styling
     - Performance-based feedback messages
     - Statistics (hits per minute calculation)
     - Trophy icon with animation

7. **Visual Design**
   - Animated gradient background with floating elements
   - Child-friendly color scheme using bright, engaging colors
   - Responsive layout optimized for desktop and tablet
   - Professional component styling using shadcn/ui components
   - Smooth animations and transitions throughout

8. **Technical Architecture**
   - React + TypeScript for type safety and modern development
   - Component-based architecture for maintainability
   - State management with React hooks
   - Tailwind CSS for styling with custom animations
   - Accessibility considerations with proper button states and feedback

9. **Game Logic Features**
   - Smart target positioning: Prevents consecutive same-cell targets
   - Precise timing system: Accurate countdown and game duration tracking
   - Score tracking: Real-time updates with visual feedback
   - Performance metrics: Automatic calculation of hits per minute
   - **Combo / Streak System:** Tracks consecutive hits, displays streak counter, and awards bonus points for streaks.

10. **Audio System**
    - Success sounds: Pleasant feedback for correct clicks
    - Error sounds: Clear audio cues for mistakes using Web Audio API
    - Volume control: Appropriate levels for different age groups

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

---

## Future Additions & Planned Features

### Gameplay / Challenge Enhancements
- **Adaptive Difficulty Option**
  - For older players, allow the target to move automatically after a few seconds even if unclicked.
  - Speed can increase over time for challenge.
- **Random Distractors**
  - Optionally enable “fake” targets that penalize if clicked.
  - Helps advanced players practice discrimination and accuracy.
- **Time-based Power-Ups**
  - Occasional special targets that give bonus points or time extensions.
  - Kids love surprises!

### Accessibility / UX Improvements
- **High-Contrast Mode**
  - Optional color scheme with higher contrast for players with vision challenges. *Important for young kids too.*
- **Simple Tutorial**
  - Quick interactive guide that explains how to play on first launch.
  - Arrows or text bubbles pointing to Start, Quit, Grid, etc.
- **Progressive Difficulty Suggestions**
  - After playing Easy for a while, prompt: “Ready for Medium?” *Encourages gradual skill-building.*

### Engagement / Motivation
- **High Score Saving**
  - Store best scores per difficulty/duration locally.
  - Show “New High Score!” celebration.
- **Player Stats / History**
  - Track games played, total clicks, average accuracy.
  - Great for older kids to see progress.
- **Unlockable Themes / Colors**
  - Reward milestones with new color schemes or grid styles.

### Sound / Music Toggle
- Option to mute sounds (parents will appreciate it).
- **Encouraging Feedback**
  - Positive reinforcement text: “Great job!” “So fast!” after high streaks.

### Technical / Quality of Life
- **Responsive Touch Support**
  - Make sure grids are big and responsive for tablets or touchscreens.
  - Add tap feedback for mobile.
- **Settings Menu**
  - Central place to adjust difficulty, duration, sound, color themes.
- **Offline-Friendly**
  - No network requirements—just runs in browser.
- **Progressive Web App (PWA) Option**
  - Let players “install” the game on their device homescreen.
- **Custom Duration Option**
  - Instead of fixed 30s, 1m, 2m only, allow custom time (e.g. slider 15–300 seconds).
- **Language / Localization**
  - Option to switch UI text to other languages.
  - Simple words make it easy to translate.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Current Bugs & UI Issues

- ~~The grid is not perfectly centered on the page, only within its flex column.~~ ✅ Fixed
- ~~The timer/progress bar shrinks on larger screens.~~ ✅ Fixed
- ~~The variable target sizing feature does not feel visually impactful or as intended.~~ ✅ Fixed
- ~~The grid and score area alignment is not pixel-perfect with the timer and controls.~~ ✅ Fixed
- ~~The grid does not always use available screen space optimally.~~ ✅ Fixed