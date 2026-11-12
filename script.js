/**
 * SAPCCOL website interactions
 * Vanilla JavaScript — no framework or build step required.
 * Source: original single-file SAPCCOL website.
 */
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Keep mobile navigation accessible and restore scrolling on close. */
function initNavigation() {
    const nav = $('#mn');
    const menu = $('#nl');
    const toggle = $('#hbg');
    const topButton = $('#stbtn');
    if (!nav || !menu || !toggle) return;

    function setMenuOpen(open) {
        toggle.classList.toggle('open', open);
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => {
        setMenuOpen(!menu.classList.contains('open'));
    });

    $$('#nl a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenuOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setMenuOpen(false);
    });

    const sections = $$('section[id]');
    const links = $$('.nl a');
    let ticking = false;

    function updateOnScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        topButton?.classList.toggle('vis', window.scrollY > 400);
        let current = '';
        for (const section of sections) {
            if (window.scrollY >= section.offsetTop - 130) current = section.id;
        }
        for (const link of links) {
            const active = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('nav-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });

    topButton?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateOnScroll();
}

/** Manage the independent Academics and Fees tab groups. */
function initTabs() {
    for (const bar of $$('.tbar')) {
        const section = bar.closest('section');
        if (!section) continue;
        const buttons = $$('.tbtn', bar);
        const panels = $$('.tpanel', section);
        buttons.forEach((button, index) => {
            const panel = panels[index];
            if (!panel) return;
            const active = button.classList.contains('active');
            button.setAttribute('aria-controls', panel.id);
            button.setAttribute('aria-selected', String(active));
            button.setAttribute('role', 'tab');
            button.tabIndex = active ? 0 : -1;
            panel.setAttribute('role', 'tabpanel');
            panel.hidden = !active;

            function activate() {
                buttons.forEach((candidate, i) => {
                    const selected = candidate === button;
                    candidate.classList.toggle('active', selected);
                    candidate.setAttribute('aria-selected', String(selected));
                    candidate.tabIndex = selected ? 0 : -1;
                    panels[i]?.classList.toggle('active', selected);
                    if (panels[i]) panels[i].hidden = !selected;
                });
                panel.classList.add('vis');
            }
            button.addEventListener('click', activate);
            button.addEventListener('keydown', event => {
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
                    (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
                buttons[next].focus();
                buttons[next].click();
            });
        });
        bar.setAttribute('role', 'tablist');
    }
}

/** Reveal content as it enters the viewport, with a safe fallback. */
function initRevealAnimations() {
    const elements = $$('.rv, .rvl, .rvr');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elements.forEach(element => element.classList.add('vis'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    elements.forEach(element => observer.observe(element));
}

/** Hide unavailable photos; keep the original gallery fallback labels. */
function initImages() {
    $$('.hbg2 img').forEach(img => {
        const show = () => img.classList.add('loaded');
        if (img.complete && img.naturalWidth) show();
        img.addEventListener('load', show);
    });
    $$('.aiph img').forEach(img => {
        img.addEventListener('error', () => { img.style.display = 'none'; });
        if (img.complete && !img.naturalWidth) img.style.display = 'none';
    });
    $$('.gtile img').forEach(img => {
        const placeholder = $('.gph', img.parentElement);
        const loaded = () => { if (placeholder) placeholder.style.display = 'none'; };
        const failed = () => { img.style.display = 'none'; };
        img.addEventListener('load', loaded);
        img.addEventListener('error', failed);
        if (img.complete) (img.naturalWidth ? loaded : failed)();
    });
}

/**
 * Prepare a mailto draft instead of falsely claiming the enquiry was sent.
 * A production deployment needs a backend endpoint and anti-spam protection.
 */
function initEnquiry() {
    const button = $('#sendEnquiry');
    const message = $('#fmsg');
    if (!button || !message) return;
    button.addEventListener('click', () => {
        const first = $('#fn')?.value.trim() || '';
        const last = $('#ln')?.value.trim() || '';
        const phone = $('#ph')?.value.trim() || '';
        const type = $('#eq')?.value || 'General Enquiry';
        const details = $('#msg')?.value.trim() || '';
        if (!first || !phone) {
            message.textContent = 'Please provide your first name and phone number.';
            message.classList.add('is-visible');
            (!first ? $('#fn') : $('#ph'))?.focus();
            return;
        }
        const subject = `SAPCCOL enquiry: ${type}`;
        const body = `Name: ${first} ${last}\nPhone: ${phone}\nTopic: ${type}\n\n${details}`;
        const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        message.textContent = 'Your email application will open with a prepared message. Please enter the school’s confirmed email address and send it yourself; nothing has been submitted yet.';
        message.classList.add('is-visible');
        window.location.href = mailto;
    });
}

/** Animate the original hero motto; respect reduced-motion preferences. */
function initMotto() {
    const element = $('#hmotto');
    if (!element) return;
    const motto = 'Faith and Integrity, Key to Genuine Intellectual Excellence';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = motto;
        return;
    }
    let index = 0;
    function typeNext() {
        if (index > motto.length) return;
        element.textContent = motto.slice(0, index);
        index += 1;
        setTimeout(typeNext, index === 1 ? 800 : 38);
    }
    setTimeout(typeNext, 1200);
}

/** Preserve the page loader, but always dismiss it if loading stalls. */
function initLoader() {
    const loader = $('#loader');
    const fill = $('#ldrFill');
    if (!loader || !fill) return;
    let progress = 0;
    const interval = setInterval(() => {
        progress = Math.min(progress + (Math.random() * 12 + 4), 92);
        fill.style.width = `${progress}%`;
        if (progress >= 92) clearInterval(interval);
    }, 60);
    const finish = () => {
        clearInterval(interval);
        fill.style.width = '100%';
        setTimeout(() => loader.classList.add('done'), 400);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    setTimeout(() => loader.classList.add('done'), 3000);
}

function main() {
    initNavigation();
    initTabs();
    initRevealAnimations();
    initImages();
    initEnquiry();
    initMotto();
    initLoader();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
} else {
    main();
}
