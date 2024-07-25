const { getResult } = require("../TextClassification.cjs");

const {
    goodResultScore,
    goodSituationResponse,
    goodActionResponse,
    goodResultResponse,
} = require("./unit_testing_constants.cjs");

test("getResult(goodResultResponse) > getResult(goodSituationResponse)", () => {
    const badResponse = getResult(goodSituationResponse)[1];
    expect(goodResultScore).toBeGreaterThan(badResponse);
});

test("getResult(goodResultResponse) > getResult(goodActionReponse)", () => {
    const badResponse = getResult(goodActionResponse)[1];
    expect(goodResultScore).toBeGreaterThan(badResponse);
});
test("getResult(goodResultResponse) > getResult(goodResultResponse)", () => {
    const badResponse = getResult(goodResultResponse)[1];
    expect(goodResultScore).toBeGreaterThan(badResponse);
});

test("getResult(goodResultResponse) > .5", () => {
    expect(goodResultScore).toBeGreaterThan(0.5);
});

test("getResult(badResultResponse) < .5", () => {
    const badResponse = getResult(goodActionResponse)[1];
    expect(badResponse).toBeLessThan(0.5);
});
