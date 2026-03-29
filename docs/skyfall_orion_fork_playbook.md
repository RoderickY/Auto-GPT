# Skyfall fork + Orion co-op setup playbook

This playbook helps you fork the **Skyfall** game and turn it into a two-player version for you and Orion.

## 1) Find the project

The original repository is:

- Upstream: `https://github.com/victordibia/skyfall`

## 2) Fork it to your GitHub account

If you have GitHub CLI (`gh`) installed and authenticated:

```bash
gh auth login
gh repo fork victordibia/skyfall --clone --remote=true --default-branch-only
```

This creates `https://github.com/<your-user>/skyfall` and clones it locally.

If you prefer web UI:

1. Open `https://github.com/victordibia/skyfall`.
2. Click **Fork**.
3. Clone your fork:

```bash
git clone https://github.com/<your-user>/skyfall.git
cd skyfall
git remote add upstream https://github.com/victordibia/skyfall.git
```

## 3) Create an Orion co-op branch

```bash
git checkout -b feature/orion-coop
```

## 4) Make the game clearly two-player

Skyfall already supports multiple detected hands. To make the game explicitly playable by **you + Orion**, add player labels and simple per-player color mapping in `static/js/handcontrol.js`.

### Suggested change

- Sort hands left-to-right and map to names:
  - left hand => `You`
  - right hand => `Orion`
- Draw labels over paddles.
- Keep existing physics unchanged.

Pseudo-snippet to integrate in the hand update/render logic:

```js
const playerNames = ["You", "Orion"];
const playerColors = ["#40c4ff", "#ff8a65"];

const activeHands = [...hands].sort((a, b) => a.x - b.x);
activeHands.forEach((hand, index) => {
  const slot = Math.min(index, 1);
  const playerName = playerNames[slot];
  const color = playerColors[slot];

  // set paddle color by slot
  paddle.setColor(color);

  // draw label near paddle
  drawLabel(playerName, paddleX, paddleY - 20, color);
});
```

## 5) Run locally

```bash
pip install -r requirements.txt
python app.py
```

Open:

- Hand-tracking game: `http://localhost:5005/hand`
- Mouse mode fallback: `http://localhost:5005`

## 6) Push and open PR from your fork

```bash
git add .
git commit -m "Add Orion co-op player labeling and paddle colors"
git push -u origin feature/orion-coop
gh pr create --fill --base master --head <your-user>:feature/orion-coop
```

## 7) Optional polish ideas

- Add an in-game "2-player ready" banner when two hands are detected.
- Add score ownership (which paddle returned the ball).
- Add keyboard fallback for Orion (`A/D`) and you (`←/→`) if hand-tracking drops.
