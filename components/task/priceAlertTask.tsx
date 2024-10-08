import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoClient from "@/services/crypto";
import { CryptoCoin } from "@/models/cryptoCoin";
import { User } from "@/models/user";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";

const PriceAlertTask = (props: any) => {
  const cryptoClient = new CryptoClient();
  const { taskArgs, setTaskArgs, setIsSubmit, handleMainSubmitState } = props;
  const [coinsList, setCoinsList] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [selectedCoinValue, setSelectedCoinValue] = useState<string>("");
  const [currentCoinValue, setCurrentCoinValue] = useState<string>("");
  const [coinPriceMargin, setCoinPriceMargin] = useState<string>("");
  const [alertPrice, setAlertPrice] = useState<number>(0);
  const [priceDirection, setPriceDirection] = useState<"over" | "under">(
    "over"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const token = Cookies.get("token") as string;
  const user = Cookies.get("user")
    ? (JSON.parse(Cookies.get("user") as string) as User)
    : null;

  const setTaskTypeData = async () => {
    const coinsList = await cryptoClient.getCoinsList(token);
    setCoinsList(coinsList);
  };

  const handleSubmitState = () => {
    if (selectedCoin) {
      setIsSubmit(true);
      handleMainSubmitState();
    } else {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await setTaskTypeData();
      setTaskArgs({ ...taskArgs, user, priceDirection });
    }
    if (!coinsList.length) {
      fetchData();
    }
    handleSubmitState();
  }, [selectedCoin]);

  const onCoinChange = async (e: any) => {
    setLoading(true);
    const coin: CryptoCoin = await cryptoClient.getCoinByName(
      token,
      e.value.name
    );
    const oldCoinPrice = +coin.price;
    let currentCoin: CryptoCoin = await cryptoClient.getCoin(token, coin.id);
    if (!currentCoin) {
      currentCoin = coin;
    }
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

  return (
    <>
      <p className="text-sm">
        (Task for sending notification alert if chosen coin is over/under target
        price)
      </p>
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
          Alert Price
        </label>
        <div className="flex justify-content-center my-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex align-items-center">
              <RadioButton
                inputId="over"
                name="over"
                value="over"
                onChange={(e) => {
                  setPriceDirection(e.value);
                  setTaskArgs({ ...taskArgs, priceDirection: e.value });
                }}
                checked={priceDirection === "over"}
              />
              <label htmlFor="over" className="ml-2">
                over
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="under"
                name="under"
                value="under"
                onChange={(e) => {
                  setPriceDirection(e.value);
                  setTaskArgs({ ...taskArgs, priceDirection: e.value });
                }}
                checked={priceDirection === "under"}
              />
              <label htmlFor="under" className="ml-2">
                under
              </label>
            </div>
          </div>
        </div>
        <InputNumber
          inputId="alertPrice"
          value={currentCoinValue ? +currentCoinValue : alertPrice}
          onValueChange={(e) => {
            setAlertPrice(e.value as number);
            setTaskArgs({ ...taskArgs, alertPrice: e.value as number });
          }}
          showButtons
          min={0}
          max={999999}
        />
      </div>
    </>
  );
};

export default PriceAlertTask;
