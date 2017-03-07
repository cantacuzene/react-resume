import delay from './delay.js'



const Skills=[
    [{name:'C#', rating:90},
    {name: 'HTML', rating:80}, 
    {name:'CSS', rating:70},
    {name:'Javascript', rating:80},
    {name:'Docker', rating:60},
    {name:'SQL', rating:70},
    {name:'Linux', rating:60},
    {name:'dotnet core', rating:60}, 
    {name:'Hexagonal Architecture', rating:70},
    {name:'React', rating:70},
    {name:'Go', rating:30},
    {name:'Ruby', rating:30},
    {name:'Scrum Master', rating:90}, 
    {name:'web architecture', rating:90}]
];


class SkillsApi
{
    static getAll()
    {
         return new Promise((resolve, reject) => { setTimeout(() => {resolve(Object.assign([], Skills));}, delay);});
    }
    static get()
    {
        return Skills;
    }
}

export default SkillsApi;