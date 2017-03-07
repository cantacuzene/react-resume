import delay from './delay.js'

const Languages=[
    {
        name:'English',
        rating:0.87
    },
    {
        name:'French',
        rating:1
    }
];

class LanguageApi
{
    static getAll()
    {
         return new Promise((resolve, reject) => { setTimeout(() => {resolve(Object.assign([], Languages));}, delay);});
    }
}

export default LanguageApi;