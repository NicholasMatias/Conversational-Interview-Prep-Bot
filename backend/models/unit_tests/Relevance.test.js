const {
    getRelevanceScore,
    strengthQuestion,
    strengthQuestionResponse,
    strengthUnrelatedResponse,
} = require("./unit_testing_constants.cjs");

test("getRelevanceScore(question, matching response)", () => {
    const relevanceScore = getRelevanceScore(
        strengthQuestion,
        strengthQuestionResponse
    )[1];
    expect(relevanceScore).toBeGreaterThan(0.7);
});

test("getRelevanceScore(question, matching response)", () => {
    const relevanceScore = getRelevanceScore(
        strengthQuestion,
        strengthUnrelatedResponse
    )[1];
    expect(relevanceScore).toBeLessThan(0.7);
});
