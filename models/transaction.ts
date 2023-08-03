export interface Transaction {
  id: number;
  createdAt?: string;
  username: string;
  wallet: string;
  name: string;
  symbol: string | any;
  amount: number;
  unit_price: string;
  value?: string;
  totalValue?: string;
  coinImage?: string;
  date?: Date | string | number;
  action: "BUY" | "SELL";
  type: "CRYPTO" | "STOCK" | "FOREX";
}
