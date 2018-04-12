import * as reducers from '../reducers'
import * as actions from '../../actions/actions'

const initTialState= ()=>{
    return {Languages:[{name:'dummy',rating:0.9}],
    Experiences:['DummyExp'],
    Educations:['DummySchool'],
    Abouts:{
      cover:[{data:"boring dummy stuff"}],interests:[{value:'no interests'}]
    },
    Skills:{
    names:['c#'],
    ratings:['42']
  }};
}
describe('reducers',()=>{

    it('LanguageReducer with request action',()=>{

        const dummyAction = actions.LanguageActions.request();
        const SystemUnderTest = reducers.LanguagesReducer(initTialState().Languages,dummyAction)
        expect(SystemUnderTest).toEqual(initTialState().Languages);
    });

    it('LanguageReducer with success action',()=>{
        const dummyPayload=[{id:0,name:'french',rating:1},{id:1,name:'french',rating:1}];
        const dummyAction = actions.LanguageActions.success(dummyPayload);
        const SystemUnderTest = reducers.LanguagesReducer(initTialState().Languages,dummyAction)
        expect(SystemUnderTest).toEqual(dummyPayload);
    });

    it('SkillsReducer with request action',()=>{

        const dummyAction = actions.SkillsActions.request();
        const SystemUnderTest = reducers.SkillsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });


    it('SkillsReducer with success action',()=>{
        const dummyPayload=[{"name":"C#", "rating":90}, {"name": "HTML", "rating":80}];
        const dummyAction = actions.SkillsActions.success(dummyPayload);
        const SystemUnderTest = reducers.SkillsReducer(initTialState().Skills,dummyAction)
        expect(SystemUnderTest).toEqual({
            names:dummyPayload.map(x=>x.name),
            ratings:dummyPayload.map(x=>x.rating)
          });
    });

    it('EducationsReducer with request action',()=>{

        const dummyAction = actions.EducationsActions.request();
        const SystemUnderTest = reducers.EducationsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });

    it('EducationsReducer with success action',()=>{
        const dummyPayload=[   {
            "id":1,
            "year":2008,
            "school":"EPITECH",
            "location":"Paris, France",
            "title":"Master Expert en Technologies de l'Information"   
        }];
        const dummyAction = actions.EducationsActions.success(dummyPayload);
        const SystemUnderTest = reducers.EducationsReducer(initTialState().Educations,dummyAction)
        expect(SystemUnderTest).toEqual(dummyPayload);
    });



    it('AboutsReducer with request action',()=>{

        const dummyAction = actions.AboutsActions.request();
        const SystemUnderTest = reducers.AboutsReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });


    it('AboutsReducer with success action',()=>{
        const dummyPayload={
            cover:[{
                "id": 0,
                "data": "Passionné d'informatique depuis ma plus tendre enfance, j'ai non seulement grandi avec les ordinateurs, mais aussi avec le WEB."
            }],
            interests:[{
                "id": 6,
                "value": "Les architectures micro services et server-less"
            }]
          };
        const dummyAction = actions.AboutsActions.success(dummyPayload);
        const SystemUnderTest = reducers.AboutsReducer(initTialState().Abouts,dummyAction)
        expect(SystemUnderTest).toEqual(dummyPayload);
    });

    it('ExperiencesReducer with request action',()=>{

        const dummyAction = actions.ExperiencesActions.request();
        const SystemUnderTest = reducers.ExperiencesReducer(initTialState(),dummyAction)
        expect(SystemUnderTest).toEqual(initTialState());
    });

    it('ExperiencesReducer with success action',()=>{
        const dummyPayload=[ {
            "id":5,
                "title": "Software Architect",
                "company": "Karib IT SAS",
                "start": "01/2018",
                "end": "maintenant",
                "contentClassName": "right",
                "description": "Création d’une société de R&D informatique dans le but d’effectuer de la prestation de service auprès d’entreprises locales et internationales",
                "stack": ".Net Core, Python, Django, VS Code, heroku, CI/CD, git, DDD, TDD, React, webpack, babel"
            }];
        const dummyAction = actions.ExperiencesActions.success(dummyPayload);
        const SystemUnderTest = reducers.ExperiencesReducer(initTialState().Experiences,dummyAction)
        expect(SystemUnderTest).toEqual(dummyPayload);
    });
})