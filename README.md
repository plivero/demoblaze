# Demoblaze Product Store — Cypress (UI)

> End-to-end automation suite with **Cypress**, covering UI flows of the [Demoblaze Product Store](https://www.demoblaze.com/index.html/) platform.

---

## About

This repository contains an automated test suite built with Cypress for the Demoblaze Product Store.
It focuses on clean, maintainable UI flows, following the Page Object Model (POM) pattern and using environment-based configuration.

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

This suite follows core automation principles to ensure reliable, maintainable, and deterministic UI tests using Cypress. It is designed around modular code, clean selectors, and clear separation between logic and assertions.

### Page Objects

- Located in `/support/pages/`
- Expose only locators and simple actions (e.g., `.clickAddToCart()`)
- **No logic or assertions** inside PO files
- All validations must live in the `.spec.js` files

### Selector Strategy

- **Preferred**: `data-*` attributes — Cypress-recommended for stability
- **Fallback**: text-based or semantic selectors were used **only when the target app (Demoblaze)** did not provide stable IDs or data-\* attributes
- **Avoid**: fragile or layout-dependent selectors (`:nth-child`, chained `.div > .div`)

### Session control

- Use of `cy.session()` for clean session state between specs
- Each spec starts with cart cleared and user logged in

### Minimal helper data

- Uses static factory-like helpers (`orderData()`) to isolate test inputs
- Employs `@faker-js/faker` to generate realistic values (e.g., name, card), keeping inputs varied but deterministic
- Reduces flakiness and encourages repeatability

### CI enforcement

- Tests run headless on GitHub Actions matrix (Chrome, Edge, Firefox)

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

## Test Design Strategy

This section describes the structured testing approach used to validate Demoblaze's core behaviors, starting from a rapid exploratory phase to a stable automation suite.

### Phase 0: Initial Exploration (Manual)

Before automating, we conducted a short exploratory session to understand the application's structure, UI consistency, alert behavior, and known limitations. This allowed us to:

- Identify fragile locators and modal alert timing
- Confirm essential workflows (e.g., product selection, purchase, cart behavior)
- Understand element reuse across pages (e.g., `#tbodyid` in catalog, detail, cart)

These insights helped define the minimal essential flow and pick robust selectors.

### Phase 1: Essential Flow Automation

The first automation delivery focused exclusively on the **critical purchase path**:

**Login → Laptop selection → Cart → Checkout → Purchase confirmation**

This path was prioritized due to its impact on user experience and business value. It was validated across multiple browsers and iterations to ensure:

- Consistent state transitions (login/logout, cart reset, modal timing)
- Price propagation from catalog → detail → cart
- Successful order modal submission with valid input

Once stable, we expanded the test scope.

### Phase 2: Extended Coverage

After the essential journey was locked, the suite grew to cover:

- Product category filtering: Phones, Laptops, Monitors
- Cart behaviors: add/remove, totals, empty state
- Pagination transitions (next, previous, visibility)
- Field validations and alert handling on the order modal

This broader coverage ensured resilience against future regressions.

---

### Test Design Techniques

#### Equivalence Partitioning (EP)

- **Order Modal:**
  - All required fields filled → purchase confirmed
  - Missing name or card → browser alert triggered
- **Category filtering:**
  - Phones / Laptops / Monitors as partitions
  - Example: “Samsung galaxy s6” should only appear under Phones

#### Experience-based Testing

- **Exploratory**: discovered flaky behavior in:
  - Native alerts appearing inconsistently
  - Modal rendering timing vs alert timing
  - Pagination causing temporary disappearance of items
- **Checklist-based**:
  - Each screen must show: product name, price, category list, navigation links

---

## Locator Strategy

Selectors were carefully chosen based on the limitations of the Demoblaze site, which does **not provide consistent `data-*` attributes** nor well-structured IDs. The strategy followed these principles:

1. **Prefer stable, test-friendly selectors**:

   - If available, always use unique and consistent **`data-*` attributes**, in line with Cypress recommendations.
   - Example: `cy.get('[data-testid="cart-item"]')` _(not available in Demoblaze)_

2. **Fallback to text-based or semantic selectors**:

   - Used **only when data-\* or IDs were not viable**.
   - Example:
     - `cy.contains('a.list-group-item', 'Laptops')`
     - `cy.contains('a.hrefch', 'Sony vaio i5')`

3. **Use stable IDs or classes when available**:

   - Ex: `#login2`, `#logout2`, `#cartur`, `#tbodyid tr`

4. **Attribute-based selectors for actions**:

   - Used when elements had no readable text or useful ID.
   - Ex: `a[onclick*="deleteItem"]` for delete buttons

5. **Avoid layout-dependent or brittle selectors**:
   - Such as `:nth-child`, `div > div > div`, etc.

---

> It was chosen due to **lack of test-specific attributes** in the target application, and only when safer options were unavailable.
> Always prefer **predictable, stable selectors** first. Text-based approaches were a **last resort** dictated by Demoblaze’s limitations.

---

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
