import { prisma } from "../../src/database.js"

export async function getPostIdFactory(name: string) {
    return await prisma.recommendation.findFirst({
        where: {name}
    })
}