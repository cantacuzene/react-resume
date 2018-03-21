import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);


export  let getLanguages = fetchf(  `http://localhost:${conf.port}/api/Languages`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
