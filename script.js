// Waste Management System Frontend JS

// Add fetchReports function for backend report fetching
async function fetchReports() {
    try {
        const response = await fetch('/api/reports');
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
}

// Slogan rotator logic
const slogans = [
    'Cleaner Communities, Greener Future',
    'Report. Resolve. Renew.',
    'Together for a Sustainable Tomorrow',
    'Your Report Makes a Difference',
    'Act Green, Live Clean',
];
const sloganRotator = document.getElementById('slogan-rotator');
let sloganIndex = 0;
if (sloganRotator) {
    setInterval(() => {
        sloganIndex = (sloganIndex + 1) % slogans.length;
        sloganRotator.textContent = slogans[sloganIndex];
    }, 3000);
}

// Animated hero slogan rotator (single definition, no redeclaration)
const heroSlogans = [
    'Cleaner Communities, Greener Future',
    'Animals are revered as gods in India',
    'Save and protect animals',
    'Compassion for all living beings',
    'Every life matters: protect our animals',
    'Act Green, Live Clean',
];
const heroSloganRotator = document.getElementById('slogan-rotator');
let heroSloganIndex = 0;
if (heroSloganRotator) {
    setInterval(() => {
        heroSloganIndex = (heroSloganIndex + 1) % heroSlogans.length;
        heroSloganRotator.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            heroSloganRotator.textContent = heroSlogans[heroSloganIndex];
            heroSloganRotator.classList.remove('opacity-0');
        }, 500);
    }, 3500);
}

// Side nav pop-out logic
const sideNavToggle = document.getElementById('side-nav-toggle');
const sideNav = document.getElementById('side-nav');
const sideNavClose = document.getElementById('side-nav-close');
const sideNavOverlay = document.getElementById('side-nav-overlay');

if (sideNavToggle && sideNav && sideNavClose && sideNavOverlay) {
    sideNavToggle.addEventListener('click', () => {
        sideNav.classList.remove('-translate-x-full');
        sideNavOverlay.classList.remove('hidden');
    });
    sideNavClose.addEventListener('click', () => {
        sideNav.classList.add('-translate-x-full');
        sideNavOverlay.classList.add('hidden');
    });
    sideNavOverlay.addEventListener('click', () => {
        sideNav.classList.add('-translate-x-full');
        sideNavOverlay.classList.add('hidden');
    });
}

// Utility: Read reports from localStorage
function getReports() {
    return JSON.parse(localStorage.getItem('reports') || '[]');
}
function saveReports(reports) {
    localStorage.setItem('reports', JSON.stringify(reports));
}

// Tailwind status badge color map
const statusColorMap = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Acknowledged': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    'Resolved': 'bg-green-100 text-green-700',
};

// Priority color map
const priorityColorMap = {
    'Critical': 'bg-red-100 text-red-700 border-red-300',
    'High': 'bg-orange-100 text-orange-700 border-orange-300',
    'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Low': 'bg-green-100 text-green-700 border-green-300',
};

const statusList = document.getElementById('status-list');
const dashboardMap = document.getElementById('dashboard-map');
const priorityBanner = document.getElementById('priority-banner');
const topPrioritySection = document.getElementById('top-priority-section');

// Add type badge rendering logic
function getTypeBadge(type) {
    const typeMap = {
        'garbage': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-trash"></i> Garbage</span>',
        'animal-death': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><i class="fa-solid fa-heart-broken"></i> Animal Death</span>',
        'animal-adopt': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><i class="fa-solid fa-home"></i> Animal Adoption</span>',
        'animal-care': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700"><i class="fa-solid fa-paw"></i> Animal Care</span>',
        'cleaning': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700"><i class="fa-solid fa-broom"></i> Cleaning</span>',
        'recycling': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><i class="fa-solid fa-recycle"></i> Recycling</span>',
        'hazardous': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><i class="fa-solid fa-exclamation-triangle"></i> Hazardous</span>',
        'other': '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700"><i class="fa-solid fa-ellipsis"></i> Other</span>'
    };
    return typeMap[type] || '';
}

