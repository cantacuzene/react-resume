import React from 'react'
import LanguageList from '../LanguagesList'
import renderer from 'react-test-renderer'
//import HomePage from '../HomePage';

describe('LanguageList', ()=>{

    const articles ={
        "Languages":[{
        "name":"English",
        "rating":0.87,
        "id":0
    },
    {
        "name":"French",
        "rating":1,
        "id":1
    }],
    "chartid":"myd3chart" ,
    "width":500, 
    "height":190,
    "Titles":{"Languages":'Languages'}
}

    it('renders correctly', ()=>{
       const tree=  renderer.create(
        <LanguageList {...articles} />
        ).toJSON();
        expect(tree).toMatchSnapshot();

        //looking for the g elements
        expect(tree.children[1].children[0].children[0].children.length).toBe(2);
    })


});
