// 1. Data Storage
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Quality is not an act, it is a habit.", category: "Wisdom" }
];

// 2. Function to Show a Random Quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Select random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // DOM Manipulation: Create and append elements
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// 3. Function to Add a New Quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  if (textInput.value && categoryInput.value) {
    quotes.push({ text: textInput.value, category: categoryInput.value });
    textInput.value = '';
    categoryInput.value = '';
    alert("Quote added!");
  }
}

// 4. Dynamic UI Creation (Advanced DOM)
function createAddQuoteForm() {
  const container = document.createElement('div');
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(container);

  // Attach event listener to the dynamically created button
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Initialize
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();