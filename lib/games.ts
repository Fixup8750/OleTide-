import type { StaticImageData } from "next/image";
import airportIcon from "@/assets/games/airport-tycoon-icon.png";
import airportShot from "@/assets/games/airport-tycoon-0.png";
import animeIcon from "@/assets/games/anime-evolve-icon.png";
import animeShot from "@/assets/games/anime-evolve-0.png";
import phoneIcon from "@/assets/games/phone-empire-icon.png";
import phoneShot from "@/assets/games/phone-empire-0.png";
import ropairIcon from "@/assets/games/ropair-icon.png";
import ropairShot from "@/assets/games/ropair-0.png";
import tradingIcon from "@/assets/games/trading-tycoon-icon.png";
import tradingShot from "@/assets/games/trading-tycoon-0.png";

export type Game = {
  name: string;
  genre: string;
  universeId: number;
  placeId: number;
  icon: StaticImageData;
  shot: StaticImageData;
};

export type GameStats = { playing: number; visits: number; rating: number };

/** OleTide portfolio. Ids come from the Roblox games API. */
export const GAMES: Game[] = [
  {
    name: "Build a Phone Empire",
    genre: "Tycoon",
    universeId: 10767582899,
    placeId: 101914705206759,
    icon: phoneIcon,
    shot: phoneShot,
  },
  {
    name: "Trading Tycoon",
    genre: "Tycoon",
    universeId: 10767912502,
    placeId: 112241277471797,
    icon: tradingIcon,
    shot: tradingShot,
  },
  {
    name: "+1 Anime Evolve",
    genre: "PvP · Simulator",
    universeId: 10765591030,
    placeId: 107838436017187,
    icon: animeIcon,
    shot: animeShot,
  },
  {
    name: "Airport Tycoon",
    genre: "Tycoon",
    universeId: 10241000620,
    placeId: 138486812747835,
    icon: airportIcon,
    shot: airportShot,
  },
  {
    name: "RoPair",
    genre: "Simulator",
    universeId: 10767951625,
    placeId: 83686617495082,
    icon: ropairIcon,
    shot: ropairShot,
  },
];

export const gameUrl = (g: Game) => `https://www.roblox.com/games/${g.placeId}`;
