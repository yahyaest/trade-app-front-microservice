import axios from "axios";
import { CustomLogger } from "@/utils/logger";
class CryptoClient {
  private baseUrl: string;
  private logger;
  public source?: string;

  constructor(source?: string) {
    this.baseUrl = process.env.BASE_URL || "";
    this.logger = new CustomLogger();
    this.source = source;
  }

  serverLogger(level: "info" | "debug" | "warn" | "error", message: string) {
    if (this.source === "server") {
      switch (level) {
        case "info":
          this.logger.info(message);
          break;
        case "debug":
          this.logger.debug(message);
          break;
        case "warn":
          this.logger.warn(message);
          break;
        case "error":
          this.logger.error(message);
          break;
        default:
          break;
      }
    }
  }

  async getTransactions(token: string, query: any = {}) {
    try {
      let queryParams = "";
      if (query) {
        queryParams = "?";
        for (let key of Object.keys(query)) {
          queryParams += `${key}=${query[key]}&`;
        }
        queryParams = queryParams.slice(0, -1);
      }

      const transactionsUrl = `${this.baseUrl}/trade-crypto/api/transactions/${queryParams}`;
      // Check URL validity
      let urlValid = true;
      try {
        const url = new URL(transactionsUrl);
      } catch (e) {
        urlValid = false;
        this.logger.error(e);
      }

      if (!urlValid) {
        throw new Error(`Invalid URL ${transactionsUrl}`);
      }

      if (!token) {
        throw new Error(
          "No token was provided. Failed to get transactions data"
        );
      }

      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(transactionsUrl, options);
      const transactions = response.data;

      return transactions;
    } catch (error: any) {
      if (error.response?.data?.message) {
        this.logger.error(
          `Error fetching transactions : ${error.response.data.message}`
        );
        throw new Error(
          `Error fetching transactions data. ${error.response.data.message}`
        );
      } else {
        this.logger.error(
          `Error fetching transactions : ${error.response.data.message}`
        );
        throw new Error(`Error fetching transactions data. ${error}`);
      }
    }
  }

  async postTransaction(token: string, payload: any = {}) {
    try {
      const transactionsUrl = `${this.baseUrl}/trade-crypto/api/transactions`;

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
      this.logger.error(
        `Error posting transaction : ${error.response.data.message}`
      );
      throw Error(
        `Error posting transaction data. ${error.response.data.message}`
      );
    }
  }

  async getCoins(token: string) {
    try {
      const coinsUrl = `${this.baseUrl}/trade-crypto/api/coins`;

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
      this.logger.error(`Error fetching coins : ${error}`);
      throw Error(`Error fetching coins data. ${error}`);
    }
  }

  async getCoin(token: string, id: number) {
    try {
      const coinUrl = `${this.baseUrl}/trade-crypto/api/coins/${id}`;

      if (!token) {
        throw Error("No token was provided. Failed to get coin data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(coinUrl, options);
      const coin = response.data;

      return coin;
    } catch (error: any) {
      this.logger.error(
        `Error fetching coin with id ${id} : ${error.response.data.message}`
      );
      // throw Error(`Error fetching coin data. ${error.response.data.message}`);
    }
  }

  async getCoinByName(token: string, name: string) {
    try {
      const coinsUrl = `${this.baseUrl}/trade-crypto/api/coins/?name=${name}`;

      this.serverLogger(
        "info",
        `Making GET request to /trade-crypto/api/coins/?name=${name}`
      );

      if (!token) {
        throw Error("No token was provided. Failed to get coin data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(coinsUrl, options);

      this.serverLogger(
        "info",
        `GET Request to /trade-crypto/api/coins/?name=${name} procecced with response ${response.status}`
      );

      const coin = response.data[0];

      return coin;
    } catch (error: any) {
      this.logger.error(
        `Error fetching coin data: ${error.response.data.message}`
      );
      throw Error(`Error fetching coin data: ${error.response.data.message}`);
    }
  }

  async getCoinChartData(token: string, coinId: number, duration: string) {
    try {
      const coinsUrl = `${this.baseUrl}/trade-crypto/api/coins/${coinId}/history/?duration=${duration}`;

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
    } catch (error: any) {
      this.logger.error(
        `Error fetching coin chart data: ${error.response.data.message}`
      );
      throw Error(
        "Error fetching coin chart data. Please check your network connection"
      );
    }
  }

  async getCoinsList(token: string) {
    try {
      const coinsUrl = `${this.baseUrl}/trade-crypto/api/coins/list`;

      if (!token) {
        throw Error("No token was provided. Failed to get coin data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(coinsUrl, options);
      const coinsList = response.data;

      return coinsList;
    } catch (error: any) {
      this.logger.error(
        "Error fetching coins List:",
        error.response.data.message
      );
      throw Error(
        `Error fetching coins List data: ${error.response.data.message}`
      );
    }
  }
}

export default CryptoClient;
