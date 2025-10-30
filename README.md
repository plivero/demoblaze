# Demoblaze Product Store — Cypress (UI)

> End-to-end automation suite with **Cypress**, covering UI flows of the [Demoblaze Product Store](https://www.demoblaze.com/index.html/) platform.

---

## About

This repository contains an automated test suite built with Cypress for the Demoblaze Product Store.
It focuses on clean, maintainable UI flows, following the Page Object Model (POM) pattern and using environment-based configuration.

The suite is fast, deterministic, and easy to extend.

---

# Tech Stack & Versions

![Node](https://img.shields.io/badge/node-v22.14.0-339933?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-v11.3.0-CB3837?logo=npm&logoColor=white)
![Cypress](https://img.shields.io/badge/cypress-v15.2.0-04C38E?logo=cypress&logoColor=white)
![Electron](https://img.shields.io/badge/electron-36.4.0-47848F?logo=electron&logoColor=white)
![Bundled Node](<https://img.shields.io/badge/node(bundled)-v22.15.1-339933?logo=node.js&logoColor=white>)
![Faker](https://img.shields.io/badge/faker-v10.0.0-FF6F00)

---

## Table of Contents

- [Project Structure](#project-structure)
- [Folders & Files Overview](#folders--files-overview)
- [Best Practices](#best-practices)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)
- [Test Types](#test-types)
- [Test Design Techniques](#test-design-techniques)
- [State Transition Table](#state-transition-table)
- [Decision Table Summary](#decision-table-summary)
- [Coverage & Traceability](#coverage--traceability)
- [Entry / Exit Criteria](#entry--exit-criteria)
- [Locator Strategy](#locator-strategy)
- [Automated Scenarios](#automated-scenarios)
- [References](#references)

## Project Structure

```bash
demoblaze/
├─ cypress/
│  ├─ e2e/
│  ├─ fixtures/
│  └─ support/
│     ├─ helpers/
│     ├─ pages/
│  ├─ commands.js
│  ├─ e2e.js
├─ cypress.env.json # Local environment variables (added manually)

```

## Folders & Files Overview

- **cypress/e2e** → All Cypress specs (UI only).
- **cypress/support/helpers/** → Minimal helpers for static data (e.g., orderData.js).
- **cypress/support/pages/** → Page Objects (POM) with locators and simple actions only.
- **cypress/support/commands.js** → Custom commands (ensureSession, ignoreNextAlert, expectNextAlert).
- **cypress/support/e2e.js/** → Global imports and configuration.

---

## Best Practices

This suite was developed under a **short and constrained timeline**, requiring clear prioritization to ensure a stable and reliable automation baseline. The first phase focused exclusively on validating the **essential purchase flow** — the path that ensures a customer can successfully complete a transaction.

Once this flow (login → laptop selection → cart → checkout → confirmation) was fully stable and deterministic, the scope was expanded to include other categories (**Phones**, **Monitors**) and additional user-impacting behaviors such as **pagination**, **alerts**, **required-field validations**, and **cart operations**.

Although Cypress officially recommends using **`data-*` attributes** for selectors — and this remains the best practice for maintainable test suites — the target application (Demoblaze) does **not expose reliable test-friendly selectors**. Due to limitations in the site’s markup and occasional rendering issues, **text-based and semantic selectors were used as a fallback** strategy, striking a balance between **stability and feasibility**.

---

- **Essential flow first**: prioritize and stabilize the critical end-to-end purchase before scaling coverage.
- **Independent specs**: each test starts from a clean state (cart cleared, fresh session) using `cy.session()` to isolate contexts and avoid cross-test dependency.
- **Stable selectors**: fallback to robust text-based or semantic selectors — always aiming for resilience and readability.
- **Page Objects**:
  - Only expose locators and direct actions
  - **No assertions, no logic inside PO files**
  - All assertions live in `.spec.js`
- **Deterministic data**: minimal, predictable test data (via helper functions like `orderData()`) reduces flakiness and improves repeatability.
- **Unified alert handling**: centralized commands to handle and assert `window.alert` messages consistently.

---

## How to Run

### Run Locally

Clone the repository:

```bash
git clone https://github.com/plivero/demoblaze.git
cd demoblaze
```

### Install dependencies:

```bash
npm ci
```

### Run Cypress in interactive mode:

```bash
npx cypress open
```

### Run all tests in headless mode:

```bash
npx cypress run
```

### Run specific spec or folder:

```bash
npx cypress run --spec "cypress/e2e/*.cy.js"
```

---

## Environment Variables

Sensitive or configurable data is externalized through environment variables.

Example:

```json
{
  "USER_NAME": "Name_Example",
  "USER_PASSWORD": "Password_Example"
}
```

---

## Test Types

- **Functional testing**: validate the purchase workflow: login → catalog → product → cart → checkout.
- **Regression testing**: ensure price/cart behavior is stable after code/config changes.
- **Confirmation testing**: re-run previously failing cases after fix (e.g., modal alert timing).

---

## Test Design Techniques

### Equivalence Partitioning (EP)

- **Order modal (required fields)**:

  - {all fields filled} → confirmation modal
  - {missing name}, {missing card}, {multiple missing} → browser alert

- **Category filtering**:
  - Partitions: Phones / Laptops / Monitors
  - Example: “Samsung galaxy s6” only appears under Phones

### Boundary Value Analysis (BVA)

- **Pagination**:

  - Boundaries: first ↔ next ↔ last page
  - Ex: item “Samsung galaxy s7” only appears after `Next`, disappears after `Previous`

- **Cart item count**:
  - Boundaries: 0 → 1 → N
  - Ex: validate row increase when adding first item, and reset when emptying cart

### Experience-based Testing

- **Exploratory**: identified flakiness in modal timing, pagination flickers, alert delays
- **Error guessing**: race condition when deleting items before confirmation
- **Checklist-based**: presence of title, price, category list, rows, fields per screen

---

## State Transition Table

| State              | Action     | Result                          |
| ------------------ | ---------- | ------------------------------- |
| Logged out         | Login      | Logged in, purchase flow active |
| Logged in          | Logout     | Returns to login state          |
| Cart empty         | Add item   | Row added, total updated        |
| Order modal closed | Open modal | Modal appears                   |
| Modal open         | Purchase   | Modal closes, confirmation seen |
| Modal open         | Close / X  | Modal closes, no confirmation   |

---

## Decision Table Summary

| name | card | month | year | Expected result       |
| ---- | ---- | ----- | ---- | --------------------- |
| ✓    | ✓    | ✓     | ✓    | Purchase confirmation |
| ✗    | ✓    | ✓     | ✓    | Alert: name required  |
| ✓    | ✗    | ✓     | ✓    | Alert: card required  |
| ✓/✗  | ✓/✗  | ✗     | ✓/✗  | Purchase confirmation |
| ✓/✗  | ✓/✗  | ✓     | ✗    | Purchase confirmation |

---

## Coverage & Traceability

- Each test case traces back to a defined business rule or behavior
- Coverage tracked by:
  - Category filters
  - Cart totals
  - Modal validations
  - Transition states

---

## Entry / Exit Criteria

- **Entry**: site available, login OK, cart empty
- **Exit**: critical paths validated, no blocking bug, CI passed

---

## Locator Strategy

### Preferred order:

1. **Text-based (`cy.contains`)**

   - Used due to absence of `data-*` in Demoblaze
   - Examples:
     - `cy.contains('a.list-group-item', 'Laptops')`
     - `cy.contains('a.hrefch', 'Sony vaio i5')`

2. **Stable IDs / classes**

   - Examples: `#login2`, `#logout2`, `#cartur`, `#tbodyid tr`

3. **Attribute-based selectors**
   - Ex: `a[onclick*="deleteItem"]`

> **Avoid**: layout-based selectors (`:nth-child`, `.row > div > div`), fragile and break easily.

---

### Demoblaze-specific notes

- **`#tbodyid` is reused** across multiple pages (catalog grid, product detail, cart).  
  **Always pair with context** (e.g., ensure you are on `/cart.html` before using `#tbodyid tr`, or assert `a.hrefch:visible` when on catalog).

- Category **"All" is not a link** in current UI. Treat **`cy.visit('/')`** as the “All” state and assert the product grid via `a.hrefch:visible`.

- **Buttons are often `<a>` elements**:

  - Add to cart: `#tbodyid a.btn-success`
  - Delete from cart: `#tbodyid a[onclick*="deleteItem"]`

- **Pagination**:

  - Next/Previous are stable: `#next2`, `#prev2`.
  - After clicking, **re-query visible items**:  
    `cy.get('a.hrefch:visible', { timeout: 10000 }).should('exist')`.

- **Alerts** (after Add to cart) are native browser alerts; handle via:  
  `cy.once('window:alert', () => {});` (or assert the text when needed).

---

### Why these choices

- Text-first selectors survive CSS/layout shifts and match user intent.
- Context + stable id/class reduces ambiguity (same id reused across screens).
- Attribute intent captures behavior that lacks good text (e.g., Delete links).
- Avoiding `:nth-child` prevents flakiness when DOM structure changes or items re-order.

## Automated Scenarios

**Location:** `cypress/e2e/`

- **Purchase flows:** full end-to-end coverage for laptops, phones, and monitors, including single-item and multi-item purchases.
- **Cart management:** adding, removing, and verifying products in various combinations before checkout.
- **Validation cases:** attempts to purchase with missing required fields, empty cart checks, and modal interactions.
- **Price consistency:** ensures alignment between product list, detail view, and total price check in the cart.
- **Pagination and stability:** verifies that navigation and selection remain reliable across pages and categories.

---

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [faker-js Documentation](https://fakerjs.dev/)
