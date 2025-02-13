const { Status, validateStatus } = require('../../models/Status/Status')
const { Product } = require('../../models/Warehouse/Product')
const { Clinica } = require('../../models/DirectorAndClinica/Clinica')
const { Service } = require('../../models/Services/Service')
const { ProductConnector } = require('../../models/Warehouse/ProductConnector')
const {
    OfflineClient,
    validateOfflineClient,
} = require('../../models/OfflineClient/OfflineClient')
const {
    OfflineProduct,
    validateOfflineProduct,
} = require('../../models/OfflineClient/OfflineProduct')
const {
    OfflineService,
    validateOfflineService,
} = require('../../models/OfflineClient/OfflineService')
const {
    OfflineConnector,
    validateOfflineConnector,
} = require('../../models/OfflineClient/OfflineConnector')
const {
    OfflineCounteragent,
} = require('../../models/OfflineClient/OfflineCounteragent')
const { OfflineAdver } = require('../../models/OfflineClient/OfflineAdver')
const { StatsionarRoom } = require("../../models/StatsionarClient/StatsionarRoom");
const { Room } = require("../../models/Rooms/Room");
const { TableColumn } = require("../../models/Services/TableColumn");
const { ServiceTable } = require("../../models/Services/ServiceTable");
const { ServiceType } = require("../../models/Services/ServiceType");
const { CounterDoctor } = require('../../models/CounterDoctor/CounterDoctor')
const { Department } = require('../../models/Services/Department')
const { AfterOperationClient } = require('../../models/OfflineClient/AfterOperationClient')
require('../../models/Cashier/OfflinePayment')
require('../../models/Users')

//status register
module.exports.registerAll = async (req, res) => {
    try {
        const statuses = req.body
        const all = []
        for (const d of statuses) {
            const { error } = validateStatus(d)
            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const { name, clinica } = d

            const clinic = await Clinica.findOne({ name: clinica })

            if (!clinic) {
                return res.status(400).json({
                    message: "Diqqat! Klinika ma'lumotlari topilmadi.",
                })
            }

            const status = await Status.findOne({
                clinica: clinic._id,
                name,
            })

            if (status) {
                return res.status(400).json({
                    message: `Diqqat! ${name} reklamasi avval yaratilgan.`,
                })
            }

            const newStatus = new Status({
                name,
                clinica: clinic._id,
            })
            await newStatus.save()
            all.push(newStatus)
        }

        res.send(all)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status registerstatus
module.exports.register = async (req, res) => {
    try {
        const { error } = validateStatus(req.body)
        if (error) {
            return res.status(400).json({
                error: error.message,
            })
        }

        const { name, clinica } = req.body

        const status = await Status.findOne({
            clinica,
            name,
        })

        if (status) {
            return res.status(400).json({
                message: 'Diqqat! Ushbu reklama avval yaratilgan.',
            })
        }

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const newStatus = new Status({
            name,
            clinica,
        })
        await newStatus.save()

        res.send(newStatus)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status update
module.exports.update = async (req, res) => {
    try {
        const { name, clinica } = req.body

        const status = await Status.findById(req.body._id)

        if (!status) {
            return res.status(400).json({
                message: 'Diqqat! Ushbu reklama topilmadi.',
            })
        }

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        status.name = name
        await Status.save()

        res.send(status)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status getall
module.exports.getAll = async (req, res) => {
    try {
        const { clinica } = req.body
        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const s = await Status.find({
            clinica,
        })
            .select('-__v -updatedAt -isArchive')
            .lean()
        const statuses = []

        for (const status of s) {
            const clients = await OfflineConnector.find({
                status: status._id
            }).lean().count()
            // console.log(clients);
            statuses.push({
                ...status,
                clients: clients
            })
        }

        res.send(statuses)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getStatusClients = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, status } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const connectors = await OfflineConnector.find({
            clinica,
            status,
            createdAt: {
                $gte: beginDay,
                $lte: endDay,
            },
        })
            .sort({ createdAt: -1 })
            .select('-__v -updatedAt -isArchive')
            .populate('clinica', 'name phone1 image')
            .populate("status", "name")
            .populate("client")
            .populate({
                path: "services",
                select: "service serviceid accept refuse column tables turn connector client files department",
                populate: {
                    path: "service",
                    select: "price"
                }
            })
            .populate({
                path: "services",
                select: "service serviceid accept refuse column tables turn connector client files department",
                populate: {
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                }
            })
            .populate({
                path: "services",
                select: "service serviceid accept refuse column tables turn connector client files department",
                populate: {
                    path: "templates",
                    select: "name template",
                }
            })
            .populate({
                path: "services",
                select: "service serviceid accept refuse column tables turn connector client files department",
                populate: {
                    path: 'department',
                    select: "probirka"
                }
            })
            .populate('payments')
            .lean()

        res.status(200).send(connectors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status get
module.exports.get = async (req, res) => {
    try {
        const { clinica, _id } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const status = await Status.findById(_id)

        if (!status) {
            return res.status(400).json({
                message: "Diqqat! Bo'lim topilmadi.",
            })
        }

        res.send(status)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status delete
module.exports.delete = async (req, res) => {
    try {
        const { _id, clinica } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const status = await Status.findByIdAndDelete(_id)

        res.send(status)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//status deleteall
module.exports.deleteAll = async (req, res) => {
    try {
        const { clinica } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const statuses = await Status.find({
            clinica,
        })
        // .select("_id");
        for (const status of statuses) {
            const del = await Status.findByIdAndDelete(status)
        }

        res.send(statuses)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}
