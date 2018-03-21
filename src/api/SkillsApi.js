import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);


export  let getSkills= fetchf(  `http://localhost:${conf.port}/api/Skills`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
