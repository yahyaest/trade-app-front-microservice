import axios from "axios";
import Cookies from "js-cookie";
import { CustomLogger } from "@/utils/logger";
import { User } from "@/models/user";

class GatewayClient {
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

  async register(username: string, email: string, password: string) {
    try {
      const signUpUrl = `${this.baseUrl}/api/auth/signup`;
      const register = await axios.post(signUpUrl, {
        username,
        email,
        password,
      });
      const token = register.data.access_token;
      if (!token)
        return { isRegister: false, message: "No token was provided" };
      Cookies.set("token", token);
      return { isRegister: true, message: "You have successfully Registered" };
    } catch (error: any) {
      this.logger.error(`Error register user : ${error.response.data.message}`);
      return { isRegister: false, message: error.response.data.message };
    }
  }

  async login(email: string, password: string) {
    try {
      const signInUrl = `${this.baseUrl}/api/auth/signin`;
      const login = await axios.post(signInUrl, { email, password });
      const token = login.data.access_token;
      if (!token) return false;
      Cookies.set("token", token);
      return true;
    } catch (error) {
      this.logger.error(`Error login : ${error}`);
      return false;
    }
  }

  logout() {
    Cookies.remove("token");
    Cookies.remove("user");
  }

  async getToken(email: string, password: string) {
    try {
      const signInUrl = `${this.baseUrl}/api/auth/signin`;
      const login = await axios.post(signInUrl, { email, password });
      const token = login.data.access_token;
      if (!token) return null;
      return token;
    } catch (error) {
      this.logger.error(`Failed to get token : ${error}`);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const currentUserUrl = `${this.baseUrl}/api/users/me`;
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
      return user as User;
    } catch (error) {
      this.logger.error(`Error fetching current user : ${error}`);
    }
  }

  async getUserByEmail(email: string, token: string) {
    try {
      // Token need to be of admin user
      const currentUserUrl = `${this.baseUrl}/api/users/?email=${email}`;
      if (!token) {
        throw Error("No token was provided. Failed to get current user data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(currentUserUrl, options);
      const user = response.data[0];
      return user as User;
    } catch (error) {
      this.logger.error(`Error fetching user ${email} : ${error}`);
      alert(error);
    }
  }

  async getUsers() {
    try {
      const currentUserUrl = `${this.baseUrl}/api/users`;

      const response = await axios.get(currentUserUrl);
      const users = response.data;
      return users;
    } catch (error) {
      this.logger.error(`Error fetching users : ${error}`);
    }
  }

  async uploadImage(file: string, username: string) {
    try {
      const uploadImageUrl = `${this.baseUrl}/api/images`;

      const token = Cookies.get("token");
      if (!token) {
        this.logger.warn("No token was provided");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      const response = await axios.post(uploadImageUrl, formData, options);
      if (response.status === 201) return response.data;
    } catch (error) {
      this.logger.error(`Error uploading image : ${error}`);
    }
  }

  async getCurrentUserAvatar() {
    try {
      const currentUserAvatarUrl = `${this.baseUrl}/api/images/me`;
      const token = Cookies.get("token");
      if (!token) {
        throw Error("No token was provided. Failed to get current user data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(currentUserAvatarUrl, options);
      const image = response.data;
      const imageUrl = `${this.baseUrl}/${image.filename}`;
      return image ? imageUrl : null;
    } catch (error) {
      this.logger.error(`Error fetching current user image : ${error}`);
    }
  }

  async getUserAvatar(username: string, token: string) {
    // Token need to be of admin user
    try {
      const currentUserAvatarUrl = `${this.baseUrl}/api/images/?username=${username}`;
      if (!token) {
        throw Error("No token was provided. Failed to get current user data");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(currentUserAvatarUrl, options);
      const image = response.data;
      const imageUrl = `${image[0].filename}`;
      return imageUrl;
    } catch (error) {
      this.logger.error(`Error fetching image for ${username} : ${error}`);
    }
  }
}

export default GatewayClient;
