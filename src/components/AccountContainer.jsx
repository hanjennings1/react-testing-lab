import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")

  useEffect(()=>{
    fetch("http://localhost:6001/transactions")
    .then(r=>r.json())
    .then(data=>setTransactions(data))
    .catch(error => console.error("Failed to fetch transactions:", error))
  },[])

  function postTransaction(newTransaction){
    fetch('http://localhost:6001/transactions',{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
    .then(r=>r.json())
    .then(data=>setTransactions([...transactions,data]))
    .catch(error => console.error("Failed to add transaction:", error))
  }

  // Sort transactions by the given field (description or category)
  function onSort(sortBy){
    const sorted = [...transactions].sort((a, b) =>
      a[sortBy].localeCompare(b[sortBy])
    )
    setTransactions(sorted)
  }

  // Filter transactions by the current search text (case-insensitive match on description)
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="app-content">
      <section className="add-transaction-card">
        <h3>Add a Transaction</h3>
        <AddTransactionForm postTransaction={postTransaction}/>
      </section>

      <section className="transactions-section">
        <div className="transactions-toolbar">
          <h3>Recent Transactions</h3>
          <div className="toolbar-controls">
            <Search setSearch={setSearch}/>
            <Sort onSort={onSort}/>
          </div>
        </div>
        <TransactionsList transactions={filteredTransactions} />
      </section>
    </main>
  );
}

export default AccountContainer;