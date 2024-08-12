import { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { Page } from "../../types/types";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { CustomLogger } from "@/utils/logger";
import TaskClient from "@/services/task";
import TaskArgs from "@/components/taskArgs";
import { Task } from "@/models/task";
import { User } from "@/models/user";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

const TasksPage: Page = (props: any) => {
  const taskClient = new TaskClient();
  const { error } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskType, setTaskType] = useState<string | object>("");
  const [isTaskPeriodic, setIsTaskPeriodic] = useState<boolean>(false);
  const [cronExpression, setCronExpression] = useState<string>("");
  const [retryNumber, setRetryNumber] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(true);
  // Task Args States
  const [taskArgs, setTaskArgs] = useState<Object>({});

  const toast: any = useRef(null);
  const router = useRouter();

  const items = [{ label: `tasks` }];
  const home = { icon: "pi pi-home", label: "icons", url: "/" };
  const token = Cookies.get("token") as string;
  const user = Cookies.get("user")
    ? (JSON.parse(Cookies.get("user") as string) as User)
    : null;

  const tasksList = [
    { name: "Wallet History" }, // TODO: to be removed and created by admin for each user
    { name: "Price Alert" },
    { name: "Buy Crypto Coin" },
  ];

  const errorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const createTaskToast = (taskName: string, status: boolean): Promise<void> => {
    return new Promise((resolve) => {
      toast.current?.show({
        severity: status ? "success" : "error",
        summary: status ? "Task created successfully" : "Failed to create task",
        detail: status ? `Task ${taskName} created successfully` : `Failed to create task ${taskName}`,
        life: 3000,
      });
  
      // Resolve the promise after the duration of the toast
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const handleMainSubmitState = () => {
    if (!taskName || !taskType || (isTaskPeriodic && !cronExpression)) {
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
    }
  };

  const onTaskTypeChange = async (e: any) => {
    setTaskType(e.value);
    setTaskArgs({});
  };

  const submitTask = async () => {
    try {
      const payload: Task = {
        name: taskName,
        description: taskDescription,
        task_type: (taskType as { name: string }).name,
        cron_expression: isTaskPeriodic ? cronExpression ? cronExpression : null : null,
        user: user?.email as string,
        args: taskArgs,
        retry_number: retryNumber ? retryNumber : 0,
      };
      await taskClient.addTask(token, payload);
      await createTaskToast(taskName, true);
      router.reload();
    } catch (error: any) {
      console.log(error.message);
      createTaskToast(taskName, false);
    }
  };

  useEffect(() => {
    // if (coinsList) setLoading(false);
    setLoading(false);
    handleMainSubmitState();
  }, [taskName, taskType, isTaskPeriodic, cronExpression]);

  if (error) {
    console.log(error);
    errorToast(error);
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <Toast ref={toast} />
        <h3>{error}</h3>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
      <BreadCrumb model={items as any} home={home} className="my-3" />
      <h1 className="font-bold text-3xl sm:text-6xl text-yellow-500">Tasks</h1>
      <Toast ref={toast} />

      <div
        style={{
          borderRadius: "56px",
          padding: "0.3rem",
          background:
            "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
        }}
        className="mx-3 sm:mx-8 my-5"
      >
        <div
          className="w-full surface-card py-8 px-5 sm:px-8"
          style={{ borderRadius: "53px" }}
        >
          <h1 className="text-left text-2xl">Create Task Form</h1>
          <div className="my-5">
            <label
              htmlFor="taskName"
              className="block text-900 text-xl font-medium mb-2"
            >
              Task Name
            </label>
            <InputText
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              type="text"
              placeholder="Task Name"
              className="w-full md:w-30rem mb-5"
              style={{ padding: "1rem" }}
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="description"
              className="block text-900 text-xl font-medium mb-2"
            >
              Task Description
            </label>
            <InputTextarea
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={5}
              cols={30}
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="taskType"
              className="block text-900 text-xl font-medium mb-2"
            >
              Task Type
            </label>
            <Dropdown
              value={taskType}
              onChange={(e) => onTaskTypeChange(e)}
              options={tasksList}
              optionLabel="name"
              placeholder="Select a Task"
              className="w-full md:w-14rem"
            />
          </div>
          <div className="my-5">
            <Checkbox
              onChange={(e) => setIsTaskPeriodic(!isTaskPeriodic)}
              checked={isTaskPeriodic}
            ></Checkbox>
            <label htmlFor="ingredient1" className="ml-2">
              Is Periodic
            </label>
          </div>
          {isTaskPeriodic && (
            <div className="my-5">
              <label
                htmlFor="taskName"
                className="block text-900 text-xl font-medium mb-2"
              >
                CronExpression
              </label>
              <InputText
                id="cronExpression"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                type="text"
                placeholder="CronExpression"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
              />
            </div>
          )}
          <div className="my-5">
            <label htmlFor="retryNumber" className="font-bold block mb-2">
              Retry Number
            </label>
            <InputNumber
              inputId="retryNumber"
              value={retryNumber}
              onValueChange={(e) => setRetryNumber(e.value as number)}
              showButtons
              min={0}
              max={5}
            />
          </div>
          {/* Task Args */}
          {taskType && (
            <TaskArgs
              taskType={taskType}
              taskArgs={taskArgs}
              setTaskArgs={setTaskArgs}
              isTaskPeriodic={isTaskPeriodic}
              setIsSubmit={setIsSubmit}
              handleMainSubmitState={handleMainSubmitState}
            />
          )}

          {/* End Task Args */}
          <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
          <Button
            label="Submit"
            className="w-20rem p-3 text-xl"
            onClick={() => submitTask()}
            disabled={!isSubmit}
          ></Button>
        </div>
      </div>

      <Button
        label="Tasks Dashboards"
        raised
        onClick={() =>
          window.open(
            process.env.TASK_SCHEDULER_BASE,
            "_blank",
            "noopener,noreferrer"
          )
        }
        className="mb-5"
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  const logger = new CustomLogger();
  try {
    const token = context.req.cookies["token"];

    if (!token) {
      logger.warn("No token was provided. Redirecting to login page");
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error: any) {
    logger.error(`Error in task page: ${error.message}`);
    return {
      props: { error: error.message },
    };
  }
};

export default TasksPage;
