export const STORAGE_KEYS = {
  theme: 'tsg_theme',
  session: 'tsg_session',
  rememberEmail: 'tsg_remember_email',
  lockUntil: 'tsg_lock_until',
  tasks: 'tsg_tasks_v1',
};

export function storageGet(area, key) {
  try {
    return window[area].getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(area, key, value) {
  try {
    window[area].setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function storageRemove(area, key) {
  try {
    window[area].removeItem(key);
  } catch {}
}
