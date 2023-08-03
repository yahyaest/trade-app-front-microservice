export interface Wallet {
  id: number;
  createdAt:string;
  name: string;
  username: string;
  currentValue: string;
  intialValue: string;
  type: "CRYPTO" | "STOCK" | "FOREX";
}
