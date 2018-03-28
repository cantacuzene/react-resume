import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);

export const getRessourcesWithConf=(conf)=>(ressourcePath)=> fetchf(  `http://${conf.host}:${conf.port}/api/${ressourcePath}`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));



export  let getRessources=getRessourcesWithConf(conf);
