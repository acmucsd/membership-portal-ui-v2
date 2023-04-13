/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Login succeeds with valid member credentials', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { username, password } = standard;

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/');
    });
  });

  it('Login succeeds with valid admin credentials', () => {
    cy.fixture('accounts').then(({ admin }) => {
      const { username, password } = admin;

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/');
    });
  });

  it('Login fails with missing username', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { password } = standard;

      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/login');
      cy.get('Required').should('be.hidden');
    });
  });

  it('Link to Forgot Password Functions Correctly', () => {
    cy.get('a').contains('Forgot your password?').click();
    cy.location('pathname').should('equal', '/forgot-password');
  });

  it('Link to Register Functions Correctly', () => {
    cy.get('a').contains('Sign Up').click();
    cy.location('pathname').should('equal', '/register');
  });
});
