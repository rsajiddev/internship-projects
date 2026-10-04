'use strict';
(function () {
    function sessionExists() {
        try {
            const raw = sessionStorage.getItem('tsg_session');
            if (!raw) return false;
            const value = JSON.parse(raw);
            return Boolean(value && value.email && value.loginTime);
        } catch {
            return false;
        }
    }

    const dashboardPage = location.pathname.includes('/dashboard/');
    const loginUrl = '../index.html';
    const dashboardUrl = 'dashboard/';

    function check() {
        if (dashboardPage && !sessionExists()) location.replace(loginUrl);
        if (!dashboardPage && sessionExists()) location.replace(dashboardUrl);
    }

    check();
    window.addEventListener('pageshow', event => {
        if (event.persisted) check();
    });
})();
