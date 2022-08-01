import { prisma } from "../src/database.js"
import { faker } from '@faker-js/faker'
import supertest from "supertest"
import app from "../src/app.js"
import { getPostIdFactory } from "./factory/getIdFactory.js";
import { array, not } from "joi";
import { postTenObjects, postTwoObjects } from "./factory/postObj.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

const body = {
    name: `${faker.name}`,
    youtubeLink: `https://www.youtube.com/${faker.name}`
}


describe("POST /recomendations", () => {

    it("trying to post a video sucessfully", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        expect(respo.statusCode).toBe(201)
    })

    it("trying to post a video with a name that has already been inserted", async () => {
        const body2 = {...body, name: "node tutorial"}
        const respo = await supertest(app).post("/recommendations").send(body2)
        expect(respo.statusCode).toBe(201)

        const respo2 = await supertest(app).post("/recommendations").send(body2)
        expect(respo2.statusCode).toBe(409)
    })

    it("trying to post a video with a wrong youtube link pattern", async () => {
        const body2 = {...body, youtubeLink: 1}
        const respo = await supertest(app).post("/recommendations").send(body2)
        expect(respo.statusCode).toBe(422)
    })
})

describe("POST /recommendations/:id/upvote or downvote", () => {
    
    it("trying to add a like to the video", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        expect(respo.statusCode).toBe(201)

        const respo2 = await getPostIdFactory(body.name)
        const respo3 = await supertest(app).post(`/recommendations/${respo2.id}/upvote`).send()
        expect(respo3.statusCode).toBe(200)
    })

    it("trying to add a dislike to the video", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        expect(respo.statusCode).toBe(201)

        const respo2 = await getPostIdFactory(body.name)
        const respo3 = await supertest(app).post(`/recommendations/${respo2.id}/downvote`).send()
        expect(respo3.statusCode).toBe(200)
    })

    it("trying to delete a obj by the downvotes", async () => {
        await postTwoObjects()

        const respo = await supertest(app).get("/recommendations")
        expect(respo.body).toHaveLength(2)

        for (let i = 0; i <= 5; i++) {
            await supertest(app).post(`/recommendations/${respo.body[0].id}/downvote`).send()
        }

        const respo2 = await supertest(app).get("/recommendations")
        expect(respo2.body).toHaveLength(1)
    })
})

describe("GET /recommendations", () => {

    it("trying to get all recommendations", async () => {
        const respo = await postTenObjects()

        const respo2 = await supertest(app).get("/recommendations")
        expect(respo2.body).toHaveLength(10)
    })

    it("trying to get recommendations by id", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        expect(respo.statusCode).toBe(201)

        const respo2 = await getPostIdFactory(body.name)
        const respo3 = await supertest(app).get(`/recommendations/${respo2.id}`)
        expect(respo3).not.toBe(null)
    })

    it("trying to get recommendations with a invalid id", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        const respo2 = await getPostIdFactory(body.name)
        const respo3 = await supertest(app).get(`/recommendations/${100000000}`)
        expect(respo3.statusCode).toBe(404)

    })

    it("trying to get ranked recommendations", async () => {
        await postTwoObjects()
        const respo = await supertest(app).get("/recommendations")
        expect(respo.body).toHaveLength(2)

        const recommendation2 = respo.body[1].id

        const upVote = await supertest(app).post(`/recommendations/${respo.body[1].id}/upvote`).send()
        expect(upVote.statusCode).toBe(200)

        const respo2 = await supertest(app).get("/recommendations/top/2")

        expect(respo2.body).toHaveLength(2)
        expect(respo2.body[0].id).toEqual(recommendation2)

    })

})

describe("GET /recommendations/random", () => {

    it("trying to get a recommendation in a empty dabase", async () => {
        const respo = await supertest(app).get("/recommendations/random")
        expect(respo.statusCode).toBe(404) 
    })

    it("trying to get random recommendations", async () => {
        await postTenObjects()

        const respo = await supertest(app).get("/recommendations/random")
        expect(respo.body).not.toBeNull()
    })
})


afterAll(async () => {
    await prisma.$disconnect();
});