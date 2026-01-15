// --- INITIAL DATA & STORAGE ---
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Quality is not an act, it is a habit.", category: "Wisdom" },
  { text: "Stay hungry, stay foolish.", category: "Life" }
];

// --- CORE FUNCTIONS ---

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Displays a quote based on the selected filter.
 * If "all" is selected, it picks a random one.
 */
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  let filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>"${quote.text}"</strong></p>
    <p><em>— ${quote.category}</em></p>
  `;
  
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  if (textInput.value && categoryInput.value) {
    const newQuote = { text: textInput.value, category: categoryInput.value };
    quotes.push(newQuote);
    saveQuotes();
    
    // Refresh categories in dropdown and clear inputs
    populateCategories();
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added!");
  }
}

// --- FILTERING LOGIC ---

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  
  // Preserve current selection
  const currentSelection = categoryFilter.value;

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore selection if it still exists
  categoryFilter.value = currentSelection;
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);
  showRandomQuote();
}

// --- DATA IMPORT/EXPORT ---

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch (e) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- UI SETUP ---

function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  
  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = "Quote Text";
  
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = "Category";
  
  const btn = document.createElement('button');
  btn.textContent = "Add Quote";
  btn.onclick = addQuote;
  
  container.append(textInput, categoryInput, btn);
}

// --- INITIALIZATION ---

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

window.onload = function() {
  createAddQuoteForm();
  populateCategories();
  
  // Restore last filter from localStorage
  const savedFilter = localStorage.getItem('lastSelectedCategory');
  if (savedFilter) {
    document.getElementById('categoryFilter').value = savedFilter;
  }
  
  showRandomQuote();
};