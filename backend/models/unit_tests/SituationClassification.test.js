const { getSituation } = require("../TextClassification.cjs");

const {
    goodSituationScore,
    goodTaskResponse,
    goodActionResponse,
    goodResultResponse,
} = require("./unit_testing_constants.cjs");

test("getSituation(goodSituationResponse) > getSituation(goodResultResponse)", () => {
    const badResponse = getSituation(goodResultResponse)[1];
    expect(goodSituationScore).toBeGreaterThan(badResponse);
});

test("getSituation(goodSituationResponse) > getSituation(goodActionReponse)", () => {
    const badResponse = getSituation(goodActionResponse)[1];
    expect(goodSituationScore).toBeGreaterThan(badResponse);
});
test("getSituation(goodSituationResponse) > getSituation(goodTaskResponse)", () => {
    const badResponse = getSituation(goodTaskResponse)[1];
    expect(goodSituationScore).toBeGreaterThan(badResponse);
});

test("getSituation(goodSituationResponse) > .5", () => {
    expect(goodSituationScore).toBeGreaterThan(0.5);
});

test("getSituation(badSituationResponse) < .5", () => {
    const badResponse = getSituation(goodResultResponse)[1];
    expect(badResponse).toBeLessThan(0.5);
});
