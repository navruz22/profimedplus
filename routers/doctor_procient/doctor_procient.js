const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const {
    OfflineService
} = require('../../models/OfflineClient/OfflineService');
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
const { User } = require("../../models/Users");
require('../../models/Services/Department')
require("../../models/Users");
require('../../models/OfflineClient/OfflineClient')
require('../../models/StatsionarClient/StatsionarRoom')
require('../../models/StatsionarClient/StatsionarClient')

module.exports.getDocotors = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }


        const doctors = await User.find({
            clinica,
        })
            .select('firstname lastname specialty type')
            .populate('specialty', 'name')
            .lean()
            .then(doctors => doctors.filter(doctor => {
                if (doctor.type === 'Laborotory' || doctor.type === 'Doctor') {
                    return doctor.specialty;
                }
            }))


        for (const doctor of doctors) {
            const offlineservices = await OfflineService.find({
                clinica, department: doctor.specialty._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay
                }
            })
                .select('service pieces')
                .lean()

            doctor.total = offlineservices.reduce((prev, el) => prev + (el.pieces * el.service.price), 0)
            doctor.profit = offlineservices.reduce((prev, el) => {
                const procient = el.service.doctorProcient;
                const totalprice = el.pieces * el.service.price;
                if (procient <= 100 && procient > 0) {
                    prev += ((totalprice / 100) * procient);
                }
                if (procient > 100) {
                    prev += procient
                }
                return prev;
            }, 0)
        }


        res.status(200).json(doctors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.getStatsionar = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const doctors = await User.find({
            clinica,
        })
            .select('firstname lastname specialty type')
            .populate('specialty', 'name')
            .lean()
            .then(doctors => doctors.filter(doctor => {
                if (doctor.type === 'Laborotory' || doctor.type === 'Doctor') {
                    return doctor.specialty;
                }
            }))

        for (const doctor of doctors) {
            const connectors = await StatsionarConnector.find({
                clinica, doctor: doctor._id,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay
                }
            })
                .populate('room')
                .lean()

            doctor.total = connectors.reduce((prev, connector) => {
                const sum = Math.round(
                    Math.abs(
                        ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                            -
                            new Date(connector.room.beginday).getTime())
                        /
                        (24 * 60 * 60 * 1000)
                    )
                ) * connector.room.room.price;
                prev += sum;
                return prev;
            }, 0)
            doctor.profit = connectors.reduce((prev, connector) => {
                const procient = connector.room.room.doctorProcient;
                const totalprice = Math.round(
                    Math.abs(
                        ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                            -
                            new Date(connector.room.beginday).getTime())
                        /
                        (24 * 60 * 60 * 1000)
                    )
                ) * connector.room.room.price

                if (procient <= 100 && procient > 0) {
                    prev += ((totalprice / 100) * procient);
                }
                if (procient > 100) {
                    prev += procient
                }
                return prev;
            }, 0)
        }

        res.status(200).json(doctors)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.get = async (req, res) => {
    try {
        const { department, beginDay, endDay } = req.body;

        const offlineservices = await OfflineService.find({
            department, createdAt: {
                $gte: beginDay,
                $lte: endDay
            }
        })
            .select('service pieces department')
            .populate('client', 'firstname lastname')
            .populate({
                path: 'department',
                select: "doctor",
                populate: {
                    path: "doctor",
                    select: "firstname lastname"
                }
            })
            .lean()

        for (const service of offlineservices) {
            const procient = service.service.doctorProcient;
            const totalprice = service.service.price * service.pieces;

            service.totalprice = totalprice;
            service.doctor_profit = 0;

            if (procient <= 100 && procient > 0) {
                service.doctor_profit = ((totalprice / 100) * procient);
            }
            if (procient > 100) {
                service.doctor_profit = procient
            }
        }

        res.status(200).json(offlineservices)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}


module.exports.getDocotorsStatsionar = async (req, res) => {
    try {
        const { doctor } = req.body;

        const connectors = await StatsionarConnector.find({
            doctor
        })
            .select('-__v -isArchive -updatedAt')
            .populate('room')
            .populate('client')
            .lean()

        for (const connector of connectors) {
            const procient = connector.room.room.doctorProcient
            const days = Math.round(
                Math.abs(
                    ((connector.room.endday ? new Date(connector.room.endday).getTime() : new Date().getTime())
                        -
                        new Date(connector.room.beginday).getTime())
                    /
                    (24 * 60 * 60 * 1000)
                )
            )

            const total = days * connector.room.room.price;

            let profit = 0
            if (procient <= 100 && procient > 0) {
                profit += ((total / 100) * procient);
            }
            if (procient > 100) {
                profit += procient
            }

            connector.days = days;
            connector.total = total;
            connector.profit = profit;
        }

        res.status(200).json(connectors)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}