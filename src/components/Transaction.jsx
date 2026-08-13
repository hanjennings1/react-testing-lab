import React from "react";

function Transaction({transaction}) {
  const amount = Number(transaction.amount);
  const isNegative = amount < 0;
  const formattedAmount = `${isNegative ? "-" : ""}$${Math.abs(amount).toFixed(2)}`;

  return (
    <tr>
      <td>{transaction.date}</td>
      <td>{transaction.description}</td>
      <td>{transaction.category}</td>
      <td className={`col-amount ${isNegative ? "amount-negative" : "amount-positive"}`}>
        {formattedAmount}
      </td>
    </tr>
  );
}

export default Transaction;