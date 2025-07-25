export function getTeamLogo(idOrName: string): string {
  try {
    const slug = (idOrName || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Vite will handle asset url at build time
    return new URL(`/src/assets/logos/${slug}.png`, import.meta.url).href;
  } catch {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Vite will handle asset url at build time
    return new URL('/src/assets/logos/genericlogo.jpeg', import.meta.url).href;
  }
}
