import React from "react";
import PriceAlertTask from "./task/priceAlertTask";

const TaskArgs = (props: any) => {
  const { taskType, taskArgs, setTaskArgs } = props;

  return (
    <div className="my-5">
      <h4>
        Task <strong>{(taskType as { name: string }).name}</strong> Args
      </h4>
      {taskType.name === "Price Alert" && (
        <PriceAlertTask taskArgs={taskArgs} setTaskArgs={setTaskArgs} />
      )}
    </div>
  );
};

export default TaskArgs;
