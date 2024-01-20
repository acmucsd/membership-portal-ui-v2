/// <reference types="cypress" />

describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('/forgot-password');
  });

  it('Should fail with missing email', () => {
    cy.contains('button', 'Submit').click();
    cy.contains('p', 'Required').should('exist');
  });

  it('Should fail with unknown email', () => {
    const email = 'test@ucsd.edu';
    cy.get('input[name="email"]').type(email);
    cy.contains('button', 'Submit').click();

    cy.get('.Toastify').contains('There is no account associated with that email').should('exist');
  });

  it('Should succeed with valid email', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { email } = standard;
      cy.get('input[name="email"]').type(email);
      cy.contains('button', 'Submit').click();

      cy.get('.Toastify').contains('Success').should('exist');
    });
  });
});
