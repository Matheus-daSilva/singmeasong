import { recommendationService } from "./../../src/services/recommendationsService.js"
import { recommendationRepository } from "./../../src/repositories/recommendationRepository.js"
import { faker } from '@faker-js/faker'
import { jest } from "@jest/globals";

describe("GET random", () => {

    it("testing the random service function", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            const arr = []
            for (let i = 1; i <= 10; i++) {
                arr.push({
                    name: `${faker.address}+${i}`,
                    youtubeLink: `https://www.youtube.com/${faker.name}`
                })
            }
            return arr
        })

        const respo = await recommendationService.getRandom()

        expect(respo).not.toBeNull()

    })

    it("testing the random service function faling", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [{}]
        })
        const respo = await recommendationService.getRandom()

        expect(respo.id).toBeUndefined()
        expect(respo.name).toBeUndefined()
        expect(respo.score).toBeUndefined()
        expect(respo.youtubeLink).toBeUndefined()
    })

})