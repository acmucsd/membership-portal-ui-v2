/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Can login with valid credentials', () => {
    cy.fixture('accounts').then(accounts => {
      const { admin } = accounts;
      cy.get('input[name="email"]').type(admin.username);
      cy.get('input[name="password"]').type(admin.password);
      cy.contains('Sign In').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/');
      });
    });
  });
});
