/**
 * Express Setup - AI Integration Presentation
 * Interactive JavaScript Controller
 */

// ============================================
// State Management
// ============================================

const state = {
    currentSlide: 0,
    currentStage: 1,
    slides: [],
    navItems: [],
    isAnimating: false
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeSlides();
    initializeNavigation();
    initializeLifecycle();
    initializeKeyboardNavigation();
    updateUI();
});

function initializeSlides() {
    state.slides = Array.from(document.querySelectorAll('.slide'));
    state.navItems = Array.from(document.querySelectorAll('.nav-item'));
}

function initializeNavigation() {
    // Add click handlers to nav items
    state.navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!state.isAnimating) {
                navigateToSlide(index);
            }
        });
    });
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (state.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                navigateNext();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                navigatePrev();
                break;
            case 'Home':
                e.preventDefault();
                navigateToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                navigateToSlide(state.slides.length - 1);
                break;
        }
    });
}

// ============================================
// Navigation Functions
// ============================================

function navigateToSlide(index) {
    if (index < 0 || index >= state.slides.length || index === state.currentSlide) {
        return;
    }
    
    state.isAnimating = true;
    
    // Update slides
    state.slides[state.currentSlide].classList.remove('active');
    state.slides[index].classList.add('active');
    
    // Update navigation
    state.navItems[state.currentSlide].classList.remove('active');
    state.navItems[index].classList.add('active');
    
    state.currentSlide = index;
    updateUI();
    
    // Reset animation lock
    setTimeout(() => {
        state.isAnimating = false;
    }, 600);
    
    // Trigger section-specific animations
    if (state.slides[index].id === 'lifecycle') {
        setTimeout(animateLifecycle, 300);
    }
}

function navigateToSection(sectionId) {
    const index = state.slides.findIndex(slide => slide.id === sectionId);
    if (index !== -1) {
        navigateToSlide(index);
    }
}

function navigateNext() {
    if (state.currentSlide < state.slides.length - 1) {
        navigateToSlide(state.currentSlide + 1);
    }
}

function navigatePrev() {
    if (state.currentSlide > 0) {
        navigateToSlide(state.currentSlide - 1);
    }
}

// ============================================
// UI Updates
// ============================================

function updateUI() {
    updateProgress();
    updateNavigationArrows();
}

function updateProgress() {
    const progress = ((state.currentSlide + 1) / state.slides.length) * 100;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
}

function updateNavigationArrows() {
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    
    if (prevBtn) {
        prevBtn.disabled = state.currentSlide === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = state.currentSlide === state.slides.length - 1;
    }
}

// ============================================
// Lifecycle Animation
// ============================================

function initializeLifecycle() {
    const stages = document.querySelectorAll('.stage');
    
    stages.forEach((stage, index) => {
        stage.addEventListener('click', () => {
            setActiveStage(index + 1);
        });
        
        stage.addEventListener('mouseenter', () => {
            setActiveStage(index + 1);
        });
    });
}

function setActiveStage(stageNum) {
    state.currentStage = stageNum;
    
    // Update stage dots
    const stages = document.querySelectorAll('.stage');
    stages.forEach((stage, index) => {
        stage.classList.toggle('active', index + 1 === stageNum);
    });
    
    // Update progress circle
    updateLifecycleProgress(stageNum);
}

function updateLifecycleProgress(stageNum) {
    // Highlight active stage arrow segment
    const arrows = document.querySelectorAll('.lifecycle-arrow');
    arrows.forEach((arrow, index) => {
        if (index < stageNum) {
            arrow.style.opacity = '1';
        } else {
            arrow.style.opacity = '0.3';
        }
    });
}

function animateLifecycle() {
    setActiveStage(1);
    
    // Animate stages sequentially
    const stages = document.querySelectorAll('.stage');
    stages.forEach((stage, index) => {
        stage.style.opacity = '0';
        
        setTimeout(() => {
            stage.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            stage.style.opacity = '1';
        }, 100 + (index * 150));
    });
}

// ============================================
// Touch Support
// ============================================

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (state.isAnimating) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            navigatePrev();
        } else {
            navigateNext();
        }
    }
});

// ============================================
// Utility Functions
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent values
}, 250));

// Preload animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

