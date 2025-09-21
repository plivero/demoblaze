// cypress/support/helpers/orderData.js
import { faker } from "@faker-js/faker";

export function orderData() {
  return {
    name: faker.person.fullName(),
    country: faker.location.country(),
    city: faker.location.city(),
    card: faker.finance.creditCardNumber(),
    month: "12",
    year: "2025",
  };
}
