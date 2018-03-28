import * as reducers from '../reducers'
import * as actions from '../../actions/actions'

const initTialState= ()=>{
    return {Languages:[{name:'dummy',rating:0.9}],
    Experiences:['DummyExp'],
    Educations:['DummySchool'],
    Abouts:{
      cover:["boring dummy stuff"],interests:['no interests']
    },
    Skills:{
    names:['c#'],
    ratings:['42']
  }};
}
describe('reducers',()=>{

    it('LanguageReducer with request action',()=>{

        const dummyAction = actions.fetchLanguagesRequest();
        const SystemUnderTest = reducers.LanguagesReducer(initTialState().Languages,dummyAction)
        expect(SystemUnderTest).toEqual(initTialState().Languages);
    });

    it('LanguageReducer with success action',()=>{
        const dummyPayload=[{id:0,name:'french',rating:1},{id:1,name:'french',rating:1}];
        const dummyAction = actions.fetchLanguagesSucceded(dummyPayload);
        const SystemUnderTest = reducers.LanguagesReducer(initTialState().Languages,dummyAction)
        expect(SystemUnderTest).toEqual(dummyPayload);
    });

    it('SkillsReducer with request action',()=>{

        const dummyAction = actions.fetchSkillsRequest();
        const SystemUnderTest = reducers.SkillsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });


    it('LanguageReducer with success action',()=>{
        const dummyPayload=[{"name":"C#", "rating":90}, {"name": "HTML", "rating":80}];
        const dummyAction = actions.fetchSkillsSucceded(dummyPayload);
        const SystemUnderTest = reducers.SkillsReducer(initTialState().Skills,dummyAction)
        expect(SystemUnderTest).toEqual({
            names:dummyPayload.map(x=>x.name),
            ratings:dummyPayload.map(x=>x.rating)
          });
    });

    it('EducationsReducer with request action',()=>{

        const dummyAction = actions.fetchEducationsRequest();
        const SystemUnderTest = reducers.EducationsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });
    it('AboutsReducer with request action',()=>{

        const dummyAction = actions.fetchAboutsRequest();
        const SystemUnderTest = reducers.AboutsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });
    it('ExperiencesReducer with request action',()=>{

        const dummyAction = actions.fetchExperiencesRequest();
        const SystemUnderTest = reducers.ExperiencesReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });
})