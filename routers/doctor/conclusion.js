const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { StatsionarClient } = require("../../models/StatsionarClient/StatsionarClient");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
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

// module.exports.saveClientCard = async (req, res) => {
//     try {
//         const {client} = req.body;

//         const statsionarclient = await StatsionarClient.findById(client._id);
        
//         co

//     } catch (error) {
        
//     }
// }