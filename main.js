// =========================
// DOM ELEMENTS
// =========================

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const menuIcon = document.querySelector('.menu-icon');
const header = document.querySelector('.site-header');
const revealElements = document.querySelectorAll('.reveal');

// =========================
// MODAL ELEMENTS
// =========================

const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
const modalCloseButtons = document.querySelectorAll('[data-close-modal]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const modalJumpLinks = document.querySelectorAll('.modal-jump-link');

// =========================
// MODAL STATE
// =========================

let activeModal = null;
let lastFocusedElement = null;

// =========================
// MOBILE MENU
// =========================

function closeMenu() {
    if(!mobileNav || !menuButton || !menuIcon) return;

    mobileNav.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuIcon.textContent = '☰';
}

function openMenu() {
    if (!mobileNav || !menuButton || !menuIcon) return;

    mobileNav.classList.add('active');
    menuButton.setAttribute('aria-expanded', 'true');
    menuIcon.textContent = '✖';
}

if (menuButton) {
    menuButton.addEventListener('click', function () {
        const isOpen = mobileNav.classList.contains('active');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        closeMenu();
    });
});

document.addEventListener('click', function (event) {
    if (!mobileNav || !menuButton) return;

    const clickedButton = menuButton.contains(event.target);
    const clickedNav = mobileNav.contains(event.target);
    const isOpen = mobileNav.classList.contains('active');

    if (!clickedButton && !clickedNav && isOpen) {
        closeMenu();
    }
});

// =========================
// HEADER SCROLL EFFECT
// =========================

window.addEventListener('scroll', function () {
    if(!header) return;

    const isScrolled = window.scrollY > 50;

    if (isScrolled && !header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
    } else if (!isScrolled && header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
    }
});

// =========================
// SCROLL REVEAL
// =========================

if (revealElements.length > 0) {
    const observer = new IntersectionObserver(function (entries, revealObserver) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(function (element, index) {
        element.style.transitionDelay = `${index * 0.1}s`;
    });

    revealElements.forEach(function (element) {
        observer.observe(element);
    });
}

// =========================
// MODAL HELPERS
// =========================

function getFocusableElements(container) {
    return container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
}

function trapFocus(event) {
    if (!activeModal || event.key !== 'Tab') return;

    const modalBox = activeModal.querySelector('.modal');
    if (!modalBox) return;

    const focusableElements = getFocusableElements(modalBox);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

function openModal(modal, triggerButton) {
    if (!modal) return;

    if (activeModal && activeModal !== modal) {
        closeModal(activeModal, false);
    }

    activeModal = modal;
    lastFocusedElement = triggerButton || document.activeElement;

    modal.hidden = false;

    requestAnimationFrame(function () {
        modal.classList.add('active');

        const modalBox = modal.querySelector('.modal');
        if (modalBox) {
            modalBox.focus();
        }
    });

    document.body.classList.add('modal-open');
}

function closeModal(modal, restoreFocus = true) {
    if (!modal) return;

    modal.classList.remove('active');

    setTimeout(function () {
        modal.hidden = true;

        if (restoreFocus && lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }, 300);

    document.body.classList.remove('modal-open');

    if (activeModal === modal) {
        activeModal = null;
    }
}

// =========================
// MODAL OPEN EVENTS
// =========================

modalOpenButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const modalId = button.dataset.modalTarget;
        const modal = document.getElementById(modalId);

        openModal(modal, button);
    });
});

// =========================
// MODAL CLOSE EVENTS
// =========================

modalCloseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const modal = button.closest('.modal-overlay');
        closeModal(modal);
    });
});

modalOverlays.forEach(function (overlay) {
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

// =========================
// ESCAPE KEY SUPPORT
// =========================

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (activeModal) {
            closeModal(activeModal);
            return;
        }

        if (mobileNav && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    }

    trapFocus(event);
});

// =========================
// MODAL CTA NAVIGATION
// =========================

modalJumpLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (!targetElement || !activeModal) return;

        closeModal(activeModal, false);

        setTimeout(function () {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    });
});