import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import CryptoClient from "@/services/crypto";
import WalletClient from "@/services/wallet";
import { CryptoCoin } from "@/models/cryptoCoin";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { Messages } from "primereact/messages";

const PlaceOrderTask = (props: any) => {
  const cryptoClient = new CryptoClient();
  const walletClient = new WalletClient();
  const {
    taskArgs,
    setTaskArgs,
    isTaskPeriodic,
    setIsSubmit,
    handleMainSubmitState,
  } = props;
  const msgs = useRef<Messages>(null);
  const [coinsList, setCoinsList] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [selectedCoinValue, setSelectedCoinValue] = useState<string>("");
  const [currentCoinValue, setCurrentCoinValue] = useState<string>("");
  const [coinPriceMargin, setCoinPriceMargin] = useState<string>("");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [messageShowed, setMessageShowed] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const token = Cookies.get("token") as string;
  const user = Cookies.get("user")
    ? (JSON.parse(Cookies.get("user") as string) as User)
    : null;

  const setTaskTypeData = async () => {
    const coinsList = await cryptoClient.getCoinsList(token);
    setCoinsList(coinsList);
    const walletList: Wallet[] | any = await walletClient.getUserWallets(token);
    setWalletList(
      walletList.filter((wallet: Wallet) => wallet.type === "CRYPTO")
    );
  };

  const handleSubmitState = () => {
    if (coinAmount > 0 && selectedWallet && selectedCoin && !messageShowed) {
      setIsSubmit(true);
      handleMainSubmitState();
    } else {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await setTaskTypeData();
      setTaskArgs({ ...taskArgs, user });
    }
    if (!coinsList.length && !walletList.length) {
      fetchData();
    }
    handleSubmitState();
  }, [coinAmount, selectedWallet, selectedCoin]);

  const handleMessages = (orderCost: number) => {
    if (orderCost > +selectedWallet!.currentValue) {
      setIsSubmit(false);
      if (!messageShowed) {
        msgs.current?.show([
          {
            sticky: true,
            severity: "error",
            summary: "Error",
            detail: ` : You don't have enough balance in your wallet to place this order`,
          },
        ]);
        setMessageShowed(true);
      }
    } else {
      setIsSubmit(true);
      setMessageShowed(false);
      msgs.current?.clear();
    }
  };

  const onCoinChange = async (e: any) => {
    setLoading(true);
    const coin: CryptoCoin = await cryptoClient.getCoinByName(
      token,
      e.value.name
    );
    const oldCoinPrice = +coin.price;
    const currentCoin: CryptoCoin = await cryptoClient.getCoin(token, coin.id);
    const newCoinPrice = +currentCoin.price;
    const priceMargin = (
      ((newCoinPrice - oldCoinPrice) / oldCoinPrice) *
      100
    ).toFixed(2);
    setSelectedCoin(currentCoin);
    setSelectedCoinValue(e.value);
    setCurrentCoinValue(newCoinPrice.toFixed(2));
    setCoinPriceMargin(priceMargin);
    setTaskArgs({ ...taskArgs, coin: currentCoin });
    setLoading(false);
  };

  const onWalletChange = async (e: any) => {
    setLoading(true);
    setCoinAmount(0);
    setOrderNumber(0);
    msgs.current?.clear();
    setSelectedWallet(e.value);
    setTaskArgs({ ...taskArgs, wallet: e.value });
    setLoading(false);
  };

  const onCoinAmountChange = (e: any) => {
    const orderCost = e.value * +currentCoinValue;
    handleMessages(orderCost);
    const orderNumber = Math.floor(+selectedWallet!.currentValue / orderCost);
    setOrderNumber(orderNumber);
    setCoinAmount(e.value as number);
    setTaskArgs({ ...taskArgs, coinAmount: e.value });
  };

  const getTypeSeverity = (type: string) => {
    switch (type) {
      case "FOREX":
        return "danger";

      case "STOCK":
        return "success";

      case "CRYPTO":
        return "info";
    }
  };

  const selectedCoinTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <>
          {loading ? (
            <ProgressSpinner className="w-2rem h-2rem" />
          ) : (
            <div className="flex align-items-center">
              <Avatar image={option.icon} shape="circle" />
              <div className="mx-2 text-xs sm:text-lg font-bold">
                {option.name.length < 20 ? option.name : selectedCoin?.symbol}
              </div>
              <div className="mx-1 text-xs sm:text-lg">
                {currentCoinValue} $
              </div>
              <div
                className="mx-1 text-xs sm:text-lg"
                style={{ color: `${+coinPriceMargin > 0 ? "green" : "red"} ` }}
              >
                {`(${
                  +coinPriceMargin > 0
                    ? `+  ${coinPriceMargin} %`
                    : `- ${coinPriceMargin.replace("-", "")} %`
                })`}
              </div>
            </div>
          )}
        </>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const coinOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <Avatar image={option.icon} shape="circle" />
        <div className="mx-2">{option.name}</div>
      </div>
    );
  };

  const selectedWalletTemplate = (option: Wallet, props: any) => {
    if (option) {
      return (
        <>
          {loading ? (
            <ProgressSpinner className="w-2rem h-2rem" />
          ) : (
            <div className="flex align-items-center">
              <Tag
                value={option.type}
                severity={getTypeSeverity(option.type)}
              ></Tag>
              <div className="mx-2">
                {option.name} ({(+option.currentValue).toFixed(2)} $)
              </div>
            </div>
          )}
        </>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const walletOptionTemplate = (option: Wallet) => {
    return (
      <div className="flex align-items-center">
        <Tag value={option.type} severity={getTypeSeverity(option.type)}></Tag>
        <div className="mx-2">{option.name}</div>
      </div>
    );
  };

  return (
    <>
      <p className="text-sm">(Task for buying crypto coin)</p>
      <div className="my-5">
        <label htmlFor="coin" className="font-bold block mb-2">
          Coin <span className="text-xs">(with current price)</span>
        </label>
        <Dropdown
          value={selectedCoinValue}
          onChange={(e) => onCoinChange(e)}
          options={coinsList}
          optionLabel="name"
          placeholder="Select a Coin"
          className="w-full md:w-25rem"
          valueTemplate={selectedCoinTemplate}
          itemTemplate={coinOptionTemplate}
        />
      </div>

      <div className="my-5">
        <label htmlFor="coin" className="font-bold block mb-2">
          Wallet <span className="text-xs">(with current price)</span>
        </label>
        <Dropdown
          value={selectedWallet}
          onChange={(e) => onWalletChange(e)}
          options={walletList}
          optionLabel="name"
          placeholder="Select a Wallet"
          className="w-full md:w-25rem"
          valueTemplate={selectedWalletTemplate}
          itemTemplate={walletOptionTemplate}
        />
      </div>

      {walletList.length > 0 && selectedWallet && selectedCoin && (
        <div className="my-5">
          <label htmlFor="coinAmount" className="font-bold block mb-2">
            Coin Amount
          </label>
          <p className="text-xs">
            (Order Cost for {selectedCoin.name} :{" "}
            {(coinAmount * +currentCoinValue).toFixed(2)} $){" "}
          </p>
          {isTaskPeriodic && orderNumber > 0 && (
            <p className="text-xs">
              ({selectedWallet.name} wallet won&apos;t support this operation
              after {orderNumber} {orderNumber > 1 ? "orders" : "order"}. Task
              will be stopped after that)
            </p>
          )}
          <Messages ref={msgs} />
          <InputNumber
            inputId="coinAmount"
            value={coinAmount}
            onValueChange={(e) => onCoinAmountChange(e)}
            showButtons
            min={0}
            max={100}
          />
        </div>
      )}
    </>
  );
};

export default PlaceOrderTask;
