import React from "react";

function AddTransactionForm({postTransaction}) {
  function submitForm(e){
    e.preventDefault()
    const newTransaction = {
      date: e.target.elements.date.value,
      description: e.target.elements.description.value,
      category: e.target.elements.category.value,
      amount: e.target.elements.amount.value
    }
    postTransaction(newTransaction)
  }

  return (
    <form className="add-transaction-form" onSubmit={(e)=>{submitForm(e)}}>
      <div className="form-fields">
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" name="date" />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <input id="description" type="text" name="description" placeholder="Description" />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <input id="category" type="text" name="category" placeholder="Category" />
        </div>
        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
      </div>
      <button className="btn-primary" type="submit">
        Add Transaction
      </button>
    </form>
  );
}

export default AddTransactionForm;