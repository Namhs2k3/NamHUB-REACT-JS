// export const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "VND",
//     }).format(value);
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US").format(value) + "₫";
