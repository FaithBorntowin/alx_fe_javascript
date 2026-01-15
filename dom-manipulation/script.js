// --- INITIAL DATA & CONSTANTS ---
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Quality is not an act, it is a habit.", category: "Wisdom" }
];

// --- SERVER INTERACTION ---

/**
 * Task: Check for the fetchQuotesFromServer function
 * Task: Check for fetching data from the server using a mock API
 */
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverPosts = await response.json();
    
    // Convert mock API data to your quote format
    return serverPosts.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

/**
 * Task: Check for posting data to the server using a mock API
 */
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

/**
 * Task: Check for the syncQuotes function
 * Task: Check for updating local storage with server data and conflict resolution
 */
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  
  if (!serverQuotes) return;

  let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  let newQuotesAdded = false;

  serverQuotes.forEach(sQuote => {
    // Conflict Resolution: Server data takes precedence if not in local
    if (!localQuotes.some(lQuote => lQuote.text === sQuote.text)) {
      localQuotes.push(sQuote);
      newQuotesAdded = true;
    }
  });

  if (newQuotesAdded) {
    quotes = localQuotes;
    saveQuotes();
    populateCategories();
    // Task: Check for UI elements or notifications for data updates or conflicts
    alert("Quotes synced with server!"); 
  }
}

// --- CORE UTILITIES ---

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const filter = document.getElementById('categoryFilter').value;
  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.category === filter);
  
  if (filtered.length === 0) {
    display.innerHTML = "No quotes available.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<p><strong>"${quote.text}"</strong></p><p><em>— ${quote.category}</em></p>`;
}

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const catInput = document.getElementById('newQuoteCategory');
  
  if (textInput.value && catInput.value) {
    const newQuote = { text: textInput.value, category: catInput.value };
    quotes.push(newQuote);
    saveQuotes();
    
    // Sync single new quote to server
    await postQuoteToServer(newQuote);
    
    populateCategories();
    textInput.value = '';
    catInput.value = '';
    showRandomQuote();
  }
}

// --- UI MANAGEMENT ---

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
  showRandomQuote();
}

// --- INITIALIZATION ---

function createAddQuoteForm() {
  const container = document.getElementById('formContainer') || document.body;
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  container.appendChild(formDiv);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

window.onload = () => {
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();
  
  // Task: Check for periodically checking for new quotes from the server
  setInterval(syncQuotes, 60000); // Sync every 60 seconds
};