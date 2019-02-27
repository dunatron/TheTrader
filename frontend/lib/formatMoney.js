export default function(amount) {
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }
  // if its a whole, dollar amount, leave off the .00
  if (amount % 100 === 0) options.minimumFractionDigits = 0
  // const formatter = new Intl.NumberFormat("en-US", options)
  const formatter = new Intl.NumberFormat("en-NZ", options)
  // return formatter.format(amount / 100)
  return formatter.format(amount)
}

// export default function formatMoney(n, c, d, t) {
//   const options = {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//   }
//   var c = isNaN((c = Math.abs(c))) ? 2 : c,
//     d = d == undefined ? "." : d,
//     t = t == undefined ? "," : t,
//     s = n < 0 ? "-" : "",
//     i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
//     j = (j = i.length) > 3 ? j % 3 : 0

//   return (
//     s +
//     (j ? i.substr(0, j) + t : "") +
//     i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
//     (c
//       ? d +
//         Math.abs(n - i)
//           .toFixed(c)
//           .slice(2)
//       : "")
//   )
// }
