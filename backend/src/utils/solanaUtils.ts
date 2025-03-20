import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Processes refund from treasury wallet back to user.
 * @param groupId - The group identifier
 * @param userSecretKey - The user's secret key (JSON array string)
 * @param treasuryWallet - The treasury wallet public address
 * @param amount - Amount in SOL to refund
 * @returns Refund transaction result
 */
export const groupRefund = async (
  groupId: string,
  userSecretKey: string,
  treasuryWallet: string,
  amount: number
) => {
  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // Load treasury secret key from .env
    const treasurySecretKeyRaw = process.env.TREASURY_SECRET_KEY;
    if (!treasurySecretKeyRaw) {
      throw new Error("Missing TREASURY_SECRET_KEY in environment variables");
    }

    const treasuryKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(treasurySecretKeyRaw))
    );

    // Create user keypair from provided secret key
    const userKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(userSecretKey))
    );

    const userPubkey = userKeypair.publicKey;

    // Construct refund transaction: transfer from treasury to user
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasuryKeypair.publicKey,
        toPubkey: userPubkey,
        lamports: amount * 1e9,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, tx, [treasuryKeypair]);

    return {
      success: true,
      message: "Refund successful",
      tx: signature,
    };
  } catch (error: any) {
    console.error("Refund Error Stack:", error);
    return {
      success: false,
      message: "Refund failed",
      error: error?.message || "Unknown refund error",
    };
  }
};
