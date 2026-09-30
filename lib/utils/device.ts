export function isMobileUserAgent(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}
