import React from "react";
import PriceAlertTask from "./task/priceAlertTask";
import WalletHistoryTask from "./task/walletHistoryTask";

const TaskArgs = (props: any) => {
  const { taskType, taskArgs, setTaskArgs, isTaskPeriodic, setIsSubmit } =
    props;

  return (
    <div className="my-5">
      <h4>
        Task <strong>{(taskType as { name: string }).name}</strong> Args
      </h4>
      {taskType.name === "Price Alert" && (
        <PriceAlertTask
          taskArgs={taskArgs}
          setTaskArgs={setTaskArgs}
          setIsSubmit={setIsSubmit}
        />
      )}
      {taskType.name === "Wallet History" && (
        <WalletHistoryTask
          taskArgs={taskArgs}
          setTaskArgs={setTaskArgs}
          setIsSubmit={setIsSubmit}
        />
      )}
    </div>
  );
};

export default TaskArgs;
