import dotenv from "dotenv";
dotenv.config();

export const doFollowUp_notLastQuestion_prompt = (context, message) => {
    return `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people. 
    The user is about give their response to a question that you have asked. Please provide a relevant reaction to their answer and brief feedback. Remember to keep this concise. Here is the question that 
    was asked: ${context}. Here is the user's response to the question: ${message} Lastly, ask a follow-up question to the user based on their response. Make the question relevant to them yet still broad 
    enough to allow them to answer on their own terms. `;
};

export const notLastQuestion_notFollowUp_prompt = (context, message) => {
    return `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; 
    do not include quotes around your response. The user is about give their response to a question that you have asked. Please provide a relevant reaction to their answer and say what you liked about 
    their response. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
    to the question: ${message}. Do not ask any type of question within your response. Say something to end this thought and mention going on to the next question. `;
};

export const lastQuestion_prompt = (context, message) => {
    return `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; do not include 
    quotes around your response. The user is about give their response to a question that you have 
    asked. Please provide a relevant reaction to their answer and say what you liked about their response. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the 
    user's response to the question: ${message}. Do not ask any type of question within your response. Say something to end this thought.
    Lastly, since this was the last question, you are done conducting the interview.
    You must always express your thanks for getting to interview the person and mention that there will be post interview feedback via our post interview review on our platform InterviewMe. `;
};

export const feedbackPrompt = (userResponse, question, scores) => {
    return `
        Your purpose is to provide constructive feedback to the user. The user has just answered a behavioral interview question. Your goal is to provide insightful advice on how to improve their response. Here are the guidelines:

        1. Your response can be no longer than 100 words.

        2. Your response should heavily be based off what they need to improve on. This should be solely based off the provided scores, user response, and question asked. 

        3. Here is the question that the user was asked: ${question}

        4. Here is the user's response to the question: ${userResponse}

        5. There are 5 scores that the user's response is being evaluated on:

        5.1. The user's response is being evaluated on the STAR method. For context the STAR method is a structured manner of responding to a behavioral-based interview question by discussing the specific situation, task, action, and result of the situation you are describing.
        
        5.2. The situation: Describe the situation that you were in or the task that you needed to accomplish. You
        must describe a specific event or situation, not a generalized description of what you have done in
        the past. Be sure to give enough detail for the interviewer to understand. This situation can be
        from a previous job, from a volunteer experience, or any relevant event.

        5.3. The task: What goal were you working toward? What were you trying to accomplish?

        5.4. The action: Describe the actions you took to address the situation with an appropriate amount of detail and keep the focus on YOU. What specific steps did you take and what was your particular contribution? Be careful that you don't describe what the team or group did when talking about a project, but what you actually did. Use the word “I,” not “we” when describing actions. 
        
        5.5. The result: Describe the outcome of your actions and don't be shy about taking credit for your behavior. What happened? How did the event end? What did you accomplish? What did you learn? Make sure your answer contains multiple positive results.
        
        5.6. The user's response is being evaluated on how relevant is it to the question. (a relevance score). 

        5.7. All of these scores are from 0 to 1. Here are the scores: 
        Situation = ${scores[0]}
        Task = ${scores[1]}
        Action = ${scores[2]}
        Result = ${scores[3]}
        Relevance = ${scores[4]}

        6. Now you have the user's response to a question, the question they were asked, the STAR scores, and the relevance score. Provide the user with specific feedback on how he or she could improve in any of the STAR categories or if they should make their response more relevant to the question. 



        
        `;
};

export const errorChatCompletion = "Error getting chat completion:";

export const errorTranscribingAudio = "Error transcribing audio:";

export const baseURL = `http://localhost:${process.env.PORT}`;

export const PORT = process.env.PORT || 3000;

export const relevanceLast = 0.3;

export const relevanceFourth = 0.6;

export const relevaneThird = 0.85;

export const relevanceSecond = 0.9;

export const followUpQuestionThreshold = 0.65;

export const goodSituationScore = getSituation(
    "I was assigned to lead a project in a domain I was not initially familiar with."
)[1];
export const goodTaskScore = getTask(
    "I needed to quickly get up to speed and effectively lead the project."
)[1];
export const goodActionScore = getAction(
    "I conducted research, engaged with experts, and applied new strategies to lead the project successfully."
)[1];
export const goodResultScore = getResult(
    "The project was completed on time, and my leadership was praised for its effectiveness."
)[1];

export const goodSituationResponse =
    "I was assigned to lead a project in a domain I was not initially familiar with.";
export const goodTaskResponse =
    "I needed to quickly get up to speed and effectively lead the project.";
export const goodActionResponse =
    "I conducted research, engaged with experts, and applied new strategies to lead the project successfully.";
export const goodResultResponse =
    "The project was completed on time, and my leadership was praised for its effectiveness.";

export const stopWords = new Set([
    " ",
    "m",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
]);
