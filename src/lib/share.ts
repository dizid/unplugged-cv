"use client";

/**
 * Detect if the current device is mobile based on user agent.
 * Must be called client-side only.
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Share a CV URL using the Web Share API, with clipboard fallback.
 * Returns true if sharing succeeded (either native share or clipboard copy).
 */
export async function shareCV(
  url: string,
  title: string = "My CV"
): Promise<{ success: boolean; method: "share" | "clipboard" }> {
  // Try Web Share API first (works on mobile Safari, Android Chrome)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: `Check out ${title}`,
        url,
      });
      return { success: true, method: "share" };
    } catch (err) {
      // User cancelled or share failed - fall through to clipboard
      if ((err as Error).name === "AbortError") {
        // User cancelled, don't fallback
        return { success: false, method: "share" };
      }
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return { success: true, method: "clipboard" };
  } catch {
    return { success: false, method: "clipboard" };
  }
}
