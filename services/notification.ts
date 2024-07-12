import axios from "axios";
import { getToken, getUserByEmail } from "./gateway";
import Cookies from "js-cookie";
let cookies: any;

if (typeof window === "undefined") {
  // This code will only be executed on the server
  cookies = require("next/headers").cookies;
} else {
  // This code will only be executed on the client
  cookies = Cookies;
}

export const addUserNotification = async (payload: any) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/notifications`;
    const token = Cookies.get("token")
      ? Cookies.get("token")
      : cookies().get("token")?.value;
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
    console.error("Failed to create notification :", error);
  }
};

export const addProductOwnerNotification = async (
  appSigninPayload: any,
  productOwner: string,
  data: any
) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/notifications`;

    // Get Product Owner User
    const signinPayload = appSigninPayload;

    const appToken = await getToken(
      signinPayload.email,
      signinPayload.password
    );

    if (!appToken) {
      throw Error("No token was provided. Failed to post notification");
    }

    const productOwnerUser = await getUserByEmail(productOwner, appToken);
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
    console.error("Failed to create notification :", error);
  }
};

export const getUserNotifications = async (email: string) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/notifications/?userEmail=${email}`;
    const token = Cookies.get("token")
      ? Cookies.get("token")
      : cookies().get("token")?.value;
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
    console.log("Notifications: ", notification);

    return notification;
  } catch (error) {
    console.error("Failed to get notifications :", error);
  }
};

export const updateNotification = async (
  notificationId: number,
  payload: any
) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/notifications/${notificationId}`;
    const token = Cookies.get("token")
      ? Cookies.get("token")
      : cookies().get("token")?.value;
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
    console.error("Failed to update notification :", error);
  }
};

export const updateBulkNotification = async (payload: any) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/bulk_notifications`;
    const token = Cookies.get("token")
      ? Cookies.get("token")
      : cookies().get("token")?.value;
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
    console.error("Failed to update notifications :", error);
  }
};

export const deleteNotification = async (notificationId: number) => {
  try {
    const notificationBaseUrl = process.env.NOTIFICATION_BASE_URL;
    const notificationUrl = `${notificationBaseUrl}/api/notifications/${notificationId}`;
    const token = Cookies.get("token")
      ? Cookies.get("token")
      : cookies().get("token")?.value;
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
    console.error("Failed to delete notification :", error);
  }
};
