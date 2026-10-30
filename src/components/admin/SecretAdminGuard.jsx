/**
 * SecretAdminGuard Component
 * Admin authentication is verified by the server.
 */

export function checkAdminAuth() {
  return Boolean(sessionStorage.getItem('admin_token'));
}

export async function promptAdminLogin(onSuccess) {
  const password = prompt('🔐 অ্যাডমিন পাসওয়ার্ড লিখুন:');
  if (!password) return false;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const result = await response.json();
    if (!response.ok || !result.token) throw new Error(result.error || 'Admin login failed');

    sessionStorage.setItem('admin_token', result.token);
    if (onSuccess) onSuccess();
    return true;
  } catch (error) {
    alert(error.message || 'অ্যাডমিন লগইন করা যায়নি।');
    window.location.href = '/';
    return false;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem('admin_token');
  window.location.href = '/';
}
