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
- [Test Strategy & Design](#test-strategy--design)
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

This suite was built under a **compressed timeline** with a clear priority: deliver a reliable automation baseline for the **essential purchase flow** (login → product(laptop) selection → cart → checkout → confirmation). To control risk and keep momentum, work started by stabilizing this end-to-end path so it ran deterministically both locally and in CI (headless, cross-browser), with session bootstrap and state isolation to avoid cross-test bleed.

Once the baseline was consistently green, coverage expanded **incrementally** to additional categories (Phones, Monitors) and UI behaviors that affect user outcomes, such as **pagination, required-field validations, alerts, and cart operations**.

- **Essential flow first**: stabilize the purchase journey end-to-end before adding breadth.
- **Independent tests**: each spec resets state (clean cart, home reload) and restores a logged-in session via `cy.session()` to remove cross-test coupling.
- **Stable selectors**: prefer text-based or semantic locators over brittle attributes.
- **Clean POM**: page objects expose only locators and simple actions; **assertions live in the specs**.
- **Deterministic data**: keep inputs minimal (simple helper for order data) to reduce flakiness.
- **Unified alert handling**: custom commands to ignore/expect the next `window.alert`.
- **Static analysis as a guardrail**: ESLint enabled and **blocks `it.only` / `describe.only`**.
- **CI pipeline**: GitHub Actions cross-browser (Chrome, Edge, Firefox) with repo secrets for credentials.

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

## Test Design

### Test types

- **Functional testing**: validate specified behavior across the purchase workflow (authentication, catalog navigation, product-detail presentation and pricing, cart operations, and checkout confirmation).
- **Change-related testing**

  - **Confirmation testing (re-testing)**: re-run previously failing cases after fixes (e.g., modal/alert timing issues).
  - **Regression testing**: re-run the essential purchase flow and price/cart-deletion scenarios after code/config/CI changes.

- **Equivalence Partitioning (EP)**  
  Applied to inputs and UI states using representative classes:

  - **Order modal (required fields)**: partitions = {all required present} vs {missing _name_} vs {missing _card_} vs {multiple missing}. Expected outcomes = {confirmation} vs {browser alert}.
  - **Catalog by category**: partitions = {Phones} / {Laptops} / {Monitors}. Example: assert product presence per category (e.g., “Samsung galaxy s6” only under **Phones**), and absence outside the active partition.

- **Boundary Value Analysis (BVA)**  
  Used where off-by-one risks exist:

  - **Pagination**: boundaries = first page ↔ next page ↔ last page. Example: verify reference items across **Next/Previous** (e.g., “Samsung galaxy s7” visible only after `Next`, returns after `Previous`).
  - **Cart item count**: 0 → 1 → N. Example: assert transitions in **row count** and **total** when adding the first item (0→1) and when emptying back to 0.

- **Decision Table Testing**  
  Modeled business rules as action/condition → outcome:

  - **Order modal validation**  
    | name | card | month | year | Expected |
    |------|------|-------|------|----------|
    | ✓ | ✓ | ✓ | ✓ | Purchase confirmation |
    | ✗ | ✓ | ✓ | ✓ | Alert (required) |
    | ✓ | ✗ | ✓ | ✓ | Alert (required) |
    | ✓/✗ | ✓/✗ | ✗ | ✓/✗ | Alert (required) |
    | ✓/✗ | ✓/✗ | ✓ | ✗ | Alert (required) |
  - **Cart operations**  
    | Current state | Action | Expected |
    |---------------|------------|----------|
    | 0 items | Add | 1 item; total = price |
    | 1 item | Add same | 2 items; total += price |
    | N items | Remove one | N-1 items; total decrements |
    | N items | Empty cart | 0 items; total = 0 |

- **State Transition Testing**  
  Focused on observable UI states and transitions:

  - **Authentication state**: _logged-in_ → purchase flow available; logout returns to _logged-out_ (login button visible).
  - **Order modal**: _closed_ → _open_ (Place Order) → _(confirmed | canceled)_ with distinct outcomes (confirmation vs modal dismissed).

- **Experience-based techniques** (exploratory, error guessing, checklist)  
  Grounded by hands-on observation:
  - **Exploratory**: identified fragile areas (modal timing, alert sequencing, pagination visibility changes) that informed assertions and waits.
  - **Error guessing**: targeted cart-emptying race conditions (ensuring row count truly decreases after Delete before proceeding).
  - **Checklist-based**: per screen, verified presence of primary UI elements (category list, product title, price on detail, cart rows, order fields) to support quick sanity coverage.

### Coverage & traceability

- **Requirements-based coverage** with **traceability** from requirements → test conditions → test cases.
- Coverage monitored via conditions/rules (e.g., decision-table rules, state transitions).

### Entry / exit criteria

- **Entry**: environment available, test data/accounts ready, prerequisite defects closed.
- **Exit**: planned test conditions executed, critical defects resolved or deferred by agreement, and results reviewed/approved.

---

## Locator Strategy & Preferences

### Preferred order (most → least stable)

1. **Visible text with `cy.contains()`**

   - Rationale: resilient to markup changes and indices; mirrors how users interact.
   - Examples:
     - Categories: `cy.contains('a.list-group-item', 'Phones')` / `'Laptops'` / `'Monitors'`
     - Product by name: `cy.contains('a.hrefch', 'Sony vaio i5')`

2. **Semantic/role or stable attributes (when available)**

   - Rationale: aligns with accessibility/intent; less brittle than position.
   - Demoblaze often lacks ARIA roles; when present, prefer them.

3. **Stable IDs/classes scoped to a context**

   - Rationale: simple and fast, but avoid over-generic scopes reused in multiple screens.
   - Examples:
     - Cart rows: `#tbodyid tr` (only after navigating to `/cart.html`)
     - Add to cart (detail): `#tbodyid a.btn-success`
     - Login/welcome: `#login2`, `#logout2`, `#nameofuser`, `#cartur`

4. **Attribute intent selectors** (when text is not available)
   - Rationale: captures behavior without relying on layout.
   - Example (cart delete): `#tbodyid a[onclick*="deleteItem"]`

> **Avoid:** position-based selectors (e.g., `:nth-child(1)`), brittle CSS chains tied to layout.

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
