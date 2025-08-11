describe('Test with the backend', () => {

  beforeEach(('loggin to application'), () => {
    cy.logginToApplication();
  })


  it('first', () => {
    cy.log('This is the first test');
  })

  it.only('Verify the request and response', () => {
    
  })

})  