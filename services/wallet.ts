import axios from "axios";
import CryptoClient from "./crypto";

const cryptoClient = new CryptoClient();

export const getAssets = async (token: string, query: any) => {
  try {
    let queryParams = "";
    if (query) {
      queryParams = "?";
      for (let key of Object.keys(query)) {
        queryParams = queryParams + `${key}=${query[key]}&`;
      }
      queryParams = queryParams.slice(0, -1);
    }
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets/${queryParams}`;
    const assetsUrl = `${walletBaseUrl}/api/assets`;

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
        const assetTransactions = await cryptoClient.getTransactions(
          token,
          query
        );
        asset.transactions = assetTransactions;
      }
      assets = assets.concat(walletAssets);
    }
    return assets;
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
};

export const getAssetsByQuery = async (token: string, query: any) => {
  try {
    let queryParams = "";
    if (query) {
      queryParams = "?";
      for (let key of Object.keys(query)) {
        queryParams = queryParams + `${key}=${query[key]}&`;
      }
      queryParams = queryParams.slice(0, -1);
    }

    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const assetsUrl = `${walletBaseUrl}/api/assets/${queryParams}`;

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
    console.error("Error fetching assets:", error);
  }
};

export const getUserWallets = async (token: string) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets`;

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
    console.error("Error fetching wallets:", error);
    throw new Error(`Error fetching wallets:", ${error}`);
  }
};

export const getWalletByName = async (token: string, walletName: string) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets/?name=${walletName}`;

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
    console.error("Error fetching wallets:", error);
  }
};

export const getWallet = async (token: string, id: number) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets/${id}`;

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
    console.error("Error fetching wallet :", error);
  }
};

export const addWallet = async (token: string, payload: any) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets`;

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
    console.error("Error posting wallet:", error);
  }
};

export const patchWallet = async (
  token: string,
  walletId: number,
  payload: any
) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletsUrl = `${walletBaseUrl}/api/wallets/${walletId}`;

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
    console.error("Error patching wallet:", error);
  }
};

export const getWalletHistory = async (token: string, query: any) => {
  try {
    let queryParams = "";
    if (query) {
      queryParams = "?";
      for (let key of Object.keys(query)) {
        queryParams = queryParams + `${key}=${query[key]}&`;
      }
      queryParams = queryParams.slice(0, -1);
    }
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletHistoryUrl = `${walletBaseUrl}/api/histories/${queryParams}`;

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
    console.error("Error fetching wallet history:", error);
  }
};

export const addWalletHistory = async (token: string, payload: any) => {
  try {
    const walletBaseUrl = process.env.WALLET_BASE_URL;
    const walletHistoryUrl = `${walletBaseUrl}/api/histories`;

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
    console.error("Error posting wallet history:", error);
  }
};
