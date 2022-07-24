import "https://deno.land/x/dotenv/load.ts";
import { Bot, session } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
// import { groupOnlyBot, channelOnly } from "./filters.ts";
import {
  toggleReplyMode,
  toggleMembersMode,
  removeMmeber,
  deleteMessageWithoutReply,
} from "./group-commands.ts";
import type { SessionData, MyContext } from "./types.ts";
import { freeStorage } from "https://deno.land/x/grammy_storages@v2.0.0/free/src/mod.ts";

const initial = (): SessionData => ({
  onlyReply: false,
  preventMembers: false,
});

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

if (typeof BOT_TOKEN === "undefined") {
  throw new Error("BOT_TOKEN is not defined");
}

export const bot = new Bot<MyContext>(BOT_TOKEN);
bot.use(
  session({
    initial,
    storage: freeStorage<SessionData>(bot.token),
  })
);

bot.command(["start", "help"], (ctx) =>
  ctx.reply(
    "Welcome! \nI will help you to manage your channel comments! please add me to your channel group, then use commands: \nUse /toggle_reply_mode to toggle reply mode.\nUse /toggle_members_mode to toggle members prevent mode.\n If you found any bugs, or have suggestion please contact me at @mi3lix9!"
  )
);

export const groupOnlyBot = bot.filter(
  (ctx) => ctx.chat?.type === "supergroup"
);

export const channelOnly = bot.filter((ctx) => ctx.chat?.type === "channel");

const botCommands = groupOnlyBot.filter(async (ctx) => {
  const author = await ctx.getAuthor();

  return author.status === "administrator" || author.status === "creator";
});

botCommands.command("toggle_reply_mode", toggleReplyMode);
botCommands.command("toggle_members_mode", toggleMembersMode);

groupOnlyBot.on(":new_chat_members", removeMmeber);
groupOnlyBot.on("message", deleteMessageWithoutReply);
