const { Classifier } = require('ml-classify-text')
const path = require("path")
const fs = require("fs")

let star_data = JSON.parse(fs.readFileSync(path.join(__dirname,'STAR_Responses.json'), 'utf-8'))

const situationData = star_data.slice(0,10000).map(item => item['Situation']);
const noSituation = new Array(100).fill("There was no situation detected.");

const situation_model = new Classifier()

situation_model.train(situationData,"Situation");
situation_model.train(noSituation, "No Situation");

const predictions = situation_model.predict("  I was a project manager for a project that was a stock forecasting model. My team consisted of three other students and myself. I led the weekly meetings and I set them up via Google Calendar invites. I would set the agenda for every weekly meeting as well. During these meetings, I would check in with each member and then help them set up their sprints for the following week. So this included ensuring that the sprint was reasonable in terms of the project and then reasonable in terms of the scope as well. as well, so like the given time constraints. Through doing this, I was able to actually assemble these meetings, and we were able to actually produce a really, really good product when it came to the end result")

if (predictions.length) {
	predictions.forEach((prediction) => {
		console.log(`${prediction.label} (${prediction.confidence})`)
	})
} else {
	console.log('No predictions returned')
}		


const taskData = star_data.slice(0,10000).map(item => item['Task']);
const noTask = new Array(100).fill("There was no task detected.");

const task_model = new Classifier()

task_model.train(taskData,"Task")
task_model.train(noTask,"No Task")


const taskPredictions = task_model.predict("  I was a project manager for a project that was a stock forecasting model. My team consisted of three other students and myself. I led the weekly meetings and I set them up via Google Calendar invites. I would set the agenda for every weekly meeting as well. During these meetings, I would check in with each member and then help them set up their sprints for the following week. So this included ensuring that the sprint was reasonable in terms of the project and then reasonable in terms of the scope as well. as well, so like the given time constraints. Through doing this, I was able to actually assemble these meetings, and we were able to actually produce a really, really good product when it came to the end result")

if (taskPredictions.length) {
	taskPredictions.forEach((prediction) => {
		console.log(`${prediction.label} (${prediction.confidence})`)
	})
} else {
	console.log('No predictions returned')
}		


const actionData = star_data.slice(0,10000).map(item => item['Action'])
const noAction = new Array(100).fill("There was no action detected.")

const action_model = new Classifier()

action_model.train(actionData, "Action")
action_model.train(noAction, "No Action")

const actionPrediction = action_model.predict("  I was a project manager for a project that was a stock forecasting model. My team consisted of three other students and myself. I led the weekly meetings and I set them up via Google Calendar invites. I would set the agenda for every weekly meeting as well. During these meetings, I would check in with each member and then help them set up their sprints for the following week. So this included ensuring that the sprint was reasonable in terms of the project and then reasonable in terms of the scope as well. as well, so like the given time constraints. Through doing this, I was able to actually assemble these meetings, and we were able to actually produce a really, really good product when it came to the end result")

if (actionPrediction.length) {
	actionPrediction.forEach((prediction) => {
		console.log(`${prediction.label} (${prediction.confidence})`)
	})
} else {
	console.log('No predictions returned')
}		


const resultData = star_data.slice(0,10000).map(item => item['Result'])
const noResult = new Array(100).fill("There was no result detected.")

const result_model = new Classifier()

result_model.train(resultData, "Result")
result_model.train(noResult, "No Result")

const resultPrediction = result_model.predict("  I was a project manager for a project that was a stock forecasting model. My team consisted of three other students and myself. I led the weekly meetings and I set them up via Google Calendar invites. I would set the agenda for every weekly meeting as well. During these meetings, I would check in with each member and then help them set up their sprints for the following week. So this included ensuring that the sprint was reasonable in terms of the project and then reasonable in terms of the scope as well. as well, so like the given time constraints. Through doing this, I was able to actually assemble these meetings, and we were able to actually produce a really, really good product when it came to the end result")

if (resultPrediction.length) {
	resultPrediction.forEach((prediction) => {
		console.log(`${prediction.label} (${prediction.confidence})`)
	})
} else {
	console.log('No predictions returned')
}		

