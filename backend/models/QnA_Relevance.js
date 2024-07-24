import natural from 'natural'
import {relevanceLast, relevanceFourth, relevaneThird, relevanceSecond} from '../constants.js';
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

    if (!similarity || similarity <= relevanceLast) {
		return ['last',similarity]
	} else if (similarity <= relevanceFourth) {
		return ['fourth',similarity ]
	} else if (similarity <= relevaneThird) {
		return ['third',similarity]
	} else if (similarity <= relevanceSecond) {
		return ['second',similarity]
	} else {
		return ['best',similarity]
	}
}


