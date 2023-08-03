import axios from "axios";

export const getTransactions = async (token: string, query: any = {}) => {
  try {
    let queryParams = "";
    if (query) {
      queryParams = "?";
      for (let key of Object.keys(query)) {
        queryParams = queryParams + `${key}=${query[key]}&`;
      }
      queryParams = queryParams.slice(0, -1);
    }

    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const transactionsUrl = `${cryptoBaseUrl}/api/transactions/${queryParams}`;

    if (!token) {
      throw Error("No token was provided. Failed to get transactions data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(transactionsUrl, options);
    const transactions = response.data;

    return transactions;
  } catch (error : any) {
    console.error("Error fetching transactions:", error.response.data.message);
    throw Error(`Error fetching transactions data. ${error.response.data.message}`);
  }
};

export const postTransaction = async (token: string, payload: any = {}) => {
  try {
    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const transactionsUrl = `${cryptoBaseUrl}/api/transactions`;

    if (!token) {
      throw Error("No token was provided. Failed to get transaction data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(transactionsUrl, payload, options);
    const transaction = response.data;

    return transaction;
  } catch (error: any) {
    console.error("Error fetching transaction:", error.response.data.message);
    throw Error(`Error fetching transaction data. ${error.response.data.message}`);
  }
};

export const getCoins = async (token: string) => {
  try {
    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const coinsUrl = `${cryptoBaseUrl}/api/coins`;

    if (!token) {
      throw Error("No token was provided. Failed to get coins data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(coinsUrl, options);
    const coins = response.data;

    return coins;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw Error(
      `Error fetching coins data. ${error}`
    );
  }
};

export const getCoin = async (token: string, id: number) => {
  try {
    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const coinsUrl = `${cryptoBaseUrl}/api/coins/${id}`;

    if (!token) {
      throw Error("No token was provided. Failed to get coin data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(coinsUrl, options);
    const coin = response.data;

    return coin;
  } catch (error : any) {
    console.error("Error fetching coin:", error.response.data.message);
     throw Error(
       `Error fetching coin data. ${error.response.data.message}`
     );
  }
};

export const getCoinByName = async (token: string, name: string) => {
  try {
    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const coinsUrl = `${cryptoBaseUrl}/api/coins/?name=${name}`;

    if (!token) {
      throw Error("No token was provided. Failed to get coin data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(coinsUrl, options);
    const coin = response.data[0];

    return coin;
  } catch (error : any) {
    console.error("Error fetching coin:", error.response.data.message);
     throw Error(`Error fetching coin data: ${error.response.data.message}`);
  }
};

export const getCoinChartData = async (
  token: string,
  coinId: number,
  duration: string
) => {
  try {
    const cryptoBaseUrl = process.env.CRYPTO_BASE_URL;
    const coinsUrl = `${cryptoBaseUrl}/api/coins/${coinId}/history/?duration=${duration}`;

    if (!token) {
      throw Error("No token was provided. Failed to get coin data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(coinsUrl, options);
    const chartData = response.data;

    return chartData;
  } catch (error) {
    console.error("Error fetching coin chart data:", error);
    throw Error(
      "Error fetching coin chart data. Please check your network connection"
    );
  }
};
