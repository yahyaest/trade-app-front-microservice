import axios from "axios";
import { CustomLogger } from "@/utils/logger";
import CryptoClient from "./crypto";

class WalletClient {
  private baseUrl: string;
  private logger;
  private cryptoClient: CryptoClient;

  constructor() {
    this.baseUrl = process.env.BASE_URL || "";
    this.logger = new CustomLogger();
    this.cryptoClient = new CryptoClient();
  }

  async getAssets(token: string, query: any) {
    try {
      let queryParams = "";
      if (query) {
        queryParams = "?";
        for (let key of Object.keys(query)) {
          queryParams = queryParams + `${key}=${query[key]}&`;
        }
        queryParams = queryParams.slice(0, -1);
      }
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets/${queryParams}`;
      const assetsUrl = `${this.baseUrl}/trade-wallet/api/assets`;

      if (!token) {
        throw Error("No token was provided. Failed to get assets data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // get user wallets
      const walletsRersponse = await axios.get(walletsUrl, options);
      const wallets = walletsRersponse.data;

      // get users assets
      let assets: any[] = [];
      for (let wallet of wallets) {
        const payload = {
          username: wallet.username,
          walletName: wallet.name,
          walletId: wallet.id,
          type: wallet.type,
        };

        const assetsRersponse = await axios.post(assetsUrl, payload, options);
        let walletAssets = assetsRersponse.data;

        // get wallet transactions
        for (let asset of walletAssets) {
          const query = {
            coinImage: true,
            type: asset.type,
            wallet: asset.walletName,
            name: asset.name,
            symbol: asset.symbol,
          };
          const assetTransactions = await this.cryptoClient.getTransactions(
            token,
            query
          );
          asset.transactions = assetTransactions;
        }
        assets = assets.concat(walletAssets);
      }
      return assets;
    } catch (error) {
      this.logger.error(`Error fetching assets: ${error}`);
    }
  }

  async getAssetsByQuery(token: string, query: any) {
    try {
      let queryParams = "";
      if (query) {
        queryParams = "?";
        for (let key of Object.keys(query)) {
          queryParams = queryParams + `${key}=${query[key]}&`;
        }
        queryParams = queryParams.slice(0, -1);
      }

      const assetsUrl = `${this.baseUrl}/trade-wallet/api/assets/${queryParams}`;

      if (!token) {
        throw Error("No token was provided. Failed to get wallets data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const assetsRersponse = await axios.get(assetsUrl, options);
      const assets = assetsRersponse.data;
      return assets;
    } catch (error) {
      this.logger.error(`Error fetching assets: ${error}`);
    }
  }

  async getUserWallets(token: string) {
    try {
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets`;

      if (!token) {
        throw Error("No token was provided. Failed to get wallets data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletsRersponse = await axios.get(walletsUrl, options);
      const wallets = walletsRersponse.data;
      return wallets;
    } catch (error) {
      this.logger.error(`Error fetching wallets: ${error}`);
      throw new Error(`Error fetching wallets:", ${error}`);
    }
  }

  async getWalletByName(token: string, walletName: string) {
    try {
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets/?name=${walletName}`;

      if (!token) {
        throw Error("No token was provided. Failed to get wallets data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletsRersponse = await axios.get(walletsUrl, options);
      let wallets = walletsRersponse.data;
      return wallets[0];
    } catch (error) {
      this.logger.error(`Error fetching wallet: ${error}`);
    }
  }

  async getWallet(token: string, id: number) {
    try {
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets/${id}`;

      if (!token) {
        throw Error("No token was provided. Failed to get wallet data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletRersponse = await axios.get(walletsUrl, options);
      const wallet = walletRersponse.data;
      return wallet;
    } catch (error) {
      this.logger.error(`Error fetching wallet: ${error}`);
    }
  }

  async addWallet(token: string, payload: any) {
    try {
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets`;

      if (!token) {
        throw Error("No token was provided. Failed to post wallet");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletRersponse = await axios.post(walletsUrl, payload, options);
      const wallet = walletRersponse.data;
      return wallet;
    } catch (error) {
      this.logger.error(`Error posting wallet: ${error}`);
    }
  }

  async patchWallet(token: string, walletId: number, payload: any) {
    try {
      const walletsUrl = `${this.baseUrl}/trade-wallet/api/wallets/${walletId}`;

      if (!token) {
        throw Error("No token was provided. Failed to patch wallet");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletRersponse = await axios.patch(walletsUrl, payload, options);
      const wallet = walletRersponse.data;
      return wallet;
    } catch (error) {
      this.logger.error(`Error patching wallet: ${error}`);
    }
  }

  async getWalletHistory(token: string, query: any) {
    try {
      let queryParams = "";
      if (query) {
        queryParams = "?";
        for (let key of Object.keys(query)) {
          queryParams = queryParams + `${key}=${query[key]}&`;
        }
        queryParams = queryParams.slice(0, -1);
      }
      const walletHistoryUrl = `${this.baseUrl}/trade-wallet/api/histories/${queryParams}`;

      if (!token) {
        throw Error("No token was provided. Failed to get wallet history data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(walletHistoryUrl, options);
      const walletHistory = response.data;
      return walletHistory;
    } catch (error) {
      this.logger.error(`Error fetching wallet history: ${error}`);
    }
  }

  async addWalletHistory(token: string, payload: any) {
    try {
      const walletHistoryUrl = `${this.baseUrl}/trade-wallet/api/histories`;

      if (!token) {
        throw Error("No token was provided. Failed to post wallet history");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const walletRersponse = await axios.post(
        walletHistoryUrl,
        payload,
        options
      );
      const wallet = walletRersponse.data;
      return wallet;
    } catch (error) {
      this.logger.error(`Error posting wallet history: ${error}`);
    }
  }
}

export default WalletClient;
