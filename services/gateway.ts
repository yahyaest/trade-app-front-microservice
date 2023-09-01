import axios from "axios";
import Cookies from "js-cookie";

export const register = async (username: string, email: string, password: string) => {
  try {
    const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
    const signUpUrl = `${gatewayBaseUrl}/api/auth/signup`;
    const redister = await axios.post(signUpUrl, {username, email, password });
    const token = redister.data.access_token;
    if (!token) return false;
    Cookies.set("token", token);
    return true;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
    const signInUrl = `${gatewayBaseUrl}/api/auth/signin`;
    const login = await axios.post(signInUrl, { email, password });
    const token = login.data.access_token;
    if (!token) return false;
    Cookies.set("token", token);
    return true;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};

export const getCurrentUser = async () => {
  try {
    const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
    const currentUserUrl = `${gatewayBaseUrl}/api/users/me`;
    const token = Cookies.get("token");
    if (!token) {
      throw Error("No token was provided. Failed to get current user data");
    }
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(currentUserUrl, options);
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getUsers = async () => {
  try {
    const gatewayBaseUrl = process.env.GATEWAY_BASE_URL;
    const currentUserUrl = `${gatewayBaseUrl}/api/users`;

    const response = await axios.get(currentUserUrl);
    const users = response.data;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
