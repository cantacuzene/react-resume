import * as _ from 'ramda'

export const trace = _.curry((tag,x)=>{
    /* eslint-disable no-console */
    console.log(tag,x);
    /* eslint-enable no-console */
    return x
})
