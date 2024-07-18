import { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { Page } from "../../types/types";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
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
import { addTask } from "@/services/task";

const TasksPage: Page = (props: any) => {
  const { error } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskType, setTaskType] = useState<string | object>("");
  const [isTaskPeriodic, setIsTaskPeriodic] = useState<boolean>(false);
  const [cronExpression, setCronExpression] = useState<string>("");
  const [retryNumber, setRetryNumber] = useState<number>(0);
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
    { name: "Order Placement" },
  ];

  const errorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
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
        cron_expression: cronExpression ? cronExpression : null,
        user: user?.email as string,
        args: taskArgs,
        retry_number: retryNumber ? retryNumber : 0,
      };
      await addTask(token, payload);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // if (coinsList) setLoading(false);
    setLoading(false);
  }, []);

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
            />
          )}

          {/* End Task Args */}
          <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
          <Button
            label="Submit"
            className="w-20rem p-3 text-xl"
            onClick={() => submitTask()}
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
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  try {
    const token = context.req.cookies["token"];

    if (!token) {
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
    return {
      props: { error: error.message },
    };
  }
};

export default TasksPage;
