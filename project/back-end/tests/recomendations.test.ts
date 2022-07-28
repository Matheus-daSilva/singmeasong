import {prisma} from "../src/database.js"
import { faker } from '@faker-js/faker'
import supertest from "supertest"
import app from "../src/app.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

const body = {
    name: faker.name,
    youtubeLink: `https://www.youtube.com/${faker.name}`
}


describe("POST /recomendations", () => {

    it("postagem de uma recomendação de vídeo", async () => {
        const respo = await supertest(app).post("/recommendations").send(body)
        expect(respo.statusCode).toBe(201)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});