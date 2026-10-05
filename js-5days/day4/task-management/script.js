import {
  STORAGE_KEYS,
  storageGet,
  storageSet,
  storageRemove,
} from './shared/storage.js';

import { setSession, displayName } from './shared/auth.js';

const CREDENTIAL_EMAIL = 'intern@techsgstudio.com';
const CREDENTIAL_PASSWORD = 'TSG@2026';

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;
const LOGIN_DELAY = 900;

function initHeroPreview() {
  const photo = document.querySelector('.hero-photo');
  const frame = photo?.closest('.photo-frame');

  if (photo && frame) {
    const showFallback = () => {
      frame.dataset.imageFailed = 'true';
    };

    photo.addEventListener('error', showFallback, { once: true });

    if (photo.complete && photo.naturalWidth === 0) {
      showFallback();
    }
  }

  const days = [...document.querySelectorAll('[data-week-day]')];

  if (!days.length) return;

  const today = new Date();
  const start = new Date(today);

  start.setDate(today.getDate() - today.getDay());

  const weekday = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
  });

  const date = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
  });

  days.forEach((element, index) => {
    const current = new Date(start);

    current.setDate(start.getDate() + index);

    const label = document.createElement('span');
    label.textContent = weekday.format(current);

    const number = document.createElement('strong');
    number.textContent = date.format(current);

    element.replaceChildren(label, number);

    element.classList.toggle(
      'is-today',
      current.toDateString() === today.toDateString()
    );
  });
}

