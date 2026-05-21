document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = document.body.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));
    }

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const detailButtons = document.querySelectorAll('.btn-details');
    let lastFocused = null;

    function openProjectModal(projectId) {
        const template = document.getElementById(`detail-${projectId}`);
        if (!template || !modal || !modalBody) return;

        lastFocused = document.activeElement;
        modalBody.innerHTML = '';
        modalBody.appendChild(template.content.cloneNode(true));
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }

    function closeProjectModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (modalBody) modalBody.innerHTML = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    detailButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            if (projectId) openProjectModal(projectId);
        });
    });

    if (modal) {
        modal.querySelectorAll('[data-close-modal]').forEach((el) => {
            el.addEventListener('click', closeProjectModal);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
            closeProjectModal();
        }
    });
});
