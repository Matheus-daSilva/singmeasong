/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe("user behavior", () => {

    it("user should be able to post a recommendation", async () => {

        const body = {
            name: faker.name.findName(),
            youtubeLink: "https://www.youtube.com/watch?v=rywUS-ohqeE&list=RDCBF25QcaC_g&index=14"
        }

        cy.visit("http://localhost:3000/")
        cy.get("#name").type(body.name)
        cy.get("#link").type(body.youtubeLink)

        cy.get("#button").click()

    })

    it("user should set a upVote", async () => {

        cy.visit("http://localhost:3000/")
        
        cy.get("#arrowUp").click()
    })

    it("a recommendation should be deleted with a score -5", async () => {

        cy.visit("http://localhost:3000/")

        for (let i = 1; i < 6; i++) {
            cy.get("#arrowDown").click()
        }
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