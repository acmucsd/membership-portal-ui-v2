declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Log in as the specified user, pulling details from accounts.json
       * @example cy.login('standard')
       */
      login(account: string): Chainable<void>;

      /**
       * Type text into a form input or textarea under specified label
       * @param label - text of label that the input is a child of
       * @param value - text to be typed into input
       */
      typeInForm(label: string, value: string): Chainable<void>;

      /**
       * Select the given option in a select under specified label
       * @param label - text of label that the select is a child of
       * @param value - option to be selected
       */
      selectInForm(label: string, value: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (account: string) => {
  cy.fixture('accounts.json').then(accs => {
    if (!(account in accs))
      throw new Error(`Account '${account}' isn't specified in \`accounts.json\``);
    const { email, password } = accs[account];

    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('Sign In').click();
  });
});

Cypress.Commands.add('typeInForm', (label: string, value: string) => {
  cy.get(`label:contains("${label}") input, label:contains("${label}") textarea`).as('input');
  cy.get('@input').clear();
  cy.get('@input').type(value as string);
});

Cypress.Commands.add('selectInForm', (label: string, value: string | number) => {
  cy.get(`label:contains("${label}") select`).select(value);
});

export {};
