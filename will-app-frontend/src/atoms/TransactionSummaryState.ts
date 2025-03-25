import { atom } from "recoil";
import { ITransaction } from "../models/willService";

export const TransactionSummaryState = atom<ITransaction | null>({
  key: "transactionSummaryState",
  default: null,
});