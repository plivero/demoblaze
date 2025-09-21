// API - Catalog (bycat)
describe("API - Catalog (bycat)", () => {
  const API = "https://api.demoblaze.com";

  it("Should return 200 and a list of notebook products", () => {
    cy.request("POST", `${API}/bycat`, { cat: "notebook" }).then(
      ({ status, body }) => {
        expect(status).to.eq(200);
        expect(body)
          .to.have.property("Items")
          .and.to.be.an("array")
          .and.to.have.length.greaterThan(0);

        const [first] = body.Items;
        expect(first).to.include.all.keys("id", "title", "price");
      }
    );
  });
});
