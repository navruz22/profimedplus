const bot = require("./bot");
const config = require("config")

module.exports.sendData = async (req, res) => {
    try {
        const {firstname, lastname, room} = req.body;

        bot.sendMessage(config.get("tgChannelIdForOrder"), 
        `${lastname + ' ' + firstname}
        Кабинет: ${room}`);

          res.status(200).send({ message: "success"});

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
    }
}