const Joi = require('joi');

let BaseModel = Joi.object().keys({
    name: joi.string().required(),
    uuid: joi.string().required(),
    active: Joi.boolean().required(),
});

let models = {
    RealmModel: BaseModel.keys({}),
    InstituteModel: BaseModel.keys({}),
    MediumModel: BaseModel.keys({}),
    ProgramModel: BaseModel.keys({}),
    CourseModel: BaseModel.keys({}),
    ClassModel: BaseModel.keys({}),
    SubjectModel: BaseModel.keys({}),
    BookModel: BaseModel.keys({}),
    RootModel: BaseModel.keys({}),
}

module.exports = models;