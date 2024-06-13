import { HandlerContext } from "@xmtp/message-kit";
import { Wallet } from "ethers";
import { Client as xmtpClient } from "@xmtp/xmtp-js";

export async function handler(context: HandlerContext) {
  const { content, senderAddress } = context.message;
  const { params } = content;
  const { amount, name, users } = params;

  if (!amount || !name || !users) {
    context.reply(
      "Missing required parameters. Please provide amount, token, and username.",
    );
    return;
  }

  let url = await generateBetUrl(
    senderAddress,
    name as string,
    amount as string,
  );
  context.reply(`Bet created!. Go here: ${url}`, []);
}

async function generateBetUrl(
  senderAddress: string,
  betName: string,
  amount: string,
) {
  const baseUrl = "dm:/";
  const key =
    "0xf999aa0e24be24df5700e76f8d146c049e99ad6480918ee6cbdd73fec3336a98";
  const wallet = new Wallet(key);
  const client = await xmtpClient.create(wallet, { env: "production" });
  const conv = await client.conversations.newConversation(senderAddress);
  await conv.send(`Bet created!\n${betName} for $${amount}`);
  await conv.send(
    `https://base-frame-lyart.vercel.app/transaction?transaction_type=send&amount=1&token=eth&receiver=0xA45020BdA714c3F43fECDC6e38F873fFF2Dec8ec`,
  );
  const link = `${baseUrl}${client.address}`;
  return link;
}
