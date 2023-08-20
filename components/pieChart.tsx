import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function PieChart(props: any) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const { walletCoinList } = props;

  useEffect(() => {
    let colorList = [
      "blue",
      "yellow",
      "green",
      "red",
      "pink",
      "orange",
      "purple",
      "gray",
      "cyan",
      "teal",
      "indigo",
    ];

    // prevent duplicate color while walletCoinList.length <= colorList.length
    let reserveColorList: any[] = [];

    let colortFontList = [
      { main: 300, hover: 200 },
      { main: 400, hover: 300 },
      { main: 500, hover: 400 },
      { main: 600, hover: 500 },
    ];

    let labels = [];
    let values = [];
    let backgroundColor = [];
    let hoverBackgroundColor = [];

    const documentStyle = getComputedStyle(document.documentElement);

    for (let e of walletCoinList) {
      let randomColorIndex = Math.floor(Math.random() * colorList.length);


      // prevent duplicate color while walletCoinList.length <= colorList.length
      while (
        reserveColorList.indexOf(colorList[randomColorIndex]) !== -1 &&
        colorList.length !== reserveColorList.length
      ) {
        randomColorIndex = Math.floor(Math.random() * colorList.length);
      }

      if (colorList.length !== reserveColorList.length) {
        reserveColorList.push(colorList[randomColorIndex]);
      }


      const randomColorFontIndex = Math.floor(
        Math.random() * colortFontList.length
      );
      labels.push(e.name);
      values.push(e.count);
      backgroundColor.push(
        documentStyle.getPropertyValue(
          `--${colorList[randomColorIndex]}-${colortFontList[randomColorFontIndex].main}`
        )
      );
      hoverBackgroundColor.push(
        documentStyle.getPropertyValue(
          `--${colorList[randomColorIndex]}-${colortFontList[randomColorFontIndex].hover}`
        )
      );
    }

    const data = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor,
          hoverBackgroundColor,
        },
      ],
    };
    const options = {
      cutout: "60%",
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <React.Fragment>
      <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
      />
    </React.Fragment>
  );
}
