import {prisma} from "../src/database.js"
import supertest from "supertest"
import app from "../src/app.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recomendations;`;
});

describe("POST /recomendations", () => {

    it("postagem de uma recomendação de vídeo", async () => {
        
    })
})