document.addEventListener('DOMContentLoaded', function () {
    loadHeaderAndFooter();
});

function loadHeaderAndFooter() {
    // Load header
    fetch('/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                initializeHeader();
            } else {
                console.error('Header placeholder not found in the DOM.');
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                console.log('Footer successfully loaded');
                initializeFooter();
            } else {
                console.error('Footer placeholder not found in the DOM.');
            }
        })
        .catch(error => console.error('Error loading footer:', error));
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
            { text: '  ★  11 live AI & JS tools at johnb.io', cls: 't-hi' },
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
            { text: '  /aitocv         AI CV Enhancer', cls: 't-hi' },
            { text: '  /lm-chat        LLM Chat Interface', cls: 't-hi' },
            { text: '  /transcripts    YouTube Transcript Tool', cls: 't-hi' },
            { text: '  /rai            AI Governance Framework', cls: 't-hi' },
            { text: '  /zzmystery      Zig Zag Drop Slot', cls: 't-hi' },
            { text: '  /bankroll       Poker Bankroll Calculator', cls: 't-hi' },
            { text: '  /editor         AI Copyeditor', cls: 't-hi' },
            { text: '  /calculator     Bill Calculator', cls: 't-hi' },
            { text: '  /ebay           eBay Price Tracker', cls: 't-hi' },
            { text: '  /genz           Gen Z Translator', cls: 't-hi' },
            { text: '  /text-to-voice  Text to Voice', cls: 't-hi' },
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
    console.log('Cookie banner:', cookieBanner); // Debug log

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