const { Service } = require("../../models/Services/Service");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const {
  OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineService, validateOfflineService } = require("../../models/OfflineClient/OfflineService");
const { Template } = require("../../models/Templates/Template");
const { ProductConnector } = require("../../models/Warehouse/ProductConnector");
const { Product } = require("../../models/Warehouse/Product");
const { TableColumn } = require("../../models/Services/TableColumn");
const { ServiceTable } = require("../../models/Services/ServiceTable");
const { ServiceType } = require("../../models/Services/ServiceType");
const { StatsionarService } = require("../../models/StatsionarClient/StatsionarService");
require('../../models/StatsionarClient/StatsionarConnector')
require('../../models/StatsionarClient/StatsionarClient')
require('../../models/Services/Department')

//Clients getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica, beginDay, endDay, department } = req.body;

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

    const services = await OfflineService.find({
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
    .then(services => services.filter(service => (String(service.department._id) === String(department) || service.department.probirka)))


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
};

module.exports.getStatsionarAll = async (req, res) => {
  try {
    const { clinica, beginDay, endDay, department } = req.body;

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

    const services = await StatsionarService.find({
      department,
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
};


module.exports.gettemplates = async (req, res) => {
  try {
    const { clinica, doctor } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const templates = await Template.find({
      doctor,
      clinica,
    }).select("name template");

    res.status(200).send(templates);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.addservices = async (req, res) => {
  try {
    const { clinica, services, connector, client } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const updateOfflineConnector = await OfflineConnector.findById(
      connector._id,
    )

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

    updateOfflineConnector.totalprice =
      updateOfflineConnector.totalprice + totalprice
    await updateOfflineConnector.save()

    res.status(200).send({ message: "Xizmatlar ro'yxatga olindi" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getServices = async (req, res) => {
  try {
    const { clinica, department } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }


    const services = await Service.find({
      clinica,
      department,
    })
      .select('-__v -updatedAt -isArchive')
      .lean()

    res.status(200).json(services)

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
}

module.exports.adoptClient = async (req, res) => {
  try {
    const { services, connector } = req.body;

    for (const service of services) {
      const offlineService = await OfflineService.findById(service._id)
      offlineService.templates = service.templates;
      offlineService.files = service.files;
      offlineService.accept = true;
      if (service.tables.length > 0) {
        offlineService.tables = service.tables;
      }
      offlineService.save()
    }

    const offlineConnector = await OfflineConnector.findById(connector)
    offlineConnector.accept = true;
    offlineConnector.save()

    res.status(200).json({ message: "Mijoz qabul qilindi!" })
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}