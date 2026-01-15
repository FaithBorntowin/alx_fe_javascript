// --- INITIALIZATION & STATE ---
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Quality is not an act, it is a habit.", category: "Wisdom" }
];

// --- STORAGE & SYNC LOGIC ---

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Sends a single quote to the server (Mock POST)
 */
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

/**
 * Fetches quotes from server and merges with local data (Conflict Resolution)
 */
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverPosts = await response.json();
    
    // Map mock data to our format
    const serverQuotes = serverPosts.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    let updated = false;
    serverQuotes.forEach(sQuote => {
      // Conflict Resolution: Check if quote exists locally; if not, add it
      if (!quotes.some(lQuote => lQuote.text === sQuote.text)) {
        quotes.push(sQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server!");
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
}

// --- DOM MANIPULATION & UI ---

function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const filter = document.getElementById('categoryFilter').value;
  
  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.category === filter);
  
  if (filtered.length === 0) {
    display.innerHTML = "No quotes found.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<p><strong>"${quote.text}"</strong></p><p><em>— ${quote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const catInput = document.getElementById('newQuoteCategory');
  
  if (textInput.value && catInput.value) {
    const newQuote = { text: textInput.value, category: catInput.value };
    quotes.push(newQuote);
    saveQuotes();
    
    // Sync with server immediately
    await postQuoteToServer(newQuote);
    
    populateCategories();
    textInput.value = '';
    catInput.value = '';
    showNotification("Quote added and synced!");
  }
}

function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  const current = filter.value;

  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
  filter.value = current;
}

function filterQuotes() {
  localStorage.setItem('lastCategory', document.getElementById('categoryFilter').value);
  showRandomQuote();
}

// --- FILE I/O ---

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Import successful!");
  };
  reader.readAsText(event.target.files[0]);
}

function showNotification(msg) {
  const note = document.createElement('div');
  note.style = "position:fixed; bottom:20px; right:20px; background:#28a745; color:white; padding:15px; border-radius:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";
  note.textContent = msg;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// --- STARTUP ---

function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  container.innerHTML = `
    <input id="newQuoteText" placeholder="Quote Content">
    <input id="newQuoteCategory" placeholder="Category">
    <button onclick="addQuote()">Add Quote</button>
  `;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

window.onload = () => {
  createAddQuoteForm();
  populateCategories();
  
  const lastCat = localStorage.getItem('lastCategory');
  if (lastCat) document.getElementById('categoryFilter').value = lastCat;

  showRandomQuote();
  
  // Periodic sync every 30 seconds
  setInterval(syncQuotes, 30000);
};