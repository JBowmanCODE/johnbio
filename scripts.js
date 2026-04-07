document.addEventListener('DOMContentLoaded', function () {
    loadHeaderAndFooter();
    initShareBar();
    // Set skip-nav target on the page's main element
    const mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) mainEl.id = 'main-content';
});

function loadHeaderAndFooter() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Load header (use sessionStorage cache to avoid flash on navigation)
    const cachedHeader = sessionStorage.getItem('site-header-v4');
    if (cachedHeader && headerPlaceholder) {
        headerPlaceholder.innerHTML = cachedHeader;
        initializeHeader();
    } else {
        fetch('/header.html?v=4')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = data;
                    sessionStorage.setItem('site-header-v4', data);
                    initializeHeader();
                }
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer (use sessionStorage cache)
    const cachedFooter = sessionStorage.getItem('site-footer');
    if (cachedFooter && footerPlaceholder) {
        footerPlaceholder.innerHTML = cachedFooter;
        initializeFooter();
    } else {
        fetch('/footer.html?v=2')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = data;
                    sessionStorage.setItem('site-footer', data);
                    initializeFooter();
                }
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// Initialize header functionality
function initializeHeader() {
    // Logo typewriter hover effect
    const logoText = document.getElementById('logo-text');
    if (logoText) {
        const original = 'JohnB.io';
        const hoverText = 'John Bowman';
        let timer = null;
        const logoLink = logoText.closest('a');

        // Lock width to fit the wider hover text so nav never shifts
        logoText.textContent = hoverText;
        logoLink.style.minWidth = logoLink.offsetWidth + 'px';
        logoText.textContent = original;

        logoLink.addEventListener('mouseenter', () => {
            clearTimeout(timer);
            let i = 0;
            logoText.textContent = '';
            function type() {
                if (i < hoverText.length) {
                    logoText.textContent += hoverText.charAt(i++);
                    timer = setTimeout(type, 60);
                }
            }
            type();
        });

        logoLink.addEventListener('mouseleave', () => {
            clearTimeout(timer);
            logoText.textContent = original;
        });
    }

    initializeTerminal();
    initializeIdeasModal();
    initializeMobileDrawer();
}

function initializeMobileDrawer() {
    const btn     = document.getElementById('hamburger-btn');
    const drawer  = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const closeBtn = document.getElementById('mobile-drawer-close');
    if (!btn || !drawer) return;

    function openDrawer()  { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }

    btn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    const mobileIdeasBtn    = document.getElementById('mobile-ideas-btn');
    const mobileTerminalBtn = document.getElementById('mobile-terminal-btn');
    if (mobileIdeasBtn)    mobileIdeasBtn.addEventListener('click', () => { closeDrawer(); document.getElementById('ideas-btn').click(); });
    if (mobileTerminalBtn) mobileTerminalBtn.addEventListener('click', () => { closeDrawer(); document.getElementById('terminal-btn').click(); });
}

function initializeIdeasModal() {
    const btn   = document.getElementById('ideas-btn');
    const modal = document.getElementById('ideas-modal');
    const close = document.getElementById('ideas-close');
    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    });
    close.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

