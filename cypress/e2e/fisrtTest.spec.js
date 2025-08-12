describe('Test with the backend', () => {

  
  beforeEach(('loggin to application'), () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'})
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

  it('Verify popular tags are displayed', () => {
    cy.get('.tag-list')
    .should('contain', 'cypress')
    .and('contain', 'automation')
    .and('contain', 'test')
  })

  it('Verify global feeds like count', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', '{"articles":[],"articlesCount":0}')
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', {fixture: 'articles.json'})

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(hearList => {
      expect(hearList[0]).to.contain('1')
      expect(hearList[1]).to.contain('5')
    })

    cy.fixture('articles.json').then(file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/' + articleLink + '/favorite', file)

    })
    cy.get('app-article-list button').eq(1).click().should('contain', '6')
  })

})  