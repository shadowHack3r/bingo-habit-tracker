// === Select Elements ===
const tiles = document.querySelectorAll('.tile');
const trackerTitle = document.getElementById('tracker-title');

const STORAGE_KEY = 'bingo-habits';
let completedLines = new Set();

// === Editable Title Logic ===
trackerTitle.contentEditable = true;

trackerTitle.addEventListener('blur', () => {
  if (trackerTitle.textContent.trim() === '') {
    trackerTitle.textContent = '✨ Bingo Habit Tracker ✨';
  }
  localStorage.setItem('bingo-title', trackerTitle.textContent);
});

// Load saved title
const savedTitle = localStorage.getItem('bingo-title');
if (savedTitle) {
  trackerTitle.textContent = savedTitle;
}

// === Load saved habits ===
function loadHabits() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  tiles.forEach((tile, index) => {
    const data = saved[index];
    if (data) {
      tile.textContent = data.text;
      if (data.completed) tile.classList.add('completed');
    }
  });
}

// === Save habits ===
function saveHabits() {
  const data = [];
  tiles.forEach(tile => {
    data.push({
      text: tile.textContent.trim(),
      completed: tile.classList.contains('completed')
    });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// === Check Bingo Lines for Confetti ===
function checkBingo() {
  const tilesArray = Array.from(tiles);
  const lines = [];

  // Rows
  for (let r = 0; r < 5; r++) {
    lines.push([r*5, r*5+1, r*5+2, r*5+3, r*5+4]);
  }

  // Columns
  for (let c = 0; c < 5; c++) {
    lines.push([c, c+5, c+10, c+15, c+20]);
  }

  // Diagonals
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  lines.forEach((line, index) => {
    const isComplete = line.every(i => tilesArray[i].classList.contains('completed'));
    if (isComplete && !completedLines.has(index)) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 }
      });
      completedLines.add(index);
    } else if (!isComplete && completedLines.has(index)) {
      completedLines.delete(index);
    }
  });
}

// === Tile Events ===
tiles.forEach(tile => {
  tile.contentEditable = false; // Start locked

  // Single click toggles completed if not editing
  tile.addEventListener('click', () => {
    if (!tile.isContentEditable) {
      tile.classList.toggle('completed');
      saveHabits();
      checkBingo();
    }
  });

  // Double click enables editing
  tile.addEventListener('dblclick', () => {
    tile.contentEditable = true;
    tile.focus();
  });

  // Disable editing and save on blur
  tile.addEventListener('blur', () => {
    tile.contentEditable = false;
    saveHabits();
  });
});

// === Initialize ===
loadHabits();
