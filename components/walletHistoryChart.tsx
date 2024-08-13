import React, { useState, useEffect } from "react";
import {
  calculateListAverage,
  formatCurrency,
  formatDateForChartFromTimestamp,
} from "@/utils/utils";
import SpinnerModal from "./spinnerModal";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import styles from "./walletHistoryChart.module.css";

const getFilteredData = (
  chartData: { time: string[]; value: number[]; margin: number[] },
  duration: string
) => {
  const now = new Date() as any;
  let startDate;

  switch (duration) {
    case "1h":
      startDate = new Date(now - 60 * 60 * 1000); // 1 hour ago
      break;
    case "3h":
      startDate = new Date(now - 3 * 60 * 60 * 1000); // 3 hours ago
      break;
    case "12h":
      startDate = new Date(now - 12 * 60 * 60 * 1000); // 12 hours ago
      break;
    case "24h":
      startDate = new Date(now - 24 * 60 * 60 * 1000); // 1 day ago
      break;
    case "7d":
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      break;
    case "30d":
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      break;
    case "3m":
      startDate = new Date(now - 3 * 30 * 24 * 60 * 60 * 1000); // 3 months ago
      break;
    case "1y":
      startDate = new Date(now - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      break;
    case "3y":
      startDate = new Date(now - 3 * 365 * 24 * 60 * 60 * 1000); // 3 years ago
      break;
    case "5y":
      startDate = new Date(now - 5 * 365 * 24 * 60 * 60 * 1000); // 5 years ago
      break;
    case "all":
      return chartData;
    default:
      throw new Error("Invalid duration");
  }

  // Filter data based on startDate
  const filteredIndices = chartData.time
    .map((t, index) => (new Date(t) >= startDate ? index : -1))
    .filter((index) => index !== -1);

  return {
    time: filteredIndices.map((index) => chartData.time[index]),
    value: filteredIndices.map((index) => chartData.value[index]),
    margin: filteredIndices.map((index) => chartData.margin[index]),
  };
};

export default function WalletHistoryChart(props: any) {
  const walletChartData: { time: string[]; value: number[]; margin: number[] } =
    props.walletChartData;
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartType, setChartType] = useState<string>("line");
  const [currentTimeData, setCurrentTimeData] = useState<any[]>(
    walletChartData
      ? getFilteredData(walletChartData, "24h").time.map((e) =>
          formatDateForChartFromTimestamp(e, "24h")
        )
      : []
  );
  const [currentValueData, setCurrentValueData] = useState<any[]>(
    walletChartData ? getFilteredData(walletChartData, "24h").value : []
  );
  const [currentMarginlData, setCurrentMarginlData] = useState<any[]>(
    walletChartData ? getFilteredData(walletChartData, "24h").margin : []
  );

  const [selectedDurationClassName, setSelectedDurationClassName] =
    useState<string>("");
  const [selectedChartTypeClassName, setSelectedChartTypeClassName] =
    useState<string>("");
  const [chartMax, setChartMax] = useState<number | null>(
    walletChartData ? Math.max(...currentValueData) : null
  );
  const [chartMin, setChartMin] = useState<number | null>(
    walletChartData ? Math.min(...currentValueData) : null
  );
  const [chartAverage, setChartAverage] = useState<number | null>(
    walletChartData ? calculateListAverage(currentValueData) : null
  );
  const [chartDiff, setChartDiff] = useState<string | null>(
    walletChartData
      ? (
          ((currentValueData[currentValueData.length - 1] -
            currentValueData[0]) /
            currentValueData[0]) *
          100
        ).toFixed(2)
      : null
  );

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("24h");

  const timeline = [
    // "1h",
    // "3h",
    // "12h",
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

  const setDataFormat = () => {
    try {
      for (let index = 0; index < walletChartData.time.length; index++) {
        const day = walletChartData.time[index].split("T")[0];
        const time = walletChartData.time[index].split("T")[1].slice(0, 5);
        walletChartData.time[index] = `${day} ${time}`;
      }
    } catch (error) {
      // pass due to useEffect re-render
    }
  };

  const changeBackgroundColor = (
    className: string,
    target: "duration" | "type"
  ) => {
    if (target === "duration") {
      if (selectedDurationClassName) {
        const prevElement = document.querySelector(
          `.${selectedDurationClassName}`
        ) as any;
        prevElement.style.backgroundColor = ""; // Remove background color
      }
      setSelectedDurationClassName(className);
    } else {
      if (selectedChartTypeClassName) {
        const prevElement = document.querySelector(
          `.${selectedChartTypeClassName}`
        ) as any;
        prevElement.style.backgroundColor = ""; // Remove background color
      }
      setSelectedChartTypeClassName(className);
    }
    const element = document.querySelector(`.${className}`) as any;
    element.style.backgroundColor = "rgba(0, 128, 0, 0.5)"; // Green with 50% opacity
  };

  const updateChartData = async (period: string) => {
    try {
      const filteredWalletChartData = getFilteredData(walletChartData, period);

      let timeData = [];
      let valueData = [];
      let marginData = [];

      for (let element of filteredWalletChartData.time) {
        timeData.push(formatDateForChartFromTimestamp(element, period));
      }

      for (let element of filteredWalletChartData.value) {
        valueData.push(element);
      }

      for (let element of filteredWalletChartData.margin) {
        marginData.push(element);
      }

      setCurrentTimeData(timeData);
      setCurrentValueData(valueData);
      setCurrentMarginlData(marginData);

      const documentStyle = getComputedStyle(document.documentElement);
      let data = {
        labels: timeData,
        datasets: [
          {
            label: `Wallet value`,
            data: valueData,
            yAxisID: "y",
            fill: false,
            borderColor: documentStyle.getPropertyValue("--blue-500"),
            tension: 0.4,
          },
          {
            label: `Margin`,
            data: marginData,
            yAxisID: "y1",
            fill: false,
            borderColor: documentStyle.getPropertyValue("--green-500"),
            tension: 0.4,
          },
        ],
      };
      setChartData(data);
      setChartMax(Math.max(...valueData));
      setChartMin(Math.min(...valueData));
      setChartAverage(calculateListAverage(valueData));
      setChartDiff(
        (
          ((valueData[valueData.length - 1] - valueData[0]) / valueData[0]) *
          100
        ).toFixed(2)
      );
      setDuration(period);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setDataFormat();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: currentTimeData,
      datasets: [
        {
          label: `Wallet value`,
          data: currentValueData,
          yAxisID: "y",
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: `Margin`,
          data: currentMarginlData,
          yAxisID: "y1",
          fill: false,
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            maxTicksLimit: 15,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
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
        y1: {
          type: "linear",
          display: true,
          position: "right",
          ticks: {
            color: textColorSecondary,
            callback: function (value: any, index: any, ticks: any) {
              return `${value % 1 === 0 ? value : value.toFixed(2)}` + " %";
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
          header={`Fetching wallet history data`}
        />
      )}

      <div className="flex justify-content-start  align-items-center mx-2  sm:mx-5 mt-3">
        <Tag
          value="Wallet Chart"
          severity={"warning"}
          className="sm:mr-6 w-auto sm:w-full lg:w-auto"
        />
        {chartDiff && (
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
        )}
        <p className="mx-2 sm:mx-5 m-1">
          High : <strong>{formatCurrency(chartMax)}</strong>
        </p>
        <p className="mx-2 sm:mx-5 m-1">
          Low : <strong>{formatCurrency(chartMin)}</strong>
        </p>
        <p className="mx-2 sm:mx-5 m-1">
          Average : <strong>{formatCurrency(chartAverage)}</strong>
        </p>
      </div>

      <div className="card sm:m-2 md:m-5">
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
              className={` my-1 p-1 px-1 sm:px-3 ${styles.chart_option_element} duration-${e}`}
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
              className={` my-1 p-1 px-3 ${
                styles.chart_option_element
              } type-${e} ${
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
