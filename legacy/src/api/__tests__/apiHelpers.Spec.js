global.fetch = require('jest-fetch-mock');
import * as apiHelpers from '../apiHelpers'

describe('apiHelpers',()=>{
    beforeEach(() => {
        fetch.resetMocks()
      })

    it('getRessources when receiving data',()=>{
        const dummyData= { data: '12345' }
        fetch.mockResponseOnce(JSON.stringify(dummyData))
        apiHelpers.getRessources("toto").fork((error)=>expect(error).toBe(false), (res)=>expect(res).toEqual(dummyData));
    });

    it('getRessources when receiving error',()=>{
        const dummyData= 'fake error message'
        fetch.mockReject(new Error(dummyData))

        apiHelpers.getRessources("toto").fork((error)=>{
            expect(error.message).toBe(dummyData)}, (res)=>expect(res).toEqual(dummyData));
    });
    })
