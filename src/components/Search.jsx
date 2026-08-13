import React from "react";

function Search({setSearch}) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search your Recent Transactions"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default Search;