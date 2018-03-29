import * as action from '../actions'
import * as types from '../ActionTypes'

describe("actions::Languages",()=>{
    it('fetchLanguagesRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_REQUEST
        const sut = action.fetchLanguagesRequest();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchLanguagesSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = action.fetchLanguagesSucceded(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchLanguagesError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_LANGUAGES_ERROR;
        const expectedError = {dummyObject:true};
        const sut = action.fetchLanguagesError(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Skills",()=>{
    it('fetchSkillsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_REQUEST
        const sut = action.fetchSkillsRequest();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchSkillsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = action.fetchSkillsSucceded(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchSkillsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_SKILLS_ERROR;
        const expectedError = {dummyObject:true};
        const sut = action.fetchSkillsError(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Experiences",()=>{
    it('fetchExperiencesRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_REQUEST
        const sut = action.fetchExperiencesRequest();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchExperiencesSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = action.fetchExperiencesSucceded(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchExperiencesError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EXPERIENCES_ERROR;
        const expectedError = {dummyObject:true};
        const sut = action.fetchExperiencesError(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Experiences",()=>{
    it('fetchEducationsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_REQUEST
        const sut = action.fetchEducationsRequest();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchEducationsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = action.fetchEducationsSucceded(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchEducationsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_EDUCATION_ERROR;
        const expectedError = {dummyObject:true};
        const sut = action.fetchEducationsError(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});

describe("actions::Abouts",()=>{
    it('fetchEducationsRequest action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_REQUEST
        const sut = action.fetchAboutsRequest();
        expect(sut.type).toBe(expectedType)
    })

    it('fetchEducationsSucceded action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_SUCCESS;
        const expectedPayload = {dummyObject:true};
        const sut = action.fetchAboutsSucceded(expectedPayload);
        expect(sut.type).toBe(expectedType);
        expect(sut.payload).toBe(expectedPayload);
    })

    it('fetchEducationsError action creator behaves as expected',()=>{
        const expectedType = types.FETCH_ABOUTS_ERROR;
        const expectedError = {dummyObject:true};
        const sut = action.fetchAboutsError(expectedError);
        expect(sut.type).toBe(expectedType);
        expect(sut.error).toBe(expectedError);
    })

});