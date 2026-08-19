/*
 * about.js — progressive enhancement only.
 *
 * The six skill panels are rendered statically in about.html so they exist for
 * crawlers that never run JavaScript (GPTBot, ClaudeBot, PerplexityBot, CCBot).
 * Without JS every panel is visible and readable. With JS this file turns the
 * buttons into a tab strip and shows one panel at a time. Never move the skill
 * data back into this file.
 */
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('skill-details');
    const tablist = document.querySelector('.skill-buttons-container');
    const buttons = Array.prototype.slice.call(document.querySelectorAll('.skill-button'));
    const panels = container
        ? Array.prototype.slice.call(container.querySelectorAll('.skill-panel'))
        : [];

    if (container && tablist && buttons.length && panels.length) {
        container.classList.add('js-tabs');
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-label', 'Skill categories');

        buttons.forEach(function (button, index) {
            const panel = document.getElementById('skill-panel-' + button.dataset.skill);
            button.setAttribute('role', 'tab');
            if (panel) {
                button.setAttribute('aria-controls', panel.id);
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', button.id);
                panel.setAttribute('tabindex', '0');
            }
            button.addEventListener('click', function () {
                selectTab(index);
            });
            button.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                event.preventDefault();
                const step = event.key === 'ArrowRight' ? 1 : -1;
                const next = (index + step + buttons.length) % buttons.length;
                selectTab(next);
                buttons[next].focus();
            });
        });

        selectTab(0);
    }

    function selectTab(activeIndex) {
        buttons.forEach(function (button, index) {
            const isActive = index === activeIndex;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        panels.forEach(function (panel, index) {
            panel.classList.toggle('active', index === activeIndex);
        });
    }

    // Profile image swap on hover
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function () {
            profileImage.src = '/images/jbcode.webp';
        });
        profileImage.addEventListener('mouseleave', function () {
            profileImage.src = '/images/JohnB.webp';
        });
    }
});
