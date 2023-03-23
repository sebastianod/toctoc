function capitalizeFirstLetterOfFirstWordAndLowercaseTheRest(string) { //takes a sentence or word and capitalizes the first letter and lowercases the rest
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function processListOfSentences(string) { //accepts a string of sentences delimited by "*" and returns an array of sentences with the first letter of each sentence capitalized and the rest lowercased
  return string
    .split("*") //split the string into an array of sentences delimited by "*"
    .map((sentence) => sentence.trim()) //remove any number of spaces from the beginning and end of each sentence
    .map((sentence) => {return capitalizeFirstLetterOfFirstWordAndLowercaseTheRest(sentence)}) //capitalize the first letter of each sentence and lower case the rest });
}

// const testInput = "People* House*   stone* wAteR* RougH paTch"; //messed up test entry
// console.log(processListOfSentences(testInput));