// Priority logic with new system
function getPriority(report) {
    // If report has priority field, use it
    if (report.priority) {
        return {
            label: report.priority,
            color: priorityColorMap[report.priority] || priorityColorMap['Medium'],
            icon: getPriorityIcon(report.priority)
        };
    }
    
    // Fallback to type-based priority
    const typePriorityMap = {
        'hazardous': 'Critical',
        'animal-death': 'High',
        'animal-care': 'High',
        'garbage': 'Medium',
        'cleaning': 'Medium',
        'recycling': 'Medium',
        'animal-adopt': 'Low',
        'other': 'Medium'
    };
    
    const priority = typePriorityMap[report.type] || 'Medium';
    return {
        label: priority,
        color: priorityColorMap[priority],
        icon: getPriorityIcon(priority)
    };
}

function getPriorityIcon(priority) {
    const iconMap = {
        'Critical': 'fa-exclamation-triangle',
        'High': 'fa-arrow-up',
        'Medium': 'fa-minus',
        'Low': 'fa-arrow-down'
    };
    return iconMap[priority] || 'fa-minus';
}

// Priority sorting function
function prioritySort(a, b) {
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    const priorityA = getPriority(a).label;
    const priorityB = getPriority(b).label;
    return priorityOrder[priorityA] - priorityOrder[priorityB];
}

// Filtering and summary logic
const filterButtons = document.querySelectorAll('.type-filter-btn');
const typeSummary = document.getElementById('type-summary');
let currentTypeFilter = 'all';

// Remove all Chart.js logic and references for analytics

function updateTypeSummary(reports) {
    const counts = {garbage: 0, animal_death: 0, animal_adopt: 0};
    reports.forEach(r => { if (counts[r.type] !== undefined) counts[r.type]++; });
    typeSummary.innerHTML = `
        <span class='mr-4'><i class="fa-solid fa-trash text-emerald-500"></i> Garbage: ${counts.garbage}</span>
        <span class='mr-4'><i class="fa-solid fa-skull-crossbones text-red-500"></i> Animal Death: ${counts.animal_death}</span>
        <span><i class="fa-solid fa-paw text-blue-500"></i> Animal Adopt: ${counts.animal_adopt}</span>
    `;
}

function getPriorityExplanation(type) {
    if (type === 'animal_death') return 'Animal Death reports are most urgent and require immediate attention.';
    if (type === 'garbage') return 'Garbage reports are important for cleanliness and health.';
    if (type === 'animal_adopt') return 'Animal Adopt reports are important for animal care and welfare.';
    return 'Unknown priority.';
}

