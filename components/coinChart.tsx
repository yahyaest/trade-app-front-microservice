import React, { useState, useEffect } from "react";
import { Tag } from "primereact/tag";
import { Chart } from "primereact/chart";
import Cookies from "js-cookie";
import { getCoinChartData } from "@/services";
import SpinnerModal from "./spinnerModal";
import { CryptoCoin } from "@/models/cryptoCoin";

export default function CoinChart(props: any) {
  const { coinChartData, initialVerticalData, initialHorizentalData, styles } =
    props;
  const coin: CryptoCoin = props.coin;

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartType, setChartType] = useState<string>("line");
  const [currentVerticalData, setCurrentVerticalData] =
    useState<any[]>(initialVerticalData);
  const [currentHorizentalData, setCurrentHorizentalData] = useState<any[]>(
    initialHorizentalData
  );
  const [selectedDurationClassName, setSelectedDurationClassName] =
    useState<string>("");
  const [selectedChartTypeClassName, setSelectedChartTypeClassName] =
    useState<string>("");
  const [chartMax, setChartMax] = useState<string>(
    coinChartData ? coinChartData.max : null
  );
  const [chartMin, setChartMin] = useState<string>(
    coinChartData ? coinChartData.min : null
  );
  const [chartAverage, setChartAverage] = useState<string>(
    coinChartData ? coinChartData.average : null
  );
  const [chartDiff, setChartDiff] = useState<string>(
    coinChartData ? coinChartData.diff : null
  );
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("1h");

  const timeline = [
    "1h",
    "3h",
    "12h",
    "24h",
    "7d",
    "30d",
    "3m",
    "1y",
    "3y",
    "5y",
    "all",
  ];

  const chartTypes = ["line", "bar"];

  const changeBackgroundColor = (
    className: string,
    target: "duration" | "type"
  ) => {
    if (target === "duration") {
      if (selectedDurationClassName) {
        const prevElement = document.querySelector(
          `.${selectedDurationClassName}`
        ) as any;
        prevElement.style.backgroundColor = "";; // Remove background color
      }
      setSelectedDurationClassName(className);
    } else {
      if (selectedChartTypeClassName) {
        const prevElement = document.querySelector(
          `.${selectedChartTypeClassName}`
        ) as any;
        prevElement.style.backgroundColor = "";; // Remove background color
      }
      setSelectedChartTypeClassName(className);
    }
    const element = document.querySelector(`.${className}`) as any;
    element.style.backgroundColor = "rgba(0, 128, 0, 0.5)"; // Green with 50% opacity
  };

  const setChartHorizentalData = (currentvalue: string) => {
    if (
      duration === "1h" ||
      duration === "3h" ||
      duration === "12h" ||
      duration === "24h"
    ) {
      return currentvalue.split(" ")[3];
    }
    if (duration === "7d") {
      let time: any = currentvalue.split(" ");
      time.splice(2, 1);
      time = time.join(" ").toString().replace(",", "");
      return time;
    }
    if (duration === "30d" || duration === "3m") {
      return currentvalue
        .split(" ")
        .slice(0, 2)
        .join(" ")
        .toString()
        .replace(",", "");
    }
    if (duration === "1y") {
      return currentvalue.split(" ")[0];
    }
    if (duration === "3y") {
      let time: any = currentvalue.split(" ");
      time.splice(1, 1);
      time = time.join(" ").toString().replace(",", "");
      return time;
    }
    if (duration === "5y" || duration === "all") {
      return currentvalue.split(" ")[2];
    }
    return currentvalue;
  };

  const updateChartData = async (period: string) => {
    try {
      const token = Cookies.get("token") as string;
      const coinChartData = await getCoinChartData(token, coin.id, period);

      let verticalData = [];
      let horizentalData = [];
      let tooltipHorizentalData = [];

      for (let element of coinChartData.chart) {
        verticalData.push(element.chartPrice);
        horizentalData.push(element.time);
      }

      setCurrentVerticalData(verticalData);
      setCurrentHorizentalData(horizentalData);

      const documentStyle = getComputedStyle(document.documentElement);
      let data = {
        labels: horizentalData,
        datasets: [
          {
            label: `${coin.name} chart`,
            data: verticalData,
            fill: true,
            borderColor: documentStyle.getPropertyValue("--blue-500"),
            tension: 0.4,
          },
        ],
      };
      setChartData(data);
      setChartMax(coinChartData.max);
      setChartMin(coinChartData.min);
      setChartAverage(coinChartData.average);
      setChartDiff(coinChartData.diff);
      setDuration(period);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: currentHorizentalData,
      datasets: [
        {
          label: `${coin.name} chart`,
          data: currentVerticalData,
          fill: true,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        // tooltip:{
        // }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            maxTicksLimit: 15,
            callback: function (this: any, value: any, index: any) {
              return setChartHorizentalData(this.getLabelForValue(value));
            } as any,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: function (value: any, index: any, ticks: any) {
              return "$ " + `${value % 1 === 0 ? value : value.toFixed(2)}`;
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [duration]);

  return (
    <React.Fragment>
      {isDataLoading && (
        <SpinnerModal
          visible={isDataLoading}
          setVisible={setIsDataLoading}
          header={`Fetching ${coin.name} data`}
        />
      )}
      <div className="flex justify-content-start  align-items-center mx-2  sm:mx-5 mt-3">
        <Tag
          value="Price Chart"
          severity={"warning"}
          className="sm:mr-6 w-auto sm:w-full lg:w-auto"
        />
        <p
          className="mx-2 sm:mx-5 m-1 w-full lg:w-auto"
          style={{ color: `${+chartDiff > 0 ? "green" : "red"} ` }}
        >
          {`${
            +chartDiff > 0
              ? `+  ${chartDiff} %`
              : `- ${chartDiff.replace("-", "")} %`
          } `}
        </p>
        <p className="mx-2 sm:mx-5 m-1">
          High : <strong>{chartMax}</strong>
        </p>
        <p className="mx-2 sm:mx-5 m-1">
          Low : <strong>{chartMin}</strong>
        </p>
        <p className="mx-2 sm:mx-5 m-1">
          Average : <strong>{chartAverage}</strong>
        </p>
      </div>

      <div className="card m-2 sm:m-5">
        <Chart type={chartType} data={chartData} options={chartOptions} />
      </div>
      <div className="flex justify-content-center align-items-center mb-3">
        <div className="border-1 border-blue-500">
          <div className="my-1 p-1 sm:px-3">Time period </div>
        </div>
        <div className="flex justify-content-center align-items-center border-1">
          {timeline.map((e) => (
            <div
              key={e}
              className={` my-1 p-1 px-1 sm:px-3 ${styles.test} duration-${e}`}
              onClick={async () => {
                setIsDataLoading(true);
                changeBackgroundColor(`duration-${e}`, "duration");
                await updateChartData(e);
                setIsDataLoading(false);
              }}
            >
              {e}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-content-center align-items-center mb-3">
        <div className="border-1 border-blue-500">
          <div className="my-1 p-1 px-3">Chart Type </div>
        </div>
        <div className="flex justify-content-center align-items-center border-1">
          {chartTypes.map((e) => (
            <div
              key={e}
              className={` my-1 p-1 px-3 ${styles.test} type-${e} ${
                e === "bar" ? "pi pi-chart-bar" : "pi pi-chart-line"
              }`}
              onClick={() => {
                setChartType(e);
                changeBackgroundColor(`type-${e}`, "type");
              }}
            >
              {" "}
              {e}
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
