const {
  Clinica,
  validateClinica,
} = require('../../models/DirectorAndClinica/Clinica')
const { Director } = require('../../models/DirectorAndClinica/Director')
const { User } = require('../../models/Users')

module.exports.register = async (req, res) => {
  try {
    const { error } = validateClinica(req.body)

    if (error) {
      return res.status(400).json({
        message: error.message,
      })
    }
    const {
      name,
      organitionName,
      image,
      phone1,
      phone2,
      phone3,
      bank,
      bankNumber,
      inn,
      address,
      orientation,
      director,
      mfo,
    } = req.body

    const clinica = await Clinica.find({ name })

    if (clinica.length > 0) {
      return res.status(400).json({
        message:
          "Diqqat! Klinika nomida biroz o'zgartirish qilib keyin kiriting.",
      })
    }

    const newClinica = new Clinica({
      name,
      organitionName,
      image,
      phone1,
      phone2,
      phone3,
      bank,
      bankNumber,
      inn,
      address,
      orientation,
      director,
      mfo,
    })

    await newClinica.save()

    res.status(201).send(newClinica)
  } catch (error) {
    res.status(501).json({ message: error })
  }
}

module.exports.getClinica = async (req, res) => {
  try {
    const { clinicaId } = req.body
    if (!clinicaId) {
      return res.status(400).json({
        message: "Diqqat! Clinica ID si ko'rsatilmagan.",
      })
    }

    const clinica = await Clinica.findById(clinicaId)

    if (!clinica) {
      return res.status(400).json({
        message: "Diqqat! Ko'rsatilgan klinika ro'yxatdan o'tkazilmagan.",
      })
    }

    res.status(200).send(clinica)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.getClinicaList = async (req, res) => {
  try {

    const clinicas = await Clinica.find()
      .lean()

    for (const clinica of clinicas) {
      const director = await Director.findOne({
        clinica: clinica._id
      }).lean()

      clinica.director = director;
    }

    res.status(200).json(clinicas)

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.update = async (req, res) => {
  try {
    const clinica = req.body;

    const clinic = await Clinica.findById(clinica._id);
    if (!clinic) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan klinika dasturda ro'yxatga olinmagan.",
      });
    }

    await Clinica.findByIdAndUpdate(clinica._id, { ...clinica })

    const resdata = await Clinica.findById(clinica._id);

    res.send(resdata)
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}