function renderPriorityBannerAndTopSection(reports) {
    if (!priorityBanner || !topPrioritySection) return;
    
    const sorted = reports.slice().sort(prioritySort);
    if (sorted.length === 0) {
        priorityBanner.classList.add('hidden');
        topPrioritySection.classList.add('hidden');
        return;
    }
    
    const top = sorted[0];
    const priority = getPriority(top);
    
    // Show priority banner
    priorityBanner.classList.remove('hidden');
    priorityBanner.innerHTML = `
        <div class="bg-gradient-to-r from-${getPriorityGradient(priority.label)} rounded-2xl p-4 shadow-lg">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i class="fa-solid ${priority.icon} text-2xl text-white"></i>
                    <div>
                        <h3 class="text-white font-bold text-lg">Top Priority Report</h3>
                        <p class="text-white/90 text-sm">${priority.label} priority issue needs immediate attention</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-white font-bold">${top.location}</div>
                    <div class="text-white/80 text-sm">${formatDate(top.timestamp || top.date)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Show top priority section
    topPrioritySection.classList.remove('hidden');
    topPrioritySection.innerHTML = `
        <div class="bg-white border-4 border-${getPriorityBorder(priority.label)} rounded-2xl shadow-xl p-6 flex items-center gap-6 animate-pulse relative">
            <div class="absolute top-2 right-2">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${priority.color}">
                    <i class="fa-solid ${priority.icon}"></i> 
                    ${priority.label} Priority
                </span>
            </div>
            <img src="${top.image}" alt="Top Priority" class="w-24 h-24 object-cover rounded-lg border-2 border-${getPriorityBorder(priority.label)}">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-800">${top.location}</h3>
                    ${getTypeBadge(top.type)}
                </div>
                <p class="text-gray-600 mb-2">${top.description}</p>
                <div class="flex items-center gap-4 text-sm">
                    <span class="text-gray-500">${formatDate(top.timestamp || top.date)}</span>
                    <span class="inline-block px-2 py-1 rounded-full font-semibold text-xs ${statusColorMap[top.status] || 'bg-gray-200 text-gray-700'}">
                        ${top.status}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function getPriorityGradient(priority) {
    const gradientMap = {
        'Critical': 'red-500 to-red-600',
        'High': 'orange-500 to-orange-600',
        'Medium': 'yellow-500 to-yellow-600',
        'Low': 'green-500 to-green-600'
    };
    return gradientMap[priority] || 'yellow-500 to-yellow-600';
}

function getPriorityBorder(priority) {
    const borderMap = {
        'Critical': 'red-400',
        'High': 'orange-400',
        'Medium': 'yellow-400',
        'Low': 'green-400'
    };
    return borderMap[priority] || 'yellow-400';
}

function getGlowClass(priority) {
    switch (priority) {
        case 'Critical': return 'glow-red';
        case 'High': return 'glow-orange';
        case 'Medium': return 'glow-yellow';
        case 'Low': return 'glow-green';
        default: return '';
    }
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-500', 'text-white'));
        btn.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-500', 'text-white');
        currentTypeFilter = btn.getAttribute('data-type');
        renderStatusList();
        renderDashboard();
    });
});

// Status tracker rendering (fetches from backend)
async function renderStatusList() {
    const reports = await fetchReports();
    updateTypeSummary(reports);
    renderPriorityBannerAndTopSection(reports);
    statusList.innerHTML = '';
    let filtered = reports;
    if (currentTypeFilter !== 'all') filtered = reports.filter(r => r.type === currentTypeFilter);
    filtered = filtered.slice().sort(prioritySort);
    // Remove the top-priority report from the list
    if (filtered.length > 0) filtered = filtered.slice(1);
    if (filtered.length === 0) {
        statusList.innerHTML = '<p class="text-gray-500">No reports yet.</p>';
        return;
    }
    filtered.forEach(report => {
        const priority = getPriority(report);
        const card = document.createElement('div');
        card.className = 'flex items-center gap-6 bg-white/80 backdrop-blur-sm border-l-4 border-emerald-400 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow ' + getGlowClass(priority.label);
        card.innerHTML = `
            <img src="${report.image}" alt="Waste" class="w-16 h-16 object-cover rounded-md border border-emerald-200">
            <div class="flex-1">
                <div class="flex items-center gap-2 font-semibold text-lg text-gray-800">${report.location || 'Unknown Location'} ${getTypeBadge(report.type)}</div>
                <div class="text-gray-500 text-sm">${formatDate(report.timestamp || report.date)}</div>
                <div class="text-gray-700 mt-1">${report.description || ''}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
                <span class="inline-block px-3 py-1 rounded-full font-semibold text-sm ${statusColorMap[report.status] || 'bg-gray-200 text-gray-700'}">
                    ${report.status}
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${priority.color}">
                    <i class="fa-solid ${priority.icon}"></i> 
                    ${priority.label}
                </span>
            </div>
        `;
        addReportActions(card, report); // Add actions to report cards
        statusList.appendChild(card);
    });
}

