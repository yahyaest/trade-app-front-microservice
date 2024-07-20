import React from "react";
import PriceAlertTask from "./task/priceAlertTask";
import WalletHistory from "./task/walletHistory";

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
      {taskType.name === "Wallet History" && <WalletHistory taskArgs={taskArgs} setTaskArgs={setTaskArgs} />}
    </div>
  );
};

export default TaskArgs;
