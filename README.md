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

- **Clean POM:** Page Objects contain only locators and simple, direct actions (`click`, `type`, `get`), without assertions or logic.
- **Readable specs:** test files hold only test steps and assertions.
- **Reusable session:** `cy.ensureSession()` maintains a logged-in state between specs for faster, independent runs.
- **Unified alert handling:** alerts are handled consistently across all specs.
- **State isolation:** each test starts from a clean state (cart emptied, page reloaded) to avoid side effects.
- **Deterministic data:** input values are generated once per test using `faker` via `orderData()`, ensuring consistency without external dependencies.

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

## Test Strategy & Design

The testing started with the **essential laptop purchase flow** — login, product selection, add to cart, checkout, and confirmation — to ensure the core business path was fully stable.  
Once this flow was solid and repeatable, the suite expanded to include **edge cases** and **other product categories** (Phones and Monitors), covering additional user behaviors such as pagination, cart clearing, invalid inputs, and required-field validations.

The approach applies **equivalence and boundary reasoning** only where it adds real value, avoiding redundant checks while still validating representative cases.  
Each new scenario was derived from actual user interactions observed during exploratory runs, focusing on how the system behaves in practice rather than ideal logic.

Overall, the design emphasizes **clarity, maintainability, and realistic coverage**: assertion-driven specs, deterministic data, short Page Object actions, and helpers to keep tests consistent and easy to extend.

### Principles

- **Prioritized by critical flow:** automation started with the **essential purchase journey** — login, laptop selection, add to cart, and checkout — as the main business path.
- **Progressive expansion:** once stable, the same structure was extended to other categories (phones, monitors), pagination behavior, and UI inconsistencies found during exploration.
- **Realistic validation:** tests assert what the application actually displays (alerts, delays, modal behavior) rather than ideal logic.
- **Session bootstrap:** every test starts from a stable, logged-in state using `cy.session()` to ensure speed and independence.
- **Specs stay readable:** specs contain only steps and assertions — no logic, loops, or data handling.
- **Data minimalism:** inputs use only what’s necessary, provided by a simple faker-based `orderData()` helper.

### Data

- **Environment variables:** `USER_NAME`, `USER_PASSWORD` stored in `cypress.env.json`.
- **Modal data:** `orderData()` helper generates consistent order inputs using faker.

### Coverage Techniques

- **Exploratory-driven:** initial manual mapping exposed fragile areas (slow modals, alerts, pagination), leading to stronger, DOM-based synchronization.
- **Positive and light negative:** covers normal purchases, modal cancellations, required-field alerts, and empty-cart behavior.
- **Selective EP/BVA:** applied only where it adds functional relevance (e.g., pagination indices, price totals, item count).
- **Adaptive validation:** when the platform behaves inconsistently, assertions target the **observable UI outcome** instead of expected logic.

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
