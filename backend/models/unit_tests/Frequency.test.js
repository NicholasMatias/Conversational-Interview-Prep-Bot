const { getFreq, testFreq } = require("./unit_testing_constants.cjs");

//for reference testFreq: "This is a test to see if the frequency method works as expected. We willl seen soon enough. Hopefully the test goes as expected"

test("getFreq(text, n = 3, ngramSize = 1) => 3 most common words", () => {
    const freq = getFreq(testFreq, 3, 1);
    expect(freq[0][1]).toBe(2); // test = 2
    expect(freq[1][1]).toBe(2); // expected = 2
    expect(freq[2][1]).toBe(1); // see = 1
});

test("getFreq(text, n = 3, ngramSize = 2) => 3 most common 2 word phrases", () => {
    const freq = getFreq(testFreq, 3, 2);
    expect(freq[0][1]).toBe(2); // as expected = 2
    expect(freq[1][1]).toBe(1); // this is = 1
    expect(freq[2][1]).toBe(1); // is a = 1
});
