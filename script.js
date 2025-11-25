// Elements
const startDateInput = document.getElementById('start-date');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.getElementById('result-section');
const daysCount = document.getElementById('days-count');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const countersList = document.getElementById('counters-list');
const encouragementText = document.getElementById('encouragement-text');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const currentMilestone = document.getElementById('current-milestone');
const nextMilestoneEl = document.getElementById('next-milestone');
const milestonesAchieved = document.getElementById('milestones-achieved');
const milestoneBadges = document.getElementById('milestone-badges');

// Milestones (in days)
const milestones = [1, 7, 14, 30, 60, 90, 180, 365, 730, 1095];

// Milestone names
const milestoneNames = {
    1: '🌟 Första dagen',
    7: '📅 1 vecka',
    14: '🎯 2 veckor',
    30: '🏆 1 månad',
    60: '💎 2 månader',
    90: '👑 3 månader',
    180: '🌈 6 månader',
    365: '🎊 1 år',
    730: '🔥 2 år',
    1095: '⭐ 3 år'
};

// Encouraging messages based on days
function getEncouragingMessage(days) {
    if (days === 0) return 'Din resa börjar idag! 🚀';
    if (days === 1) return 'Första dagen klar! Du är en stjärna! 🌟';
    if (days < 7) return `${days} dagar! Varje dag är en seger! 💪`;
    if (days === 7) return 'En hel vecka! Otroligt starkt jobbat! 🎉';
    if (days < 14) return `${days} dagar av styrka och beslutsamhet! 💫`;
    if (days === 14) return 'Två veckor! Din vilja är inspirerande! 🌟';
    if (days < 30) return `${days} fantastiska dagar! Fortsätt lysa! ✨`;
    if (days === 30) return 'En hel månad! Du är oslagbar! 🏆';
    if (days < 60) return `${days} dagar av mod och styrka! Så stolt! 💎`;
    if (days === 60) return 'Två månader! Din resa är mäktig! 👑';
    if (days < 90) return `${days} dagar! Din kraft är otrolig! 🔥`;
    if (days === 90) return 'Tre månader! En sann hjälte! 🦸`;
    if (days < 180) return `${days} dagar av ren vilja och styrka! 🌈`;
    if (days === 180) return 'Ett halvår! Fantastiskt presterat! 🎊';
    if (days < 365) return `${days} dagar! Din resa inspirerar! ⭐`;
    if (days === 365) return 'ETT ÅR! Helt otroligt! 🎆🎉🏆';
    if (days < 730) return `${days} dagar av styrka! Legend! 👑`;
    if (days === 730) return 'TVÅ ÅR! Oberörd! 🔥⭐';
    return `${days} fantastiska dagar! Du är en inspiration! 🌟`;
}

// Fire confetti
function fireConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#FF6B35', '#FFA500', '#FFD700', '#9ACD32', '#4CAF50']
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#FF6B35', '#FFA500', '#FFD700', '#9ACD32', '#4CAF50']
        });
    }, 250);
}

// Get next milestone
function getNextMilestone(days) {
    for (let milestone of milestones) {
        if (days < milestone) {
            return milestone;
        }
    }
    return null;
}

// Get achieved milestones
function getAchievedMilestones(days) {
    return milestones.filter(m => days >= m);
}

// Update milestone progress
function updateMilestoneProgress(days) {
    const achieved = getAchievedMilestones(days);
    const next = getNextMilestone(days);

    // Show achieved milestones
    if (achieved.length > 0) {
        milestonesAchieved.classList.remove('hidden');
        milestoneBadges.innerHTML = achieved.map(m => `
            <div class="milestone-badge px-4 py-2 rounded-full text-white font-bold text-sm sparkle">
                ${milestoneNames[m] || m + ' dagar'}
            </div>
        `).join('');
    }

    // Update progress to next milestone
    if (next) {
        const previous = achieved.length > 0 ? achieved[achieved.length - 1] : 0;
        const progress = ((days - previous) / (next - previous)) * 100;
        const daysLeft = next - days;

        currentMilestone.textContent = previous + ' dagar';
        nextMilestoneEl.textContent = milestoneNames[next] || next + ' dagar';
        progressBar.style.width = progress + '%';
        progressText.textContent = `${daysLeft} dag${daysLeft !== 1 ? 'ar' : ''} till ${milestoneNames[next]}!`;
    } else {
        // All milestones achieved!
        const previous = achieved[achieved.length - 1];
        currentMilestone.textContent = previous + ' dagar';
        nextMilestoneEl.textContent = '∞';
        progressBar.style.width = '100%';
        progressText.textContent = 'Alla milstolpar uppnådda! Du är en legend! 👑';
    }
}

// Load saved counters from localStorage
let savedCounters = JSON.parse(localStorage.getItem('counters')) || [];

// Set default date (use last used date if available, otherwise today)
const today = new Date().toISOString().split('T')[0];
const lastUsedDate = localStorage.getItem('lastUsedDate') || today;
startDateInput.value = lastUsedDate;

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
function displayResult(startDate, showConfetti = true) {
    const days = calculateDays(startDate);
    const todayDate = new Date();

    daysCount.textContent = days;
    fromDate.textContent = formatDate(startDate);
    toDate.textContent = formatDate(todayDate.toISOString().split('T')[0]);

    // Update encouraging message
    encouragementText.textContent = getEncouragingMessage(days);

    // Update milestone progress
    updateMilestoneProgress(days);

    resultSection.classList.remove('hidden');

    // Save last used date
    localStorage.setItem('lastUsedDate', startDate);

    // Check if milestone achieved and fire confetti (only if showConfetti is true)
    if (showConfetti && milestones.includes(days)) {
        fireConfetti();
    }

    // Scroll to result (only if showConfetti is true, meaning user clicked button)
    if (showConfetti) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Save counter
function saveCounter(startDate) {
    const counterExists = savedCounters.some(counter => counter.date === startDate);

    if (!counterExists) {
        savedCounters.push({
            id: Date.now(),
            date: startDate,
            name: `Min resa från ${formatDate(startDate)}`
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
        countersList.innerHTML = '<p class="text-white/80 text-center text-lg">Inga sparade räknare ännu</p>';
        return;
    }

    countersList.innerHTML = savedCounters.map(counter => {
        const days = calculateDays(counter.date);
        const achieved = getAchievedMilestones(days);
        const topBadge = achieved.length > 0 ? achieved[achieved.length - 1] : null;

        return `
            <div class="bg-white rounded-2xl p-6 glow-card">
                <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                        <div class="text-lg font-semibold text-gray-800 mb-2">
                            ${counter.name}
                        </div>
                        <div class="text-5xl font-bold mb-3">
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                                ${days}
                            </span>
                            <span class="text-gray-600 text-2xl ml-2">dagar</span>
                        </div>
                        ${topBadge ? `
                            <div class="inline-block milestone-badge px-3 py-1 rounded-full text-white font-semibold text-xs mb-2">
                                ${milestoneNames[topBadge]}
                            </div>
                        ` : ''}
                        <div class="text-sm text-gray-500">
                            Sedan: ${formatDate(counter.date)}
                        </div>
                    </div>
                    <button
                        class="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
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

// Auto-load result if there's a saved date (without confetti or scrolling)
if (lastUsedDate && lastUsedDate !== today) {
    // If there's a previously used date (not today), show it automatically
    displayResult(lastUsedDate, false);
} else if (savedCounters.length > 0) {
    // If no last used date but there are saved counters, show the first one
    displayResult(savedCounters[0].date, false);
}

// Update saved counters every minute to keep the day count current
setInterval(() => {
    renderSavedCounters();
}, 60000);
