import { prisma } from "../../src/database.js"
import { faker } from '@faker-js/faker'

export async function postTenObjects() {

    for (let i = 1; i <= 10; i++) {
        await prisma.recommendation.create({
            data: {
                name: `${faker.address}+${i}`,
                youtubeLink: `https://www.youtube.com/${faker.name}`
            }
        })

    }

    return
}

export async function postTwoObjects() {

    for (let i = 1; i <=2; i++) {
        await prisma.recommendation.create({
            data: {
                name: `${faker.address}+${i}`,
                youtubeLink: `https://www.youtube.com/${faker.name}`
            }
        })
    }
}