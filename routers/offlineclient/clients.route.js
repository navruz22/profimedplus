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
require('../../models/Cashier/OfflinePayment')
require('../../models/Users')

// register
module.exports.register = async (req, res) => {
    try {
        const {
            client,
            connector,
            services,
            products,
            counterdoctor,
            adver,
        } = req.body
        //=========================================================
        // CheckData
        const checkClient = validateOfflineClient(client).error
        if (checkClient) {
            return res.status(400).json({
                error: error.message,
            })
        }

        const checkOfflineConnector = validateOfflineConnector(connector).error

        if (checkOfflineConnector) {
            return res.status(400).json({
                error: error.message,
            })
        }

        //=========================================================
        // CreateClient
        const id =
            (await OfflineClient.find({ clinica: client.clinica })).length + 1000001

        const fullname = client.lastname + ' ' + client.firstname

        const newclient = new OfflineClient({ ...client, id, fullname })
        await newclient.save()

        //=========================================================
        // CreateOfflineConnector
        let probirka = 0
        if (connector.probirka) {
            probirka =
                (
                    await OfflineConnector.find({
                        clinica: connector.clinica,
                        probirka: { $ne: 0 },
                        createdAt: {
                            $gte: new Date(new Date().setUTCDate(0, 0, 0, 0)),
                        },
                    })
                ).length + 1
        }

        const newconnector = new OfflineConnector({
            ...connector,
            client: newclient._id,
            probirka,
        })
        await newconnector.save()

        newclient.connectors.push(newconnector._id)
        await newclient.save()

        //=========================================================
        // CreateServices
        let totalprice = 0
        for (const service of services) {
            const { error } = validateOfflineService(service)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: client.clinica,
                service: service.serviceid,
            })

            for (const productconnector of productconnectors) {
                const product = await Product.findById(productconnector.product)
                product.total = product.total - productconnector.pieces * service.pieces
                await product.save()
            }

            //=========================================================
            // TURN
            var turn = 0
            const clientservice = await OfflineService.findOne({
                clinica: service.clinica,
                client: newclient._id,
                department: service.department,
                createdAt: {
                    $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                },
            })

            if (clientservice) {
                turn = clientservice.turn
            } else {
                let turns = await OfflineService.find({
                    clinica: service.clinica,
                    department: service.department,
                    createdAt: {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                    },
                })
                    .sort({ client: 1 })
                    .select('client')

                turns.map((t, i) => {
                    if (i === 0) {
                        turn++
                    } else {
                        if (turns[i - 1].client.toString() !== t.client.toString()) {
                            turn++
                        }
                    }
                })

                turn++
            }

            //=========================================================
            // Create Service
            const serv = await Service.findById(service.serviceid)
                .populate('column', 'col1 col2 col3 col4 col5')
                .populate('tables', 'col1 col2 col3 col4 col5')
            const newservice = new OfflineService({
                ...service,
                service: {
                    _id: serv._id,
                    name: serv.name,
                    price: serv.price,
                    shortname: serv.shortname,
                    doctorProcient: serv.doctorProcient,
                    counterAgentProcient: serv.counterAgentProcient,
                    counterDoctorProcient: serv.counterDoctorProcient
                },
                counterdoctor: counterdoctor,
                client: newclient._id,
                connector: newconnector._id,
                turn,
                column: { ...serv.column },
                tables: [...JSON.parse(JSON.stringify(serv.tables))]
            })

            await newservice.save()

            totalprice += service.service.price * service.pieces

            newconnector.services.push(newservice._id)
            await newconnector.save()
        }

        // CreateProducts
        for (const product of products) {
            const { error } = validateOfflineProduct(product)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const produc = await Product.findById(product.productid)
            produc.total = produc.total - product.pieces
            await produc.save()

            const newproduct = new OfflineProduct({
                ...product,
                client: newclient._id,
                connector: newconnector._id,
            })

            await newproduct.save()
            totalprice += product.product.price * product.pieces

            newconnector.products.push(newproduct._id)
            await newconnector.save()
        }

        newconnector.totalprice = totalprice
        await newconnector.save()

        if (adver.adver) {
            const newadver = new OfflineAdver({
                client: newclient._id,
                connector: newconnector._id,
                ...adver,
            })

            await newadver.save()
        }

        const response = await OfflineConnector.findById(newconnector._id)
            .populate('client')
            .populate('services')
            .populate('products')

        res.status(201).send(response)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.add = async (req, res) => {
    try {
        const {
            client,
            connector,
            services,
            products,
            counterdoctor,
            adver,
        } = req.body

        const updateClient = await OfflineClient.findByIdAndUpdate(
            client._id,
            client,
        )

        const updateOfflineConnector = await OfflineConnector.findById(
            connector._id,
        )

        //=========================================================
        // CreateOfflineConnector
        let probirka = 0
        if (connector.probirka && !updateOfflineConnector.probirka) {
            probirka =
                (
                    await OfflineConnector.find({
                        clinica: client.clinica,
                        probirka: { $ne: 0 },
                        createdAt: {
                            $gte: new Date(new Date().setUTCDate(0, 0, 0, 0)),
                        },
                    })
                ).length + 1

            updateOfflineConnector.probirka = probirka
            await updateOfflineConnector.save()
        }

        //=========================================================
        // CreateServices
        let totalprice = 0
        for (const service of services) {
            const { error } = validateOfflineService(service)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: client.clinica,
                service: service.serviceid,
            })

            for (const productconnector of productconnectors) {
                const product = await Product.findById(productconnector.product)
                product.total = product.total - productconnector.pieces * service.pieces
                await product.save()
            }

            //=========================================================
            // TURN
            var turn = 0
            const clientservice = await OfflineService.findOne({
                clinica: service.clinica,
                client: client._id,
                department: service.department,
                createdAt: {
                    $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                },
            })

            if (clientservice) {
                turn = clientservice.turn
            } else {
                let turns = await OfflineService.find({
                    clinica: service.clinica,
                    department: service.department,
                    createdAt: {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                    },
                })
                    .sort({ client: 1 })
                    .select('client')

                turns.map((t, i) => {
                    if (i === 0) {
                        turn++
                    } else {
                        if (turns[i - 1].client.toString() !== t.client.toString()) {
                            turn++
                        }
                    }
                })

                turn++
            }

            //=========================================================
            //=========================================================
            // Create Service
            const serv = await Service.findById(service.serviceid)
                .populate('column', 'col1 col2 col3 col4 col5')
                .populate('tables', 'col1 col2 col3 col4 col5')
            const newservice = new OfflineService({
                ...service,
                service: {
                    _id: serv._id,
                    name: serv.name,
                    price: serv.price,
                    shortname: serv.shortname,
                    doctorProcient: serv.doctorProcient,
                    counterAgentProcient: serv.counterAgentProcient,
                    counterDoctorProcient: serv.counterDoctorProcient
                },
                counterdoctor: counterdoctor,
                client: client._id,
                connector: updateOfflineConnector._id,
                turn,
                column: { ...serv.column },
                tables: [...JSON.parse(JSON.stringify(serv.tables))]
            })
            await newservice.save()

            totalprice += service.service.price

            updateOfflineConnector.services.push(newservice._id)
        }

        // CreateProducts
        for (const product of products) {
            const { error } = validateOfflineProduct(product)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const produc = await Product.findById(product.productid)
            produc.total = produc.total - product.pieces
            await produc.save()

            const newproduct = new OfflineProduct({
                ...product,
                client: client._id,
                connector: updateOfflineConnector._id,
            })

            await newproduct.save()
            totalprice += product.product.price * product.pieces

            updateOfflineConnector.products.push(newproduct._id)
        }

        // if (counteragent.counterdoctor) {
        //     const oldcounteragent = await OfflineCounteragent.findOne({
        //         connector: connector._id,
        //     })

        //     if (oldcounteragent) {
        //         oldcounteragent.counteragent = counteragent.counteragent
        //         oldcounteragent.counterdoctor = counteragent.counterdoctor
        //         oldcounteragent.services = [...updateOfflineConnector.services]
        //         await oldcounteragent.save()
        //     } else {
        //         const newcounteragent = new OfflineCounteragent({
        //             client: client._id.toString(),
        //             connector: updateOfflineConnector._id.toString(),
        //             services: [...updateOfflineConnector.services],
        //             ...counteragent,
        //         })
        //         await newcounteragent.save()
        //     }
        // }

        if (adver.adver) {
            const oldadver = await OfflineAdver.findOne({
                connector: connector._id,
            })

            if (oldadver) {
                oldadver.adver = adver.adver
                await oldadver.save()
            } else {
                const newadver = new OfflineAdver({
                    client: client._id,
                    connector: updateOfflineConnector._id,
                    ...adver,
                })
                await newadver.save()
            }
        }

        updateOfflineConnector.totalprice =
            updateOfflineConnector.totalprice + totalprice
        await updateOfflineConnector.save()

        res.status(201).send({ message: "Xizmatlar ro'yxatga olindi" })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.addConnector = async (req, res) => {
    try {
        const {
            client,
            connector,
            services,
            products,
            counterdoctor,
            adver,
        } = req.body
        //=========================================================

        const checkOfflineConnector = validateOfflineConnector(connector).error

        if (checkOfflineConnector) {
            return res.status(400).json({
                error: error.message,
            })
        }

        //=========================================================
        // CreateOfflineConnector
        let probirka = 0
        if (connector.probirka) {
            probirka =
                (
                    await OfflineConnector.find({
                        clinica: connector.clinica,
                        probirka: { $ne: 0 },
                        createdAt: {
                            $gte: new Date(new Date().setUTCDate(0, 0, 0, 0)),
                        },
                    })
                ).length + 1
        }

        const newconnector = new OfflineConnector({
            ...connector,
            client: client._id,
            probirka,
        })
        await newconnector.save()


        const currentClient = await OfflineClient.findById(client._id)

        currentClient.connectors.push(newconnector._id)
        await currentClient.save()

        //=========================================================
        // CreateServices
        let totalprice = 0
        for (const service of services) {
            const { error } = validateOfflineService(service)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            //=========================================================
            // Product decrement
            const productconnectors = await ProductConnector.find({
                clinica: client.clinica,
                service: service.serviceid,
            })

            for (const productconnector of productconnectors) {
                const product = await Product.findById(productconnector.product)
                product.total = product.total - productconnector.pieces * service.pieces
                await product.save()
            }

            //=========================================================
            // TURN
            var turn = 0
            const clientservice = await OfflineService.findOne({
                clinica: service.clinica,
                client: client._id,
                department: service.department,
                createdAt: {
                    $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                },
            })

            if (clientservice) {
                turn = clientservice.turn
            } else {
                let turns = await OfflineService.find({
                    clinica: service.clinica,
                    department: service.department,
                    createdAt: {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                    },
                })
                    .sort({ client: 1 })
                    .select('client')

                turns.map((t, i) => {
                    if (i === 0) {
                        turn++
                    } else {
                        if (turns[i - 1].client.toString() !== t.client.toString()) {
                            turn++
                        }
                    }
                })

                turn++
            }

            //=========================================================
            // Create Service
            const serv = await Service.findById(service.serviceid)
                .populate('column', 'col1 col2 col3 col4 col5')
                .populate('tables', 'col1 col2 col3 col4 col5')
            const newservice = new OfflineService({
                ...service,
                service: {
                    _id: serv._id,
                    name: serv.name,
                    price: serv.price,
                    shortname: serv.shortname,
                    doctorProcient: serv.doctorProcient,
                    counterAgentProcient: serv.counterAgentProcient,
                    counterDoctorProcient: serv.counterDoctorProcient
                },
                counterdoctor: counterdoctor,
                client: client._id,
                connector: newconnector._id,
                turn,
                column: { ...serv.column },
                tables: [...JSON.parse(JSON.stringify(serv.tables))]
            })

            await newservice.save()

            totalprice += service.service.price * service.pieces

            newconnector.services.push(newservice._id)
            await newconnector.save()
        }

        // CreateProducts
        for (const product of products) {
            const { error } = validateOfflineProduct(product)

            if (error) {
                return res.status(400).json({
                    error: error.message,
                })
            }

            const produc = await Product.findById(product.productid)
            produc.total = produc.total - product.pieces
            await produc.save()

            const newproduct = new OfflineProduct({
                ...product,
                client: client._id,
                connector: newconnector._id,
            })

            await newproduct.save()
            totalprice += product.product.price * product.pieces

            newconnector.products.push(newproduct._id)
            await newconnector.save()
        }

        newconnector.totalprice = totalprice
        await newconnector.save()

        if (adver.adver) {
            const newadver = new OfflineAdver({
                client: client._id,
                connector: newconnector._id,
                ...adver,
            })

            await newadver.save()
        }

        const response = await OfflineConnector.findById(newconnector._id)
            .populate('client')
            .populate('services')
            .populate('products')

        res.status(201).send(response)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//Clients getall
module.exports.getAll = async (req, res) => {
    try {
        const { clinica, beginDay, endDay } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const connectors = await OfflineConnector.find({
            clinica,
            createdAt: {
                $gte: beginDay,
                $lt: endDay,
            },
        })
            .sort({ createdAt: -1 })
            .populate('client', '-createdAt -updatedAt -isArchive -__v')
            .populate('payments')
            .populate({
                path: 'services',
                select: "-updatedAt -isArchive -__v",
                populate: {
                    path: "serviceid",
                    select: "servicetype",
                    populate: {
                        path: "servicetype",
                        select: "name"
                    }
                }
            })
            .populate('products')

        res.status(200).send(connectors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

//Clients getall
module.exports.getAllReseption = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn, clientId } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        let connectors = null;

        if (clientborn) {
            connectors = await OfflineConnector.find({
                clinica
            })
                .select('probirka client services products createdAt totalprice')
                .populate('client', 'fullname firstname lastname fathername phone id gender born address')
                .populate('services', '_id service refuse turn pieces department accept column tables templates')
                .populate('products', '_id product pieces')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        }
        if (clientId) {
            connectors = await OfflineConnector.find({
                clinica
            })
                .select('probirka client services products createdAt totalprice')
                .populate('client', 'fullname firstname lastname fathername phone id gender born address')
                .populate('services', '_id service refuse turn pieces department accept')
                .populate('products', '_id product pieces')
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => String(connector.client.id).includes(clientId));
                })
        } else {
            connectors = await OfflineConnector.find({
                clinica,
                createdAt: {
                    $gte: beginDay,
                    $lt: endDay,
                },
            })
                .select('probirka client services products createdAt totalprice')
                .populate('client', 'fullname firstname lastname fathername phone id gender born address')
                .populate('services', '_id service turn refuse pieces department accept column tables templates')
                .populate('products', '_id product pieces')
                .sort({ _id: -1 })
        }

        res.status(200).send(connectors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// Update client
module.exports.update = async (req, res) => {
    try {
        const { client, connector, counteragent, adver } = req.body

        if (!client) {
            return res
                .status(404)
                .send({ message: "Foydalanuvchi ma'lumotlari topilmadi" })
        }
        const update = await OfflineClient.findByIdAndUpdate(client._id, client)

        const oldconnector = await OfflineConnector.findById(connector._id)

        if (counteragent.counterdoctor) {
            const oldcounteragent = await OfflineCounteragent.findOne({
                client: client._id,
                connector: connector._id,
            })

            if (oldcounteragent) {
                oldcounteragent.counteragent = counteragent.counteragent
                oldcounteragent.counterdoctor = counteragent.counterdoctor
                oldcounteragent.services = [...oldconnector.services]
                await oldcounteragent.save()
            } else {
                const newcounteragent = new OfflineCounteragent({
                    client: client._id.toString(),
                    connector: connector._id,
                    services: [...oldconnector.services],
                    ...counteragent,
                })
                await newcounteragent.save()
            }
        }

        if (adver.adver) {
            const oldadver = await OfflineAdver.findOne({
                client: client._id,
            })

            if (oldadver) {
                oldadver.adver = adver.adver
                await oldadver.save()
            } else {
                const newadver = new OfflineAdver({
                    client: client._id,
                    connector: connector._id,
                    ...adver,
                })
                await newadver.save()
            }
        }

        res.status(200).send(update)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

// End statsionar
module.exports.end = async (req, res) => {
    try {
        const { clinica, room } = req.body

        const clinic = await Clinica.findById(clinica)

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            })
        }

        const roomupdate = await StatsionarRoom.findByIdAndUpdate(room._id, {
            endday: new Date()
        })

        const roomm = await Room.findById(room.roomid)
        roomm.position = false
        roomm.save()

        res.status(200).send({ message: "Mijozning davolanish muddati muvaffaqqiyatli yakunlandi." })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


module.exports.getCounterDoctors = async (req, res) => {
    try {
        const { clinica } = req.body;
        console.log('work');
        const clinic = await Clinica.findById(clinica);
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const counterDoctors = await CounterDoctor.find({ clinica })
            .select('-__v -isArchive -updatedAt')
            .lean()

        res.status(200).json(counterDoctors)
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}

module.exports.getTurns = async (req, res) => {
    try {
        const { clinica } = req.body;

        const clinic = await Clinica.findById(clinica);
        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        const departments = await Department.find({
            clinica
        })
            .select("name room probirka")
            .populate('doctor', 'firstname lastname')
            .lean()

        for (const department of departments) {
            if (department.probirka) {
                const connectors = await OfflineConnector.find({
                    clinica,
                    department: department._id,
                    accept: true,
                    createdAt: {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                    }
                })
                    .lean()

                department.turn = connectors.length + 1;

            } else {
                const services = await OfflineService.find({
                    clinica,
                    department: department._id,
                    accept: true,
                    createdAt: {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                    }
                })
                    .sort({ turn: -1 })
                    .lean()

                department.turn = services[0] && (services[0].turn + 1) || 1;
            }
        }
        res.status(200).json(departments);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}