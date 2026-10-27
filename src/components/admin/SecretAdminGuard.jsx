/**
 * SecretAdminGuard Component
 * Role-Based Access Control (RBAC) & Route Guard for /sys-portal-mgt-v2
 */

export const ADMIN_SECRET_KEY = 'ruaa-admin-secret-2026';

export function checkAdminAuth() {
  const token = sessionStorage.getItem('admin_token');
  return token === ADMIN_SECRET_KEY;
}

export function promptAdminLogin(onSuccess) {
  const key = prompt('🔐 নিরাপত্তা পিন বা সিক্রেট এক্সেস কি প্রদান করুন:');
  if (key === ADMIN_SECRET_KEY) {
    sessionStorage.setItem('admin_token', key);
    if (onSuccess) onSuccess();
    return true;
  } else {
    alert('❌ অনুমতিহীন এক্সেস! আপনি রিডাইরেক্ট হচ্ছেন...');
    window.location.href = '/';
    return false;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem('admin_token');
  window.location.href = '/';
}
