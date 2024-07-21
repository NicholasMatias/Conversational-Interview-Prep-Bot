const { Classifier } = require('ml-classify-text')
const path = require("path")
const fs = require("fs")



function trainModels(type) {
	const star_data = JSON.parse(fs.readFileSync(path.join(__dirname, 'STAR_Responses.json'), 'utf-8'))

	const modelData = star_data.slice(0, 10000).map(item => item[`${type}`]);
	const labelNotFound = new Array(100).fill(`There was no ${type} detected.`);

	const model = new Classifier()

	model.train(modelData, `${type}`);
	model.train(labelNotFound, `No ${type}`);

	return model
}


function getResults(userResponse) {
	const situation_model = trainModels("Situation");
	const task_model = trainModels("Task");
	const action_model = trainModels("Action");
	const result_model = trainModels("Result");

	const situation_prediction = situation_model.predict(userResponse)
	const task_prediction = task_model.predict(userResponse)
	const action_prediction = action_model.predict(userResponse)
	const result_prediction = result_model.predict(userResponse)

	if (situation_prediction.length) {
		console.log(`${situation_prediction[0].label} (${situation_prediction[0].confidence})`);
	}
	if (task_prediction.length) {
		console.log(`${task_prediction[0].label} (${task_prediction[0].confidence})`);
	}
	if (action_prediction.length) {
		console.log(`${action_prediction[0].label} (${action_prediction[0].confidence})`);
	}
	if (result_prediction.length) {
		console.log(`${result_prediction[0].label} (${result_prediction[0].confidence})`);
	}



	return [situation_prediction[0].confidence, task_prediction[0].confidence, action_prediction[0].confidence, result_prediction[0].confidence]
}

module.exports = {
	trainModels: trainModels,
	getResults: getResults
}