// Dashboard rendering (fetches from backend)
async function renderDashboard() {
    const reports = await fetchReports();
    let filtered = reports;
    if (currentTypeFilter !== 'all') filtered = reports.filter(r => r.type === currentTypeFilter);
    filtered = filtered.slice().sort(prioritySort);
    // Remove the top-priority report from the list
    if (filtered.length > 0) filtered = filtered.slice(1);
    dashboardMap.innerHTML = '';
    if (filtered.length === 0) {
        dashboardMap.innerHTML = '<p class="text-gray-500">No reported issues yet.</p>';
        return;
    }
    filtered.forEach(report => {
        const priority = getPriority(report);
        const card = document.createElement('div');
        card.className = 'bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4 w-56 flex flex-col items-center hover:shadow-xl transition-shadow ' + getGlowClass(priority.label);
        card.innerHTML = `
            <div class="mb-2 flex flex-col items-center gap-1">${getTypeBadge(report.type)}
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${priority.color}">
                    <i class="fa-solid ${priority.icon}"></i> 
                    ${priority.label}
                </span>
            </div>
            <img src="${report.image}" alt="Waste" class="w-24 h-20 object-cover rounded-md mb-2 border border-emerald-200">
            <div class="font-semibold text-gray-800 text-center">${report.location || 'Unknown Location'}</div>
            <div class="inline-block px-3 py-1 rounded-full font-semibold text-sm mt-2 ${statusColorMap[report.status] || 'bg-gray-200 text-gray-700'}">
                ${report.status}
            </div>
            <div class="text-gray-500 text-xs mt-1">${formatDate(report.timestamp || report.date)}</div>
        `;
        addReportActions(card, report); // Add actions to report cards
        dashboardMap.appendChild(card);
    });
}

// Remove reported images gallery and upload logic
// Remove fetchAndDisplayUploadedImages and related event listeners

// Clear all reports logic
const clearReportsBtn = document.getElementById('clear-reports');
if (clearReportsBtn) {
    clearReportsBtn.addEventListener('click', async function() {
        const password = prompt('Enter admin password to clear all reports:');
        if (!password) return;
        try {
            const res = await fetch('/api/clear-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const result = await res.json();
            if (res.ok && result.success) {
                alert('All reports cleared!');
                renderStatusList();
                renderDashboard();
            } else {
                alert(result.error || 'Failed to clear reports.');
            }
        } catch (e) {
            alert('Failed to clear reports.');
        }
    });
}

// Demo: Simulate status updates (cycling through statuses)
function cycleStatuses() {
    const reports = getReports();
    let changed = false;
    reports.forEach(report => {
        if (report.status === 'Reported') {
            report.status = 'Acknowledged'; changed = true;
        } else if (report.status === 'Acknowledged') {
            report.status = 'In Progress'; changed = true;
        } else if (report.status === 'In Progress') {
            report.status = 'Resolved'; changed = true;
        }
    });
    if (changed) {
        saveReports(reports);
        renderStatusList();
        renderDashboard();
    }
}
setInterval(cycleStatuses, 15000); // Every 15s

// Initial render
renderStatusList();
renderDashboard();

// On page load, highlight 'All' filter
if (filterButtons.length) filterButtons[0].classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-500', 'text-white');

// Auto-hide navbar on scroll
const navbar = document.getElementById('main-navbar');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
        navbar.classList.add('-translate-y-full');
        navbar.classList.remove('translate-y-0');
    } else {
        navbar.classList.remove('-translate-y-full');
        navbar.classList.add('translate-y-0');
    }
    lastScrollY = window.scrollY;
});

