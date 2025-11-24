// Elements
const resultSection = document.getElementById('result-section');
const daysCount = document.getElementById('days-count');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const milestoneInfo = document.getElementById('milestone-info');

// HÅRDKODAT STARTDATUM - Din nykterhet började här! 🌟
const SOBRIETY_START_DATE = '2025-10-23';

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
function displayResult() {
    const days = calculateDays(SOBRIETY_START_DATE);
    const todayDate = new Date();

    daysCount.textContent = days;
    fromDate.textContent = formatDate(SOBRIETY_START_DATE);
    toDate.textContent = formatDate(todayDate.toISOString().split('T')[0]);

    // Show milestone info
    const milestone = checkMilestone(days);
    const nextMilestone = MILESTONES.find(m => m.days > days);

    if (milestone) {
        milestoneInfo.innerHTML = `<div class="milestone-badge">🎉 Milstolpe! ${milestone.message}</div>`;
    } else if (nextMilestone) {
        const daysToGo = nextMilestone.days - days;
        milestoneInfo.innerHTML = `<div class="next-milestone">Nästa milstolpe om ${daysToGo} ${daysToGo === 1 ? 'dag' : 'dagar'}</div>`;
    }
}

// Check if today is a milestone day and celebrate
function checkAndCelebrateMilestone() {
    const days = calculateDays(SOBRIETY_START_DATE);
    const milestone = checkMilestone(days);

    // Check if we've already celebrated today
    const lastCelebration = localStorage.getItem('lastCelebration');
    const today = new Date().toISOString().split('T')[0];

    if (milestone && lastCelebration !== today) {
        setTimeout(() => {
            showCelebration(milestone, days);
            localStorage.setItem('lastCelebration', today);
        }, 1000);
    }
}

// Initialize - Load and display the counter
displayResult();
checkAndCelebrateMilestone();

// Update counter every minute to keep it current
setInterval(() => {
    displayResult();
}, 60000);
