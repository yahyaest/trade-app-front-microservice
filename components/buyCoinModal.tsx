import React, { useState, useRef } from "react";
import Cookies from "js-cookie";
import { formatCurrency } from "@/utils/utils";
import CryptoClient from "@/services/crypto";
import WalletClient from "@/services/wallet";
import { Wallet } from "@/models/wallet";
import { CryptoCoin } from "@/models/cryptoCoin";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Toast } from "primereact/toast";

export default function BuyCoinModal(props: any) {
  const cryptoClient = new CryptoClient();
  const walletClient = new WalletClient();
  const { visible, setVisible, toast } = props;
  const wallets: Wallet[] = props.wallets;
  const coin: CryptoCoin = props.coin;
  const [selectedWallet, setSelectedWallet] = useState<Wallet>({} as Wallet);
  const [amount, setAmount] = useState<number>(0);
  const [value, setValue] = useState<string>("0");
  const [sliderValue, setSliderValue] = useState<number>(100);

  const buyCoinsToast = (coinName: string, amount: number) => {
    toast.current?.show({
      severity: "success",
      summary: "Buy coins",
      detail: `${amount} ${coinName} are bought succussfully`,
      life: 3000,
    });
  };

  const buyCoinsErrorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Buy coins failed",
      detail: error,
      life: 3000,
    });
  };

  const buyCoins = async (wallet: Wallet, amount: number) => {
    try {
      const token = Cookies.get("token") as string;
      const transactionPayload = {
        wallet: wallet.name,
        username: wallet.username,
        action: "BUY",
        type: "CRYPTO",
        amount,
        name: coin.name,
        symbol: coin.symbol,
        unit_price: coin.price,
        value: `${+coin.price * amount}`,
      };
      await cryptoClient.postTransaction(token, transactionPayload);
      const walletPayload = {
        currentValue: `${+wallet.currentValue - +coin.price * amount}`,
      };
      await walletClient.patchWallet(token, wallet.id, walletPayload);
      buyCoinsToast(coin.name, amount);
    } catch (error: any) {
      console.log(error.message);
      buyCoinsErrorToast(error.message);
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
          buyCoins(selectedWallet, amount);
          setVisible(false);
        }}
        autoFocus
        disabled={
          +coin.price * amount > +selectedWallet.currentValue ||
          Object.keys(selectedWallet).length === 0 ||
          amount === 0
            ? true
            : false
        }
      />
    </div>
  );

  return (
    <React.Fragment>
      <Dialog
        header={`Buy ${coin.name}`}
        visible={visible}
        style={{ width: "75vw" }}
        className="px-0 md:px-8"
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div>
          {+coin.price * amount > +selectedWallet.currentValue && (
            <div
              className="mt-2 mb-4 text-center"
              style={{ backgroundColor: "tomato", borderRadius: "10px" }}
            >
              <p className="p-2 text-white">
                <strong>
                  {`Transaction value ${formatCurrency(
                    +coin.price * amount
                  )} is superior to your wallet value ${formatCurrency(
                    selectedWallet.currentValue
                  )}`}
                </strong>
              </p>
            </div>
          )}

          {+coin.price * amount <= +selectedWallet.currentValue && (
            <div
              className="mt-2 mb-4 text-center"
              style={{ backgroundColor: "greenyellow", borderRadius: "10px" }}
            >
              <p className="p-2">
                <strong>
                  {`Transaction value ${formatCurrency(+coin.price * amount)}`}
                </strong>
              </p>
            </div>
          )}
          <div className="flex-auto mb-5">
            <label htmlFor="minmax-buttons" className="font-bold block mb-2">
              Wallet
            </label>
            <Dropdown
              value={selectedWallet}
              onChange={(e) => {
                setSelectedWallet(e.value);
                setValue(formatCurrency(e.value.currentValue));
              }}
              options={wallets}
              optionLabel="name"
              placeholder="Select a Wallet"
              className="w-full md:w-14rem"
            />
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
                    +selectedWallet.currentValue - +coin.price * e.value
                  )
                );
                setSliderValue(
                  100 -
                    ((+coin.price * e.value) / +selectedWallet.currentValue) *
                      100
                );
              }}
              mode="decimal"
              showButtons
              min={0}
              max={500}
            />
          </div>

          {Object.keys(selectedWallet).length > 0 && (
            <div className="flex-auto">
              <label htmlFor="minmax-buttons" className="font-bold block mb-2">
                Wallet Value
              </label>
              <div className="w-14rem">
                <InputText value={`${value}`} className="w-full" />
                <Slider value={sliderValue} className="w-full" />
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
}
