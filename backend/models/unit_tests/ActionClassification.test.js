const { getAction } = require("../TextClassification.cjs");

const {
    goodActionScore,
    goodSituationResponse,
    goodTaskResponse,
    goodResultResponse,
} = require("./unit_testing_constants.cjs");

test("getAction(goodActionResponse) > getAction(goodSituationResponse)", () => {
    const badResponse = getAction(goodSituationResponse)[1];
    expect(goodActionScore).toBeGreaterThan(badResponse);
});

test("getAction(goodActionResponse) > getAction(goodTaskResponse)", () => {
    const badResponse = getAction(goodTaskResponse)[1];
    expect(goodActionScore).toBeGreaterThan(badResponse);
});
test("getAction(goodActionResponse) > getAction(goodResultResponse)", () => {
    const badResponse = getAction(goodResultResponse)[1];
    expect(goodActionScore).toBeGreaterThan(badResponse);
});

test("getAction(goodActionResponse) > .5", () => {
    expect(goodActionScore).toBeGreaterThan(0.5);
});

test("getAction(badActionResponse) < .5", () => {
    const badResponse = getAction(goodResultResponse)[1];
    expect(badResponse).toBeLessThan(0.5);
});
