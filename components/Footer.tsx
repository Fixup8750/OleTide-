import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-4 pt-24 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="rule" />
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-12">
          <p className="max-w-[34ch] text-sm leading-relaxed text-cream/55 md:col-span-5">
            OleTide is a LiveOps partner for Roblox games. We take over growth and development in exchange for a share
            of revenue.
          </p>
          <ul className="flex flex-col gap-2 text-sm md:col-span-3 md:col-start-7">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="text-cream/60 transition-colors duration-500 ease-fluid hover:text-caramel"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 text-sm md:col-span-3">
            <a
              href={site.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-cream/60 transition-colors duration-500 ease-fluid hover:text-caramel"
            >
              Discord · @{site.discord.username}
            </a>
            <a
              href="#top"
              data-cursor="hover"
              className="text-cream/60 transition-colors duration-500 ease-fluid hover:text-caramel"
            >
              Back to the top
            </a>
          </div>
        </div>
        <div className="label-caps flex flex-col justify-between gap-2 pb-6 text-cream/35 md:flex-row">
          <span>© 2026 OleTide</span>
          <span>Not affiliated with or endorsed by Roblox Corporation.</span>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none select-none bg-linear-to-b from-caramel via-burnt via-55% to-ink bg-clip-text pb-[0.06em] text-center font-display text-[25vw] font-black uppercase leading-[0.9] tracking-[-0.02em] text-transparent"
      >
        OleTide
      </p>
    </footer>
  );
}
