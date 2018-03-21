import * as Future from 'fluture';
var fetchf = Future.encaseP(fetch);


export  let getExperiences= fetchf(  'http://localhost:3333/api/Experiences')
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
