/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe("user behavior", () => {

    it("user should be able to post a recommendation", async () => {

        const body = {
            name: faker.name.findName(),
            youtubeLink: "https://www.youtube.com/watch?v=CBF25QcaC_g&list=RDCBF25QcaC_g&start_radio=1"
        }

        cy.visit("http://localhost:3000/")
        cy.get("#name").type(body.name)
        cy.get("#link").type(body.youtubeLink)

        cy.get("#button").click()

    })

    it("user should see top recommendations", async () => {

        cy.visit("http://localhost:3000/")
        cy.get("#top").click()

        cy.url().should("equal", "http://localhost:3000/top")
    })

    it("user should be able to see random recommendations", async () => {

        cy.visit("http://localhost:3000/")
        cy.get("#random").click()

        cy.url().should("equal", "http://localhost:3000/random")
    })
})