import { Middleware } from "aleph/server/types.ts";

// 1.0.0-alpha.75だとContextに詳細な型がつかないため
import type { Context } from "https://deno.land/x/aleph@1.0.0-alpha.79/server/types.ts";

export const COOKIE_PLAYER_ID_KEY = "player-id";

export class PlayerId implements Middleware {
  name = "session";

  fetch(_: Request, context: Context): void {
    const id = context.cookies.get(COOKIE_PLAYER_ID_KEY);
    if (id !== undefined) {
      return;
    }
    context.cookies.set(
      COOKIE_PLAYER_ID_KEY,
      globalThis.crypto.randomUUID(),
      { httpOnly: true },
    );
  }
}
