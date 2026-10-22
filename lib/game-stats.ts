import { cacheLife } from "next/cache";
import { GAMES, type GameStats } from "./games";

/**
 * Live player counts, visits and like ratio per universe, cached for an hour.
 * Returns null when Roblox is unreachable; the UI then simply hides the numbers.
 */
export async function getGameStats(): Promise<Record<number, GameStats> | null> {
  "use cache";
  cacheLife("hours");
  const ids = GAMES.map((g) => g.universeId).join(",");
  try {
    const [games, votes] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${ids}`).then((r) => {
        if (!r.ok) throw new Error(`games ${r.status}`);
        return r.json() as Promise<{ data: { id: number; playing: number; visits: number }[] }>;
      }),
      fetch(`https://games.roblox.com/v1/games/votes?universeIds=${ids}`).then((r) => {
        if (!r.ok) throw new Error(`votes ${r.status}`);
        return r.json() as Promise<{ data: { id: number; upVotes: number; downVotes: number }[] }>;
      }),
    ]);
    const stats: Record<number, GameStats> = {};
    for (const g of games.data) {
      const v = votes.data.find((x) => x.id === g.id);
      const total = v ? v.upVotes + v.downVotes : 0;
      stats[g.id] = {
        playing: g.playing,
        visits: g.visits,
        rating: total ? Math.round((v!.upVotes / total) * 100) : 0,
      };
    }
    return stats;
  } catch (err) {
    console.error("Roblox stats unavailable:", err);
    return null;
  }
}
