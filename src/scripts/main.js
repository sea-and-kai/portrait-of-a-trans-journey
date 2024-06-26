const game = {
    sections: [
        {
            id: "1",
            title: "Where to begin",
            happyScore: 5,
            qualityScore: 10,
            icon: "🤔"
        },
        {
            id: "2",
            title: "Discretion",
            happyScore: 2,
            qualityScore: 6,
            icon: "🤫"
        },
        {
            id: "3",
            title: "Fear",
            happyScore: 1,
            qualityScore: 5,
            icon: "👹"
        },
        {
            id: "4",
            title: "Friendship",
            happyScore: 10,
            qualityScore: 4,
            icon: "🫂"
        },
        {
            id: "5",
            title: "Mentors",
            happyScore: 8,
            qualityScore: 3,
            icon: "👩‍🏫"
        },
        {
            id: "6",
            title: "Community",
            happyScore: 7,
            qualityScore: 1,
            icon: "🌐"
        },
        {
            id: "7",
            title: "Paying It Forward",
            happyScore: 4,
            qualityScore: 2,
            icon: "🤛"
        },
        {
            id: "8",
            title: "Chasers",
            happyScore: 3,
            qualityScore: 8,
            icon: "🏃"
        },
        {
            id: "9",
            title: "Love and Triangles",
            happyScore: 6,
            qualityScore: 9,
            icon: "🔼"
        },
        {
            id: "10",
            title: "Clarity",
            happyScore: 9,
            qualityScore: 7,
            icon: "🔮"
        }
    ],
    currentSection: "intro",
    visitedSections: [],
    shouldHideVisitedSections: false
};

function main() {
    prepareSectionButtons();
    hideSection('outro');
    loadOrInitiateLocalStorage();
    bindCheckboxElement();
    bindSortButtons();
    bindDoneButton();
    bindResetButton();
    reapplyButtonPositions();
    updateProgressBar();
}

function prepareSectionButtons() {
    for (let i = 0; i < game.sections.length; i++) {
        const section = game.sections[i];
        const button = createButtonElement(section.title, section.id, i);
        document.getElementById('essay-buttons-container').appendChild(button);
        hideSection(section.id);
    }
    document.getElementById('essay-buttons-container').style.height = (game.sections.length * 30) + 'px';
}

function loadOrInitiateLocalStorage() {
    const visitedSections = localStorage.getItem('visitedSections');
    if (visitedSections) {
        game.visitedSections = JSON.parse(visitedSections);
    }
    const shouldHideVisitedSections = localStorage.getItem('shouldHideVisitedSections');
    if (shouldHideVisitedSections) {
        game.shouldHideVisitedSections = JSON.parse(shouldHideVisitedSections);
    }

    evaluateButtonVisibilityStates();
    //mark all visited section buttons
    for (let i = 0; i < game.visitedSections.length; i++) {
        const sectionId = game.visitedSections[i];
        const button = document.getElementById(sectionId + '-button');
        button.classList.add('visited');
    }
}

function saveToLocalStorage() {
    localStorage.setItem('visitedSections', JSON.stringify(game.visitedSections));
    localStorage.setItem('shouldHideVisitedSections', JSON.stringify(game.shouldHideVisitedSections));
}

function bindCheckboxElement() {
    const checkbox = document.getElementById('hide-visited');
    checkbox.checked = game.shouldHideVisitedSections;
    checkbox.onchange = function () {
        setHiddenStateForVisitedSections(checkbox.checked);
    };

    const checkboxLabel = document.getElementById('hide-checkbox-section');
    checkboxLabel.onclick = function () {
        const isHidden = !game.shouldHideVisitedSections;
        checkbox.checked = isHidden;
        setHiddenStateForVisitedSections(isHidden);
    };

    return checkbox;
}

function setHiddenStateForVisitedSections(isHidden) {
    game.shouldHideVisitedSections = isHidden;
    if (game.shouldHideVisitedSections) {
        hideVisitedSectionButtons();
    } else {
        showVisitedSectionButtons();
    }
    saveToLocalStorage();
    reapplyButtonPositions();
}

function bindSortButtons() {
    const happyButton = document.getElementById('happy-sort');
    happyButton.onclick = sortSectionsByHappyScoreDesc;

    const defaultButton = document.getElementById('default-sort');
    defaultButton.onclick = sortSectionsByDefault;

    const qualityButton = document.getElementById('quality-sort');
    qualityButton.onclick = sortSectionsByQualityScoreDesc;
}

