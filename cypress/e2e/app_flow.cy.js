describe('Full Application Flow Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Perform login
    cy.get('input[placeholder="Username"]').type('user@example.com');
    cy.get('input[placeholder="Password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();
    // Wait for main app to load
    cy.contains('Global AI Postal System').should('be.visible');
  });

  it('should track a package and display status and location', () => {
    // Stub the /api/track endpoint to return a successful response
    cy.intercept('POST', '/api/track', {
      statusCode: 200,
      body: { status: 'In Transit', location: 'Distribution Center' },
    }).as('trackPackage');

    cy.get('input[placeholder="Enter Package ID"]').type('PKG12345');
    // Use cy.get to find the button and click it explicitly
    cy.get('button').contains('Track').click();

    // Wait for the stubbed API call to complete
    cy.wait('@trackPackage');

    // Check that the status and location are displayed
    cy.contains('Status: In Transit').should('be.visible');
    cy.contains('Location: Distribution Center').should('be.visible');
  });

  it('should allow changing the AI agent and display agent input', () => {
    cy.get('input#agent-input').clear().type('agent2');
    cy.get('input#agent-input').should('have.value', 'agent2');
  });

  it('should display subscription component and allow API key change', () => {
    cy.get('input').filter('[value=""]').first().type('test-api-key');
  });

  it('should display the Dashboard component', () => {
    cy.contains('Dashboard').should('be.visible');
  });
});
