import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { formatCurrency } from "@/utils/utils";
import {
  getCoin,
  getCoinByName,
  getWallet,
  patchWallet,
  postTransaction,
} from "@/services";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Asset } from "@/models/asset";
import { CryptoCoin } from "@/models/cryptoCoin";
import { Wallet } from "@/models/wallet";
import { ProgressSpinner } from "primereact/progressspinner";

export default function SellCoinModal(props: any) {
  const { visible, setVisible, toast } = props;
  const data: Asset = props.data;
  const [currentCoin, setCurrentCoin] = useState<CryptoCoin>({} as CryptoCoin);
  const [targetWallet, setTargetWallet] = useState<Wallet>({} as Wallet);
  const [amount, setAmount] = useState<number>(
    data.boughtAmount - data.soldAmount
  );
  const [value, setValue] = useState<string>("0");
  const [sliderValue, setSliderValue] = useState<number>(100);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get("token") as string;
        let currentCoin = await getCoinByName(token, data.name);
        currentCoin = await getCoin(token, currentCoin.id);
        const targetWallet = await getWallet(token, data.walletId);
        setCurrentCoin(currentCoin);
        setTargetWallet(targetWallet);
        setValue(
          formatCurrency(
            +targetWallet.currentValue +
              currentCoin.price * (data.boughtAmount - data.soldAmount)
          )
        );
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (
      Object.keys(currentCoin).length === 0 &&
      Object.keys(targetWallet).length === 0
    )
      fetchData();
  }, []);

  const sellCoinsToast = () => {
    toast.current?.show({
      severity: "success",
      summary: "Sell coins",
      detail: `${amount} ${data.name} are sold succussfully`,
      life: 3000,
    });
  };

  const sellCoinsErrorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Sell coins failed",
      detail: error,
      life: 3000,
    });
  };

  const getCoinBoughtValues = () => {
    let coinBoughtValues = [];
    for (let transaction of data.transactions) {
      const checkValue = coinBoughtValues.filter(
        (value) => value.boughtAt === transaction.unit_price
      );
      if (transaction.action === "BUY" && checkValue.length === 0) {
        let payload: any = {};
        payload.createdAt = (transaction as any).createdAt.split("T")[0];
        payload.boughtAt = transaction.unit_price;
        payload.amount = transaction.amount;
        payload.gain = (
          ((+currentCoin.price - +transaction.unit_price) /
            +transaction.unit_price) *
          100
        ).toFixed(2);
        coinBoughtValues.push(payload);
      }
      if (transaction.action === "BUY" && checkValue.length > 0) {
        let index = coinBoughtValues.findIndex(
          (value: any) => value.boughtAt === transaction.unit_price
        );
        coinBoughtValues[index].amount =
          coinBoughtValues[index].amount + transaction.amount;
      }
    }
    return coinBoughtValues;
  };

  const sellCoins = async (amount: number) => {
    try {
      const token = Cookies.get("token") as string;
      const transactionPayload = {
        wallet: data.walletName,
        username: data.username,
        action: "SELL",
        type: "CRYPTO",
        amount,
        name: data.name,
        symbol: data.symbol,
        unit_price: currentCoin.price,
        value: `${+currentCoin.price * amount}`,
      };
      await postTransaction(token, transactionPayload);
      const walletPayload = {
        currentValue: `${
          +targetWallet.currentValue + +currentCoin.price * amount
        }`,
      };
      await patchWallet(token, targetWallet.id, walletPayload);
      await sellCoinsToast();
      router.reload();
    } catch (error: any) {
      console.log(error.message);
      sellCoinsErrorToast(error.message);
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={() => {
          sellCoins(amount);
          setVisible(false);
        }}
        autoFocus
        disabled={amount === 0 ? true : false}
      />
    </div>
  );

  return (
    <Dialog
      header={`Sell ${data.name}`}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
      footer={footerContent}
    >
      <div>
        <div className="flex-auto mb-5">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            {`Current ${data.name} price`}
          </label>
          {!currentCoin.price && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          )}
          {currentCoin.price && <p>{formatCurrency(currentCoin.price)}</p>}
        </div>
        <div className="flex-auto mb-5">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            Bought At these value
          </label>
          {!currentCoin.price && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          )}
          {currentCoin.price &&
            getCoinBoughtValues().map((e) => (
              <div key={e.boughtAt}>
                <strong>{e.amount}</strong>
                {` ${e.amount > 1 ? "coins" : "coin"} `} bought at
                <strong> {formatCurrency(e.boughtAt)} </strong>
                for coin on <strong> {e.createdAt}</strong> . Gain is
                <strong> {e.gain} %</strong>
              </div>
            ))}
        </div>
        <div className="flex-auto mb-5">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            Amount
          </label>
          <InputNumber
            inputId="minmax-buttons"
            value={amount}
            onValueChange={(e: any) => {
              setAmount(e.value);
              setValue(
                formatCurrency(
                  +targetWallet.currentValue + +currentCoin.price * e.value
                )
              );
              setSliderValue(
                (e.value / (data.boughtAmount - data.soldAmount)) * 100
              );
            }}
            mode="decimal"
            showButtons
            min={0}
            max={data.boughtAmount - data.soldAmount}
          />
        </div>

        {Object.keys(targetWallet).length > 0 && (
          <div className="flex-auto">
            <label htmlFor="minmax-buttons" className="font-bold block mb-2">
              Wallet Value
            </label>
            <div className="w-14rem">
              <InputText value={value} className="w-full" />
              <Slider value={sliderValue} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
