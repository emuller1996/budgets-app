/* eslint-disable prettier/prettier */

export function ViewDollar(strt) {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  
    return USDollar.format(strt);
  }