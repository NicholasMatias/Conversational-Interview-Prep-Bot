import natural from 'natural'
const TfIdf = natural.TfIdf


export function dotProduct(a, b) {
    let product = 0;
    for (let i = 0; i < a.length; i++) {
        product += a[i] * b[i];
    }
    return product;
}

export function magnitude(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += vector[i] ** 2;
    }
    return Math.sqrt(sum);
}

export function cosineSimilarity(a, b) {
    const dotProd = dotProduct(a, b);
    const magA = magnitude(a);
    const magB = magnitude(b);

    if (magA === 0 || magB === 0) {
        return 0;
    }

    const cosSim = dotProd / (magA * magB);
    return cosSim;
}

export function getRelevanceScore(question, response){
    const tf_idf = new TfIdf()

    tf_idf.addDocument(question)
    tf_idf.addDocument(response)

    const questionVector = tf_idf.listTerms(0).map(term => term.tfidf)
    const responseVector = tf_idf.listTerms(1).map(term => term.tfidf)

    while (questionVector.length < responseVector.length) questionVector.push(0);
    while (responseVector.length < questionVector.length) responseVector.push(0);

    const similarity = cosineSimilarity(questionVector, responseVector)

    return similarity

}


const question = "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?"
const answer = "  One time I worked on a project with three other members. Our project was a stock forecasting model capable of predicting the stock indexes for various sectors within the stock market, so technology sector, healthcare sector, something like that. My role on the project was project manager actually. This meant that I was responsible for setting up the weekly meetings. I would send out Google Calendar invites to ensure that everybody had the invite, the Zoom link, etc., all those logistical details. During these meetings, I would set the agenda for the following week as well, leading the meeting throughout. During the meeting, I would also ensure that everybody's upcoming sprints were reasonable in terms of the scope of the project and the given time constraints of the project. Being a leader and leading this project has taught me how to be concise in communication, how to actually bring people together to have a cohesive working project group so that we actually have an angle and we're all on the same page of the angle leading to a great end result. And with that said, I'm really proud of what we were able to produce."





const similarity = getRelevanceScore(question, answer);
console.log("Score:", similarity);