const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineConnector } = require("../../models/OfflineClient/OfflineConnector");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { Service } = require("../../models/Services/Service");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { Template } = require("../../models/Templates/Template");
const { ServiceType } = require("../../models/Services/ServiceType");
const { StatsionarService } = require("../../models/StatsionarClient/StatsionarService");
const { StatsionarConnector } = require("../../models/StatsionarClient/StatsionarConnector");
require("../../models/StatsionarClient/StatsionarClient");
require("../../models/StatsionarClient/StatsionarConnector");
require('../../models/Services/ServiceType')
require('../../models/StatsionarClient/StatsionarDaily')
require('../../models/Services/Department')


module.exports.approve = async (req, res) => {
    try {
        const { connector } = req.body;

        const offlineConnector = await OfflineConnector.findById(connector);
        if (offlineConnector) {
            offlineConnector.accept = true;
            offlineConnector.save()
        } else {
            const statsionarconnector = await StatsionarConnector.findById(connector);
            statsionarconnector.accept = true;
            statsionarconnector.save()
        }


        res.status(200).json({ message: 'Mijoz qon oldi!' })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getLabClients = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        let clients = [];
        let client = {
            client: {},
            connector: {},
            services: [],
        };

        let services = null;

        let offline = []
        let statsionar = []
        if (clientborn) {
            offline = await OfflineService.find({
                clinica,
            })
                .select("service serviceid accept refuse column tables turn connector client files department")
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica",
                    populate: {
                        path: "clinica",
                        select: "name phone1 image"
                    }
                })
                .populate("client", "lastname firstname born id phone address")
                .populate("service", "price")
                .populate({
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                })
                .populate('department', 'probirka')
                .populate("templates", "name template")
                .lean()
                .then(services => {
                    return services.filter(service => {
                        return service.connector.accept && new Date(new Date(service.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                            && service.department.probirka && !service.refuse
                    })
                })
            statsionar = await StatsionarService.find({
                clinica,
            })
                .select("service serviceid accept refuse column tables turn connector client files department")
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica dailys",
                    populate: {
                        path: "clinica",
                        select: "name phone1 image"
                    }
                })
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica dailys",
                    populate: {
                        path: "dailys",
                        select: "probirka"
                    }
                })
                .populate("client", "lastname firstname born id phone address")
                .populate("service", "price")
                .populate({
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                })
                .populate('department', 'probirka')
                .populate("templates", "name template")
                .lean()
                .then(services => {
                    return services.filter(service => {
                        return service.connector.accept && new Date(new Date(service.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                            && service.department.probirka && !service.refuse
                    })
                })
        } else {
            offline = await OfflineService.find({
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
                clinica,
            })
                .select("service serviceid accept refuse column tables turn connector client files department")
                .populate("client", "lastname firstname born id phone address")
                .populate("service", "price")
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica",
                    populate: {
                        path: "clinica",
                        select: "name phone1 image"
                    }
                })
                .populate({
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                })
                .populate('department', 'probirka')
                .populate("templates", "name template")
                .lean()
                .then(services => {
                    return services.filter(service => service.connector.accept && service.department.probirka && !service.refuse)
                })
            statsionar = await StatsionarService.find({
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
                clinica,
            })
                .select("service serviceid accept column tables turn connector client files department")
                .populate("client", "lastname firstname born id phone address")
                .populate("service", "price")
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica dailys",
                    populate: {
                        path: "clinica",
                        select: "name phone1 image"
                    }
                })
                .populate({
                    path: "connector",
                    select: "probirka createdAt accept clinica dailys",
                    populate: {
                        path: "dailys",
                        select: "probirka"
                    }
                })
                .populate({
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                })
                .populate('department', 'probirka')
                .populate("templates", "name template")
                .lean()
                .then(services => {
                    return services.filter(service => service.connector.accept && service.department.probirka && !service.refuse)
                })
        }

        services = [...offline, ...statsionar]

        if (services.length > 0) {
            // for (const i in services) {
            //     if (i == 0) {
            //         client.client = services[i].client;
            //         client.connector = services[i].connector;
            //         client.services.push(services[i]);
            //     } else {
            //         if (services[i - 1].client._id === services[i].client._id) {
            //             client.services.push(services[i]);
            //         } else {
            //             clients.push(client);
            //             client = {
            //                 client: {},
            //                 connector: {},
            //                 services: [],
            //             };
            //             client.client = services[i].client;
            //             client.connector = services[i].connector;
            //             client.services.push(services[i]);
            //         }
            //     }
            // }

            let connectorsId = []
            for (const service of services) {
                const check = connectorsId.includes(String(service.connector._id));
                if (!check) {
                    clients.push({
                        client: service.client,
                        connector: service.connector,
                        services: [service],
                    })
                    connectorsId.push(String(service.connector._id));
                } else {
                    const index = clients.findIndex(c => String(c.connector._id) === String(service.connector._id))
                    clients[index].services.push(service)
                }
            }
        }

        res.status(200).send(clients);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.getLabClientsForApprove = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        let clients = [];
        let client = {
            client: {},
            connector: {},
            services: [],
        };

        let services = []

        let offline = await OfflineService.find({
            createdAt: {
                $gte: beginDay,
                $lt: endDay,
            },
            clinica,
        })
            .select("service serviceid accept column tables turn connector client files department")
            .populate("client", "lastname firstname born id phone address")
            .populate("service", "price")
            .populate({
                path: "connector",
                select: "probirka createdAt accept clinica",
                populate: {
                    path: "clinica",
                    select: "name phone1 image"
                }
            })
            .populate({
                path: "serviceid",
                select: "servicetype",
                populate: {
                    path: "servicetype",
                    select: "name"
                }
            })
            .populate('department', 'probirka')
            .populate("templates", "name template")
            .lean()
            .then(services => {
                return services.filter(service => service.department.probirka)
            })
        let statsionar = await StatsionarService.find({
            createdAt: {
                $gte: beginDay,
                $lt: endDay,
            },
            clinica,
        })
            .select("service serviceid accept column tables turn connector client files department")
            .populate("client", "lastname firstname born id phone address")
            .populate("service", "price")
            .populate({
                path: "connector",
                select: "probirka createdAt accept clinica",
                populate: {
                    path: "clinica",
                    select: "name phone1 image"
                }
            })
            .populate({
                path: "serviceid",
                select: "servicetype",
                populate: {
                    path: "servicetype",
                    select: "name"
                }
            })
            .populate('department', 'probirka')
            .populate("templates", "name template")
            .lean()
            .then(services => {
                return services.filter(service => service.department.probirka)
            })

        services = [...offline, ...statsionar]

        if (services.length > 0) {
            for (const i in services) {
                if (i == 0) {
                    client.client = services[i].client;
                    client.connector = services[i].connector;
                    client.services.push(services[i]);
                } else {
                    if (services[i - 1].client._id === services[i].client._id) {
                        client.services.push(services[i]);
                    } else {
                        clients.push(client);
                        client = {
                            client: {},
                            connector: {},
                            services: [],
                        };
                        client.client = services[i].client;
                        client.connector = services[i].connector;
                        client.services.push(services[i]);
                    }
                }
            }
        }

        clients.push(client);
        res.status(200).send(clients);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.adoptLabClient = async (req, res) => {
    try {
        const { services } = req.body;

        for (const service of services) {
            const offlineService = await OfflineService.findById(service._id)
            offlineService.files = service.files;
            offlineService.tables = service.tables;
            offlineService.accept = service.accept;
            offlineService.save()
        }

        res.status(200).json({ message: "Mijoz qabul qilindi!" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getServicesType = async (req, res) => {
    try {
        const { clinica } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const servicetypes = await ServiceType.find({
            clinica,
        }).select('-__v -updatedAt -isArchive')
            .populate('services', "-__v -updatedAt -isArchive")
            .populate('department', 'probirka')
            .lean()
            .then(servicetypes => servicetypes.filter(s => s.department.probirka))

        res.status(200).json(servicetypes)

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.getClientsForResult = async (req, res) => {
    try {
        const { clinica, servicetype } = req.body;

        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const services = await OfflineService.find({
            clinica,
            createdAt: {
                $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setDate(new Date().getDate() + 1))
            }
        })
            .select("service serviceid accept refuse column tables turn connector client files")
            .populate("connector", "probirka createdAt accept")
            .populate("client", "lastname firstname born id phone address")
            .populate({
                path: "serviceid",
                select: "servicetype",
                match: { servicetype: servicetype }
            })
            .lean()
            .then(services => services.filter(service => service.serviceid && !service.refuse))


        let clients = [];
        let client = {
            client: {},
            connector: {},
            services: [],
        };
        if (services.length > 0) {
            for (const i in services) {
                if (i == 0) {
                    client.client = services[i].client;
                    client.connector = services[i].connector;
                    client.services.push(services[i]);
                } else {
                    if (services[i - 1].client._id === services[i].client._id) {
                        client.services.push(services[i]);
                    } else {
                        clients.push(client);
                        client = {
                            client: {},
                            connector: {},
                            services: [],
                        };
                        client.client = services[i].client;
                        client.connector = services[i].connector;
                        client.services.push(services[i]);
                    }
                }
            }
        }

        clients.push(client);
        res.status(200).send(clients);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.saveConclusion = async (req, res) => {
    try {
        const { services } = req.body;

        for (const service of services) {
            const offlineService = await OfflineService.findById(service._id)
            offlineService.tables = service.tables;
            offlineService.accept = service.accept;
            offlineService.save()
        }

        res.status(200).json({ message: "Xulosa berildi!" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

