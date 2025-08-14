describe('Test with the backend', () => {

  beforeEach('loggin to application', () => {
    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })
    cy.logginToApplication()
  })

  it('first', () => {
    cy.log('This is the first test')
  })

  it('Verify the request and response', () => {
    cy.intercept('post', '**/api/articles').as('postArticles')
    
    const unique = Date.now()
    
     cy.contains('New Article').click()
     cy.get('[formcontrolname="title"]').type('This is the title')
     cy.get('[formcontrolname="description"]').type('This is a description')
     cy.get('[formcontrolname="body"]').type('This is a body of the article')
     cy.contains('Publish Article').click()

    cy.wait('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.be.oneOf([200, 201])
      expect(xhr.request.body.article.body).to.equal('This is a body of the article')
      expect(xhr.request.body.article.description).to.equal('This is a description')
    })
  })

  it('Intercepting and modifying the request and response', () => {
    // cy.intercept('post', '**/api/articles', (req) => {
    //   req.body.article.description = "This is a description 2"
    // }).as('postArticles')

    cy.intercept('post', '**/api/articles', (req) => {
      req.reply(res => {
        expect(res.body.article.description).to.equal('This is a description')
        res.body.article.description = 'This is a description 2'
      })
    }).as('postArticles')

    const unique = Date.now()
    
    cy.contains('New Article').click()
    cy.get('[formControlname="title"]').type(`This is a ${unique} `)
    cy.get('[formControlname="description"]').type('This is a description')
    cy.get('[formControlname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.be.oneOf([200, 201])
      expect(xhr.request.body.article.body).to.equal('This is a body of the article')
      expect(xhr.response.body.article.description).to.equal('This is a description 2')
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
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' })

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

  it('delete a new article in a global feed', () => {
    const date = Date.now()
    const userCredentials = {
      "user": {
        "email": "djtest@hotmail.com",
        "password": "cesar0581998"
      }
    }

    const bodyRequest = {
      "article": {
        "tagList": [],
        "title": `Request from the API ${date}`,
        "description": "API testing is easy",
        "body": "Angular is cool"
      }
    }

    cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials)
      .its('body').then(body => {
        const token = body.user.token

        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles',
          headers: { 'Authorization': 'Token ' + token },
          method: 'POST',
          body: bodyRequest
        }).then(response => {
          expect(response.status).to.equal(201)
        })

        cy.contains('Global Feed').click()                  
        cy.get('.preview-link').first().click()
        cy.get('.article-actions').contains('Delete Article').click()

        cy.request({
          url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
          headers: { 'Authorization': 'Token ' + token },
          method: 'GET'
        }).its('body').then(body => {
          expect(body.articles[0].title).not.to.equal(`Request from the API ${date}`)
        })
      })
  })
})

