document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');

    if (!cookieBanner) {
        console.error('Cookie banner element not found');
        return;
    }

    if (!acceptButton || !rejectButton) {
        console.error('Accept or Reject button not found');
        return;
    }

    function setConsent(value) {
        localStorage.setItem('cookiesAccepted', value);
    }

    function getConsent() {
        const consent = localStorage.getItem('cookiesAccepted');
        return consent;
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

    acceptButton.addEventListener('click', function() {
        handleCookieAcceptance(true);
    });

    rejectButton.addEventListener('click', function() {
        handleCookieAcceptance(false);
    });

    // Check consent status on page load
    const consent = getConsent();
    if (consent === null) {
        showCookieBanner();
    } else {
        hideCookieBanner(); // If consent exists, hide the banner
    }
});
