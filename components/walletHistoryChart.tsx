import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function WalletHistoryChart(props: any) {
  const walletChartData: { time: string[]; value: number[]; margin: number[] } =
    props.walletChartData;
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

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

  useEffect(() => {
    setDataFormat();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: walletChartData.time,
      datasets: [
        {
          label: `Wallet value`,
          data: walletChartData.value,
          yAxisID: "y",
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: `Margin`,
          data: walletChartData.margin,
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
  }, []);

  return (
    <div className="card m-5">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