function initializeTerminal() {
    const btn    = document.getElementById('terminal-btn');
    const modal  = document.getElementById('terminal-modal');
    const closeBtn = document.getElementById('terminal-close');
    const output = document.getElementById('terminal-output');
    const input  = document.getElementById('terminal-input');
    if (!btn || !modal) return;

    let cmdHistory = [];
    let historyIndex = -1;

    btn.addEventListener('click', openTerminal);
    closeBtn.addEventListener('click', closeTerminal);
    modal.addEventListener('click', e => { if (e.target === modal) closeTerminal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeTerminal();
    });

    function openTerminal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 250);
        if (output.children.length === 0) printWelcome();
    }

    function closeTerminal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    function esc(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function printLines(lines, baseDelay) {
        const delay = baseDelay !== undefined ? baseDelay : 35;
        lines.forEach((line, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                if (line.html) div.innerHTML = line.text;
                else div.textContent = line.text;
                if (line.cls) div.className = line.cls;
                output.appendChild(div);
                output.scrollTop = output.scrollHeight;
            }, i * delay);
        });
        // blank spacer after block
        setTimeout(() => {
            const spacer = document.createElement('div');
            output.appendChild(spacer);
            output.scrollTop = output.scrollHeight;
        }, lines.length * delay + 20);
    }

    function printCommand(cmd) {
        const div = document.createElement('div');
        div.innerHTML = `<span class="t-dim">john@johnb.io:~$</span> <span class="t-cmd">${esc(cmd)}</span>`;
        output.appendChild(div);
    }

    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                input.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        } else if (e.key === 'Enter') {
            const cmd = input.value.trim();
            input.value = '';
            historyIndex = -1;
            if (!cmd) return;
            cmdHistory.push(cmd);
            printCommand(cmd);
            processCommand(cmd.toLowerCase());
        }
    });

    function processCommand(cmd) {
        switch (cmd.split(' ')[0]) {
            case 'help':         cmdHelp();         break;
            case 'whoami':       cmdWhoami();       break;
            case 'contact':      cmdContact();      break;
            case 'experience':   cmdExperience();   break;
            case 'achievements': cmdAchievements(); break;
            case 'skills':       cmdSkills();       break;
            case 'education':    cmdEducation();    break;
            case 'projects':     cmdProjects();     break;
            case 'linkedin':     cmdLinkedin();     break;
            case 'clear':        output.innerHTML = ''; break;
            case 'exit':         closeTerminal();   break;
            case 'delete':       cmdDelete();       break;
            default:
                printLines([{ text: `bash: ${esc(cmd)}: command not found. Try <span class="t-cmd">help</span>`, cls: 't-err', html: true }], 0);
        }
    }

    function printWelcome() {
        printLines([
            { text: '╔══════════════════════════════════════════════╗', cls: 't-dim' },
            { text: '║   Welcome to John Bowman\'s Interactive CV    ║', cls: 't-head' },
            { text: '╚══════════════════════════════════════════════╝', cls: 't-dim' },
            { text: '' },
            { text: 'Type <span class="t-cmd">help</span> to see available commands, or type <span class="t-cmd">contact</span> to see contact details.', html: true },
            { text: '' },
        ], 40);
    }

    function cmdHelp() {
        printLines([
            { text: 'Type "whoami" for [Who is John Bowman?]', cls: 't-hi' },
            { text: 'Type "contact" for [Phone, email & location]', cls: 't-hi' },
            { text: 'Type "experience" for [Career history]', cls: 't-hi' },
            { text: 'Type "achievements" for [Key wins & milestones]', cls: 't-hi' },
            { text: 'Type "skills" for [Technical & professional skills]', cls: 't-hi' },
            { text: 'Type "education" for [Qualifications & courses]', cls: 't-hi' },
            { text: 'Type "projects" for [johnb.io project list]', cls: 't-hi' },
            { text: 'Type "linkedin" for [Open LinkedIn profile]', cls: 't-hi' },
            { text: 'Type "clear" for [Clear the terminal]', cls: 't-hi' },
            { text: 'Type "exit" for [Close this window]', cls: 't-hi' },
            { text: 'Type "delete" for [deleting this site and all it\'s backup files]', cls: 't-hi' },
        ]);
    }

    function cmdWhoami() {
        printLines([
            { text: '── whoami ──────────────────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  John Bowman', cls: 't-cmd' },
            { text: '' },
            { text: '  AI Engineer & Digital Leader based in Leeds, UK.', cls: 't-val' },
            { text: '  15+ years driving digital strategy, SEO, and', cls: 't-val' },
            { text: '  product across the online gaming industry.', cls: 't-val' },
            { text: '  Now building LLM-powered tools at johnb.io.', cls: 't-val' },
            { text: '' },
            { text: '  → contact | experience | skills', cls: 't-dim' },
        ]);
    }

    function cmdContact() {
        printLines([
            { text: '── Contact ─────────────────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  phone      +44 7872 039 124', cls: 't-hi' },
            { text: '  email      ukjbowman@gmail.com', cls: 't-hi' },
            { text: '  location   Leeds, LS18, UK', cls: 't-hi' },
            { text: '  linkedin   linkedin.com/in/john-bowman', cls: 't-hi' },
            { text: '  website    johnb.io', cls: 't-hi' },
            { text: '' },
            { text: '  Type <span class="t-cmd">linkedin</span> to open LinkedIn.', cls: 't-dim', html: true },
        ]);
    }

    function cmdExperience() {
        printLines([
            { text: '── Experience ──────────────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  AI Engineer · johnb.io  (2024 – Present)', cls: 't-cmd' },
            { text: '  Building LLM tools with Claude, OpenAI &', cls: 't-val' },
            { text: '  Gemini APIs, RAG pipelines, Cloudflare Workers.', cls: 't-val' },
            { text: '' },
            { text: '  Head of Digital Products · iGaming', cls: 't-cmd' },
            { text: '  Led 90+ person cross-functional teams across', cls: 't-val' },
            { text: '  digital, SEO & content — 24 language markets.', cls: 't-val' },
            { text: '  Budget ownership: £1.5M+.', cls: 't-val' },
            { text: '' },
            { text: '  Digital & SEO Manager · Online Poker/Casino', cls: 't-cmd' },
            { text: '  Scaled digital acquisition, CRM, PPC, affiliate', cls: 't-val' },
            { text: '  and conversion optimisation strategies.', cls: 't-val' },
            { text: '' },
            { text: '  Poker Operations · 40 Countries', cls: 't-cmd' },
            { text: '  Multilingual ops, fraud investigations,', cls: 't-val' },
            { text: '  chargeback recovery (£150k+), live events media.', cls: 't-val' },
        ]);
    }

    function cmdAchievements() {
        printLines([
            { text: '── Achievements ────────────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  ★  Led teams of 90+ across digital operations', cls: 't-hi' },
            { text: '  ★  Budget management of £1.5M+', cls: 't-hi' },
            { text: '  ★  SEO strategy across 24 language markets', cls: 't-hi' },
            { text: '  ★  Recovered £150k+ in chargebacks', cls: 't-hi' },
            { text: '  ★  Multilingual operations across 40 countries', cls: 't-hi' },
            { text: '  ★  Oxford University AI Programme (2024)', cls: 't-hi' },
            { text: '  ★  IBM Generative AI Engineering (2026)', cls: 't-hi' },
            { text: '  ★  19 live AI & JS tools at johnb.io', cls: 't-hi' },
        ]);
    }

    function cmdSkills() {
        printLines([
            { text: '── Skills ──────────────────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  AI & Engineering', cls: 't-cmd' },
            { text: '  Claude / OpenAI / Gemini APIs, RAG, LangChain,', cls: 't-val' },
            { text: '  Prompt Engineering, Python, PyTorch, Computer', cls: 't-val' },
            { text: '  Vision, Cloudflare Workers, Automation Scripts', cls: 't-val' },
            { text: '' },
            { text: '  Leadership', cls: 't-cmd' },
            { text: '  Team Leadership (90+), £1.5M+ Budget, Product', cls: 't-val' },
            { text: '  Ownership, Stakeholder Comms, Multi-project Delivery', cls: 't-val' },
            { text: '' },
            { text: '  Digital & SEO', cls: 't-cmd' },
            { text: '  SEO (24 markets), CRM, PPC, Affiliate, Google', cls: 't-val' },
            { text: '  Analytics, Social Media, Conversion Optimisation', cls: 't-val' },
            { text: '' },
            { text: '  Creative & Tools', cls: 't-cmd' },
            { text: '  Photoshop, DaVinci Resolve, AI Image/Video/Music,', cls: 't-val' },
            { text: '  Excel, PowerPoint, Storytelling, Online Journalism', cls: 't-val' },
        ]);
    }

    function cmdEducation() {
        printLines([
            { text: '── Education & Qualifications ──────────────────', cls: 't-head' },
            { text: '' },
            { text: '  IBM — Generative AI Engineering                2026', cls: 't-hi' },
            { text: '  DataCamp — Responsible AI Practices            2026', cls: 't-hi' },
            { text: '  DataCamp — Understanding the EU AI Act         2026', cls: 't-hi' },
            { text: '  DataCamp — Python for Developers (Beg + Int)   2026', cls: 't-hi' },
            { text: '  Oxford University — AI Programme               2024', cls: 't-hi' },
            { text: '  SuperDataScience — AI + ChatGPT Briefing       2024', cls: 't-hi' },
            { text: '  365 Careers — Intro to ChatGPT & Gen AI        2024', cls: 't-hi' },
            { text: '  Udemy — GenAI Security & Compliance Program    2024', cls: 't-hi' },
            { text: '  Udemy — SEO 2023: Complete SEO Training        2023', cls: 't-hi' },
            { text: '  Udemy — Metaverse Masterclass                  2022', cls: 't-hi' },
            { text: '  Udemy — NFT Fundamentals                       2022', cls: 't-hi' },
            { text: '  Udemy — Master CSS3 Flexbox                    2021', cls: 't-hi' },
            { text: '  Udemy — Asana Project Management               2021', cls: 't-hi' },
            { text: '  Udemy — An Entire MBA in 1 Course              2021', cls: 't-hi' },
            { text: '  Udemy — Learn Figma: UI/UX Design              2021', cls: 't-hi' },
            { text: '  CalArts — UI/UX Design                         2021', cls: 't-hi' },
            { text: '  CalArts — Web Design: Wireframes to Prototypes 2021', cls: 't-hi' },
            { text: '  CalArts — Web Design: Strategy & Info Arch     2021', cls: 't-hi' },
            { text: '  CalArts — UX Design Fundamentals               2021', cls: 't-hi' },
            { text: '  CalArts — Visual Elements of UI Design         2021', cls: 't-hi' },
            { text: '  Rutgers University — New Tech for Biz Leaders  2020', cls: 't-hi' },
            { text: '  Digital Marketing Institute — Pro Diploma      2016', cls: 't-hi' },
        ]);
    }

    function cmdProjects() {
        printLines([
            { text: '── Projects @ johnb.io ─────────────────────────', cls: 't-head' },
            { text: '' },
            { text: '  AI Tools', cls: 't-cmd' },
            { text: '  /aitocv              AI CV Enhancer', cls: 't-hi' },
            { text: '  /lm-chat             LLM Chat Interface', cls: 't-hi' },
            { text: '  /transcripts         YouTube Transcript Tool', cls: 't-hi' },
            { text: '  /rai                 AI Governance Framework', cls: 't-hi' },
            { text: '  /editor              AI Copyeditor', cls: 't-hi' },
            { text: '  /genz                Gen Z Translator', cls: 't-hi' },
            { text: '  /text-to-speech      Text to Speech', cls: 't-hi' },
            { text: '', cls: '' },
            { text: '  Python / JS', cls: 't-cmd' },
            { text: '  /zzmystery           Zig Zag Drop Slot', cls: 't-hi' },
            { text: '  /bankroll            Poker Bankroll Calculator', cls: 't-hi' },
            { text: '  /calculator          Bill Calculator', cls: 't-hi' },
            { text: '  /ebay                eBay Price Tracker', cls: 't-hi' },
            { text: '  /text-to-voice       Text to Voice', cls: 't-hi' },
            { text: '  /igaming-compliance  iGaming Compliance Map', cls: 't-hi' },
            { text: '  /bonus-calculator    Bonus Cost Calculator', cls: 't-hi' },
            { text: '  /rg-generator        RG Message Generator', cls: 't-hi' },
            { text: '', cls: '' },
            { text: '  Digital AI Tools', cls: 't-cmd' },
            { text: '  /content-repurposer  Content Repurposer', cls: 't-hi' },
            { text: '  /promo-copy          iGaming Promo Copy Generator', cls: 't-hi' },
            { text: '  /igaming-jargon      iGaming Jargon Translator', cls: 't-hi' },
            { text: '  /llms-generator      LLMs.txt Generator', cls: 't-hi' },
        ]);
    }

    function cmdDelete() {
        // Shake the terminal window
        const win = document.querySelector('.terminal-window');
        if (win) {
            win.classList.add('glitching');
            win.addEventListener('animationend', () => win.classList.remove('glitching'), { once: true });
        }
        // Flash the screen
        let overlay = document.getElementById('glitch-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'glitch-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.remove('active');
        void overlay.offsetWidth;
        overlay.classList.add('active');
        // Fake deletion sequence
        printLines([
            { text: '> rm -rf /var/www/johnb.io/*', cls: 't-err' },
            { text: '> Deleting index.html...', cls: 't-err' },
            { text: '> Deleting all backup files...', cls: 't-err' },
            { text: '> Deleting everything...', cls: 't-err' },
            { text: '' },
            { text: '> just kidding :)', cls: 't-cmd' },
            { text: '> hey why would you do that', cls: 't-dim' },
        ], 180);
    }

    function cmdLinkedin() {
        printLines([{ text: 'Opening LinkedIn in a new tab...', cls: 't-dim' }], 0);
        setTimeout(() => window.open('https://linkedin.com/in/john-bowman', '_blank'), 400);
    }
}

