import * as utils from '../Skills.utils'

describe('skills.utils',()=>{

    it('graphOptions',()=>{
        const dummyData={
            names:[12],
            ratings:[0]
        }
        const SystemUnderTest = utils.graphOptions(dummyData.names,dummyData.ratings);
        expect(SystemUnderTest.xAxis.categories).toBe(dummyData.names);
        expect(SystemUnderTest.series[0].data).toBe(dummyData.ratings);
    });
    it('DrawSkillsPanel',()=>{
        const dummyContainer =42;
        const dummyConfig={
            names:[12],
            ratings:[0]
        }
        const SystemUnderTest = utils.DrawSkillsPanel(dummyContainer,dummyConfig);
        expect(SystemUnderTest.props.children[1].props.id).toBe(dummyContainer);
        expect(SystemUnderTest.props.children[1].props.children.props.config).toBe(dummyConfig);
    });
});