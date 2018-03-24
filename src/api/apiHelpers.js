import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);


export  let getRessources=(ressourcePath)=> fetchf(  `http://${conf.host}:${conf.port}/api/${ressourcePath}`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
));
