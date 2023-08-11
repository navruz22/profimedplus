const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const client = new Schema(
    {
        clinica: { type: Schema.Types.ObjectId, ref: 'Clinica' },
        isArchive: { type: Boolean, default: false },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        born: { type: Date },
        gender: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String },
        turn: { type: Number },
        id: { type: Number },
    },
    {
        timestamps: true,
    },
)

module.exports.AfterOperationClient = model('AfterOperationClient', client)