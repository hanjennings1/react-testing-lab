import { render, screen } from '@testing-library/react';
import AccountContainer from '../../components/AccountContainer';

describe("Display Transactions", () => {

// BASE CASE: confirms transactions fetched on mount actually render
  test("renders transactions fetched on startup", async () => {
    // Mock a successful fetch response with one transaction
    global.setFetchResponse([
      {
        id: "1",
        date: "2019-12-01",
        description: "Paycheck from Bob's Burgers",
        category: "Income",
        amount: 1000
      }
    ]);

    render(<AccountContainer />);

    // findByText waits for the async fetch/state update to resolve
    const transaction = await screen.findByText("Paycheck from Bob's Burgers");
    expect(transaction).toBeInTheDocument();
  });


// EDGE CASE: confirms multiple transactions all render, not just one
  test("renders multiple transactions fetched on startup", async () => {
    // Mock a successful fetch response with two transactions
    global.setFetchResponse([
      {
        id: "1",
        date: "2019-12-01",
        description: "Paycheck from Bob's Burgers",
        category: "Income",
        amount: 1000
      },
      {
        id: "2",
        date: "2019-12-04",
        description: "Sunglasses, Urban Outfitters",
        category: "Fashion",
        amount: -24.99
      }
    ]);

    render(<AccountContainer />);

    const transaction1 = await screen.findByText("Paycheck from Bob's Burgers");
    const transaction2 = await screen.findByText("Sunglasses, Urban Outfitters");

    expect(transaction1).toBeInTheDocument();
    expect(transaction2).toBeInTheDocument();
  });


// FAILURE CASE: confirms the app doesn't crash or show data if fetch fails
  test("does not render transactions if fetch fails", async () => {
    // Override fetch to simulate a rejected/failed network request.
    // Note: AccountContainer.jsx has a .catch() on this fetch chain
    // (added to prevent an unhandled promise rejection during this test)
    global.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")));

    render(<AccountContainer />);

    // queryByText returns null instead of throwing, so it's safe to assert absence
    const noTransactions = screen.queryByText("Paycheck from Bob's Burgers");
    expect(noTransactions).not.toBeInTheDocument();
  });

});