function bindDoneButton() {
    const doneButton = document.getElementById('outro-button');
    doneButton.onclick = function () {
        hideAllSections();
        showSection('outro');
        scrollToTop();
        document.getElementById('buttons').style.display = 'none';

        let badgesSection = document.getElementById('badges');
        // iterate over visited sections and add a badge for each
        for (let i = 0; i < game.visitedSections.length; i++) {
            const sectionId = game.visitedSections[i];
            const section = game.sections.find(section => section.id === sectionId);
            const badge = document.createElement('span');
            badge.classList.add('icon');
            badge.textContent = section.icon;
            badgesSection.appendChild(badge);
        }

        document.getElementById('badges-count').textContent = game.visitedSections.length;
    };
}

function bindResetButton() {
    const resetButton = document.getElementById('reset');
    resetButton.onclick = function() {
        localStorage.clear();
        location.reload();
    };

    const returnButton = document.getElementById('return');
    returnButton.onclick = function() {
        location.reload();
    };
}

function evaluateButtonVisibilityStates() {
    if (game.shouldHideVisitedSections) {
        hideVisitedSectionButtons();
    } else {
        showVisitedSectionButtons();
    }
}

function hideVisitedSectionButtons() {
    for (let i = 0; i < game.visitedSections.length; i++) {
        const sectionId = game.visitedSections[i];
        const button = document.getElementById(sectionId + '-button');
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
    }
}

function showVisitedSectionButtons() {
    for (let i = 0; i < game.visitedSections.length; i++) {
        const sectionId = game.visitedSections[i];
        const button = document.getElementById(sectionId + '-button');
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    }
}

function createButtonElement(title, sectionId, index) {
    const button = document.createElement('button');
    button.id = sectionId + '-button';
    button.textContent = title;
    button.onclick = function () {
        // hideAllSections();
        showSection(sectionId);
        scrollToTop();
        markSectionAsVisited(sectionId);
        evaluateButtonVisibilityStates();
        updateProgressBar();
        saveToLocalStorage();
    };

    const icon = document.createElement('span');
    icon.textContent = game.sections[index].icon;
    icon.classList.add('icon');
    button.appendChild(icon);

    return button;
}

function markSectionAsVisited(sectionId) {
    if (hasSectionBeenVisited(sectionId)) {
        return;
    }
    game.visitedSections.push(sectionId);
    const button = document.getElementById(sectionId + '-button');
    button.classList.add('visited');
}

function hasSectionBeenVisited(sectionId) {
    return game.visitedSections.includes(sectionId);
}

function showSection(sectionId) {
    fadeFromSectionToSection(game.currentSection, sectionId);
    game.currentSection = sectionId;
}

function hideSection(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
}

function hideAllSections() {
    for (let i = 0; i < game.sections.length; i++) {
        const section = game.sections[i];
        hideSection(section.id);
    }
    hideSection('intro');
    hideSection('outro');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function sortSectionsByDefault() {
    game.sections.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    reapplyButtonPositions();
}

function sortSectionsByHappyScoreDesc() {
    game.sections.sort((a, b) => b.happyScore - a.happyScore);
    reapplyButtonPositions();
}

function sortSectionsByQualityScoreDesc() {
    game.sections.sort((a, b) => b.qualityScore - a.qualityScore);
    reapplyButtonPositions();
}

function reapplyButtonPositions() {
    let sections = getVisibleSectionIds();
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const button = document.getElementById(section + '-button');
        button.style.top = ((i - i % 2) * 30) + 'px';
        if (i % 2 == 1) {
            button.style.left = "51%"
        } else {
            button.style.left = "0"
        }
    }
}

function getVisibleSectionIds() {
    const sectionIds = [];
    for (let i = 0; i < game.sections.length; i++) {
        const section = game.sections[i];
        if (!game.shouldHideVisitedSections || !game.visitedSections.includes(section.id)) {
            sectionIds.push(section.id);
        }
    }
    return sectionIds;
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    console.log('prog', progressBar);
    const progress = (game.visitedSections.length / game.sections.length) * 100;
    progressBar.style.width = progress + '%';
    console.log('prog', progress);
}

function fadeFromSectionToSection(startSectionId, endSectionId) {
    fadeOutSection(startSectionId, function () {
        fadeInSection(endSectionId, function () {
            reapplyButtonPositions();
        });
    });
}

function fadeOutSection(sectionId, callback) {
    const section = document.getElementById(sectionId);
    section.style.opacity = 1;
    let increment = 1;
    const interval = setInterval(function () {
        increment += 1;
        section.style.opacity = 1 - (increment * 0.032);
        if (section.style.opacity <= 0) {
            section.style.display = 'none';
            clearInterval(interval);
            callback();
        }
    }, 16);
}
function fadeInSection(sectionId, callback) {
    const section = document.getElementById(sectionId);
    section.style.opacity = 0;
    section.style.display = 'block';
    let increment = 1;
    const interval = setInterval(function () {
        increment += 1
        section.style.opacity = increment * 0.032;
        if (section.style.opacity >= 1) {
            clearInterval(interval);
            callback();
        }
    }, 16);
}

window.onload = main;