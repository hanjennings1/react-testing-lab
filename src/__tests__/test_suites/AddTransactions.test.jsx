import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountContainer from '../../components/AccountContainer';

describe("Add Transactions", () => {

// BASE CASE: confirms a submitted transaction gets added to the frontend
  test("adds a new transaction to the frontend", async () => {
    const user = userEvent.setup();

    // Mock the initial GET on mount — start with no transactions
    global.setFetchResponse([]);

    render(<AccountContainer />);

    // Re-mock fetch for the upcoming POST request.
    // Simulates what json-server would send back: the new transaction,
    // now with a server-assigned id.
    global.setFetchResponse({
      id: "10",
      date: "2024-01-01",
      description: "Coffee",
      category: "Food",
      amount: "-4.50"
    });

    // Fill out the form (date field skipped — no placeholder to query by)
    await user.type(screen.getByPlaceholderText("Description"), "Coffee");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "-4.50");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Assert the new transaction now renders on screen
    const newTransaction = await screen.findByText("Coffee");
    expect(newTransaction).toBeInTheDocument();
  });

  // Confirms the POST request was actually called with the correct method/URL/body
  // (checks how fetch was invoked, not just what rendered in the DOM)
  test("calls the POST endpoint when a transaction is submitted", async () => {
    const user = userEvent.setup();

    global.setFetchResponse([]);

    render(<AccountContainer />);

    global.setFetchResponse({
      id: "11",
      date: "2024-01-02",
      description: "Groceries",
      category: "Food",
      amount: "-30.00"
    });

    await user.type(screen.getByPlaceholderText("Description"), "Groceries");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "-30.00");

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Wait for the state update to settle so the fetch call has definitely happened
    await screen.findByText("Groceries");

    // global.fetch is a vi.fn() mock, so we can inspect how it was called
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:6001/transactions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String)
      })
    );
  });


  // EDGE CASE: confirms adding a transaction appends to existing ones rather than replacing them
  test("adds a new transaction without removing existing transactions", async () => {
    const user = userEvent.setup();

    // Initial GET on mount — one existing transaction already present
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

    // Wait for the existing transaction to render before continuing, to avoid
    // a race between the GET resolving and the POST mock overwrite below
    await screen.findByText("Paycheck from Bob's Burgers");

    // Re-mock fetch for the POST — the new transaction the "server" returns
    global.setFetchResponse({
      id: "12",
      date: "2024-01-03",
      description: "Movie tickets",
      category: "Entertainment",
      amount: "-15.00"
    });

    await user.type(screen.getByPlaceholderText("Description"), "Movie tickets");
    await user.type(screen.getByPlaceholderText("Category"), "Entertainment");
    await user.type(screen.getByPlaceholderText("Amount"), "-15.00");

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Both the old and new transaction should now be present
    const newTransaction = await screen.findByText("Movie tickets");
    const existingTransaction = screen.getByText("Paycheck from Bob's Burgers");

    expect(newTransaction).toBeInTheDocument();
    expect(existingTransaction).toBeInTheDocument();
  });


  // FAILURE CASE: confirms a failed POST doesn't crash the app or add a phantom transaction
  test("does not add a transaction if the POST request fails", async () => {
    const user = userEvent.setup();

    global.setFetchResponse([]);

    render(<AccountContainer />);

    // Override fetch to simulate a failed POST request.
    // Note: AccountContainer.jsx's postTransaction has a .catch() on this
    // chain (added to prevent an unhandled promise rejection during this test)
    global.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")));

    await user.type(screen.getByPlaceholderText("Description"), "Broken Transaction");
    await user.type(screen.getByPlaceholderText("Category"), "Food");
    await user.type(screen.getByPlaceholderText("Amount"), "-5.00");

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    const noTransaction = screen.queryByText("Broken Transaction");
    expect(noTransaction).not.toBeInTheDocument();
  });

});