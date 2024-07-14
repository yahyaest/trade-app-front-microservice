import React, { useEffect, useRef, useState } from "react";
import { Page } from "../../types/types";
import { useRouter } from "next/router";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const TasksPage: Page = (props: any) => {
  const { error } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [taskName, setTaskName] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("");

  const toast: any = useRef(null);

  const router = useRouter();

  const items = [{ label: `tasks` }];
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  const errorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const submitTask = async () => {
    try {
      console.log("submitTask");
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
          <div>
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

            <label
              htmlFor="taskType"
              className="block text-900 text-xl font-medium mb-2"
            >
              Task Type
            </label>
            <InputText
              id="taskType"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              type="text"
              placeholder="Task Type"
              className="w-full md:w-30rem mb-5"
              style={{ padding: "1rem" }}
            />

            <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
            <Button
              label="Register"
              className="w-full p-3 text-xl"
              onClick={() => submitTask()}
            ></Button>
          </div>
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

export default TasksPage;