// Back to top button logic
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});
backToTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
// Optional: Ripple effect for floating report button
const floatingBtn = document.getElementById('floating-report-btn');
if (floatingBtn) {
    floatingBtn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'absolute bg-white opacity-30 rounded-full pointer-events-none';
        ripple.style.width = ripple.style.height = '120px';
        ripple.style.left = (e.offsetX - 60) + 'px';
        ripple.style.top = (e.offsetY - 60) + 'px';
        ripple.style.position = 'absolute';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'transform 0.5s, opacity 0.5s';
        floatingBtn.appendChild(ripple);
        setTimeout(() => {
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';
        }, 10);
        setTimeout(() => ripple.remove(), 600);
    });
}

// Loop hero video, skipping last 5 seconds
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
    heroVideo.addEventListener('timeupdate', function() {
        if (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 5) {
            heroVideo.currentTime = 0;
            heroVideo.play();
        }
    });
} 

// Modal for details/comments
let detailsModal = null;
function showDetailsModal(report) {
    if (detailsModal) detailsModal.remove();
    detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
    detailsModal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold" id="close-details-modal">&times;</button>
        <img src="${report.image}" alt="Report Image" class="w-full h-48 object-cover rounded mb-4 border border-emerald-200">
        <div class="mb-2 font-bold text-lg flex items-center gap-2">${report.location || 'Unknown Location'} ${getTypeBadge(report.type)}</div>
        <div class="mb-2 text-gray-500 text-sm">${report.date}</div>
        <div class="mb-2 text-gray-700">${report.description || ''}</div>
        <div class="mb-2">Status: <span class="font-semibold ${statusColorMap[report.status] || 'bg-gray-200 text-gray-700'}">${report.status}</span></div>
        <div class="mb-2">Priority: <span class="font-semibold">${getPriority(report).label}</span></div>
        <div class="mb-2">Comment: <span id="details-comment">${report.comment || '<span class=\'text-gray-400\'>No comment</span>'}</span></div>
        <div class="flex gap-2 mt-4 flex-wrap">
          <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded font-semibold" id="add-comment-btn">Add Comment</button>
          <button class="bg-blue-100 text-blue-700 px-4 py-1 rounded font-semibold border border-blue-200" id="download-image-btn">Download Image</button>
          <button class="bg-gray-100 text-gray-700 px-4 py-1 rounded font-semibold border border-gray-200" id="copy-link-btn">Copy Link</button>
          <button class="bg-red-100 text-red-700 px-4 py-1 rounded font-semibold border border-red-200" id="delete-report-btn">Delete</button>
          ${report.status !== 'Resolved' ? `<button class="bg-lime-500 hover:bg-lime-600 text-white px-4 py-1 rounded font-semibold" id="resolve-report-btn">Mark as Resolved</button>` : ''}
        </div>
        <div id="comment-form-section" class="mt-4 hidden">
          <textarea id="comment-input" class="w-full border border-emerald-200 rounded p-2 mb-2" placeholder="Add a comment..."></textarea>
          <div class="flex gap-2">
            <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded font-semibold" id="save-comment-btn">Save</button>
            <button class="bg-gray-200 text-gray-700 px-4 py-1 rounded font-semibold" id="cancel-comment-btn">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(detailsModal);
    // Close modal
    const closeDetailsModalBtn = detailsModal.querySelector('#close-details-modal');
    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.onclick = () => detailsModal.remove();
    }
    // Add comment
    const addCommentBtn = detailsModal.querySelector('#add-comment-btn');
    if (addCommentBtn) {
        addCommentBtn.onclick = () => {
            detailsModal.querySelector('#comment-form-section').classList.remove('hidden');
            detailsModal.querySelector('#comment-input').focus();
        };
    }
    detailsModal.querySelector('#cancel-comment-btn').onclick = () => {
        detailsModal.querySelector('#comment-form-section').classList.add('hidden');
    };
    const saveCommentBtn = detailsModal.querySelector('#save-comment-btn');
    if (saveCommentBtn) {
        saveCommentBtn.onclick = () => {
            const val = detailsModal.querySelector('#comment-input').value.trim();
            if (val.length > 0) {
                report.comment = val;
                updateReport(report);
                detailsModal.querySelector('#details-comment').innerHTML = val;
                detailsModal.querySelector('#comment-form-section').classList.add('hidden');
                renderStatusList();
                renderDashboard();
            }
        };
    }
    // Download image
    const downloadImageBtn = detailsModal.querySelector('#download-image-btn');
    if (downloadImageBtn) {
        downloadImageBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = report.image;
            a.download = 'report-image.jpg';
            a.click();
        };
    }
    // Copy link
    const copyLinkBtn = detailsModal.querySelector('#copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.onclick = () => {
            const url = window.location.origin + window.location.pathname + `?report=${report.id}`;
            navigator.clipboard.writeText(url);
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(() => copyLinkBtn.textContent = 'Copy Link', 1200);
        };
    }
    // Delete report
    const deleteReportBtn = detailsModal.querySelector('#delete-report-btn');
    if (deleteReportBtn) {
        deleteReportBtn.onclick = () => {
            if (confirm('Are you sure you want to delete this report?')) {
                deleteReport(report.id);
                detailsModal.remove();
                renderStatusList();
                renderDashboard();
            }
        };
    }
    // Mark as resolved
    const resolveReportBtn = detailsModal.querySelector('#resolve-report-btn');
    if (resolveReportBtn) {
        resolveReportBtn.onclick = () => {
            report.status = 'Resolved';
            updateReport(report);
            detailsModal.remove();
            renderStatusList();
            renderDashboard();
        };
    }
}

