/** Placeholder pour injection future d’analytics (ex. page view). Reçoit le path actuel. */
export function AnalyticsTracker({ path }: { path: string }) {
  return <span data-analytics-path={path} aria-hidden style={{ display: 'none' }} />;
}
