import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountContainer from '../../components/AccountContainer';

describe("Search Transactions", () => {

// BASE CASE: confirms typing in the search box triggers a change and filters the list
  test("filters transactions when a search term is entered", async () => {
    const user = userEvent.setup();

    // Mock the initial GET on mount with two transactions
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

    // Wait for both to render before searching, to avoid race conditions
    // between the initial fetch resolving and the search state updating
    await screen.findByText("Paycheck from Bob's Burgers");
    await screen.findByText("Sunglasses, Urban Outfitters");

    const searchInput = screen.getByPlaceholderText("Search your Recent Transactions");
    await user.type(searchInput, "Sunglasses");

    // The matching transaction should remain
    expect(screen.getByText("Sunglasses, Urban Outfitters")).toBeInTheDocument();

    // The non-matching transaction should be filtered out
    // queryByText (not getByText) is used since it returns null instead of
    // throwing, which is what we want when asserting something is absent
    expect(screen.queryByText("Paycheck from Bob's Burgers")).not.toBeInTheDocument();
  });


// EDGE CASE: confirms clearing the search resets the list to show all transactions again
  test("shows all transactions again when the search is cleared", async () => {
    const user = userEvent.setup();

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

    await screen.findByText("Paycheck from Bob's Burgers");
    await screen.findByText("Sunglasses, Urban Outfitters");

    const searchInput = screen.getByPlaceholderText("Search your Recent Transactions");

    // Narrow the list down first
    await user.type(searchInput, "Sunglasses");
    expect(screen.queryByText("Paycheck from Bob's Burgers")).not.toBeInTheDocument();

    // Clear the search
    await user.clear(searchInput);

    // Both transactions should be visible again
    expect(await screen.findByText("Paycheck from Bob's Burgers")).toBeInTheDocument();
    expect(screen.getByText("Sunglasses, Urban Outfitters")).toBeInTheDocument();
  });


// FAILURE CASE: confirms a search with no matches renders an empty list, not an error.
  // (No network call is involved in search, so "failure" here means the natural
  // no-results scenario rather than a fetch rejection.)
  test("renders no transactions when search matches nothing", async () => {
    const user = userEvent.setup();

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

    await screen.findByText("Paycheck from Bob's Burgers");

    const searchInput = screen.getByPlaceholderText("Search your Recent Transactions");
    await user.type(searchInput, "zzz-no-match-zzz");

    expect(screen.queryByText("Paycheck from Bob's Burgers")).not.toBeInTheDocument();
  });

});

describe("Sort Transactions", () => {

// Confirms selecting a sort option reorders transactions alphabetically by that field.
  // Not a rubric-required test, but added as a safety net since we implemented
  // the onSort logic in AccountContainer.jsx as part of this lab.
  test("sorts transactions by description in ascending order", async () => {
    const user = userEvent.setup();

    global.setFetchResponse([
      {
        id: "1",
        date: "2019-12-01",
        description: "Zebra Print Purchase",
        category: "Fashion",
        amount: -19.99
      },
      {
        id: "2",
        date: "2019-12-02",
        description: "Apple Store Purchase",
        category: "Electronics",
        amount: -999
      }
    ]);

    render(<AccountContainer />);

    await screen.findByText("Zebra Print Purchase");
    await screen.findByText("Apple Store Purchase");

    // <select> elements have an implicit "combobox" role
    const sortSelect = screen.getByRole("combobox");
    await user.selectOptions(sortSelect, "description");

    // Grab all table rows, skipping the header row
    const rows = screen.getAllByRole("row").slice(1);

    // After sorting by description, "Apple..." should come before "Zebra..."
    expect(rows[0]).toHaveTextContent("Apple Store Purchase");
    expect(rows[1]).toHaveTextContent("Zebra Print Purchase");
  });

});