function updateReport(updated) {
    const reports = getReports();
    const idx = reports.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
        reports[idx] = updated;
        saveReports(reports);
    }
}
function deleteReport(id) {
    let reports = getReports();
    reports = reports.filter(r => r.id !== id);
    saveReports(reports);
}

// Add actions to report cards
function addReportActions(card, report) {
    // Add view details button
    const btn = document.createElement('button');
    btn.className = 'mt-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded font-semibold border border-emerald-200 hover:bg-emerald-200 transition';
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> View Details';
    btn.onclick = () => showDetailsModal(report);
    card.appendChild(btn);
} 

// Lightbox functionality
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(group, index) {
    lightboxImages = Array.from(document.querySelectorAll(`img[data-lightbox='${group}']`));
    lightboxIndex = index;
    showLightboxImage();
    lightboxModal.classList.remove('hidden');
}
function showLightboxImage() {
    if (!lightboxImages[lightboxIndex]) return;
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt;
}
Array.from(document.querySelectorAll('img[data-lightbox]')).forEach((img, idx, arr) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
        const group = img.getAttribute('data-lightbox');
        const groupImgs = Array.from(document.querySelectorAll(`img[data-lightbox='${group}']`));
        openLightbox(group, groupImgs.indexOf(img));
    });
});
if (lightboxClose) {
    lightboxClose.onclick = () => lightboxModal.classList.add('hidden');
}
lightboxModal.onclick = (e) => { if (e.target === lightboxModal) lightboxModal.classList.add('hidden'); };
if (lightboxPrev) {
    lightboxPrev.onclick = (e) => { e.stopPropagation(); lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxImage(); };
}
if (lightboxNext) {
    lightboxNext.onclick = (e) => { e.stopPropagation(); lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxImage(); };
}
// Keyboard navigation
window.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('hidden')) return;
    if (lightboxPrev && e.key === 'ArrowLeft') lightboxPrev.onclick(e);
    if (lightboxNext && e.key === 'ArrowRight') lightboxNext.onclick(e);
    if (lightboxClose && e.key === 'Escape') lightboxClose.onclick();
});
// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
function setDarkMode(on) {
    document.body.classList.toggle('dark', on);
    const navbar = document.getElementById('main-navbar');
    if (on) {
        document.body.classList.add('bg-[#141414]', 'text-white');
        document.body.classList.remove('bg-gradient-to-br', 'from-green-100', 'via-emerald-100', 'to-lime-100', 'text-green-900');
        // Navbar to black/white
        if (navbar) {
            navbar.classList.add('!bg-black', '!text-white', 'border-black');
            navbar.classList.remove('bg-green-50/90', 'text-emerald-800', 'border-green-300');
        }
        // Change accent colors to Netflix red
        document.querySelectorAll('.bg-emerald-50, .bg-green-50, .bg-emerald-100, .bg-lime-50, .bg-emerald-200, .bg-emerald-400, .bg-emerald-500, .bg-lime-400, .from-emerald-500, .to-lime-400, .from-emerald-600, .to-lime-500, .border-emerald-100, .border-green-300, .border-emerald-200, .border-lime-100, .text-emerald-700, .text-green-800, .text-lime-700, .text-emerald-800, .text-emerald-600, .text-emerald-400, .text-lime-400, .text-green-900, .shadow-lg, .shadow-xl, .ring-emerald-300, .ring-green-400, .ring-emerald-400, .ring-lime-400, .ring-emerald-200, .ring-emerald-100, .ring-lime-100').forEach(el => {
            el.classList.add('netflix-dark');
        });
        // Change buttons and gradients
        document.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-br').forEach(el => {
            el.classList.add('netflix-gradient');
        });
        // Ensure floating button is always green
        const floatingBtn = document.getElementById('floating-report-btn');
        if (floatingBtn) {
            floatingBtn.classList.remove('bg-gradient-to-r', 'from-red-700', 'to-red-500', 'hover:from-red-800', 'hover:to-red-600');
            floatingBtn.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-lime-400');
        }
        darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('darkMode', '1');
    } else {
        document.body.classList.remove('bg-[#141414]', 'text-white', 'dark');
        document.body.classList.add('bg-gradient-to-br', 'from-green-100', 'via-emerald-100', 'to-lime-100', 'text-green-900');
        // Restore navbar
        if (navbar) {
            navbar.classList.remove('!bg-black', '!text-white', 'border-black');
            navbar.classList.add('bg-green-50/90', 'text-emerald-800', 'border-green-300');
        }
        document.querySelectorAll('.netflix-dark').forEach(el => {
            el.classList.remove('netflix-dark');
        });
        document.querySelectorAll('.netflix-gradient').forEach(el => {
            el.classList.remove('netflix-gradient');
        });
        const floatingBtn = document.getElementById('floating-report-btn');
        if (floatingBtn) {
            floatingBtn.classList.remove('bg-gradient-to-r', 'from-red-700', 'to-red-500', 'hover:from-red-800', 'hover:to-red-600');
            floatingBtn.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-lime-400');
        }
        darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('darkMode', '0');
    }
}
if (darkModeToggle) {
    darkModeToggle.onclick = () => setDarkMode(!document.body.classList.contains('dark'));
}
if (localStorage.getItem('darkMode') === '1') setDarkMode(true);
// Card/button hover/active effects (microinteractions)
document.querySelectorAll('.group, .rounded-2xl, .shadow-lg, .shadow-xl').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('ring-2', 'ring-emerald-300'));
    card.addEventListener('mouseleave', () => card.classList.remove('ring-2', 'ring-emerald-300'));
});
document.querySelectorAll('button, a').forEach(btn => {
    btn.addEventListener('mousedown', () => btn.classList.add('scale-95'));
    btn.addEventListener('mouseup', () => btn.classList.remove('scale-95'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('scale-95'));
});
// Re-initialize AOS on page load (in case of dynamic content)
if (window.AOS) AOS.init({ once: true, duration: 900, easing: 'ease-out-cubic' }); 

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// Load reports on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    if (window.auth && window.auth.checkAuthStatus) {
        window.auth.checkAuthStatus();
        window.auth.updateNavigation();
    }
    
    renderStatusList();
    renderDashboard();
}); 