function init() {
  initHeroPreview();

  const DOM = {
    html: document.documentElement,
    form: document.querySelector('#loginForm'),
    card: document.querySelector('#loginCard'),

    email: document.querySelector('#email'),
    password: document.querySelector('#password'),
    remember: document.querySelector('#remember'),

    button: document.querySelector('#loginButton'),
    label: document.querySelector('.button-label'),

    message: document.querySelector('#formMessage'),
    emailError: document.querySelector('#emailError'),
    passwordError: document.querySelector('#passwordError'),
    caps: document.querySelector('#capsWarning'),

    passwordToggle: document.querySelector('.password-toggle'),

    theme: [...document.querySelectorAll('.theme-toggle')],

    forgot: document.querySelector('#forgotPassword'),
    dialog: document.querySelector('#forgotDialog'),
    dialogClose: document.querySelector('#dialogClose'),
    dialogOkay: document.querySelector('#dialogOkay'),

    toast: document.querySelector('#toastContainer'),
  };

  let failedAttempts = 0;
  let lockTimer = null;
  let lastDialogTrigger = null;

  const icon = (text) => {
    const mark = document.createElement('span');

    mark.className = 'message-icon';
    mark.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.textContent = text;

    return [mark, copy];
  };

  function message(text, type = 'error') {
    DOM.message.className = `form-message ${type}`;
    DOM.message.replaceChildren(...icon(text));
  }

  function clearMessage() {
    DOM.message.className = 'form-message';
    DOM.message.replaceChildren();
  }

  function clearField(field, error) {
    field.removeAttribute('aria-invalid');
    field.classList.remove('success');
    error.textContent = '';
  }

  function clearErrors() {
    clearField(DOM.email, DOM.emailError);
    clearField(DOM.password, DOM.passwordError);
  }

  function loading(on) {
    DOM.button.disabled = on;
    DOM.button.classList.toggle('is-loading', on);

    DOM.label.textContent = on ? 'Signing in...' : 'Sign in';

    DOM.email.disabled = on;
    DOM.password.disabled = on;
    DOM.remember.disabled = on;
  }

  function toast(text) {
    const item = document.createElement('div');

    item.className = 'toast';
    item.setAttribute('role', 'status');

    const copy = document.createElement('span');
    copy.textContent = text;

    const close = document.createElement('button');

    close.className = 'toast-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close notification');
    close.textContent = '×';

    close.addEventListener('click', () => {
      item.remove();
    });

    item.append(copy, close);
    DOM.toast.prepend(item);

    while (DOM.toast.children.length > 3) {
      DOM.toast.lastElementChild.remove();
    }

    window.setTimeout(() => {
      if (item.isConnected) {
        item.remove();
      }
    }, 3500);
  }

  function theme(next) {
    const value = next === 'dark' ? 'dark' : 'light';

    DOM.html.dataset.theme = value;

    DOM.theme.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(value === 'dark')
      );

      button.setAttribute(
        'aria-label',
        value === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      );
    });
  }

  function toggleTheme() {
    const next =
      DOM.html.dataset.theme === 'dark' ? 'light' : 'dark';

    theme(next);

    storageSet(
      'localStorage',
      STORAGE_KEYS.theme,
      next
    );
  }

  function runLock(until) {
    window.clearInterval(lockTimer);

    const update = () => {
      const left = Math.ceil(
        (until - Date.now()) / 1000
      );

      if (left <= 0) {
        window.clearInterval(lockTimer);

        lockTimer = null;
        failedAttempts = 0;

        storageRemove(
          'localStorage',
          STORAGE_KEYS.lockUntil
        );

        DOM.email.disabled = false;
        DOM.password.disabled = false;
        DOM.remember.disabled = false;
        DOM.button.disabled = false;

        DOM.label.textContent = 'Sign in';

        clearMessage();
        toast('Lockout ended');

        return;
      }

      DOM.button.disabled = true;
      DOM.label.textContent = `Try again in ${left}s`;

      DOM.email.disabled = true;
      DOM.password.disabled = true;
      DOM.remember.disabled = true;

      message(
        `Too many attempts. Try again in ${left}s`,
        'warning'
      );
    };

    update();

    lockTimer = window.setInterval(update, 1000);
  }

  function validate() {
    const email = DOM.email.value.trim().toLowerCase();
    const password = DOM.password.value;

    clearErrors();
    clearMessage();

    if (!email && !password) {
      DOM.email.setAttribute('aria-invalid', 'true');
      DOM.password.setAttribute('aria-invalid', 'true');

      DOM.emailError.textContent = 'Required';
      DOM.passwordError.textContent = 'Required';

      message('Please fill in all fields.');

      DOM.email.focus();

      return null;
    }

    if (!email) {
      DOM.email.setAttribute('aria-invalid', 'true');
      DOM.emailError.textContent = 'Required';

      message('Please enter your email or username.');

      DOM.email.focus();

      return null;
    }

    if (!password) {
      DOM.password.setAttribute('aria-invalid', 'true');
      DOM.passwordError.textContent = 'Required';

      message('Please enter your password.');

      DOM.password.focus();

      return null;
    }

    if (
      email.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      DOM.email.setAttribute('aria-invalid', 'true');
      DOM.emailError.textContent =
        'Enter a valid email address.';

      message('Enter a valid email address.');

      DOM.email.focus();

      return null;
    }

    return {
      email,
      password,
    };
  }

  function submit(event) {
    event.preventDefault();

    if (lockTimer) return;

    const values = validate();

    if (!values) return;

    loading(true);

    window.setTimeout(() => {
      loading(false);

      if (
        values.email === CREDENTIAL_EMAIL &&
        values.password === CREDENTIAL_PASSWORD
      ) {
        const session = {
          email: values.email,
          name: displayName(values.email),
          loginTime: Date.now(),
        };

        setSession(session);

        failedAttempts = 0;

        storageRemove(
          'localStorage',
          STORAGE_KEYS.lockUntil
        );

        message('Login Successful!', 'success');

        if (DOM.remember.checked) {
          storageSet(
            'localStorage',
            STORAGE_KEYS.rememberEmail,
            values.email
          );
        } else {
          storageRemove(
            'localStorage',
            STORAGE_KEYS.rememberEmail
          );
        }

        window.setTimeout(() => {
          location.replace('dashboard/');
        }, 700);

        return;
      }

      failedAttempts++;

      message('Invalid username or password!');

      DOM.card.classList.remove('shake');

      void DOM.card.offsetWidth;

      DOM.card.classList.add('shake');

      DOM.password.value = '';
      DOM.password.focus();

      if (failedAttempts >= MAX_ATTEMPTS) {
        const until =
          Date.now() + LOCK_SECONDS * 1000;

        storageSet(
          'localStorage',
          STORAGE_KEYS.lockUntil,
          String(until)
        );

        toast('Lockout started');

        runLock(until);
      }
    }, LOGIN_DELAY);
  }

  function openDialog() {
    lastDialogTrigger = DOM.forgot;

    DOM.dialog.showModal();
    DOM.dialogOkay.focus();
  }

  function closeDialog() {
    if (DOM.dialog.open) {
      DOM.dialog.close();
    }

    lastDialogTrigger?.focus();
  }

  // Form
  DOM.form.addEventListener('submit', submit);

  DOM.email.addEventListener('input', () => {
    clearField(DOM.email, DOM.emailError);
  });

  DOM.password.addEventListener('input', () => {
    clearField(DOM.password, DOM.passwordError);
  });

  // Caps Lock warning
  DOM.password.addEventListener('keydown', (event) => {
    DOM.caps.textContent = event.getModifierState?.('CapsLock')
      ? '⚠ Caps Lock is on'
      : '';
  });

  DOM.password.addEventListener('keyup', (event) => {
    DOM.caps.textContent = event.getModifierState?.('CapsLock')
      ? '⚠ Caps Lock is on'
      : '';
  });

  DOM.password.addEventListener('blur', () => {
    DOM.caps.textContent = '';
  });

  // Password visibility
  DOM.passwordToggle.addEventListener('click', () => {
    const show = DOM.password.type === 'password';

    DOM.password.type = show ? 'text' : 'password';

    DOM.passwordToggle.setAttribute(
      'aria-pressed',
      String(show)
    );

    DOM.passwordToggle.setAttribute(
      'aria-label',
      show ? 'Hide password' : 'Show password'
    );

    DOM.password.focus();
  });

  // Theme
  DOM.theme.forEach((button) => {
    button.addEventListener('click', toggleTheme);
  });

  // Forgot password dialog
  DOM.forgot.addEventListener('click', openDialog);

  DOM.dialogClose.addEventListener('click', closeDialog);

  DOM.dialogOkay.addEventListener('click', closeDialog);

  DOM.dialog.addEventListener('click', (event) => {
    if (event.target === DOM.dialog) {
      closeDialog();
    }
  });

  // Remembered email
  const remembered = storageGet(
    'localStorage',
    STORAGE_KEYS.rememberEmail
  );

  if (remembered) {
    DOM.email.value = remembered;
    DOM.remember.checked = true;
  }

  // Saved theme
  const savedTheme = storageGet(
    'localStorage',
    STORAGE_KEYS.theme
  );

  if (savedTheme) {
    theme(savedTheme);
  }

  // Existing lockout
  const lockUntil = Number(
    storageGet(
      'localStorage',
      STORAGE_KEYS.lockUntil
    )
  );

  if (lockUntil && lockUntil > Date.now()) {
    runLock(lockUntil);
  } else {
    storageRemove(
      'localStorage',
      STORAGE_KEYS.lockUntil
    );
  }

  DOM.email.focus();
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    init,
    { once: true }
  );
} else {
  init();
}
