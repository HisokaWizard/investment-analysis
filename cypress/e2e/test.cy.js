describe('Test', () => {
  it('Example', () => {
    cy.visit(
      'https://magiceden.io/collections/ethereum/0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    );
    cy.get('body').then((result) => {
      console.log(result);
      cy.get('[data-test-id="floor price"]').then((result) => {
        console.log(result);
        console.log(result?.[0]?.textContent);
      });
    });
  });
});
