describe('Test with the backend', () => {

  beforeEach(('loggin to application'), () => {
    cy.logginToApplication();
  })


  it('first', () => {
    cy.log('This is the first test');
  })

  it('Verify the request and response', () => {

    cy.intercept('post', '**/api/articles').as('postArticles')
    const unique = Date.now();
    cy.contains('New Article').click()
    cy.get('[formControlname="title"]').type(`This is a ${unique} `)
    cy.get('[formControlname="description"]').type('This is a description')
    cy.get('[formControlname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles',).then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.be.oneOf([200, 201])
      expect(xhr.request.body.article.body).to.equal('This is a body of the article')
      expect(xhr.request.body.article.description).to.equal('This is a description')

    })

  })

  it.only('Verify popular tags are displayed', () => {

  })

})  