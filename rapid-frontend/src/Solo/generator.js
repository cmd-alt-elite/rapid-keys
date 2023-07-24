import { generate } from 'random-words';

const TEXT_LENGTH = 25;
const WORDS_PER_STRING = 2;

export const generateText = (difficulty) => {
    let randomText = "";
    const separators = [' ', '-', ', ', '. ', '/'];

    if (difficulty === 'easy') {
        randomText = generate({ 
            exactly: TEXT_LENGTH,
            maxLength: 10,
            join: ' '
        });
    } else if (difficulty === 'medium') {
        randomText = generate({
            exactly: TEXT_LENGTH,
            join: ' ',
            formatter: (word, index) => {
                let doCapitalize = Math.random();
                return doCapitalize > 0.5 ? word.slice(0, 1).toUpperCase().concat(word.slice(1)) : word;
            }
        });
    } else {
        const textLengthAdjusted = Math.floor(TEXT_LENGTH / WORDS_PER_STRING);

        randomText = generate({
            exactly: textLengthAdjusted,
            wordsPerString: WORDS_PER_STRING,
            join: '',
            formatter: (word, index) => {

                if (index % WORDS_PER_STRING === 0) return word;

                let doCapitalize = Math.random();
                if (doCapitalize > 0.5) {
                    word = word.slice(0, 1).toUpperCase().concat(word.slice(1));
                }
                
                let separator = separators[Math.floor(Math.random() * separators.length)];

                word += separator;

                return word;
            }
        });

        randomText = randomText.trim();
    }


    return randomText;
}