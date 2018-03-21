import * as Future from 'fluture';
var fetchf = Future.encaseP(fetch);


export  let getLanguages = fetchf(  'http://localhost:3333/api/Languages')
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
