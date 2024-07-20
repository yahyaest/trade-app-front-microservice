import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getCoin, getCoinByName, getCoinsList } from "@/services/crypto";
import { CryptoCoin } from "@/models/cryptoCoin";
import { User } from "@/models/user";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Wallet } from "@/models/wallet";
import { getUserWallets, getWalletByName } from "@/services";
import { Tag } from "primereact/tag";

const WalletHistory = (props: any) => {
  const { taskArgs, setTaskArgs } = props;
  const [walletList, setWalletList] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectAllWallets, setSelectAllWallets] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const token = Cookies.get("token") as string;
  const user = Cookies.get("user")
    ? (JSON.parse(Cookies.get("user") as string) as User)
    : null;

  const setTaskTypeData = async () => {
    const walletList = await getUserWallets(token);
    setWalletList(walletList);
  };

  useEffect(() => {
    async function fetchData() {
      await setTaskTypeData();
      // setTaskArgs({ ...taskArgs });
    }
    fetchData();
  }, []);

  const onWalletChange = async (e: any) => {
    setLoading(true);
    setSelectedWallet(e.value);
    setTaskArgs({ ...taskArgs, wallets: [e.value] });
    setLoading(false);
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
      <p className="text-sm">(Task for tracking wallet history performance)</p>
      <div className="my-5">
        <Checkbox
          onChange={(e) => {
            setSelectAllWallets(!selectAllWallets);
            setTaskArgs({ ...taskArgs, wallets: walletList });
          }}
          checked={selectAllWallets}
        ></Checkbox>
        <label htmlFor="ingredient1" className="ml-2">
          Select All Wallets
        </label>
      </div>

      {!selectAllWallets && (
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
      )}
    </>
  );
};

export default WalletHistory;
