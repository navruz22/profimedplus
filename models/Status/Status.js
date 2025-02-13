const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const status = new Schema(
    {
        name: { type: String, required: true },
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
        isArchive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
)

function validateStatus(adver) {
    const schema = Joi.object({
        name: Joi.string().required(),
        clinica: Joi.string().required(),
    })

    return schema.validate(adver)
}

module.exports.validateStatus = validateStatus
module.exports.Status = model('Status', status)
