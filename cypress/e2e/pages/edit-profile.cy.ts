/// <reference types="cypress" />

describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.login('standard');
    cy.location('pathname').should('equal', '/');
    cy.visit('/profile/edit');
    cy.location('pathname').should('equal', '/profile/edit');
  });

  it('Should update profile preview', () => {
    // write something new to make sure it can save
    cy.typeInForm('First', new Date().toISOString());
    cy.get('button').contains('Save').click();

    cy.fixture('profile').then(profile => {
      const { first, last, bio, major, year } = profile;

      cy.typeInForm('First', first);
      cy.typeInForm('Last', last);
      cy.selectInForm('Major', major);
      cy.selectInForm('Graduation Year', year);
      cy.typeInForm('Biography', bio);
      cy.get('button').contains('Save').click();

      cy.get('.Toastify').contains('Changes saved!').should('exist');

      cy.get('section:contains("Current Profile")').within(() => {
        Object.values(profile).forEach((value: string | number) => {
          cy.contains(value).should('exist');
        });
      });
    });
  });
});
