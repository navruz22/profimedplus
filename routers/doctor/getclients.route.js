const { Service } = require("../../models/Services/Service");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const {
  OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { Template } = require("../../models/Templates/Template");

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
      department,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
      clinica,
    })
      .select("service serviceid accept column tables turn connector client files")
      .populate("connector", "probirka createdAt accept")
      .populate("client", "lastname firstname born id phone address")
      .populate("service", "price")
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

module.exports.updateservices = async (req, res) => {
  try {
    const { clinica, services } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    let updates = [];
    for (const service of services) {
      const update = await OfflineService(service._id, service);
      updates.push(update);
    }
    res.status(200).send(updates);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

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