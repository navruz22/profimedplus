const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
require('../../models/Users')
require('../../models/StatsionarClient/StatsionarClient')
require('../../models/StatsionarClient/StatsionarService')
require('../../models/StatsionarClient/StatsionarRoom')

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
        .populate("services")
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