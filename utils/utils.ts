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

  const timeDifference = (currentDate as any) - (inputDate as any);
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


export const formatDateForChartFromTimestamp = (
  dateString: string,
  duration: string,
) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // '2023-09-09 21:57'
  // '2023-09-09T21:57.042Z'

  const year = dateString.split('-')[0];
  const month = months[parseInt(dateString.split('-')[1]) - 1];
  const day = dateString.split('-')[2].split(' ')[0];
  const hours = dateString.includes('T') ? dateString.split('T')[1].split(':')[0] : dateString.split(' ')[1].split(':')[0];
  const minutes = dateString.includes('T') ? dateString.split('T')[1].split(':')[1].split('.')[0] : dateString.split(' ')[1].split(':')[1];

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  if (['1h', '3h', '12h', '24h'].indexOf(duration) !== -1) {
    return `${hours}:${minutes}`;
  }

  if (['7d'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${day} ${hours}:${minutes}`;
  }

  if (['30d', '3m'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${day}`;
  }

  if (['1y'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} `;
  }

  if (['3y'].indexOf(duration) !== -1) {
    return `${capitalizedMonth} ${year}`;
  }

  return `${year}`;
};


export const calculateListAverage = (numbers : number[]) => {
  // Check if the input is a valid array and not empty
  if (!Array.isArray(numbers) || numbers.length === 0) {
      throw new Error('Input must be a non-empty array of numbers');
  }

  // Calculate the sum of all numbers
  const sum = numbers.reduce((acc, num) => acc + num, 0);

  // Calculate the average
  const average = sum / numbers.length;

  return average;
}