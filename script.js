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
    { days: 28, message: 'Fyra veckor! Fortsätt så! 💫' },
    { days: 30, message: 'En månad! Du är en stjärna! 🌟🎊' },
    { days: 35, message: 'Fem veckor! Du är fantastisk! 🌈' },
    { days: 42, message: 'Sex veckor! Vilken styrka! 💪' },
    { days: 49, message: 'Sju veckor! Du är oslagbar! 🔥' },
    { days: 56, message: 'Åtta veckor! Helt otroligt! ⭐' },
    { days: 60, message: 'Två månader! Fantastiskt jobbat! 🎯💫' },
    { days: 63, message: 'Nio veckor! Du gör det! 🌟' },
    { days: 70, message: 'Tio veckor! Så stolt! 🏆' },
    { days: 77, message: 'Elva veckor! Briljant! 💎' },
    { days: 84, message: 'Tolv veckor! Tre månader snart! 🎊' },
    { days: 90, message: 'Tre månader! Ett kvartal klart! 🏆🎉' },
    { days: 120, message: 'Fyra månader! Du är oslagbar! 💎✨' },
    { days: 150, message: 'Fem månader! Vilken prestation! 🌈🎯' },
    { days: 180, message: 'Ett halvår! Du är otrolig! 🎆🏆' },
    { days: 270, message: 'Nio månader! Tre kvartal! Imponerande! 🌟👑' },
    { days: 365, message: 'ETT ÅR! Du är en inspiration! 🎉🏆🌟👑' },
    { days: 500, message: '500 dagar! Legendariskt! 👑💫' },
    { days: 730, message: 'TVÅ ÅR! Helt makalöst! 🎊🎆🏆🌟' },
    { days: 1000, message: '1000 dagar! Du är en sann hjälte! 🦸✨' },
    { days: 1095, message: 'TRE ÅR! Otroligt! 🎉🏆👑💎' }
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

// Calculate time breakdown (weeks, months, years)
function calculateTimeBreakdown(days) {
    const years = Math.floor(days / 365);
    const remainingAfterYears = days % 365;
    const months = Math.floor(remainingAfterYears / 30);
    const remainingAfterMonths = remainingAfterYears % 30;
    const weeks = Math.floor(remainingAfterMonths / 7);
    const remainingDays = remainingAfterMonths % 7;

    return { years, months, weeks, days: remainingDays, totalWeeks: Math.floor(days / 7) };
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
    const breakdown = calculateTimeBreakdown(days);

    daysCount.textContent = days;
    fromDate.textContent = formatDate(SOBRIETY_START_DATE);
    toDate.textContent = formatDate(todayDate.toISOString().split('T')[0]);

    // Build breakdown text
    let breakdownParts = [];
    if (breakdown.years > 0) {
        breakdownParts.push(`${breakdown.years} ${breakdown.years === 1 ? 'år' : 'år'}`);
    }
    if (breakdown.months > 0) {
        breakdownParts.push(`${breakdown.months} ${breakdown.months === 1 ? 'månad' : 'månader'}`);
    }
    if (breakdown.weeks > 0) {
        breakdownParts.push(`${breakdown.weeks} ${breakdown.weeks === 1 ? 'vecka' : 'veckor'}`);
    }
    if (breakdown.days > 0 || breakdownParts.length === 0) {
        breakdownParts.push(`${breakdown.days} ${breakdown.days === 1 ? 'dag' : 'dagar'}`);
    }

    // Show breakdown
    const breakdownText = breakdownParts.join(', ');
    const totalWeeksText = `(${breakdown.totalWeeks} ${breakdown.totalWeeks === 1 ? 'vecka' : 'veckor'} totalt)`;

    // Create or update breakdown display
    let breakdownDiv = document.getElementById('time-breakdown');
    if (!breakdownDiv) {
        breakdownDiv = document.createElement('div');
        breakdownDiv.id = 'time-breakdown';
        breakdownDiv.className = 'time-breakdown';
        document.querySelector('.date-info').appendChild(breakdownDiv);
    }
    breakdownDiv.innerHTML = `
        <div class="breakdown-title">Det är:</div>
        <div class="breakdown-text">${breakdownText}</div>
        <div class="breakdown-weeks">${totalWeeksText}</div>
    `;

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
