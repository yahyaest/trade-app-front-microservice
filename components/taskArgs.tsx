import React from "react";
import PriceAlertTask from "./task/priceAlertTask";
import PlaceOrderTask from "./task/placeOrderTask";
import WalletHistoryTask from "./task/walletHistoryTask";

const TaskArgs = (props: any) => {
  const { taskType, taskArgs, setTaskArgs, isTaskPeriodic, setIsSubmit, handleMainSubmitState } =
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
          handleMainSubmitState={handleMainSubmitState}
        />
      )}
      {taskType.name === "Wallet History" && (
        <WalletHistoryTask
          taskArgs={taskArgs}
          setTaskArgs={setTaskArgs}
          setIsSubmit={setIsSubmit}
          handleMainSubmitState={handleMainSubmitState}
        />
      )}
      {taskType.name === "Buy Crypto Coin" && (
        <PlaceOrderTask
          taskArgs={taskArgs}
          setTaskArgs={setTaskArgs}
          isTaskPeriodic={isTaskPeriodic}
          setIsSubmit={setIsSubmit}
          handleMainSubmitState={handleMainSubmitState}
        />
      )}
    </div>
  );
};

export default TaskArgs;
