import { Transaction } from "./transaction";

export interface Asset {
  id: number;
  username: string;
  walletId: number;
  walletName: string;
  name: string;
  symbol: string;
  amount: number;
  boughtAt: string;
  soldAt: string;
  boughtAmount: number;
  soldAmount: number;
  transactions: Transaction[];
  type: "CRYPTO" | "STOCK" | "FOREX";
}