// Toggle dark mode functionality
function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
}

// Initialize footer functionality (cookie banner logic moved here from footer.js)
function initializeFooter() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');

    if (!cookieBanner) {
        console.error('Cookie banner element not found in the footer.');
        return;
    }

    function setConsent(value) {
        localStorage.setItem('cookiesAccepted', value);
    }

    function getConsent() {
        return localStorage.getItem('cookiesAccepted');
    }

    function showCookieBanner() {
        cookieBanner.classList.remove('cookie-banner-hidden');
    }

    function hideCookieBanner() {
        cookieBanner.classList.add('cookie-banner-hidden');
    }

    function handleCookieAcceptance(accepted) {
        setConsent(accepted.toString());
        hideCookieBanner();
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => handleCookieAcceptance(true));
    }

    if (rejectButton) {
        rejectButton.addEventListener('click', () => handleCookieAcceptance(false));
    }

    const consent = getConsent();
    if (consent === null) {
        showCookieBanner();
    } else {
        hideCookieBanner();
    }
}

// Add info and download icons to the container
// NOTE: This function is kept for reference but not called globally.
// To use it, call addInfoIconAndDownloadIcon() only on the specific page that needs it,
// guarded by a URL check e.g: if (window.location.pathname.includes('/your-page')) { addInfoIconAndDownloadIcon(); }
function addInfoIconAndDownloadIcon() {
    const container = document.querySelector('.container');
    const title = document.querySelector('h1');

    if (!container || !title) {
        console.error('Container or title element not found. Cannot insert icons.');
        return;
    }

    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;margin-bottom:10px;';

    const infoIcon = document.createElement('i');
    infoIcon.className = 'fas fa-info-circle';
    infoIcon.style.cssText = 'margin-right:10px;cursor:pointer;';
    infoIcon.setAttribute('title', 'Please ensure your data includes the titles Date, Metric and Value');
    iconContainer.appendChild(infoIcon);

    const downloadIcon = document.createElement('i');
    downloadIcon.className = 'fas fa-download';
    downloadIcon.style.cursor = 'pointer';
    downloadIcon.setAttribute('title', 'Download example file');
    downloadIcon.onclick = function () {
        const exampleData = 'Date,Metric,Value\n2023,Website Views,300000\n2024,Website Views,425000';
        const blob = new Blob([exampleData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, 'example_data.csv');
        } else {
            link.href = URL.createObjectURL(blob);
            link.download = 'example_data.csv';
            link.click();
        }
    };
    iconContainer.appendChild(downloadIcon);

    container.appendChild(iconContainer);
}

