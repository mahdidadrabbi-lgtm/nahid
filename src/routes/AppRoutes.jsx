/**
 * AppRoutes Configuration
 * Masked Secret Admin Route: /sys-portal-mgt-v2
 * Protection / Route Guards: /admin and /dashboard return 404 or redirect to /
 */

export const ROUTES = {
  HOME: '/',
  TRACK: '/track',
  SECRET_ADMIN: '/sys-portal-mgt-v2',
  BLOCKED_ADMIN: '/admin',
  BLOCKED_DASHBOARD: '/dashboard',
  NOT_FOUND: '/404'
};

export function handleClientRouting() {
  const path = window.location.pathname.toLowerCase();

  // Route Guard: Block regular visitors from discovering admin
  if (path === ROUTES.BLOCKED_ADMIN || path === ROUTES.BLOCKED_DASHBOARD) {
    window.location.replace(ROUTES.NOT_FOUND);
    return;
  }
}
