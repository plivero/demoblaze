// cypress/support/helpers/price.js

export const asNumber = (text) =>
  Number((String(text).match(/\d+/g) || []).join(""));

export const sumPriceElements = (elements) => {
  let total = 0;
  for (let i = 0; i < elements.length; i++) {
    const t = elements[i].innerText || elements[i].textContent || "";
    total += asNumber(t);
  }
  return total;
};
