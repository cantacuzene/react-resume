import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);


export  let getAbouts= fetchf(  `http://localhost:${conf.port}/api/About`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
