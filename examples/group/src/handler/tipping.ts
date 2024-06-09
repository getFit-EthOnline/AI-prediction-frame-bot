import { HandlerContext } from "@xmtp/botkit";

export async function handler(context: HandlerContext) {
  const { users, commands } = context.context;
  const { senderAddress, content, typeId } = context.message;
  const { params } = content;
  let amount: number = 0,
    receiverAddresses: string[] = [],
    reference: string = "";

  // Handle different types of messages
  if (typeId === "reply") {
    // Extracts amount from reply //  [!code hl] // [!code focus]
    const { content: reply, receiver } = content;
    // Process reply messages
    receiverAddresses = [receiver];
    if (reply.includes("$degen")) {
      const match = reply.match(/(\d+)/);
      if (match) amount = parseInt(match[0]); // Extract amount from reply
    }
  } else if (typeId === "text") {
    // Uses tip command //  [!code hl] // [!code focus]
    const { content: text } = content;
    // Process text commands starting with "/tip"
    if (text.startsWith("/tip")) {
      const { amount: extractedAmount, username } = params;

      amount = extractedAmount || 10; // Default amount if not specified
      receiverAddresses = username; // Extract receiver from parameters
    }
  } else if (typeId === "reaction") {
    // Uses reaction emoji to tip //  [!code hl] // [!code focus]
    const { content: reaction, action, receiver } = content;

    // Process reactions, specifically tipping added reactions
    if (reaction === "🎩" && action === "added") {
      amount = 10; // Set a fixed amount for reactions
      receiverAddresses = [receiver];
    }
  }
  // Find sender user details
  const sender = users.find((user: any) => user.address === senderAddress);

  // Validate transaction feasibility
  if (!sender || receiverAddresses.length === 0 || amount === 0) {
    context.reply("Sender or receiver or amount not found.");
    return;
  }

  // Check if sender has enough tokens
  if (sender.tokens >= amount * receiverAddresses.length) {
    // Process sending tokens to each receiver
    receiverAddresses.forEach(async (receiver: any) => {
      context.reply(
        `You received ${amount} tokens from ${sender.username}. Your new balance is ${receiver.tokens} tokens.`,
        [receiver.address], // Notify only 1 address //  [!code hl] // [!code focus]
      );
    });
    // Notify sender of the transaction details
    context.reply(
      `You sent ${
        amount * receiverAddresses.length
      } tokens in total. Your remaining balance: ${
        sender.tokens // The hypotetical logic of distributing tokens //  [!code hl] // [!code focus]
      } tokens.`,
      [sender.address], // Notify only 1 address //  [!code hl] // [!code focus]
      reference,
    );
  } else {
    context.reply("Insufficient tokens to send.");
  }
}
