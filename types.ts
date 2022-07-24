import type {
  Context,
  SessionFlavor,
} from "https://deno.land/x/grammy@v1.9.2/mod.ts";

export interface SessionData {
  onlyReply: boolean;
  preventMembers: boolean;
}

export type MyContext = Context & SessionFlavor<SessionData>;
