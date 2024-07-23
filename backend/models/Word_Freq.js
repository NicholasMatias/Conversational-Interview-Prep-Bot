import natural from 'natural'
const { WordTokenizer, PorterStemmer } = natural

export function cleanAndTokenize(text) {
    const stopWords = new Set([" ","i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"])

    const tokenizer = new WordTokenizer()
    const tokens = tokenizer.tokenize(text.toLowerCase().replace(/[^\w\s]/g, ' '))
    console.log("Before base conversion:", tokens)
    // const baseWords = tokens.map(token => PorterStemmer.stem(token))
    // console.log("After base conversion:", baseWords)
    const removeStopWords = tokens.filter(word => !stopWords.has(word))
    console.log("Clean and Tokenize:",removeStopWords)
    return removeStopWords
}

export function cleanAndTokenizeNGrams(text) {
    const spaces = new Set([' ', ""," ", ''])
    const lower = text.toLowerCase()
    console.log("Clean and Tokenize nGrams Lower:", lower)
    const words = lower.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => !spaces.has(word))
    console.log("Clean and Tokenize nGrams:", words)
    return words
}

export function generateNGrams(tokens, n) {
    const nGrams = []
    for (let i = 0; i <= tokens.length - n; i++) {
        nGrams.push(tokens.slice(i, i + n).join(' '))
    }
    return nGrams
}

export function countFreq(words) {
    const freq = {}
    words.forEach(word => {
        freq[word] = (freq[word] || 0) + 1
    })
    return freq
}

export function getFreq(text, n = 10, nGramSize = 1) {
    const words = nGramSize===1 ? cleanAndTokenize(text) : cleanAndTokenizeNGrams(text)

    const items = nGramSize === 1 ? words : generateNGrams(words, nGramSize)

    const freq = countFreq(items)

    const freqObj = Object.entries(freq)
    const sortedFreq = freqObj.sort((a, b) => b[1] - a[1])
    const topN = sortedFreq.slice(0, n)

    return topN
}

