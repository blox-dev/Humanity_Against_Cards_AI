const ai = require('./getAiAnswer.js');
async function f(){
    x=await ai.getAiAnswer(3,Array(11,22,33,44,55,66,77,88,99,100));
    return x;
}
f();
