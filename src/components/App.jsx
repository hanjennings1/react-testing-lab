import React from "react";
import AccountContainer from "./AccountContainer";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h2>The Royal Bank of Flatiron</h2>
        <p>Personal Accounts</p>
      </header>
      <AccountContainer />
    </div>
  );
}

export default App;