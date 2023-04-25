function capitalizeFirstLetterOfFirstWordAndLowercaseTheRest(string) { //takes a sentence or word and capitalizes the first letter and lowercases the rest
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function processListOfSentences(string) { //accepts a string of sentences delimited by "*" and returns an array of sentences with the first letter of each sentence capitalized and the rest lowercased
  return string
    .trim() //remove any number of spaces from the beginning and end of the string
    .replace(/^\*+|\*+$/g, "") //error handling: remove all the beginning and ending stars if there are any
    .replace(/\*+/g, "*") //error handling: replace all repeated stars with one star
    .split("*") //split the string into an array of sentences delimited by "*"
    .map((sentence) => sentence.trim()) //remove any number of spaces from the beginning and end of each sentence
    .map((sentence) => {return capitalizeFirstLetterOfFirstWordAndLowercaseTheRest(sentence)}) //capitalize the first letter of each sentence and lower case the rest });
}

// const testInput = "People* House*   stone* wAteR* RougH paTch"; //messed up test entry
// console.log(processListOfSentences(testInput));

export function hasEmptynessBetweenStars(str) {
  return /\*\s+\*/.test(str);
}

export function capitalizeFirstLetterOfEachWord(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}