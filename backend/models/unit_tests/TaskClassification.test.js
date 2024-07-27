const { getTask } = require("../TextClassification.cjs");

const {
    goodTaskScore,
    goodSituationResponse,
    goodActionResponse,
    goodResultResponse,
} = require("./unit_testing_constants.cjs");

test("getTask(goodTaskResponse) > getTask(goodSituationResponse)", () => {
    const badResponse = getTask(goodSituationResponse)[1];
    expect(goodTaskScore).toBeGreaterThan(badResponse);
});

test("getTask(goodTaskResponse) > getTask(goodActionReponse)", () => {
    const badResponse = getTask(goodActionResponse)[1];
    expect(goodTaskScore).toBeGreaterThan(badResponse);
});
test("getTask(goodTaskResponse) > getTask(goodResultResponse)", () => {
    const badResponse = getTask(goodResultResponse)[1];
    expect(goodTaskScore).toBeGreaterThan(badResponse);
});

test("getTask(goodTaskResponse) > .5", () => {
    expect(goodTaskScore).toBeGreaterThan(0.5);
});

test("getTask(badTaskResponse) < .5", () => {
    const badResponse = getTask(goodResultResponse)[1];
    expect(badResponse).toBeLessThan(0.5);
});
