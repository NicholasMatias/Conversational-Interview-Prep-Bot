const {
    getSituation,
    getTask,
    getAction,
    getResult,
} = require("../TextClassification.cjs");
const goodSituationScore = getSituation(
    "I was assigned to lead a project in a domain I was not initially familiar with."
)[1];
const goodTaskScore = getTask(
    "I needed to quickly get up to speed and effectively lead the project."
)[1];
const goodActionScore = getAction(
    "I conducted research, engaged with experts, and applied new strategies to lead the project successfully."
)[1];
const goodResultScore = getResult(
    "The project was completed on time, and my leadership was praised for its effectiveness. We were very happy with the end result."
)[1];

const goodSituationResponse =
    "I was assigned to lead a project in a domain I was not initially familiar with.";
const goodTaskResponse =
    "I needed to quickly get up to speed and effectively lead the project.";
const goodActionResponse =
    "I conducted research, engaged with experts, and applied new strategies to lead the project successfully.";
const goodResultResponse =
    "The project was completed on time, and my leadership was praised for its effectiveness. We were very happy with the end result. ";

const relevanceLast = 0.3;

const relevanceFourth = 0.6;

const relevaneThird = 0.85;

const relevanceSecond = 0.9;

const natural = require("natural");

const TfIdf = natural.TfIdf;

function dotProduct(a, b) {
    let product = 0;
    for (let i = 0; i < a.length; i++) {
        product += a[i] * b[i];
    }
    return product;
}

function magnitude(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += vector[i] ** 2;
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(a, b) {
    const dotProd = dotProduct(a, b);
    const magA = magnitude(a);
    const magB = magnitude(b);

    if (magA === 0 || magB === 0) {
        return 0;
    }

    const cosSim = dotProd / (magA * magB);
    return cosSim;
}

function getRelevanceScore(question, response) {
    const tf_idf = new TfIdf();

    tf_idf.addDocument(question);
    tf_idf.addDocument(response);

    const questionVector = tf_idf.listTerms(0).map((term) => term.tfidf);
    const responseVector = tf_idf.listTerms(1).map((term) => term.tfidf);

    while (questionVector.length < responseVector.length)
        questionVector.push(0);
    while (responseVector.length < questionVector.length)
        responseVector.push(0);

    const similarity = cosineSimilarity(questionVector, responseVector);

    if (!similarity || similarity <= relevanceLast) {
        return ["last", similarity];
    } else if (similarity <= relevanceFourth) {
        return ["fourth", similarity];
    } else if (similarity <= relevaneThird) {
        return ["third", similarity];
    } else if (similarity <= relevanceSecond) {
        return ["second", similarity];
    } else {
        return ["best", similarity];
    }
}

const strengthQuestion = "What is your greatest strength?";

const strengthQuestionResponse =
    "My greatest strenght is my attention to detail. I am a very detail oriented person.";

const strengthUnrelatedResponse =
    "I really like to cook, especially mexican food. It is the best type of food by far.";

module.exports = {
    goodSituationScore,
    goodTaskScore,
    goodActionScore,
    goodResultScore,
    goodSituationResponse,
    goodTaskResponse,
    goodActionResponse,
    goodResultResponse,
    getRelevanceScore,
    strengthQuestion,
    strengthQuestionResponse,
    strengthUnrelatedResponse,
};
