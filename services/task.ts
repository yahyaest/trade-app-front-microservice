import axios from "axios";
import { CustomLogger } from "@/utils/logger";

class TaskClient {
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

  async addTask(token: string, payload: any) {
    try {
      const tasksUrl = `${this.baseUrl}/trade-task-scheduler/api/tasks/`;

      if (!token) {
        throw Error("No token was provided. Failed to post task");
      }
      const options: any = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const taskRersponse = await axios.post(tasksUrl, payload, options);
      const task = taskRersponse.data;
      return task;
    } catch (error) {
      this.logger.error(`Error posting task : ${error}`);
      throw(`Error posting task : ${error}`);
    }
  }
}

export default TaskClient;