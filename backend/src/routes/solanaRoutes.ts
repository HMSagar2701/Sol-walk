import express from "express";
import { refundStake } from "../services/solana.service"
import { error } from "node:console";

const router = express.Router();

/**
 * @route POST /api/solana/groupRefund
 * @desc Refund SOL to a user from the group treasury
 */
router.post("/groupRefund", async (req, res) => {
  const { groupId, userSecretKey, treasuryWallet, amount } = req.body;

  try {
    const result = await refundStake(groupId, userSecretKey, treasuryWallet, amount);
    if (result.success) {
      res.status(200).json({ success: true, message: "Refund successful", tx: result.tx });
    } else {
      res.status(500).json({ success: false, message: "Refund failed", error: result.error });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal error", error: error });
  }
});

export default router;
