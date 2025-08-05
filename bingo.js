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

const quoteElement = document.getElementById("quote");

async function fetchDailyQuote() {
  const today = new Date().toDateString(); // example: "Thu Jul 30 2025"

  // Check if we already saved today's quote
  const savedQuote = localStorage.getItem("dailyQuote");
  const savedDate = localStorage.getItem("quoteDate");

  if (savedQuote && savedDate === today) {
    // Show the saved quote for today
    quoteElement.textContent = savedQuote;
    return;
  }

  try {
    // Fetch a random quote from API
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    const quote = data.content;

    // Show it on the page
    quoteElement.textContent = quote;

    // Save for today
    localStorage.setItem("dailyQuote", quote);
    localStorage.setItem("quoteDate", today);

  } catch (error) {
    quoteElement.textContent = "Keep going, you're doing great 💜"; // fallback quote
  }
}

// Load the daily quote when page opens
fetchDailyQuote();


const note = document.getElementById("dailyNote");

// Load saved note
note.value = localStorage.getItem("dailyNote") || "";

// Save note whenever user types
note.addEventListener("input", () => {
  localStorage.setItem("dailyNote", note.value);
});

const sidePanel = document.getElementById("sidePanel");
const openPanel = document.getElementById("openPanel");
const closePanel = document.getElementById("closePanel");

openPanel.addEventListener("click", () => {
  sidePanel.style.width = "500px"; // Open width
});

closePanel.addEventListener("click", () => {
  sidePanel.style.width = "0"; // Close
});

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Load saved theme OR default to light mode
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  // User had dark mode before
  document.body.classList.add("dark-mode");
  themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
} else {
  // Default is light mode
  document.body.classList.add("light-mode");
  themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
}

// Toggle on click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");

  const isLight = document.body.classList.contains("light-mode");

  if (isLight) {
    themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
    localStorage.setItem("theme", "dark");
  }
});

const sidePanle=
document.getElementById("sidePanel");
const openPanle=
document.getElementById("openPanel");
const closePanle=
document.getElementById("closePanel");
const overlay=
document.getElementById("overlay");


function openSidePanel() {
  sidePanel.style.width = "80px"; 
  sidePanel.classList.add("open");
  overlay.classList.add("active");
  
  // Hide menu button using class
  openPanel.classList.add("hidden");
}

function closeSidePanel() {
  sidePanel.style.width = "0";
  sidePanel.classList.remove("open");
  overlay.classList.remove("active");

  // Show menu button again
  openPanel.classList.remove("hidden");
}


openPanel.addEventListener("click",
   openSidePanel);
closePanel.addEventListener("click",
   closeSidePanel);

overlay.addEventListener("click", closeSidePanel)

// === Service Worker Registration ===
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/bingo-habit-tracker/sw.js")
    .then(reg => console.log("Service Worker registered!", reg))
    .catch(err => console.log("Service Worker registration failed:", err));
}

