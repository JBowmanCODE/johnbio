/* ── RG MESSAGE GENERATOR ── */

const RG_DATA = {
  'uk': {
    name: 'United Kingdom (UKGC)',
    disclaimer: 'BeGambleAware.org. 18+. Play Responsibly.',
    extendedDisclaimer: 'Gambling is addictive, play responsibly. BeGambleAware.org. 18+ only. T&Cs apply.',
    helpline: 'https://www.begambleaware.org',
    helplineText: 'BeGambleAware.org | 0808 8020 133',
    ageRestriction: '18+',
    logos: ['BeGambleAware logo', 'GamCare logo', 'GamStop logo (online operators)', '18+ badge'],
    selfExclusion: 'GAMSTOP (gamstop.co.uk) — mandatory for UK-licensed online operators',
    channels: {
      email: 'Must include BeGambleAware.org, GamCare or similar link. Helpline number recommended. RG message must be clearly visible, not hidden in footer.',
      display: 'RG message must occupy at least 20% of the ad space (UKGC 2022 requirement). Font size legible. BeGambleAware.org required.',
      social: 'Ads must include RG message. Age-gating required. No targeting of under-25s for certain products. ASA CAP Code applies.',
      sms: 'BeGambleAware.org must be included. Keep it brief but clear: "18+ BeGambleAware.org"',
    },
    notes: 'UKGC SR Code 6.1.1 requires operators to display responsible gambling information prominently. Since October 2023, all UK-facing ads require a GamStop mention for online operators. The 20% ad space rule for display applies from April 2024.',
    regulator: 'UK Gambling Commission',
    regulatorUrl: 'https://www.gamblingcommission.gov.uk',
    strictness: 'high',
  },
  'malta': {
    name: 'Malta (MGA)',
    disclaimer: '18+ | Gambling can be addictive. Play responsibly. gamblingtherapy.org',
    extendedDisclaimer: '18+ only. Gambling can be harmful. Play responsibly. For support: gamblingtherapy.org',
    helpline: 'https://www.gamblingtherapy.org',
    helplineText: 'gamblingtherapy.org',
    ageRestriction: '18+',
    logos: ['MGA licence badge (mandatory on all licensed operator sites)', '18+ badge', 'Gambling Therapy logo'],
    selfExclusion: 'Youthful Offender Register and SAGA (Self-Assessment for Gambling Addiction)',
    channels: {
      email: 'Include responsible gambling message and link to gamblingtherapy.org. MGA-licensed sites must link to SAGA tool.',
      display: 'Must include 18+ and a responsible gambling message. gamblingtherapy.org link required.',
      social: 'MGA Social Media guidelines apply. Age restriction must be explicit. No targeting of minors.',
      sms: '18+ and gamblingtherapy.org URL required.',
    },
    notes: 'Malta Gaming Authority Player Protection Directive requires RG messaging on all marketing materials. MGA licence badge is mandatory on operator websites.',
    regulator: 'Malta Gaming Authority',
    regulatorUrl: 'https://www.mga.org.mt',
    strictness: 'medium',
  },
  'ontario': {
    name: 'Ontario, Canada (iGO)',
    disclaimer: '19+ | Know your limit, play within it. ConnexOntario.ca | 1-866-531-2600',
    extendedDisclaimer: 'Must be 19 years of age or older to play. If you or someone you know has a gambling problem, call ConnexOntario at 1-866-531-2600 or visit ConnexOntario.ca.',
    helpline: 'https://www.connexontario.ca',
    helplineText: 'ConnexOntario.ca | 1-866-531-2600',
    ageRestriction: '19+',
    logos: ['iGO Registered mark (mandatory for iGaming Ontario registered operators)', 'ConnexOntario logo', '19+ badge'],
    selfExclusion: 'GameSense (gamesense.com) — mandatory link on all iGO registered operator sites',
    channels: {
      email: 'Must include ConnexOntario.ca and phone number. iGO operators must include GameSense link.',
      display: 'Standard responsible gambling message with ConnexOntario contact. iGO "Registered" badge required.',
      social: 'Ontario AGCO advertising standards apply. Age restrictions and RG messaging mandatory.',
      sms: '19+ ConnexOntario.ca and phone number.',
    },
    notes: 'iGaming Ontario launched April 2022. All registered operators must include iGO branding and ConnexOntario details. The legal age for gambling in Ontario is 19.',
    regulator: 'Alcohol and Gaming Commission of Ontario (AGCO)',
    regulatorUrl: 'https://www.agco.ca',
    strictness: 'high',
  },
  'netherlands': {
    name: 'Netherlands (KSA)',
    disclaimer: '18+ | Speel bewust. Gok niet meer dan je je kunt veroorloven. verslavingszorg.nl',
    extendedDisclaimer: 'Gokken kan verslavend zijn. Speel alleen als je je het kunt veroorloven en ken je limieten. Hulp nodig? verslavingszorg.nl',
    helpline: 'https://www.verslavingszorg.nl',
    helplineText: 'verslavingszorg.nl (NL)',
    ageRestriction: '18+',
    logos: ['KSA licence mark (mandatory)', '18+ badge', 'CRUKS logo'],
    selfExclusion: 'CRUKS (Centraal Register Uitsluiting Kansspelen) — mandatory integration for all licensed operators',
    channels: {
      email: 'Dutch language RG message required for NL-facing marketing. CRUKS mention required.',
      display: 'KSA advertising code applies. RG message in Dutch. CRUKS mention.',
      social: 'Strict KSA advertising rules — no targeting under-24s, no use of celebrities popular with youth.',
      sms: 'Dutch: "18+ | Gok verantwoord. verslavingszorg.nl"',
    },
    notes: 'Netherlands online gambling market opened October 2021 under Koa (Remote Gambling Act). KSA enforces strict advertising rules. Operators must integrate CRUKS and cannot target players under 24 on social media.',
    regulator: 'Kansspelautoriteit (KSA)',
    regulatorUrl: 'https://www.kansspelautoriteit.nl',
    strictness: 'high',
  },
  'sweden': {
    name: 'Sweden (Spelinspektionen)',
    disclaimer: '18+ | Spela ansvarsfullt. Stödlinjen: 020-81 91 00 | stodlinjen.se',
    extendedDisclaimer: 'Spel kan vara beroendeframkallande. Spela bara med pengar du har råd att förlora. Hjälp: stodlinjen.se eller 020-81 91 00.',
    helpline: 'https://www.stodlinjen.se',
    helplineText: 'stodlinjen.se | 020-81 91 00',
    ageRestriction: '18+',
    logos: ['Spelinspektionen licence mark', '18+ badge', 'Stödlinjen logo'],
    selfExclusion: 'Spelpaus.se — national self-exclusion register, mandatory for all licensed operators',
    channels: {
      email: 'Swedish RG message required. Stödlinjen link and phone number.',
      display: 'Bonus advertising very restricted in Sweden — no "aggressive" marketing. RG message mandatory.',
      social: 'Sweden has strict rules on promotional marketing for gambling. Spelpaus.se must be referenced.',
      sms: '"18+ Spela ansvarsfullt. stodlinjen.se"',
    },
    notes: 'Sweden re-regulated gambling in January 2019. Spelinspektionen enforces strict moderation rules — particularly around bonuses. The "moderate marketing" requirement bans aggressive promotional campaigns.',
    regulator: 'Spelinspektionen',
    regulatorUrl: 'https://www.spelinspektionen.se',
    strictness: 'high',
  },
  'denmark': {
    name: 'Denmark (DGA)',
    disclaimer: '18+ | Spil ansvarligt. StopSpillet.dk | 70 22 28 25',
    extendedDisclaimer: 'Hasardspil kan være vanedannende. Spil ansvarligt og kun for beløb du har råd til at tabe. Hjælp: StopSpillet.dk | 70 22 28 25',
    helpline: 'https://www.stopspillet.dk',
    helplineText: 'StopSpillet.dk | 70 22 28 25',
    ageRestriction: '18+',
    logos: ['DGA licence mark', '18+ badge', 'StopSpillet logo', 'ROFUS logo'],
    selfExclusion: 'ROFUS (Register Over Frivilligt Udelukkede Spillere) — national self-exclusion, mandatory integration',
    channels: {
      email: 'Danish RG message and StopSpillet.dk required.',
      display: 'DGA advertising code. RG message in Danish. ROFUS mention.',
      social: 'DGA social media advertising guidelines apply. Age restrictions required.',
      sms: '"18+ Spil ansvarligt. StopSpillet.dk"',
    },
    notes: 'Denmark has regulated online gambling since 2012. DGA (Spillemyndighed) enforces advertising standards. ROFUS integration is mandatory.',
    regulator: 'Spillemyndighed (DGA)',
    regulatorUrl: 'https://www.spillemyndighed.dk',
    strictness: 'medium',
  },
  'germany': {
    name: 'Germany (GGL)',
    disclaimer: '18+ | Glücksspiel kann süchtig machen. Hilfe: Bundeszentrale für gesundheitliche Aufklärung | bzga.de | 0800 1 37 27 00',
    extendedDisclaimer: 'Glücksspiel kann süchtig machen. Spielen Sie verantwortungsbewusst. Hilfe und Beratung: bzga.de | kostenlos: 0800 1 37 27 00',
    helpline: 'https://www.bzga.de',
    helplineText: 'bzga.de | 0800 1 37 27 00 (kostenlos)',
    ageRestriction: '18+',
    logos: ['GGL licence mark (mandatory from 2024)', '18+ badge', 'BZgA logo'],
    selfExclusion: 'OASIS (cross-operator self-exclusion) — mandatory for all licensed operators from 2022',
    channels: {
      email: 'German RG message required. BZgA helpline number mandatory.',
      display: 'Strict GGL advertising rules. No advertising before 9pm on TV/radio. Online restrictions apply.',
      social: 'GGL has banned most social media gambling advertising. Very restricted.',
      sms: '"18+ Glücksspiel kann süchtig machen. bzga.de"',
    },
    notes: 'Germany Federal Gambling Treaty (GlüStV 2021) introduced unified online regulation. GGL (Gemeinsame Glücksspielbehörde der Länder) launched July 2022. OASIS mandatory self-exclusion, BZgA helpline mandatory on all materials.',
    regulator: 'Gemeinsame Glücksspielbehörde der Länder (GGL)',
    regulatorUrl: 'https://www.gluecksspielbehörde.de',
    strictness: 'high',
  },
  'ireland': {
    name: 'Ireland (GRSI)',
    disclaimer: '18+ | Gambling can be addictive. Problem Gambling Ireland: 1800 936 725',
    extendedDisclaimer: '18+ only. Gambling can harm you or someone you care about. For help call Problem Gambling Ireland on 1800 936 725 (free) or visit problemgambling.ie.',
    helpline: 'https://www.problemgambling.ie',
    helplineText: 'problemgambling.ie | 1800 936 725 (free)',
    ageRestriction: '18+',
    logos: ['18+ badge', 'Problem Gambling Ireland logo'],
    selfExclusion: 'No national scheme yet — Gambling Regulation Act 2024 implementation ongoing',
    channels: {
      email: 'Include Problem Gambling Ireland contact details. 18+ required.',
      display: 'RG message and helpline required. Ireland Gambling Regulation Act 2024 advertising rules apply from 2025.',
      social: 'Gambling Regulation Act 2024 restricts gambling advertising on social media.',
      sms: '"18+ | Help: 1800 936 725 | problemgambling.ie"',
    },
    notes: 'Ireland passed the Gambling Regulation Act 2024 in October 2024, establishing the Gambling Regulatory Authority of Ireland (GRAI). Full implementation including advertising restrictions is being phased in through 2025–2026.',
    regulator: 'Gambling Regulatory Authority of Ireland (GRAI)',
    regulatorUrl: 'https://www.grai.ie',
    strictness: 'medium',
  },
  'spain': {
    name: 'Spain (DGOJ)',
    disclaimer: '18+ | El juego puede crear adicción. Si necesitas ayuda llama al teléfono de atención al juego: 900 200 180',
    extendedDisclaimer: '18+ únicamente. Jugar puede crear adicción. Servicio de ayuda del juego: 900 200 180. juegoseguro.es',
    helpline: 'https://www.juegoseguro.es',
    helplineText: 'juegoseguro.es | 900 200 180',
    ageRestriction: '18+',
    logos: ['DGOJ authorisation mark', '18+ badge', 'Juego Seguro logo'],
    selfExclusion: 'RGIAJ (Registro General de Interdicciones de Acceso al Juego) — mandatory national self-exclusion',
    channels: {
      email: 'Spanish RG message and DGOJ helpline. RGIAJ mention recommended.',
      display: 'DGOJ advertising code. Spain banned most online gambling advertising from November 2020 (Royal Decree 958/2020).',
      social: 'Very restricted under Spanish regulations — bonus advertising and social media ads largely banned.',
      sms: '"18+ | Ayuda: 900 200 180 | juegoseguro.es"',
    },
    notes: 'Spain Royal Decree 958/2020 severely restricted gambling advertising. Bonus offers may only be marketed to opted-in existing customers. Sponsorships banned. Sports betting ads restricted to 1–5am.',
    regulator: 'Dirección General de Ordenación del Juego (DGOJ)',
    regulatorUrl: 'https://www.ordenacionjuego.es',
    strictness: 'very-high',
  },
  'gibraltar': {
    name: 'Gibraltar (GFSB)',
    disclaimer: '18+ | Please gamble responsibly. gamblingtherapy.org',
    extendedDisclaimer: 'You must be 18 or over to use this service. Please gamble responsibly. For support, visit gamblingtherapy.org',
    helpline: 'https://www.gamblingtherapy.org',
    helplineText: 'gamblingtherapy.org',
    ageRestriction: '18+',
    logos: ['Gibraltar licence badge', '18+ badge'],
    selfExclusion: 'No national mandatory scheme — operators implement own tools',
    channels: {
      email: '18+ and responsible gambling link.',
      display: 'Gibraltar Licensing Authority advertising guidelines apply. RG message required.',
      social: 'Standard responsible gambling messaging.',
      sms: '"18+ Please gamble responsibly. gamblingtherapy.org"',
    },
    notes: 'Gibraltar-licensed operators primarily serve the UK and European markets. Most must also comply with the UKGC or MGA requirements depending on where they accept players.',
    regulator: 'Gibraltar Gambling Commissioner (GFSB)',
    regulatorUrl: 'https://www.gibraltar.gov.gi/new/gambling',
    strictness: 'low',
  },
};

