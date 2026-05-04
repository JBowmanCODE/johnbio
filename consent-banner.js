(function() {
  const CONSENT_KEY = 'jb_analytics_consent';
  const banner = document.createElement('div');
  banner.id = 'consent-banner';
  banner.innerHTML = `
    <div class="consent-inner">
      <div class="consent-text">
        <p><strong>Analytics</strong></p>
        <p>We use Google Analytics to understand how you use this site. No personal data is collected.</p>
      </div>
      <div class="consent-buttons">
        <button id="consent-reject" class="consent-btn consent-reject">Reject</button>
        <button id="consent-allow" class="consent-btn consent-allow">Allow</button>
      </div>
    </div>
  `;

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function updateGA(consent) {
    if (window.gtag) {
      gtag('consent', 'update', {
        analytics_storage: consent === 'allowed' ? 'granted' : 'denied'
      });
    }
  }

  function showBanner() {
    document.body.insertBefore(banner, document.body.firstChild);

    document.getElementById('consent-reject').addEventListener('click', () => {
      setConsent('rejected');
      updateGA('rejected');
      banner.remove();
    });

    document.getElementById('consent-allow').addEventListener('click', () => {
      setConsent('allowed');
      updateGA('allowed');
      banner.remove();
    });
  }

  // Check consent on page load
  if (!getConsent()) {
    showBanner();
  } else if (getConsent() === 'allowed') {
    updateGA('allowed');
  }
})();
