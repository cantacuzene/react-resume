import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);

export  let getExperiences= fetchf(  `http://localhost:${conf.port}/api/Experiences`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
