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

    resultSection.classList.add('active');

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
        countersList.innerHTML = '<p style="color: #999; text-align: center;">Inga sparade räknare ännu</p>';
        return;
    }

    countersList.innerHTML = savedCounters.map(counter => {
        const days = calculateDays(counter.date);
        return `
            <div class="counter-item">
                <div class="counter-info">
                    <div class="counter-name">${counter.name}</div>
                    <div class="counter-days">${days} dagar</div>
                    <div class="counter-date">Från: ${formatDate(counter.date)}</div>
                </div>
                <button class="delete-btn" onclick="deleteCounter(${counter.id})">Ta bort</button>
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
