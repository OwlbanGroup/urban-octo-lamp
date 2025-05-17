describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Perform login
    cy.get('input[placeholder="Username"]').type('user@example.com');
    cy.get('input[placeholder="Password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();
    // Wait for the dashboard title to appear to ensure the page is loaded
    cy.get('h1', { timeout: 10000 }).should('contain', 'Dashboard');
  });

  it('should display the dashboard title', () => {
    cy.get('h1').contains('Dashboard').should('be.visible');
  });

  it('should display notifications section with new messages and pending tasks', () => {
    cy.get('section').contains('Notifications').should('be.visible');
    cy.get('section').contains('New Messages:').should('be.visible');
    cy.get('section').contains('Pending Tasks:').should('be.visible');
  });

  it('should display recent messages section', () => {
    cy.get('section').contains('Recent Messages').should('be.visible');
  });

  it('should display pending tasks section', () => {
    cy.get('section').contains('Pending Tasks').should('be.visible');
  });

  it('should display research analytics summary', () => {
    cy.get('section').contains('Research Analytics Summary').should('be.visible');
  });

  it('should display revenue opportunities section', () => {
    cy.get('section').contains('Revenue Opportunities').should('be.visible');
  });
});
