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
    "The project was completed on time, and my leadership was praised for its effectiveness."
)[1];

const goodSituationResponse =
    "I was assigned to lead a project in a domain I was not initially familiar with.";
const goodTaskResponse =
    "I needed to quickly get up to speed and effectively lead the project.";
const goodActionResponse =
    "I conducted research, engaged with experts, and applied new strategies to lead the project successfully.";
const goodResultResponse =
    "The project was completed on time, and my leadership was praised for its effectiveness.";

module.exports = {
    goodSituationScore,
    goodTaskScore,
    goodActionScore,
    goodResultScore,
    goodSituationResponse,
    goodTaskResponse,
    goodActionResponse,
    goodResultResponse,
};
