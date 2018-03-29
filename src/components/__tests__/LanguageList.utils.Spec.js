import * as utils from '../LanguagesList.utils'
import React from 'react'

describe('Language.utils',()=>{
    it('ChartTagDrawer renders the apropriate jsx',()=>{
        const dummyData = {
            dummyJsx :<div></div>,
            width:50,
            height:50,
            language:{
                id:42,
                name:"toto",
                rating:90}
        }
        const expectedJsx= <div key={dummyData.language.id} language={dummyData.language.name} rate={dummyData.language.rating} width={dummyData.width} height={dummyData.height} ></div>;
        const SystemUnderTest = utils.ChartTagDrawer(dummyData.dummyJsx,dummyData.width,dummyData.height,dummyData.language);
        expect(SystemUnderTest.language).toBe(expectedJsx.language);
        expect(SystemUnderTest.rate).toBe(expectedJsx.rate);
        expect(SystemUnderTest.width).toBe(expectedJsx.height);
    });
    it('ChartTagDrawer renders the apropriate jsx when language is null',()=>{
        const dummyData = {
            dummyJsx :<div></div>,
            width:50,
            height:50,
            language:null
        }
        const expectedJsx= <div  width={dummyData.width} height={dummyData.height} ></div>;
        const SystemUnderTest = utils.ChartTagDrawer(dummyData.dummyJsx,dummyData.width,dummyData.height,dummyData.language);
        expect(SystemUnderTest.language).toBe(expectedJsx.language);
        expect(SystemUnderTest.rate).toBe(expectedJsx.rate);
        expect(SystemUnderTest.width).toBe(expectedJsx.height);
    });

    it('svgTagDrawer is behaving properly',()=>{
        const dummyData={
            width:34,
            height:44,
            dumyJsx:<div />
        }
        const expectedJsx = <div viewBox={`0 0 ${dummyData.width} ${dummyData.height}`}/>
        const SystemUnderTest = utils.svgTagDrawer(dummyData.width,dummyData.height,dummyData.dumyJsx);
        expect(expectedJsx.viewBox).toBe(SystemUnderTest.viewBox)
    })
    
    it('svgTagDrawer is behaving properly with null width and height properties',()=>{
        const dummyData={
            width:null,
            height:null,
            dumyJsx:<div />
        }
        const expectedJsx = <div viewBox={`0 0 ${dummyData.width} ${dummyData.height}`}/>
        const SystemUnderTest = utils.svgTagDrawer(dummyData.width,dummyData.height,dummyData.dumyJsx);
        expect(expectedJsx.viewBox).toBe(SystemUnderTest.viewBox)
    })

    it('SectionTagDrawer is rendering properdata',()=>{
        const dummyData={
            chartid:42,
            dumyJsx:<div />
        }
        const SystemUnderTest = utils.SectionTagDrawer(dummyData.chartid,dummyData.dummyJsx);
        expect(SystemUnderTest.props.children[1].props.children.props.id).toBe(dummyData.chartid);
    })
    
    it('SectionTagDrawer is rendering properdata with null chartid',()=>{
        const dummyData={
            chartid:null,
            dumyJsx:<div />
        }
        const SystemUnderTest = utils.SectionTagDrawer(dummyData.chartid,dummyData.dummyJsx);
        expect(SystemUnderTest.props.children[1].props.children.props.id).toBe(dummyData.chartid);
    })
})

