import * as Future from 'fluture';
import {conf} from '../config/config'
var fetchf = Future.encaseP(fetch);

export const getRessourcesWithConf=(conf)=>(lang,ressourcePath)=> {
   // console.log(`http://${conf.host}:${conf.port}/api/${lang}/${ressourcePath}`);
return fetchf(  `http://${conf.host}:${conf.port}/api/${lang}/${ressourcePath}`)
.chain(res => Future.tryP(() => 
{
    return res.json()
}
))};



export  let getRessources=getRessourcesWithConf(conf);


export const fetchAndDispatch=(lang,ressource,{success,fail})=>()=>{
    return (dispatch)=>{
     getRessources(lang,ressource).fork(
       (error)=>dispatch(fail(error)),
       (data)=>{dispatch(success(data));
       })
     }};