import React from "react";
import { formatCurrency } from "@/utils/utils";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import BuyCoinModal from "./buyCoinModal";
import { CryptoCoin } from "@/models/cryptoCoin";
import { Wallet } from "@/models/wallet";

export default function CoinHeader(props: any) {
  const { isModal, setIsModal, HandleBuyButton,toast } = props;
  const coin: CryptoCoin = props.coin;
  const currentCoin: CryptoCoin = props.currentCoin;
  const userWallets: Wallet[] = props.userWallets;

  return (
    <React.Fragment>
      {isModal && (
        <BuyCoinModal
          visible={isModal}
          setVisible={setIsModal}
          wallets={userWallets}
          coin={coin}
          toast={toast}
        />
      )}
      <div className="flex justify-content-start align-items-center mx-5">
        <img
          src={`${coin.iconUrl}`}
          alt={coin.name}
          width="50px"
          className="mr-3"
        />
        <h3 className="mr-3">{coin.name}</h3>
        <h6 className="mr-3">{coin.symbol}</h6>
        <Tag value={`#${coin.rank}`} severity={"danger"} className="mr-3" />
        <h4>{formatCurrency(currentCoin.price)}</h4>
        <Button
          label="Buy"
          severity="info"
          size="large"
          rounded
          className="ml-auto mr-8"
          onClick={() => HandleBuyButton()}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "1px",
          color: "silver",
          backgroundColor: "silver",
        }}
        className="mt-3"
      ></div>
      <div className="flex justify-content-start align-items-center mx-5 mt-3">
        <Tag value="Summary" severity={"success"} className="mr-6" />
        <p>{coin.description}</p>
      </div>
    </React.Fragment>
  );
}
