describe('User Registration Tests', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user successfully', () => {
    cy.get('input[type="text"]').clear().type('Test User');
    cy.get('input[type="email"]').clear().type('testuser@example.com');
    cy.get('input[type="password"]').eq(0).clear().type('password123');
    cy.get('input[type="password"]').eq(1).clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('[data-cy=success-message]', { timeout: 15000 }).should('be.visible').and('contain', 'Registration successful! You can now log in.');
  });

  it('should show error if passwords do not match', () => {
    cy.get('input[type="text"]').clear().type('Test User');
    cy.get('input[type="email"]').clear().type('testuser@example.com');
    cy.get('input[type="password"]').eq(0).clear().type('password123');
    cy.get('input[type="password"]').eq(1).clear().type('password456');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should show error if user already exists', () => {
    cy.get('input[type="text"]').clear().type('Test User');
    cy.get('input[type="email"]').clear().type('existinguser@example.com');
    cy.get('input[type="password"]').eq(0).clear().type('password123');
    cy.get('input[type="password"]').eq(1).clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('[data-cy=error-message]', { timeout: 15000 }).should('be.visible').and('contain', 'User already exists');
  });
});
