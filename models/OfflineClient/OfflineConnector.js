const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const connector = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
        isArchive: { type: Boolean, default: false },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'OfflineClient',
            required: true,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OfflineService',
                required: true,
            },
        ],
        products: [{ type: Schema.Types.ObjectId, ref: 'OfflineProduct' }],
        probirka: { type: Number, default: 0 },
        accept: { type: Boolean, default: false },
        totalprice: { type: Number },
        payments: [{ type: Schema.Types.ObjectId, ref: 'OfflinePayment' }],
        discount: { type: Schema.Types.ObjectId, ref: 'OfflineDiscount' },
        step: {type: Boolean},
        stepDate: {type: Date},
        comment: {type: String},
        isBooking: {type: Boolean, default: false},
        stepAccess: {type: Boolean, default: false}
    },
    {
        timestamps: true,
    },
)

function validateOfflineConnector(connector) {
    const schema = Joi.object({
        clinica: Joi.string().required(),
        client: Joi.string(),
        services: Joi.string(),
        products: Joi.string(),
        probirka: Joi.number(),
        accept: Joi.boolean(),
        totalprice: Joi.number(),
        step: Joi.boolean().optional(),
        stepDate: Joi.date().optional(),
        isBooking: Joi.boolean(),
        comment: Joi.string().optional(),
        stepAccess: Joi.boolean()
    })

    return schema.validate(connector)
}

module.exports.validateOfflineConnector = validateOfflineConnector
module.exports.OfflineConnector = model('OfflineConnector', connector)