// ── SHARE BAR ────────────────────────────────────────────────────────────────
function initShareBar() {
    const placeholder = document.getElementById('share-bar-placeholder');
    if (!placeholder) return;

    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title.replace(' — JohnB.io', '').trim());

    const buttons = [
        {
            cls: 'share-bar-btn--x',
            href: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            label: 'X',
            svg: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        },
        {
            cls: 'share-bar-btn--linkedin',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            label: 'LinkedIn',
            svg: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        },
        {
            cls: 'share-bar-btn--facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            label: 'Facebook',
            svg: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        },
        {
            cls: 'share-bar-btn--whatsapp',
            href: `https://wa.me/?text=${title}%20${url}`,
            label: 'WhatsApp',
            svg: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
        },
        {
            cls: 'share-bar-btn--reddit',
            href: `https://www.reddit.com/submit?url=${url}&title=${title}`,
            label: 'Reddit',
            svg: '<svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
        },
    ];

    const message = document.createElement('div');
    message.className = 'share-bar-message';
    message.innerHTML = `<span class="share-bar-message-inner"><span class="share-bar-message-front">If this saved you time, share it. Takes one click, &amp; genuinely helps.</span><span class="share-bar-message-back">Thank you, you're a legend</span></span>`;
    placeholder.before(message);

    const bar = document.createElement('div');
    bar.className = 'share-bar';

    buttons.forEach(function (btn) {
        const a = document.createElement('a');
        a.className = 'share-bar-btn ' + btn.cls;
        a.href = btn.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = btn.svg + btn.label;
        bar.appendChild(a);
    });

    // Discord — copy link button
    const discordBtn = document.createElement('button');
    discordBtn.className = 'share-bar-btn share-bar-btn--discord';
    discordBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord';
    discordBtn.title = 'Copy link for Discord';
    discordBtn.addEventListener('click', function () {
        const ta = document.createElement('textarea');
        ta.value = window.location.href;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
        discordBtn.classList.add('copied');
        const orig = discordBtn.innerHTML;
        discordBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Copied';
        setTimeout(function () {
            discordBtn.innerHTML = orig;
            discordBtn.classList.remove('copied');
        }, 2000);
    });
    bar.appendChild(discordBtn);

    placeholder.replaceWith(bar);
}