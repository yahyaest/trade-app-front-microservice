import axios from "axios";

export const addTask = async (
  token: string,
  payload: any
) => {
  try {
    const taskBaseUrl = process.env.TASK_SCHEDULER_BASE;
    const tasksUrl = `${taskBaseUrl}/api/tasks/`;

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
    console.error("Error posting task:", error);
  }
};