/* ── STRICTNESS CONFIG ── */
const STRICTNESS_LABELS = {
  'very-high': 'Very High Strictness',
  'high': 'High Strictness',
  'medium': 'Medium Strictness',
  'low': 'Low Strictness',
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {
  const jurisdictionSelect = document.getElementById('rg-jurisdiction');
  const channelSelect = document.getElementById('rg-channel');
  const resultsContainer = document.getElementById('rg-results');

  // Populate jurisdiction select
  Object.entries(RG_DATA).forEach(function ([key, data]) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = data.name;
    jurisdictionSelect.appendChild(option);
  });

  // Render on change
  jurisdictionSelect.addEventListener('change', render);
  channelSelect.addEventListener('change', render);

  // Initial render
  render();

  function render() {
    const jurisdictionKey = jurisdictionSelect.value;
    const channel = channelSelect.value;

    if (!jurisdictionKey) {
      resultsContainer.style.display = 'none';
      return;
    }

    const data = RG_DATA[jurisdictionKey];
    if (!data) {
      resultsContainer.style.display = 'none';
      return;
    }

    const isChannelSpecific = channel !== 'general';
    const disclaimerText = isChannelSpecific && channel === 'sms'
      ? (data.channels.sms || data.disclaimer)
      : (isChannelSpecific ? data.extendedDisclaimer : data.disclaimer);

    // Determine channel note
    const channelMap = { email: 'email', display: 'display', social: 'social', sms: 'sms' };
    const channelKey = channelMap[channel];
    const channelNote = channelKey ? data.channels[channelKey] : null;

    // Build HTML
    let html = '';

    // Header row: jurisdiction name + strictness badge + regulator
    html += '<div class="rg-output-card">';
    html += '<div class="rg-strictness-row">';
    html += '<span class="rg-jurisdiction-name">' + escHtml(data.name) + '</span>';
    html += '<span class="rg-badge strictness-' + escHtml(data.strictness) + '">' + escHtml(STRICTNESS_LABELS[data.strictness] || data.strictness) + '</span>';
    html += '</div>';
    html += '<div class="rg-regulator-row">Regulator: <a href="' + escHtml(data.regulatorUrl) + '" target="_blank" rel="noopener">' + escHtml(data.regulator) + '</a></div>';
    html += '</div>';

    // Warning for very-high / high
    if (data.strictness === 'very-high' || data.strictness === 'high') {
      html += '<div class="rg-warning">';
      html += '<strong>Strict Regulatory Environment</strong>';
      if (data.strictness === 'very-high') {
        html += 'This jurisdiction has very high advertising restrictions. Standard bonus marketing and broad social media campaigns may be prohibited. Verify all materials with a qualified gambling law specialist before publication.';
      } else {
        html += 'This jurisdiction enforces strong responsible gambling requirements. Ensure all materials meet current regulatory guidance before publishing.';
      }
      html += '</div>';
    }

    // Disclaimer copy card
    html += '<div class="rg-output-card" style="position:relative;">';
    html += '<button class="rg-copy-btn" data-copy-text="' + escAttr(disclaimerText) + '" aria-label="Copy disclaimer to clipboard">Copy</button>';
    html += '<span class="rg-output-label">';
    if (channel === 'general') {
      html += 'Standard Disclaimer';
    } else if (channel === 'sms') {
      html += 'SMS Disclaimer';
    } else {
      html += escHtml(channel.charAt(0).toUpperCase() + channel.slice(1)) + ' Disclaimer';
    }
    html += '</span>';
    html += '<pre class="rg-output-text">' + escHtml(disclaimerText) + '</pre>';
    html += '</div>';

    // Extended disclaimer (if not SMS and not already using extended)
    if (channel !== 'sms') {
      html += '<div class="rg-output-card" style="position:relative;">';
      html += '<button class="rg-copy-btn" data-copy-text="' + escAttr(data.extendedDisclaimer) + '" aria-label="Copy extended disclaimer to clipboard">Copy</button>';
      html += '<span class="rg-output-label">Extended Disclaimer (website / long-form)</span>';
      html += '<pre class="rg-output-text">' + escHtml(data.extendedDisclaimer) + '</pre>';
      html += '</div>';
    }

    // Helpline + age restriction
    html += '<div class="rg-output-card">';
    html += '<span class="rg-output-label">Helpline &amp; Age Restriction</span>';
    html += '<div class="rg-helpline-row">';
    html += '<span class="rg-age-badge">' + escHtml(data.ageRestriction) + '</span>';
    html += '<a href="' + escHtml(data.helpline) + '" class="rg-helpline-link" target="_blank" rel="noopener">' + escHtml(data.helplineText) + '</a>';
    html += '</div>';
    html += '</div>';

    // Required logos
    html += '<div class="rg-output-card">';
    html += '<span class="rg-output-label">Required Logos &amp; Seals</span>';
    html += '<ul class="rg-logos">';
    data.logos.forEach(function (logo) {
      html += '<li class="rg-logo-item">' + escHtml(logo) + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // Self-exclusion
    html += '<div class="rg-output-card">';
    html += '<span class="rg-output-label">Self-Exclusion Programme</span>';
    html += '<div class="rg-selfex"><strong>Required:</strong> ' + escHtml(data.selfExclusion) + '</div>';
    html += '</div>';

    // Channel-specific notes
    if (channelNote) {
      html += '<div class="rg-output-card">';
      html += '<span class="rg-output-label">Channel Notes — ' + escHtml(channel.charAt(0).toUpperCase() + channel.slice(1)) + '</span>';
      html += '<div class="rg-notes"><strong>Guidance</strong>' + escHtml(channelNote) + '</div>';
      html += '</div>';
    }

    // Regulatory notes
    html += '<div class="rg-output-card">';
    html += '<span class="rg-output-label">Regulatory Notes</span>';
    html += '<div class="rg-reg-notes">' + escHtml(data.notes) + '</div>';
    html += '</div>';

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'flex';

    // Bind copy buttons
    resultsContainer.querySelectorAll('.rg-copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const text = btn.getAttribute('data-copy-text');
        copyToClipboard(text, btn);
      });
    });
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn);
      }).catch(function () {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      // silent fail
    }
    document.body.removeChild(ta);
  }

  function showCopied(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = originalText;
      btn.classList.remove('copied');
    }, 1800);
  }
});

/* ── HELPERS ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
