# Demoblaze Product Store — Cypress (UI + API)

> End-to-end automation suite with **Cypress**, covering UI and API flows of the [Demoblaze Product Store](https://www.demoblaze.com/index.html/) platform.

---

## About

This repository contains an automated test suite built with Cypress for the Demoblaze Product Store.
It focuses on clean, maintainable UI flows and light API validations, following the Page Object Model (POM) pattern and using environment-based configuration.

The suite is fast, deterministic, and easy to extend.
It applies reusable sessions and alert commands to keep tests independent, stable, and ready for headless or CI execution.

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
- [UI Tests](#ui-tests)
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

- **Clean POM:** Page Objects include only locators and direct actions (`click`, `type`, `get`, etc.).
- **Specs stay readable:** assertions only — no logic, loops, or data handling.
- **Reusable session:** use `cy.ensureSession()` to restore a logged-in state.
- **Reusable alerts:**
  - `cy.ignoreNextAlert()` to silence confirmation popups (e.g., Add to Cart);
  - `cy.expectNextAlert('text')` to validate expected alert messages.
- **Test independence:** each spec cleans its state (e.g., empty cart before start).
- **Headless CI-ready:** `npx cypress run` ensures consistent, fast runs.

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
npx cypress run --spec "cypress/e2e/specs/apiTests/*.cy.js"
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

The strategy began by validating the **essential purchase flow** (login → browse → add to cart → checkout → confirmation) to ensure the core functionality was stable.  
After that, the suite evolved to cover the **entire mapped site flow**, including all product categories (Laptops, Phones, Monitors), cart operations, modal behaviors, and alert validations.

The focus is on building a **complete and maintainable test suite**, with realistic coverage that reflects how users interact with the Demoblaze store.  
Tests are **assertion-driven**, using clean Page Objects for structure and short, reusable helpers to maintain readability and consistency.

### Principles

- **Expanded coverage:** from the essential purchase flow to additional scenarios (categories, alerts, empty cart, invalid fields).
- **Realistic validation:** verify what the UI actually does, not what it _should_ do.
- **Session bootstrap:** each test starts from a stable, logged-in state using a reusable session to ensure consistency and speed.
- **Data minimalism:** tests use only essential data for inputs and validation, avoiding external dependencies or unnecessary randomness.

### Data

- **Environment variables:** `USER_NAME`, `USER_PASSWORD` stored in `cypress.env.json`.
- **Modal data:** `orderData()` helper generates consistent order inputs using faker.

### Coverage Techniques

- **Exploratory-informed:** the initial manual mapping revealed unstable areas (render timing, alerts, pagination), leading to stronger DOM-based sync.
- **Positive and light negative:** includes standard purchase flow, modal cancellations, required field alerts, and empty cart behavior.
- **Selective EP/BVA:** applied only where input or range validation adds real value (e.g., pagination indices, price parsing, item count).
- **Adaptive validation:** when the platform shows inconsistent or non-deterministic behavior, tests assert the **observable response** (UI behavior) rather than idealized logic.

---

## UI Tests

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
