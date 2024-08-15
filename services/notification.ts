import axios from "axios";
import Cookies from "js-cookie";
import { CustomLogger } from "@/utils/logger";
import GatewayClient from "./gateway";

class NotificationClient {
  private baseUrl: string;
  private logger;
  private cookies: any;
  private gatewayClient: GatewayClient;
  public source?: string;

  constructor(source?: string) {
    this.baseUrl = process.env.BASE_URL || "";
    this.logger = new CustomLogger();
    this.gatewayClient = new GatewayClient();
    this.source = source;

    if (typeof window === "undefined") {
      // This code will only be executed on the server
      this.cookies = require("next/headers").cookies;
    } else {
      // This code will only be executed on the client
      this.cookies = Cookies;
    }
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

  async addUserNotification(payload: any) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/notifications`;
      const token = Cookies.get("token")
        ? Cookies.get("token")
        : this.cookies().get("token")?.value;
      if (!token) {
        throw Error("No token was provided. Failed to post notification");
      }

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!payload.externalArgs) {
        payload.externalArgs = JSON.stringify({});
      }

      const response = await axios.post(notificationUrl, payload, options);
      const notification = response.data;

      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification : ${error}`);
    }
  }

  async addProductOwnerNotification(
    appSigninPayload: any,
    productOwner: string,
    data: any
  ) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/notifications`;

      // Get Product Owner User
      const signinPayload = appSigninPayload;

      const appToken = await this.gatewayClient.getToken(
        signinPayload.email,
        signinPayload.password
      );

      if (!appToken) {
        throw Error("No token was provided. Failed to post notification");
      }

      const productOwnerUser = await this.gatewayClient.getUserByEmail(
        productOwner,
        appToken
      );
      // const productOwnerImage = await getUserAvatar(productOwnerUser?.email as string ,appToken)

      // Post notification
      const options = {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      };

      const payload = {
        userEmail: productOwnerUser?.email,
        username: productOwnerUser?.username,
        userImage: data.userImage,
        userId: productOwnerUser?.id,
        title: data.title,
        message: data.message,
        seen: false,
      };

      const response = await axios.post(notificationUrl, payload, options);
      const notification = response.data;

      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification : ${error}`);
    }
  }

  async getUserNotifications(email: string, userToken = null) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/notifications?userEmail=${email}`;
      const token = Cookies.get("token") ? Cookies.get("token") : userToken;
      if (!token) {
        throw Error("No token was provided. Failed to post notification");
      }

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(notificationUrl, options);
      const notification = response.data;

      return notification;
    } catch (error) {
      this.logger.error(`Failed to get notifications : ${error}`);
    }
  }

  async updateNotification(notificationId: number, payload: any) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/notifications/${notificationId}`;
      const token = Cookies.get("token")
        ? Cookies.get("token")
        : this.cookies().get("token")?.value;
      if (!token) {
        throw Error("No token was provided. Failed to post notification");
      }

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(notificationUrl, payload, options);
      const notification = response.data;

      return notification;
    } catch (error) {
      this.logger.error(`Failed to update notification : ${error}`);
    }
  }

  async updateBulkNotification(payload: any) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/bulk_notifications`;
      const token = Cookies.get("token")
        ? Cookies.get("token")
        : this.cookies().get("token")?.value;
      if (!token) {
        throw Error("No token was provided. Failed to post notification");
      }

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(notificationUrl, payload, options);
      const notifications = response.data;

      return notifications;
    } catch (error) {
      this.logger.error(`Failed to update notifications : ${error}`);
    }
  }

  async deleteNotification(notificationId: number) {
    try {
      const notificationUrl = `${this.baseUrl}/trade-notification/api/notifications/${notificationId}`;
      const token = Cookies.get("token")
        ? Cookies.get("token")
        : this.cookies().get("token")?.value;
      if (!token) {
        throw Error("No token was provided. Failed to post notification");
      }

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(notificationUrl, options);
      const notification = response.data;

      return notification;
    } catch (error) {
      this.logger.error(`Failed to delete notification : ${error}`);
    }
  }
}

export default NotificationClient;
