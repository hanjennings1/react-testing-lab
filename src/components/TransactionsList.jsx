import React from "react";
import Transaction from "./Transaction";

function TransactionsList({transactions}) {
  if (transactions.length === 0) {
    return <p className="empty-state">No transactions to show.</p>;
  }

  const transactionComponent = transactions.map((transaction)=>{
    return <Transaction key={transaction.id} transaction={transaction}/>
  })

  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th className="col-amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactionComponent}
      </tbody>
    </table>
  );
}

export default TransactionsList;