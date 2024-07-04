import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { addWallet } from "@/services";
import { Wallet } from "@/models/wallet";

export default function AddWalletModal(props: any) {
  const { visible, setVisible, toast } = props;
  const wallets: Wallet[] = props.wallets;
  const [username, setUsername] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [walletType, setWalletType] = useState<"CRYPTO" | "STOCK" | "FOREX">(
    "CRYPTO"
  );
  const [walletValue, setWalletValue] = useState<number>(0);

  useEffect(() => {
    const username = JSON.parse(Cookies.get("user") as string).email;
    setUsername(username);
  }, []);

  const addWalletToast = () => {
    toast.current?.show({
      severity: "success",
      summary: "New wallet",
      detail: `${walletType.toLowerCase()} wallet ${walletName} created succussfully`,
      life: 3000,
    });
  };

  const addWalletErrorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "New wallet failed",
      detail: error,
      life: 3000,
    });
  };

  const createWallet = async () => {
    try {
      const token = Cookies.get("token") as string;
      const payload = {
        username,
        name: walletName,
        type: walletType,
        intialValue: `${walletValue}`,
        currentValue: `${walletValue}`,
      };
      await addWallet(token, payload);
      addWalletToast()
    } catch (error : any) {
      console.log(error.message)
      addWalletErrorToast(error.message)
    }
  };

  const checkMaxWallets = (walletType: "CRYPTO" | "STOCK" | "FOREX") => {
    const typeWallets = wallets.filter(
      (wallet: Wallet) => wallet.type === walletType
    ).length;

    if (typeWallets > 1) return true;
    return false;
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
          createWallet();
          setVisible(false);
        }}
        autoFocus
        disabled={
          !username ||
          !walletName ||
          !walletType ||
          !walletValue ||
          walletType === "STOCK" ||
          walletType === "FOREX" ||
          checkMaxWallets(walletType)
            ? true
            : false
        }
      />
    </div>
  );

  return (
    <Dialog
      header={`Add new Wallet for ${username}`}
      visible={visible}
      style={{ width: "50vw" }}
      className="w-fit sm:w-auto mx-5"
      onHide={() => setVisible(false)}
      footer={footerContent}
    >
      <div>
        {checkMaxWallets(walletType) && (
          <div
            className="mt-2 mb-4 text-center"
            style={{ backgroundColor: "tomato", borderRadius: "10px" }}
          >
            <p className="p-2 text-white">
              <strong>
                {`You already have the maximum 2 wallets for ${walletType.toLocaleLowerCase()} assets`}
              </strong>
            </p>
          </div>
        )}
        {(walletType === "STOCK" || walletType  === "FOREX") && (
          <div
          className="mt-2 mb-4 text-center"
          style={{ backgroundColor: "tomato", borderRadius: "10px" }}
          >
            <p className="p-2 text-white">
              <strong>
                {`${walletType} wallets are not available yet. Only CRYPTO wallets are available.`}
              </strong>
            </p>
          </div>
        )}
        <div className="flex-auto mb-5">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            Wallet Name
          </label>
          <InputText
            value={walletName}
            onChange={(e) => {
              setWalletName(e.target.value);
            }}
            className="w-full"
          />
        </div>

        <div className="flex-auto mb-5">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            Wallet Type
          </label>
          <Dropdown
            value={walletType}
            onChange={(e) => {
              setWalletType(e.value);
            }}
            options={["CRYPTO", "STOCK", "FOREX"]}
            placeholder="Select a Wallet"
            className="w-full md:w-14rem"
          />
        </div>

        <div className="flex-auto">
          <label htmlFor="minmax-buttons" className="font-bold block mb-2">
            Amount
          </label>
          <InputNumber
            inputId="minmax-buttons"
            value={walletValue}
            onValueChange={(e: any) => {
              setWalletValue(e.value);
            }}
            mode="currency"
            currency="USD"
            locale="en-US"
            showButtons
            min={0}
            max={1000000}
          />
        </div>
      </div>
    </Dialog>
  );
}
