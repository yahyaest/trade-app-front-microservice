export const formatCurrency = (value: any) => {
  let price = +value;
  let formatedPrice : string =  price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  if(formatedPrice.includes(".00")){
    formatedPrice = formatedPrice.split('.')[0]
  }
  return formatedPrice
};
