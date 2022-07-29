import { prisma } from "../src/database.js"
import { faker } from '@faker-js/faker'
import supertest from "supertest"
import app from "../src/app.js"
import { getPostIdFactory } from "./factory/getIdFactory.js";

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
        await supertest(app).post("/recommendations").send(body2)
        const respo = await supertest(app).post("/recommendations").send(body2)
        expect(respo.statusCode).toBe(409)
    })
})

describe("POST /recommendations/:id/upvote", () => {
    
    it("trying to add a vote to the video", async () => {
        await supertest(app).post("/recommendations").send(body)
        const respo = await getPostIdFactory(body.name)
        const respo2 = await supertest(app).post(`/recommendations/${respo.id}/upvote`).send()
        expect(respo2.statusCode).toBe(200)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});