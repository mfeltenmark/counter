// Elements
const startDateInput = document.getElementById('start-date');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.getElementById('result-section');
const daysCount = document.getElementById('days-count');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const countersList = document.getElementById('counters-list');

// Set today's date as default
const today = new Date().toISOString().split('T')[0];
startDateInput.value = today;

// Load saved counters from localStorage
let savedCounters = JSON.parse(localStorage.getItem('counters')) || [];

// Calculate days between two dates
function calculateDays(startDate, endDate = new Date()) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Display result
function displayResult(startDate) {
    const days = calculateDays(startDate);
    const todayDate = new Date();

    daysCount.textContent = days;
    fromDate.textContent = formatDate(startDate);
    toDate.textContent = formatDate(todayDate.toISOString().split('T')[0]);

    resultSection.classList.remove('hidden');

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Save counter
function saveCounter(startDate) {
    const counterExists = savedCounters.some(counter => counter.date === startDate);

    if (!counterExists) {
        savedCounters.push({
            id: Date.now(),
            date: startDate,
            name: `Räknare från ${formatDate(startDate)}`
        });

        localStorage.setItem('counters', JSON.stringify(savedCounters));
        renderSavedCounters();
    }
}

// Delete counter
function deleteCounter(id) {
    savedCounters = savedCounters.filter(counter => counter.id !== id);
    localStorage.setItem('counters', JSON.stringify(savedCounters));
    renderSavedCounters();
}

// Render saved counters
function renderSavedCounters() {
    if (savedCounters.length === 0) {
        countersList.innerHTML = '<p class="text-gray-400 text-center font-mono text-sm">// Inga sparade räknare ännu</p>';
        return;
    }

    countersList.innerHTML = savedCounters.map(counter => {
        const days = calculateDays(counter.date);
        return `
            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-tech-purple transition-colors card-glow group">
                <div class="flex justify-between items-center">
                    <div class="flex-1">
                        <div class="text-xl font-semibold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                            ${counter.name}
                        </div>
                        <div class="text-3xl font-bold mb-2">
                            <span class="bg-gradient-to-r from-neural-green to-tech-cyan bg-clip-text text-transparent">
                                ${days}
                            </span>
                            <span class="text-gray-400 text-lg ml-2">dagar</span>
                        </div>
                        <div class="text-sm font-mono text-gray-400">
                            <span class="text-tech-cyan">start_date:</span> ${formatDate(counter.date)}
                        </div>
                    </div>
                    <button
                        class="bg-gradient-to-r from-red-500 to-ai-orange text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform ml-4"
                        onclick="deleteCounter(${counter.id})"
                    >
                        Ta bort
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Event listener for calculate button
calculateBtn.addEventListener('click', () => {
    const selectedDate = startDateInput.value;

    if (!selectedDate) {
        alert('Vänligen välj ett datum');
        return;
    }

    displayResult(selectedDate);
    saveCounter(selectedDate);
});

// Allow Enter key to calculate
startDateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateBtn.click();
    }
});

// Initial render of saved counters
renderSavedCounters();

// Update saved counters every minute to keep the day count current
setInterval(() => {
    renderSavedCounters();
}, 60000);
