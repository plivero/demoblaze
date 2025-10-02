# Demoblaze Product Store — Cypress (UI + API)

> End-to-end automation suite with **Cypress**, covering UI and API flows of the [Demoblaze Product Store](https://www.demoblaze.com/index.html/) platform.

---

## About

This repository contains an automated test suite built with Cypress for the Demoblaze store, combining focused UI flows with lightweight API checks. It applies modern practices such as the Page Object Model (POM), environment-based configuration via cypress.env.json, DRY helpers for repeatable actions (e.g., adding items, cart totals), and session reuse with cy.session() to keep specs fast and independent.

The suite is designed to be scalable, maintainable, and reproducible. It targets the most critical purchase path (laptops) with validations for login, cart operations, pagination, and price consistency (list ↔ detail ↔ cart ↔ total). Tests favor assertion-driven synchronization and headless execution, making the project ready for straightforward CI adoption when needed.

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
- [API Tests](#api-tests)
- [UI Tests](#ui-tests)
- [References](#references)

## Project Structure

```bash
demoblaze/
├─ cypress/
│  ├─ e2e/
│  │  ├─ api/
│  │  └─ ui/
│  ├─ fixtures/
│  └─ support/
│     ├─ helpers/
│     ├─ pages/
├─ cypress.env.json # Local environment variables (added manually)

```

## Folders & Files Overview

- **cypress/e2e/api/** → API endpoint validation (e.g., `/bycat`).
- **cypress/e2e/ui/** → UI flows (login, pricing checks, cart, checkout).
- **cypress/support/helpers/** → Reusable utilities (`session.js`, `cartActions.js`, `price.js`, `orderData.js`, etc.).
- **cypress/support/pages/** → Page Objects (POM) with locators and simple actions only.

---

## Best Practices

- **Clean POM:** Page Objects include **only** locators and simple actions.
- **Lean specs:** specs contain **assertions only**; move calculations/loops to **helpers**.
- **DRY:** reuse methods and helpers to avoid repeated blocks.
- **Assertion-driven sync:** avoid arbitrary sleeps. **Single agreed exception:**
- **Reusable session:** `loginSession()` with `cy.session()` in `beforeEach`.
- **Test independence:** each test prepares and validates its own state (e.g., cart ends empty when required).
- **Environment variables:** credentials in `cypress.env.json` (ignored by Git).
- **Headless execution:** default for fast, deterministic runs and CI readiness.

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

- **Local development** → stored in `cypress.env.json` (ignored by Git).

Example (`cypress.env.json`):

```json
{
  "USER_NAME": "Name_Example",
  "USER_PASSWORD": "Password_Example"
}
```

---

## Test Strategy & Design

The approach balances **efficiency, coverage, and reliability**. We prioritized the **business-critical UI purchase path for laptops** (login → browse → add to cart → checkout → confirmation) and added a lightweight **API smoke** for catalog stability. Tests are designed to be **deterministic**, **maintainable**, and **fast**.

This combination yields a suite that is **scalable** (easy to extend), **maintainable** (clear separation between assertions and actions), and **practical** (focused on real user value and realistic risks).

### Principles

- **Critical-path first (UI):** cover the end-to-end laptop purchase flow.
- **Assertion-only specs:** specs focus on expectations; actions and locators live in POM/helpers.
- **Reusability (DRY):** centralize repeated flows and calculations in helpers

### Data

- **Environment variables:** fixed credentials in `cypress.env.json` (`USER_NAME`, `USER_PASSWORD`).
- **Deterministic test data:** simple `orderData()` helper for modal fields (no external randomness).
- **No signup by API:** avoids polluting the public dataset.

### Coverage Techniques

- **Use-case based:** real workflows (login, browse laptops, add/remove, place order, confirmation).
- **Experience-based / exploratory:** initial manual pass identified fragile spots (render timing, pagination) to inform stable sync points.
- **Positive + light negative:** happy paths (purchase), cancellation (login modal Close/X), and price consistency checks.
- **Selective EP/BVA:** applied where meaningful (e.g., price parsing/aggregation, item counts, pagination indices) without overextending scope.

---

## API Tests

**Location:** `cypress/e2e/api/`

- **Endpoints covered:** `POST /bycat` (category: `notebook`).
- **Public, no auth:** proves the catalog endpoint works without authentication.
- **Contract checks:** asserts `200` and a non-empty `Items` array with `id`, `title`, `price`.
- **Simplicity:** short, deterministic smoke to validate backend data availability.

---

## UI Tests

**Location:** `cypress/e2e/ui/`

- **Critical paths:** login (session reuse), laptop purchase (happy path), place order and confirmation.
- **Cart operations:** add one and remove; buy three units of the same product; add six laptops (first page) and complete purchase.
- **Pricing integrity:** list vs detail; detail vs last cart row; sum of row prices equals `#totalp`.
- **Pagination:** add products by index on the laptops page.

---

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [faker-js Documentation](https://fakerjs.dev/)
