import { groupRefund } from "../utils/solanaUtils";

/**
 * Handles refunding a stake from a group.
 */
export const refundStake = async (groupId: string, userSecretKey: string, treasuryWallet: string, amount: number) => {
  return await groupRefund(groupId, userSecretKey, treasuryWallet, amount);
};
