// Elements
const startDateInput = document.getElementById('start-date');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.getElementById('result-section');
const daysCount = document.getElementById('days-count');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const countersList = document.getElementById('counters-list');

// Milestones configuration (in days)
const MILESTONES = [
    { days: 1, message: 'Fantastiskt! Din första dag är klar! 🌟' },
    { days: 3, message: 'Tre dagar! Du är stark! 💪' },
    { days: 7, message: 'En hel vecka! Grattis! 🎉' },
    { days: 14, message: 'Två veckor! Otroligt bra jobbat! ✨' },
    { days: 21, message: 'Tre veckor! Vilken uthållighet! 🎯' },
    { days: 30, message: 'En månad! Du är en stjärna! 🌟🎊' },
    { days: 60, message: 'Två månader! Fortsätt så! 🎯💫' },
    { days: 90, message: 'Tre månader! Helt fantastiskt! 🏆' },
    { days: 120, message: 'Fyra månader! Du är oslagbar! 💎' },
    { days: 150, message: 'Fem månader! Vilken prestation! 🌈' },
    { days: 180, message: 'Ett halvår! Du är otrolig! 🎆' },
    { days: 270, message: 'Nio månader! Imponerande! 🌟' },
    { days: 365, message: 'ETT ÅR! Du är en inspiration! 🎉🏆🌟' },
    { days: 500, message: '500 dagar! Legendariskt! 👑' },
    { days: 730, message: 'TVÅ ÅR! Helt makalöst! 🎊🎆🏆' },
    { days: 1000, message: '1000 dagar! Du är en sann hjälte! 🦸' }
];

// Set today's date as default
const today = new Date().toISOString().split('T')[0];
startDateInput.value = today;

// Load saved counters from localStorage
let savedCounters = JSON.parse(localStorage.getItem('counters')) || [];

// Confetti animation function
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe'];
    const confettiCount = 150;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.remove();
    }, 5000);
}

// Check if current days match a milestone
function checkMilestone(days) {
    const milestone = MILESTONES.find(m => m.days === days);
    if (milestone) {
        return milestone;
    }
    return null;
}

// Show celebration modal
function showCelebration(milestone, days) {
    createConfetti();

    const modal = document.createElement('div');
    modal.className = 'celebration-modal';
    modal.innerHTML = `
        <div class="celebration-content">
            <h2>🎉 GRATTIS! 🎉</h2>
            <div class="milestone-days">${days} ${days === 1 ? 'dag' : 'dagar'}</div>
            <p class="milestone-message">${milestone.message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Tack! ❤️</button>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.querySelector('.celebration-content').classList.add('show');
    }, 100);
}

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
function displayResult(startDate, showMilestone = true) {
    const days = calculateDays(startDate);
    const todayDate = new Date();

    daysCount.textContent = days;
    fromDate.textContent = formatDate(startDate);
    toDate.textContent = formatDate(todayDate.toISOString().split('T')[0]);

    resultSection.classList.add('active');

    // Check for milestone and celebrate
    if (showMilestone) {
        const milestone = checkMilestone(days);
        if (milestone) {
            setTimeout(() => {
                showCelebration(milestone, days);
            }, 500);
        }
    }

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
            name: `Nykter sedan ${formatDate(startDate)}`
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
        countersList.innerHTML = '<p style="color: #999; text-align: center;">Börja din resa genom att välja ett datum ovan 💪</p>';
        return;
    }

    countersList.innerHTML = savedCounters.map(counter => {
        const days = calculateDays(counter.date);
        const milestone = checkMilestone(days);
        const nextMilestone = MILESTONES.find(m => m.days > days);

        let milestoneHTML = '';
        if (milestone) {
            milestoneHTML = `<div class="milestone-badge">🎉 Milstolpe! ${milestone.message}</div>`;
        } else if (nextMilestone) {
            const daysToGo = nextMilestone.days - days;
            milestoneHTML = `<div class="next-milestone">Nästa milstolpe om ${daysToGo} ${daysToGo === 1 ? 'dag' : 'dagar'}</div>`;
        }

        return `
            <div class="counter-item ${milestone ? 'milestone-active' : ''}">
                <div class="counter-info">
                    <div class="counter-name">${counter.name}</div>
                    <div class="counter-days">${days} ${days === 1 ? 'dag' : 'dagar'}</div>
                    <div class="counter-date">Från: ${formatDate(counter.date)}</div>
                    ${milestoneHTML}
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
