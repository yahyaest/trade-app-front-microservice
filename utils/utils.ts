export const formatCurrency = (value: any) => {
  let price = +value;
  let formatedPrice: string = price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (formatedPrice.includes(".00")) {
    formatedPrice = formatedPrice.split(".")[0];
  }
  return formatedPrice;
};

export const formatRelativeTime = (dateString: string | Date) => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifference = currentDate - inputDate;
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const monthsDifference = Math.floor(daysDifference / 30.44);
  const yearsDifference = Math.floor(monthsDifference / 12);

  if (yearsDifference > 0) {
    return `${yearsDifference} year${yearsDifference !== 1 ? "s" : ""} ago`;
  } else if (monthsDifference > 0) {
    return `${monthsDifference} month${monthsDifference !== 1 ? "s" : ""} ago`;
  } else if (daysDifference > 0) {
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} minute${
      minutesDifference !== 1 ? "s" : ""
    } ago`;
  } else {
    return `${secondsDifference} second${
      secondsDifference !== 1 ? "s" : ""
    } ago`;
  }
};
