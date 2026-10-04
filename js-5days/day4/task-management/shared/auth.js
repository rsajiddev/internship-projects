import { STORAGE_KEYS, storageGet, storageSet, storageRemove } from './storage.js';
export function getSession() { const raw = storageGet('sessionStorage', STORAGE_KEYS.session); if (!raw) return null; try { const value = JSON.parse(raw); return value && value.email && value.loginTime ? value : null } catch { return null } }
export function setSession(session) { return storageSet('sessionStorage', STORAGE_KEYS.session, JSON.stringify(session)) }
export function clearSession() { storageRemove('sessionStorage', STORAGE_KEYS.session) }
export function displayName(email) { const local = (email || 'intern').split('@')[0].replace(/[._-]+/g, ' '); return local.replace(/\b\w/g, char => char.toUpperCase()) }
