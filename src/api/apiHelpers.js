import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);

export const getRessourcesWithConf=(conf)=>(ressourcePath)=> {
    console.log(`fetching ...http://${conf.host}:${conf.port}/api/${ressourcePath}`);
return fetchf(  `http://${conf.host}:${conf.port}/api/${ressourcePath}`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
))};



export  let getRessources=getRessourcesWithConf(conf);
