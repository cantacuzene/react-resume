import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);


export  let getEductaions= fetchf(  `http://localhost:${conf.port}/api/Educations`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
