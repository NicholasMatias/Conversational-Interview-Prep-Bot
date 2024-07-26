const { Classifier } = require("ml-classify-text");
const path = require("path");
const fs = require("fs");

//can't put these constants in constants.js bc this file is common js (cjs)
const last = 0.2;

const fourth = 0.35;

const third = 0.45;

const second = 0.55;

function trainModels(type) {
    const star_data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "STAR_Responses.json"), "utf-8")
    );

    const modelData = star_data.slice(0, 10000).map((item) => item[`${type}`]);
    const labelNotFound = new Array(100).fill(`There was no ${type} detected.`);

    const model = new Classifier();

    model.train(modelData, `${type}`);
    model.train(labelNotFound, `No ${type}`);

    return model;
}

function getResults(userResponse) {
    const situation_model = trainModels("Situation");
    const task_model = trainModels("Task");
    const action_model = trainModels("Action");
    const result_model = trainModels("Result");

    const situation_prediction = situation_model.predict(userResponse);
    const task_prediction = task_model.predict(userResponse);
    const action_prediction = action_model.predict(userResponse);
    const result_prediction = result_model.predict(userResponse);

    return [
        situation_prediction[0].confidence,
        task_prediction[0].confidence,
        action_prediction[0].confidence,
        result_prediction[0].confidence,
    ];
}

function getSituation(userResponse) {
    const situation_model = trainModels("Situation");
    const situation_prediction = situation_model.predict(userResponse);
    try {
        let result = 0;
        if (situation_prediction.length > 0) {
            result = situation_prediction
                ? situation_prediction[0].confidence
                : 0;
        }
        if (!result || result <= last) {
            return ["last", result];
        } else if (result <= fourth) {
            return ["fourth", result];
        } else if (result <= third) {
            return ["third", result];
        } else if (result <= second) {
            return ["second", result];
        } else {
            return ["best", result];
        }
    } catch (error) {
        console.error("Error getting situation score:", error);
        return ["last", 0];
    }
}

function getTask(userResponse) {
    const task_model = trainModels("Task");
    const task_prediction = task_model.predict(userResponse);
    try {
        let result = 0;
        if (task_prediction.length > 0) {
            result = task_prediction.length ? task_prediction[0].confidence : 0;
        }
        if (!result || result <= last) {
            return ["last", result];
        } else if (result <= fourth) {
            return ["fourth", result];
        } else if (result <= third) {
            return ["third", result];
        } else if (result <= second) {
            return ["second", result];
        } else {
            return ["best", result];
        }
    } catch (error) {
        console.error("Error getting task score:", error);
        return "last";
    }
}

function getAction(userResponse) {
    const action_model = trainModels("Action");
    const action_prediction = action_model.predict(userResponse);
    try {
        let result = 0;
        if (action_prediction.length > 0) {
            result = action_prediction.length
                ? action_prediction[0].confidence
                : 0;
        }
        if (!result || result <= last) {
            return ["last", result];
        } else if (result <= fourth) {
            return ["fourth", result];
        } else if (result <= third) {
            return ["third", result];
        } else if (result <= second) {
            return ["second", result];
        } else {
            return ["best", result];
        }
    } catch (error) {
        console.error("Error getting action score:", error);
        return "last";
    }
}

function getResult(userResponse) {
    const result_model = trainModels("Result");
    const result_prediction = result_model.predict(userResponse);
    try {
        let result = 0;
        if (result_prediction.length > 0) {
            result = result_prediction.length
                ? result_prediction[0].confidence
                : 0;
        }
        if (!result || result <= last) {
            return ["last", result];
        } else if (result <= fourth) {
            return ["fourth", result];
        } else if (result <= third) {
            return ["third", result];
        } else if (result <= second) {
            return ["second", result];
        } else {
            return ["best", result];
        }
    } catch (error) {
        console.error("Error getting result score:", error);
        return "last";
    }
}

module.exports = {
    trainModels: trainModels,
    getResults: getResults,
    getSituation: getSituation,
    getTask: getTask,
    getAction: getAction,
    getResult: getResult,
};
