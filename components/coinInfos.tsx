import React from "react";
import { formatCurrency } from "@/utils/utils";
import { Button } from "primereact/button";
import { CryptoCoin } from "@/models/cryptoCoin";

export default function CoinInfos(props: any) {
  const  coin : CryptoCoin  = props.coin;

  const valueStatistics = [
    { title: "Price to USD", value: formatCurrency(coin.price), isSpan: true },
    { title: "Coin Rank", value: coin.rank, isSpan: true },
    {
      title: "24h Volume",
      value: formatCurrency(coin.lastDayVolume),
      isSpan: true,
    },
    {
      title: "Market CAp",
      value: formatCurrency(coin.marketCap),
      isSpan: true,
    },
    {
      title: "All Time High",
      value: formatCurrency(JSON.parse(coin.allTimeHigh).price),
      value2: new Date(JSON.parse(coin.allTimeHigh).timestamp * 1000)
        .toISOString()
        .split("T")[0],
      isSpan: false,
    },
  ];

  const renderValueStatistics = (data: any) => {
    return (
      <React.Fragment key={data.title}>
        <div className="flex justify-content-between ">
          <p className="text-lg">{data.title}</p>
          <div>
            <p className="text-lg">
              <strong>{data.value}</strong>
            </p>
            {data.value2 && <p className="text-sm">on {data.value2}</p>}
          </div>
        </div>
        {data.isSpan && (
          <div
            style={{
              width: "100%",
              height: "1px",
              color: "silver",
              backgroundColor: "silver",
            }}
            className="mb-3"
          ></div>
        )}
      </React.Fragment>
    );
  };

  const additionalInformations = [
    { title: "Website", value: coin.websiteUrl, isUrl: true, isSpan: true },
    {
      title: "CoinRanking Website",
      value: coin.coinrankingUrl,
      isUrl: true,
      isSpan: true,
    },
    {
      title: "Number Of Market",
      value: coin.numberOfMarkets,
      isUrl: false,
      isSpan: true,
    },
    {
      title: "Market CAp",
      value: coin.numberOfExchanges,
      isUrl: false,
      isSpan: true,
    },
  ];

  const renderAdditionalInformations = (data: any) => {
    return (
      <React.Fragment key={data.title}>
        <div className="flex justify-content-between ">
          <p className="text-lg">{data.title}</p>
          {data.isUrl ? (
            <a href={data.value}>
              <Button label="Visit" size="small" text />
            </a>
          ) : (
            <p className="text-lg">
              <strong>{data.value}</strong>
            </p>
          )}
        </div>
        {data.isSpan && (
          <div
            style={{
              width: "100%",
              height: "1px",
              color: "silver",
              backgroundColor: "silver",
            }}
            className="mb-3"
          ></div>
        )}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className="formgrid grid mx-5">
        <div className="col mx-5">
          <h2 className="mb-5">Value Statistics</h2>
          {valueStatistics.map((e) => renderValueStatistics(e))}
        </div>

        <div className="col mx-5">
          <h2>Additional Information</h2>
          {additionalInformations.map((e) => renderAdditionalInformations(e))}
        </div>
      </div>
    </React.Fragment>
  );
}
