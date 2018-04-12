import * as actions from '../actions'
import * as types from '../ActionTypes'

describe("actions::Languages",()=>{
    it('fetchLanguagesRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_REQUEST
        const sut = actions.LanguageActions.request();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchLanguagesSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = actions.LanguageActions.success(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchLanguagesError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_ERROR;
        const expectedError = {dummyObject:true};
        const sut = actions.LanguageActions.fail(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Skills",()=>{
    it('fetchSkillsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_REQUEST
        const sut = actions.SkillsActions.request();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchSkillsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = actions.SkillsActions.success(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchSkillsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_ERROR;
        const expectedError = {dummyObject:true};
        const sut = actions.SkillsActions.fail(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Experiences",()=>{
    it('fetchExperiencesRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_REQUEST
        const sut = actions.ExperiencesActions.request();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchExperiencesSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = actions.ExperiencesActions.success(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchExperiencesError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_ERROR;
        const expectedError = {dummyObject:true};
        const sut = actions.ExperiencesActions.fail(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Experiences",()=>{
    it('fetchEducationsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_REQUEST
        const sut = actions.EducationsActions.request();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchEducationsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = actions.EducationsActions.success(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchEducationsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_ERROR;
        const expectedError = {dummyObject:true};
        const sut = actions.EducationsActions.fail(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Abouts",()=>{
    it('fetchEducationsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_REQUEST
        const sut = actions.AboutsActions.request();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchEducationsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = actions.AboutsActions.success(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchEducationsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_ERROR;
        const expectedError = {dummyObject:true};
        const sut = actions.AboutsActions.fail(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});