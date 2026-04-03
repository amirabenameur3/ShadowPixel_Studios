// =========================
// DOM ELEMENTS
// =========================

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const menuIcon = document.querySelector('.menu-icon');
const header = document.querySelector('header');
const revealElements = document.querySelectorAll('.reveal');

// Modal open buttons
const openEclipseModalButton = document.getElementById('open-eclipse-modal');
const openNeonModalButton = document.getElementById('open-neon-modal');
const openEchoesModalButton = document.getElementById('open-echoes-modal');
const openForestboundModalButton = document.getElementById('open-forestbound-modal');
const openEclipseRealmModalButton = document.getElementById('open-eclipse-realm-modal');
const openNeonDriftModalButton = document.getElementById('open-neon-drift-modal');
const openAetherfallModalButton = document.getElementById('open-aetherfall-modal');

// Modal elements
const eclipseModal = document.getElementById('modal-eclipse-realm');
const neonModal = document.getElementById('modal-neon-drift');
const echoesModal = document.getElementById('modal-echoes-of-titan');
const forestboundModal = document.getElementById('modal-forestbound');
const eclipseRealmModal = document.getElementById('modal-eclipse-trailer');
const neonDriftModal = document.getElementById('modal-neon-drift-update');
const aetherfallModal = document.getElementById('modal-aetherfall');

// Modal state
let activeModal = null;
let lastFocusedElement = null;

// =========================
// MOBILE MENU
// =========================

function closeMenu() {
    mobileNav.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuIcon.textContent = '☰';
}

menuButton.addEventListener('click', function () {
    mobileNav.classList.toggle('active');

    const isOpen = mobileNav.classList.contains('active');
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuIcon.textContent = isOpen ? '✖' : '☰';
});

mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        closeMenu();
    });
});

document.addEventListener('click', function (event) {
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

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
});

revealElements.forEach(function (element, index) {
    element.style.transitionDelay = `${index * 0.1}s`;
});

revealElements.forEach(function (element) {
    observer.observe(element);
});

// =========================
// MODAL FOCUS TRAP
// =========================

function trapFocus(modal) {
    if (modal.dataset.trapFocusInitialized === 'true') return;

    const focusableElements = modal.querySelectorAll(
        'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;

        if (focusableElements.length === 1) {
            event.preventDefault();
            firstElement.focus();
            return;
        }

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    modal.dataset.trapFocusInitialized = 'true';
}

// =========================
// MODAL OPEN / CLOSE
// =========================

function openModal(modal, triggerButton) {
    if (!modal) return;

    lastFocusedElement = triggerButton;
    modal.hidden = false;

    requestAnimationFrame(function () {
        modal.classList.add('active');
        modal.focus();
        trapFocus(modal);
    });

    document.body.style.overflow = 'hidden';
    activeModal = modal;
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('active');

    setTimeout(function () {
        modal.hidden = true;

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }, 300);

    document.body.style.overflow = '';
    activeModal = null;
}

// =========================
// MODAL OPEN BUTTON EVENTS
// =========================

if (openEclipseModalButton && eclipseModal) {
    openEclipseModalButton.addEventListener('click', function () {
        openModal(eclipseModal, openEclipseModalButton);
    });
}

if (openNeonModalButton && neonModal) {
    openNeonModalButton.addEventListener('click', function () {
        openModal(neonModal, openNeonModalButton);
    });
}

if (openEchoesModalButton && echoesModal) {
    openEchoesModalButton.addEventListener('click', function () {
        openModal(echoesModal, openEchoesModalButton);
    });
}

if (openForestboundModalButton && forestboundModal) {
    openForestboundModalButton.addEventListener('click', function () {
        openModal(forestboundModal, openForestboundModalButton);
    });
}

if (openEclipseRealmModalButton && eclipseRealmModal) {
    openEclipseRealmModalButton.addEventListener('click', function () {
        openModal(eclipseRealmModal, openEclipseRealmModalButton);
    });
}

if (openNeonDriftModalButton && neonDriftModal) {
    openNeonDriftModalButton.addEventListener('click', function () {
        openModal(neonDriftModal, openNeonDriftModalButton);
    });
}

if (openAetherfallModalButton && aetherfallModal) {
    openAetherfallModalButton.addEventListener('click', function () {
        openModal(aetherfallModal, openAetherfallModalButton);
    });
}

// =========================
// MODAL CLOSE EVENTS
// =========================

const allModals = [eclipseModal, neonModal, echoesModal, forestboundModal, eclipseRealmModal, neonDriftModal, aetherfallModal];

allModals.forEach(function (modal) {
    if (!modal) return;

    const closeButton = modal.querySelector('.close-modal');
    const modalBox = modal.querySelector('.modal');

    if (closeButton) {
        closeButton.addEventListener('click', function () {
            closeModal(modal);
        });
    }

    modal.addEventListener('click', function () {
        closeModal(modal);
    });

    if (modalBox) {
        modalBox.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
});

// =========================
// ESCAPE KEY SUPPORT
// =========================

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (mobileNav.classList.contains('active')) {
            closeMenu();
        }

        if (activeModal) {
            closeModal(activeModal);
        }
    }
});

// =========================
// MODAL CTA NAVIGATION
// =========================

const modalJumpLinks = document.querySelectorAll('.modal-jump-link');

modalJumpLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (!targetElement || !activeModal) return;

        closeModal(activeModal);

        setTimeout(function () {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        }, 300);
    });
});
