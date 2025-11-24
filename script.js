// Elements
const resultSection = document.getElementById('result-section');
const daysCount = document.getElementById('days-count');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const milestoneInfo = document.getElementById('milestone-info');
const achievementsContainer = document.getElementById('achievements-list');

// HARDCODED START DATE - Your sobriety journey started here! 🌟
const SOBRIETY_START_DATE = '2025-10-23';

// Milestones configuration (in days)
const MILESTONES = [
    { days: 1, message: 'Amazing! Your first day is complete! 🌟', title: 'First Day' },
    { days: 3, message: 'Three days! You are strong! 💪', title: '3 Days' },
    { days: 7, message: 'One whole week! Congratulations! 🎉', title: '1 Week' },
    { days: 14, message: 'Two weeks! Incredibly well done! ✨', title: '2 Weeks' },
    { days: 21, message: 'Three weeks! What perseverance! 🎯', title: '3 Weeks' },
    { days: 28, message: 'Four weeks! Keep it up! 💫', title: '4 Weeks' },
    { days: 30, message: 'One month! You are a star! 🌟🎊', title: '1 Month' },
    { days: 35, message: 'Five weeks! You are fantastic! 🌈', title: '5 Weeks' },
    { days: 42, message: 'Six weeks! What strength! 💪', title: '6 Weeks' },
    { days: 49, message: 'Seven weeks! You are unstoppable! 🔥', title: '7 Weeks' },
    { days: 56, message: 'Eight weeks! Absolutely incredible! ⭐', title: '8 Weeks' },
    { days: 60, message: 'Two months! Fantastically done! 🎯💫', title: '2 Months' },
    { days: 63, message: 'Nine weeks! You are doing it! 🌟', title: '9 Weeks' },
    { days: 70, message: 'Ten weeks! So proud! 🏆', title: '10 Weeks' },
    { days: 77, message: 'Eleven weeks! Brilliant! 💎', title: '11 Weeks' },
    { days: 84, message: 'Twelve weeks! Three months soon! 🎊', title: '12 Weeks' },
    { days: 90, message: 'Three months! One quarter complete! 🏆🎉', title: '3 Months' },
    { days: 120, message: 'Four months! You are unstoppable! 💎✨', title: '4 Months' },
    { days: 150, message: 'Five months! What an achievement! 🌈🎯', title: '5 Months' },
    { days: 180, message: 'Half a year! You are incredible! 🎆🏆', title: '6 Months' },
    { days: 270, message: 'Nine months! Three quarters! Impressive! 🌟👑', title: '9 Months' },
    { days: 365, message: 'ONE YEAR! You are an inspiration! 🎉🏆🌟👑', title: '1 Year' },
    { days: 500, message: '500 days! Legendary! 👑💫', title: '500 Days' },
    { days: 730, message: 'TWO YEARS! Absolutely amazing! 🎊🎆🏆🌟', title: '2 Years' },
    { days: 1000, message: '1000 days! You are a true hero! 🦸✨', title: '1000 Days' },
    { days: 1095, message: 'THREE YEARS! Incredible! 🎉🏆👑💎', title: '3 Years' }
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
            <h2>🎉 CONGRATULATIONS! 🎉</h2>
            <div class="milestone-days">${days} ${days === 1 ? 'day' : 'days'}</div>
            <p class="milestone-message">${milestone.message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Thank you! ❤️</button>
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

// Get all achieved milestones
function getAchievedMilestones(currentDays) {
    return MILESTONES.filter(m => m.days <= currentDays).reverse();
}

// Display achievements history
function displayAchievements(currentDays) {
    const achieved = getAchievedMilestones(currentDays);

    if (achieved.length === 0) {
        achievementsContainer.innerHTML = '<p class="no-achievements">Keep going! Your first milestone is coming soon! 💪</p>';
        return;
    }

    achievementsContainer.innerHTML = achieved.map((milestone, index) => {
        const achievedDate = new Date(SOBRIETY_START_DATE);
        achievedDate.setDate(achievedDate.getDate() + milestone.days);
        const dateStr = formatDate(achievedDate.toISOString().split('T')[0]);

        return `
            <div class="achievement-card" style="animation-delay: ${index * 0.05}s">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <div class="achievement-title">${milestone.title}</div>
                    <div class="achievement-message">${milestone.message}</div>
                    <div class="achievement-date">Achieved: ${dateStr}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
        breakdownParts.push(`${breakdown.years} ${breakdown.years === 1 ? 'year' : 'years'}`);
    }
    if (breakdown.months > 0) {
        breakdownParts.push(`${breakdown.months} ${breakdown.months === 1 ? 'month' : 'months'}`);
    }
    if (breakdown.weeks > 0) {
        breakdownParts.push(`${breakdown.weeks} ${breakdown.weeks === 1 ? 'week' : 'weeks'}`);
    }
    if (breakdown.days > 0 || breakdownParts.length === 0) {
        breakdownParts.push(`${breakdown.days} ${breakdown.days === 1 ? 'day' : 'days'}`);
    }

    // Show breakdown
    const breakdownText = breakdownParts.join(', ');
    const totalWeeksText = `(${breakdown.totalWeeks} ${breakdown.totalWeeks === 1 ? 'week' : 'weeks'} total)`;

    // Create or update breakdown display
    let breakdownDiv = document.getElementById('time-breakdown');
    if (!breakdownDiv) {
        breakdownDiv = document.createElement('div');
        breakdownDiv.id = 'time-breakdown';
        breakdownDiv.className = 'time-breakdown';
        document.querySelector('.date-info').appendChild(breakdownDiv);
    }
    breakdownDiv.innerHTML = `
        <div class="breakdown-title">That's:</div>
        <div class="breakdown-text">${breakdownText}</div>
        <div class="breakdown-weeks">${totalWeeksText}</div>
    `;

    // Show milestone info
    const milestone = checkMilestone(days);
    const nextMilestone = MILESTONES.find(m => m.days > days);

    if (milestone) {
        milestoneInfo.innerHTML = `<div class="milestone-badge">🎉 Milestone! ${milestone.message}</div>`;
    } else if (nextMilestone) {
        const daysToGo = nextMilestone.days - days;
        milestoneInfo.innerHTML = `<div class="next-milestone">Next milestone in ${daysToGo} ${daysToGo === 1 ? 'day' : 'days'}</div>`;
    }

    // Display achievements
    displayAchievements(days);
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
