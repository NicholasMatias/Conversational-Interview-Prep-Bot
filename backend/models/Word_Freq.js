import natural from "natural";
import { stopWords } from "../constants.js";
const { WordTokenizer, PorterStemmer } = natural;

export function cleanAndTokenize(text) {
    const tokenizer = new WordTokenizer();
    const tokens = tokenizer.tokenize(
        text.toLowerCase().replace(/[^\w\s]/g, " ")
    );

    const removeStopWords = tokens.filter((word) => !stopWords.has(word));
    return removeStopWords;
}

export function cleanAndTokenizeNGrams(text) {
    const spaces = new Set([" ", "", " ", ""]);
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/).filter((word) => !spaces.has(word));
    return words;
}

export function generateNGrams(tokens, n) {
    const nGrams = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        nGrams.push(tokens.slice(i, i + n).join(" "));
    }
    return nGrams;
}

export function countFreq(words) {
    const freq = {};
    words.forEach((word) => {
        freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
}

export function getFreq(text, n = 10, nGramSize = 1) {
    const words =
        nGramSize === 1 ? cleanAndTokenize(text) : cleanAndTokenizeNGrams(text);

    const items = nGramSize === 1 ? words : generateNGrams(words, nGramSize);

    const freq = countFreq(items);

    const freqObj = Object.entries(freq);
    const sortedFreq = freqObj.sort((a, b) => b[1] - a[1]);
    const topN = sortedFreq.slice(0, n);

    return topN;
}
