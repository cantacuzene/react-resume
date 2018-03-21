import * as Future from 'fluture';
var fetchf = Future.encaseP(fetch);


export  let getSkills= fetchf(  'http://localhost:3333/api/Skills')
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
