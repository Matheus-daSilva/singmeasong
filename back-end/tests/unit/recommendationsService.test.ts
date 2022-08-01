import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import recommendationFactory from "../factory/recommendationFactory.js";

describe("recommendationService", () => {
    it("trying to crate a new recommendation", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(
            (): any => {}
        );
        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toHaveBeenCalled();
    });

    it("trying to create an existing name", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => {
            return {
                id: 1,
                ...recommendation,
                score: 0,
            };
        });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(
            (): any => {}
        );
        const tryCreate = recommendationService.insert(recommendation);
        expect(tryCreate).rejects.toEqual({
            type: "conflict",
            message: "Recommendations names must be unique",
        });
    });

    it("Upvote recommendation", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                    score: 0,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {});
        await recommendationService.upvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("trying to upVote a recommendation that do not exist", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return null;
            }
        );
        const tryUp = recommendationService.upvote(5);
        expect(tryUp).rejects.toEqual({ type: "not_found", message: "" });
    });

    it("trying to downvote a recommendation", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
            score: 3,
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {
            return {
                ...recommendation,
            };
        });
        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("downvote until score -5", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {
            return {
                ...recommendation,
                score: -6,
            };
        });
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(
            (): any => {}
        );
        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
        expect(recommendationRepository.remove).toHaveBeenCalled();
    });

    it("trying to downVote a recommendation that do not exist", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return null;
            }
        );
        const tryDown = recommendationService.downvote(5);
        expect(tryDown).rejects.toEqual({ type: "not_found", message: "" });
    });

    it("trying to get a recommendation by id", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        const seachRecommendation = await recommendationService.getById(
            recommendation.id
        );
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(seachRecommendation.name).toEqual(recommendation.name);
    });

    it("trying to get all recommendations", async () => {
        const recommendations = [];
        const size = 5;
        for (let i = 0; i < size; i++) {
            recommendations.push({
                id: i + 1,
                ...recommendationFactory.exampleRecommendation(),
            });
        }

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const seachAllRecommendations = await recommendationService.get();
        expect(recommendationRepository.findAll).toHaveBeenCalled();
        expect(seachAllRecommendations).toHaveLength(size);
    });

    it("trying to get recommendations ranked", async () => {
        jest.spyOn(
            recommendationRepository,
            "getAmountByScore"
        ).mockImplementationOnce((): any => {});
        await recommendationService.getTop(1);
        expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
    });

    it("trying to get randomly recommendations with score > 10 ", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.1;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("trying to get randomly recommendations with score between -5 to 10", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("getting randomly recommendations with no filter", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("get a non randomly recommendation list", async () => {
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        const randomRecommendation = recommendationService.getRandom();
        expect(randomRecommendation).rejects.toEqual({
            type: "not_found",
            message: "",
        });
    });
});