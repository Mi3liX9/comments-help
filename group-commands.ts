import { Filter } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
import { MyContext } from "./types.ts";

export async function toggleReplyMode(ctx: MyContext) {
  ctx.session.onlyReply = !ctx.session.onlyReply;
  await ctx.reply("Reply onle mode: " + (ctx.session.onlyReply ? "on" : "off"));
}
export async function toggleMembersMode(ctx: MyContext) {
  ctx.session.preventMembers = !ctx.session.preventMembers;
  await ctx.reply(
    "Members prevent mode: " + (ctx.session.preventMembers ? "on" : "off")
  );
}

export async function removeMmeber(ctx: MyContext) {
  if (!ctx.session.preventMembers) return;

  const author = await ctx.getAuthor();
  if (author.status !== "member") return;

  await ctx.banAuthor();
  await ctx.unbanChatMember(author.user.id);
}

export async function deleteMessageWithoutReply(
  ctx: Filter<MyContext, "message">
) {
  if (!ctx.session.onlyReply) return;
  if (typeof ctx.message.reply_to_message !== "undefined") return;

  await ctx.deleteMessage();
}
