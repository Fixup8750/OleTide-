"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Intro = { ready: boolean; setReady: (v: boolean) => void };

const IntroContext = createContext<Intro>({ ready: true, setReady: () => {} });

/** Gates hero choreography until the preloader curtain lifts. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <IntroContext.Provider value={{ ready, setReady }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
