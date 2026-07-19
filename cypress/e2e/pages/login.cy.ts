/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should succeed with valid member login', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { email, password } = standard;

      cy.fixture('acmAuthResponse').then(({ authAdmin }) => {
        cy.intercept('POST', 'login', authAdmin).as('authAdminGood');
      });

      cy.fixture('acmStandardProfile').then(standardProfile => {
        cy.intercept('GET', 'user', standardProfile).as('adminProfile');
      });

      cy.log('Logging in with email:', email);

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/');
      cy.getCookie('ACCESS_TOKEN').should('exist');
    });
  });

  it('Should succeed with valid admin login', () => {
    cy.fixture('accounts').then(({ admin }) => {
      const { email, password } = admin;

      cy.fixture('acmAuthResponse').then(({ authAdmin }) => {
        cy.intercept('POST', 'login', authAdmin).as('authAdminGood');
      });

      cy.fixture('acmAdminProfile').then(adminProfile => {
        cy.intercept('GET', 'user', adminProfile).as('adminProfile');
      });

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/');
      cy.getCookie('ACCESS_TOKEN').should('exist');
      cy.getCookie('USER').should('exist');
    });
  });

  it('Should fail with invalid credentials', () => {
    cy.fixture('acmAuthResponseBadPassword').then(({ authAdminBad }) => {
      cy.intercept('POST', 'login', authAdminBad).as('authAdminBad');
    });

    const [email, password] = ['abc123@xyz.com', 'abc'];

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('Sign In').click();

    cy.get('.Toastify').contains('Unable to login').should('exist');
    cy.location('pathname').should('equal', '/login');
  });

  it('Should fail with missing username', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { password } = standard;

      cy.get('input[name="password"]').type(password);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/login');
      cy.contains('p', 'Required').should('exist');
    });
  });

  it('Should fail with missing password', () => {
    cy.fixture('accounts').then(({ standard }) => {
      const { email } = standard;

      cy.get('input[name="email"]').type(email);
      cy.get('button').contains('Sign In').click();

      cy.location('pathname').should('equal', '/login');
      cy.contains('p', 'Required').should('exist');
    });
  });

  it('Should link to forgot password page', () => {
    cy.get('a').contains('Forgot your password?').click();
    cy.location('pathname').should('equal', '/forgot-password');
  });

  it('Should link to account register page', () => {
    cy.get('a').contains('Sign Up').click();
    cy.location('pathname').should('equal', '/register');
  });
});
