const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { StatsionarClient } = require("../../models/StatsionarClient/StatsionarClient");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
const { ConclusionTemp } = require("../../models/Templates/ConclusionTemp");
require('../../models/Users')
require('../../models/StatsionarClient/StatsionarService')
require('../../models/StatsionarClient/StatsionarRoom')
require('../../models/Services/Department')
require('../../models/Services/Service')
require('../../models/Services/ServiceType')

module.exports.getClientInfo = async (req, res) => {
    try {
        const { connector, clinica } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const clientconnector = await StatsionarConnector.findById(connector)
        .select('-__v -updatedAt -isArchive')
        .populate({
            path: "services",
            select: "-__v -isArchive -updatedAt",
            populate: {
                path: "department",
                select: "probirka"
            }
        })
        .populate({
            path: "services",
            select: "-__v -isArchive -updatedAt",
            populate: {
                path: "serviceid",
                select: "servicetype",
                populate: {
                    path: "servicetype",
                    select: "name",
                }
            }
        })
        .populate('doctor')
        .populate('client')
        .populate('room')
        .populate('clinica')
        .lean()
        console.log(clientconnector);
        res.status(200).json(clientconnector)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.save = async (req, res) => {
    try {
        const {client} = req.body;

        await StatsionarClient.findByIdAndUpdate(client._id, {
            ...client
        })

        res.status(200).json({message: "Mijoz saqlandi!"})
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}


module.exports.createTemp = async (req, res) => {
    try {
        const {id, name, clinica, template} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        if (id) {
            await ConclusionTemp.findByIdAndUpdate(id, {
                name,
                template,
                clinica
            })
        } else {
            const newTemp = new ConclusionTemp({
                name,
                template,
                clinica
            })
            await newTemp.save()
        }

        res.status(200).json({message: "Shablon yaratildi!"})

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.getTemps = async (req, res) => {
    try {
        const {clinica} = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const temps = await ConclusionTemp.find({
            clinica,
        })

        res.status(200).json(temps)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const {id} = req.body;

        await ConclusionTemp.findByIdAndDelete(id);

        res.status(200).json({message: "Shablon yaratildi!"})

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}
