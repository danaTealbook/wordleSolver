const readline = require("readline")
const wordList = require('./words.json')

// Function to generate a random word from the word list
const generateRandomWord = (wordList) => {
    while (true) {
        const word = wordList[Math.floor(Math.random() * wordList.length)]
        return word
    }
}

/* lettersFound is for handling duplicate letters, since the game will mark the duplicate letters as grey
when they were already found on other spot(s)
for ex: Guessed word is "AMAZE". If the right word is "PLANK", the first "A" will be gray (not yellow) by the rules.*/
var lettersFound = new Set()

// Function to filter the word list based on the user feedback
const filterWordList = (wordList, userFeedback, guessedWord) => {
    let filteredWordList = wordList
    // Handle 1 & 2 first. For ex: in cases if the right word is "AMAZE" and the guessed word is "NEEZE"
    for(var i = 0; i < userFeedback.length; i++) {
        const currentChar = guessedWord[i]
        if(userFeedback[i] === 2) {
            lettersFound.add(currentChar)
            filteredWordList = filteredWordList.filter(word => {
                if(word[i] === currentChar) {
                    return true
                }
                return false
            })
        } else if(userFeedback[i] === 1) {
            lettersFound.add(currentChar)
            filteredWordList = filteredWordList.filter(word => {
                if(word.includes(currentChar) && word[i] !== currentChar) {
                    return true
                }
                return false
            })
        }
    }

    // Handle 0's
    for(var i = 0; i < userFeedback.length; i++) {
        const currentChar = guessedWord[i]
        if(userFeedback[i] === 0) {
            const isDuplicate = lettersFound.has(currentChar)
            filteredWordList = filteredWordList.filter(word => {
                if(word.includes(currentChar) && !isDuplicate) {
                    return false
                } else if(isDuplicate && word[i] === currentChar) {
                    return false
                }
                return true
            })
        } 
    }
    return filteredWordList
}


const convertStringToArray = (input) => {
    const parsedArray = input.split(',').map(Number)
  
    // Check if the parsed array has 5 elements and each element is a valid integer (0, 1, or 2)
    if (parsedArray.length === 5 && parsedArray.every((element) => [0, 1, 2].includes(element))) {
        return parsedArray
    } else {
        console.log("Invalid input. Please enter 5 digits separated by a comma, where the digits can be either 0, 1 or 2")
        return null
    }
}

// Main function
const wordleSolver = () => {
    const maxTries = 6
    let tries = 1
    var filteredWords = wordList

    // Generate the initial word suggestion
    var guessedWord = generateRandomWord(wordList)
    console.log(guessedWord.toUpperCase())

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const promptUserInput = () => {
        rl.question("Please, enter feedback: ", (answer) => {
            // Validate the input array
            var userFeedback = convertStringToArray(answer)
            if(userFeedback !== null) {
                filteredWords = filterWordList(filteredWords, userFeedback, guessedWord)
                if(filteredWords.length === 0) {
                    console.log("Sorry, no more suggestions left")
                    tries = maxTries
                } else {
                    const nextWord = generateRandomWord(filteredWords)
                    console.log(nextWord.toUpperCase())
                    guessedWord = nextWord
                    tries++
                }
            }

            if(tries < maxTries) {
                promptUserInput()
            } else {
                rl.close()
            }
        })
    }
    promptUserInput()
}
  
wordleSolver()