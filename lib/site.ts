export const site = {
  name: "OleTide",
  /** We take pitches on Discord only, no email. */
  discord: { username: "_fixup", url: "https://discord.com/users/467916809748611075" },
  nav: [
    { label: "The Deal", href: "#deal" },
    { label: "Services", href: "#services" },
    { label: "Frontier", href: "#frontier" },
    { label: "Terms", href: "#terms" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

/** Every "pitch us" CTA scrolls to the Discord contact card in the closing section. */
export const pitchHref = "#contact";

/** Spring-like curves. Never linear / ease-in-out. */
export const EASE_FLUID = [0.32, 0.72, 0, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
