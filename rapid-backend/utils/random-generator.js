import { generate } from 'random-words';

export const generateText = (difficulty) => {
    let randomText = "";

    // if (difficulty === 'easy') {
        
    // } else if (difficulty == 'medium') {
    //     randomText = generate({
    //         exactly: 25,
    //         minLength: 3,
    //         formatter: (word, index) => {
                
    //         }
    //     })
    // }

    randomText = generate({ 
        exactly: 25,
        maxLength: 10,
        join: ' '
    });

    return randomText;
}