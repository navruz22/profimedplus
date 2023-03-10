const { TableColumn, validateTableColumn } = require("../../models/Services/TableColumn");
const { Service } = require("../../models/Services/Service");
const { ServiceTable, validateServiceTable } = require("../../models/Services/ServiceTable");
const { ObjectId } = require("mongodb");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
module.exports.column = async (req, res) => {
    try {
        const { column } = req.body
        if (column._id) {
            const update = await TableColumn.findByIdAndUpdate(column._id, { ...column })

            const offlineservices = await OfflineService.find({
                serviceid: column.service,
                accept: false
            })

            for (const s of offlineservices) {
                s.column = { ...column }
                await s.save()
            }

            return res.status(200).send(column)
        } else {
            const newColumn = new TableColumn({ ...column })
            await newColumn.save()

            const update = await Service.findByIdAndUpdate(column.service, {
                column: newColumn._id
            })

            const offlineservices = await OfflineService.find({
                serviceid: column.service,
                accept: false
            })

            for (const s of offlineservices) {
                s.column = { ...newColumn }
                await s.save()
            }

            return res.status(200).send(newColumn)

        }

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.columndelete = async (req, res) => {
    try {
        const { column } = req.body
        const deleteColumn = await TableColumn.findByIdAndDelete(column._id)

        const deleteAllTables = await ServiceTable.find({ service: column.service }).select('_id')

        for (const deleteAllTable of deleteAllTables) {
            await TableColumn.findByIdAndDelete(deleteAllTable._id)
        }

        const clearService = await Service.findByIdAndUpdate(column.service, {
            tables: []
        })

        return res.status(200).send(column)
    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.table = async (req, res) => {
    try {
        const { table } = req.body
        if (table._id) {
            const update = await ServiceTable.findByIdAndUpdate(table._id, { ...table })

            return res.status(200).send(update)
        } else {
            const newTable = new ServiceTable({ ...table })
            await newTable.save()
            const update = await Service.findByIdAndUpdate(table.service, {
                $push: {
                    tables: new ObjectId(newTable._id),
                }
            })

            return res.status(200).send(newTable)

        }

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.updateTable = async (req, res) => {
    try {
        const { tables, service } = req.body;

        const responseData = [];
        for (const table of tables) {
            const update = await ServiceTable.findByIdAndUpdate(table._id, { ...table })
            responseData.push(update)
        }

        const offlineservices = await OfflineService.find({
            serviceid: service,
            accept: false
        })

        for (const s of offlineservices) {
            s.tables = [...tables]
            await s.save()
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}

module.exports.tabledelete = async (req, res) => {
    try {
        const { table } = req.body
        const deleteTable = await ServiceTable.findByIdAndDelete(table._id)

        const clearService = await Service.findByIdAndUpdate(table.service, {
            $pull: {
                tables: new ObjectId(table._id),
            }
        })

        return res.status(200).send(clearService)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}


module.exports.createall = async (req, res) => {
    try {
        const { tables, clinica, doctor, service } = req.body
        let tabless = []
        for (const table of tables) {
            const newTable = new ServiceTable({ ...table, clinica, doctor, service })
            await newTable.save()
            const update = await Service.findByIdAndUpdate(service, {
                $push: {
                    tables: new ObjectId(newTable._id),
                }
            })
            tabless.push(newTable)
        }

        const offlineservices = await OfflineService.find({
            serviceid: service,
            accept: false
        })

        for (const s of offlineservices) {
            s.tables = [...tables]
            await s.save()
        }


        return res.status(200).send(tabless)

    } catch (error) {
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}