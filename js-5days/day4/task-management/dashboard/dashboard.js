import {
    getSession,
    clearSession,
    displayName,
} from '../shared/auth.js';

import {
    initTaskUI,
    counts,
} from './tasks-ui.js';

import {
    getStats,
} from './tasks-store.js';

const sections = {
    overview: 'Overview',
    tasks: 'My Tasks',
    completed: 'Completed',
    archived: 'Archived',
};

const session = getSession();

if (!session) {
    location.replace('../index.html');
} else {
    const DOM = {
        title: document.querySelector('#sectionTitle'),

        name: document.querySelector('#userName'),
        avatar: document.querySelector('#userAvatar'),
        email: document.querySelector('#sidebarEmail'),

        menuAvatar: document.querySelector('#menuUserAvatar'),
        menuName: document.querySelector('#menuUserName'),
        menuEmail: document.querySelector('#menuUserEmail'),
        menuHome: document.querySelector(
            '.profile-menu-heading .dash-brand'
        ),

        sections: [
            ...document.querySelectorAll(
                '[data-section-panel]'
            ),
        ],

        nav: [
            ...document.querySelectorAll(
                '.dash-nav-item,.dash-bottom-nav a'
            ),
        ],

        theme: [
            ...document.querySelectorAll('.theme-toggle'),
        ],

        toast: document.querySelector('#toastContainer'),
        bell: document.querySelector('#notificationButton'),
        logout: document.querySelector('#logoutButton'),

        profile: document.querySelector('#profileButton'),
        menu: document.querySelector('#profileMenu'),
        backdrop: document.querySelector('#profileBackdrop'),
        profileClose: document.querySelector('#profileClose'),

        changePassword: document.querySelector(
            '#changePasswordButton'
        ),

        changeEmail: document.querySelector(
            '#changeEmailButton'
        ),

        help: document.querySelector('#helpButton'),
        contacts: document.querySelector('#helpContacts'),

        mobileBell: document.querySelector(
            '#mobileNotificationButton'
        ),

        mobileTheme: document.querySelector(
            '#mobileThemeButton'
        ),

        mobileLogout: document.querySelector(
            '#mobileLogoutButton'
        ),
    };

    const name = displayName(session.email);

    DOM.name.textContent = name;
    DOM.avatar.textContent = name.charAt(0);
    DOM.email.textContent = session.email;

    DOM.menuAvatar.textContent = name.charAt(0);
    DOM.menuName.textContent = name;
    DOM.menuEmail.textContent = session.email;

    function showToast(text) {
        const item = document.createElement('div');

        item.className = 'toast';

        const content = document.createElement('span');
        content.textContent = text;

        const close = document.createElement('button');

        close.className = 'toast-close';
        close.type = 'button';
        close.setAttribute(
            'aria-label',
            'Close notification'
        );
        close.textContent = '×';

        close.addEventListener('click', () => {
            item.remove();
        });

        item.append(content, close);
        DOM.toast.prepend(item);

        window.setTimeout(() => {
            if (item.isConnected) {
                item.remove();
            }
        }, 2000);
    }

    function applyTheme() {
        const dark =
            document.documentElement.dataset.theme === 'dark';

        DOM.theme.forEach((button) => {
            button.setAttribute(
                'aria-pressed',
                String(dark)
            );

            button.setAttribute(
                'aria-label',
                dark
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
            );
        });
    }

    function toggleTheme() {
        const next =
            document.documentElement.dataset.theme === 'dark'
                ? 'light'
                : 'dark';

        document.documentElement.dataset.theme = next;

        try {
            localStorage.setItem(
                'tsg_theme',
                next
            );
        } catch { }

        applyTheme();
    }

    function currentSection() {
        const key = location.hash.slice(1);

        return sections[key] ? key : 'overview';
    }

    function renderSection() {
        const key = currentSection();

        DOM.title.textContent = sections[key];

        document.title = `${sections[key]} | Tech SG`;

        DOM.sections.forEach((section) => {
            const active =
                section.dataset.sectionPanel === key;

            section.hidden = !active;

            section.classList.toggle(
                'is-visible',
                active
            );
        });

        DOM.nav.forEach((link) => {
            const active =
                link.getAttribute('href') === `#${key} `;

            link.classList.toggle(
                'is-active',
                active
            );

            if (active) {
                link.setAttribute(
                    'aria-current',
                    'page'
                );
            } else {
                link.removeAttribute('aria-current');
            }
        });

        const heading = document.querySelector(
            `#${key} Heading`
        );

        if (heading) {
            heading.focus();
        }
    }

    function renderSummary() {
        const value = counts();
        const stats = getStats();

        document.querySelector(
            '#navTasksCount'
        ).textContent = value.tasks;

        document.querySelector(
            '#navCompletedCount'
        ).textContent = value.completed;

        document.querySelector(
            '#navArchivedCount'
        ).textContent = value.archived;

        document.querySelector(
            '#statPending'
        ).textContent = stats.pending;

        document.querySelector(
            '#statDueToday'
        ).textContent = stats.dueToday;

        document.querySelector(
            '#statOverdue'
        ).textContent = stats.overdue;

        document.querySelector(
            '#statCompleted'
        ).textContent = stats.completed;

        document.querySelector(
            '#tasksCounter'
        ).textContent =
            value.tasks === 0
                ? 'No tasks pending'
                : `${value.tasks} task${value.tasks === 1 ? '' : 's'
                } pending`;

        document.querySelector(
            '#completedCounter'
        ).textContent =
            value.completed
                ? `${value.completed} completed task${value.completed === 1 ? '' : 's'
                } `
                : 'Nothing completed yet';

        document.querySelector(
            '#archivedCounter'
        ).textContent =
            value.archived
                ? `${value.archived} archived task${value.archived === 1 ? '' : 's'
                } `
                : 'Your archive is empty';
    }

    function logout() {
        clearSession();
        location.replace('../index.html');
    }

    function closeProfile() {
        DOM.menu.hidden = true;
        DOM.backdrop.hidden = true;

        document.body.classList.remove(
            'profile-open'
        );

        DOM.profile.setAttribute(
            'aria-expanded',
            'false'
        );

        DOM.contacts.hidden = true;

        DOM.help.setAttribute(
            'aria-expanded',
            'false'
        );
    }

    function toggleProfile() {
        const open = DOM.menu.hidden;

        const useSidebar =
            window.matchMedia(
                '(max-width: 639px)'
            ).matches;

        DOM.menu.hidden = !open;

        DOM.backdrop.hidden = !(
            open && useSidebar
        );

        document.body.classList.toggle(
            'profile-open',
            open && useSidebar
        );

        DOM.profile.setAttribute(
            'aria-expanded',
            String(open)
        );
    }

    function toggleHelp() {
        const open = DOM.contacts.hidden;

        DOM.contacts.hidden = !open;

        DOM.help.setAttribute(
            'aria-expanded',
            String(open)
        );
    }

    function promptAdminForCredentials() {
        showToast(
            'Please contact your administrator at support@techsgstudio.com to update your credentials.'
        );

        closeProfile();
    }

    // Theme controls
    DOM.theme
        .filter(
            (button) => button !== DOM.mobileTheme
        )
        .forEach((button) => {
            button.addEventListener(
                'click',
                toggleTheme
            );
        });

    // Notifications
    DOM.bell.addEventListener(
        'click',
        () => {
            showToast(
                'Deadline notifications will be integrated later.'
            );
        }
    );

    // Logout
    DOM.logout.addEventListener(
        'click',
        logout
    );

    // Profile menu
    DOM.profile.addEventListener(
        'click',
        toggleProfile
    );

    DOM.profileClose.addEventListener(
        'click',
        closeProfile
    );

    DOM.menuHome.addEventListener(
        'click',
        closeProfile
    );

    DOM.backdrop.addEventListener(
        'click',
        closeProfile
    );

    // Profile actions
    DOM.changePassword.addEventListener(
        'click',
        promptAdminForCredentials
    );

    DOM.changeEmail.addEventListener(
        'click',
        promptAdminForCredentials
    );

    // Help
    DOM.help.addEventListener(
        'click',
        toggleHelp
    );

    // Mobile controls
    DOM.mobileBell.addEventListener(
        'click',
        () => {
            showToast(
                'Deadline notifications will be integrated later.'
            );

            closeProfile();
        }
    );

    DOM.mobileTheme.addEventListener(
        'click',
        () => {
            toggleTheme();
            closeProfile();
        }
    );

    DOM.mobileLogout.addEventListener(
        'click',
        logout
    );

    // Close profile when clicking outside
    document.addEventListener(
        'click',
        (event) => {
            if (
                !DOM.profile.contains(event.target) &&
                !DOM.menu.contains(event.target) &&
                event.target !== DOM.backdrop
            ) {
                closeProfile();
            }
        }
    );

    // Close profile with Escape
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.key === 'Escape') {
                closeProfile();
            }
        }
    );

    // Initialise dashboard
    window.addEventListener(
        'hashchange',
        renderSection
    );

    applyTheme();
    initTaskUI(renderSummary);
    renderSummary();
    renderSection();
}