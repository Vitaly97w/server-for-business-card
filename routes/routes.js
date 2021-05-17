const { ObjectId } = require('bson')
const { Router } = require('express')
const User = require('../models/users')
const usersWelcome = require('../models/usersWelcome')
const userWelcome = require('../models/usersWelcome')
const userAbout = require('../models/usersAbout')
const userPortfolio = require('../models/userPortfolioCards')
const userPortfolioCards = require('../models/userPortfolioCards')
const fs = require('fs')
const { mkdir } = require('fs')
const usersAbout = require('../models/usersAbout')
const userContact = require('../models/userContact')
// const multer = require('multer')
const router = Router()
// const upload = multer({
//   dest: path.join(__dirname, 'uploads/'),
// })
//регистрация
router.post('/registration', async (req, res) => {
  //Проверяем есть ли пользователь в БД
  const userSearch = await User.find({ email: req.body.email })
  if (userSearch.length > 0) {
    //Если да, то отправляем ошибку
    res.send({
      exist: true,
    })
  } else {
    //Иначе, регистрируем
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      token: '',
    })

    await user.save()
    res.send({
      exist: false,
    })
  }
})
//авторизация
router.post('/enter', async (req, res) => {
  //Ищем пользователя
  const userSearch = await User.find({ email: req.body.email })
  if (userSearch.length == 0) {
    //Есди нет, то отправляем false
    res.send({
      exist: false,
    })
  } else {
    //Иначе  проверяем пароль, если верно, то выдаем токен, сохраняем его в БД, отправляем true,
    if (req.body.password === userSearch[0].password) {
      let token =
        Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2)
      const userUpdate = await User.updateOne(
        { email: req.body.email },
        {
          $set: {
            token: token,
          },
        }
      )
      res.send({
        id: userSearch[0]._id,
        token,
        exist: true,
      })
    } else {
      //Иначе отправляем ошибку проверки
      res.send({
        exist: true,
        passwordErr: true,
      })
    }
  }
})
//Для компонента Welcome================================================
router.post('/setMainWelcome', async (req, res) => {
  // console.log(req.files)
  //Поиск Пользователя
  const userSearch = await User.find({ token: req.body.token })
  //Поиск записи
  const userWelcomeSearch = await userWelcome.find({
    idUser: userSearch[0]._id,
  })
  // Проверка на количество записей
  if (userWelcomeSearch.length == 0) {
    //Еси нет, то добавляем новую
    const newUserWelcome = new usersWelcome({
      idUser: userSearch[0]._id,
      welcomeText: req.body.welcomeText,
    })
    await newUserWelcome.save()
  } else {
    //Иначе редактируем старую
    const setUserWelcome = await userWelcome.updateOne(
      { idUser: userSearch[0]._id },
      { $set: { welcomeText: req.body.welcomeText } }
    )
  }
})
router.post(
  '/getMainWelcome',

  async (req, res) => {
    //Получаем данные для отправки в компонент Welcome
    const userSearch = await User.find({ token: req.body.token })
    const getUserWelcome = await usersWelcome.find({
      idUser: userSearch[0]._id,
    })
    if (getUserWelcome.length != 0) {
      res.send({
        welcomeText: getUserWelcome[0].welcomeText,
        photo: `http://localhost:3000/${userSearch[0]._id.toString()}/welcome/welcome.jpg`,
      })
    }
  }
)
//Добавление фото Welcome
router.post(`/photo/:component/:id`, async (req, res) => {
  if (req.params.component == 'welcome') {
    if (req.files) {
      if (!fs.existsSync(`photo/${req.params.id}`)) {
        fs.mkdirSync(`photo/${req.params.id}`)
      }
      fs.mkdir(`photo/${req.params.id}/${req.params.component}`, () => {
        req.files.file.mv(
          `photo/${req.params.id}/${req.params.component}/welcome.jpg`
        )
        return
      })
      req.files.file.mv(
        `photo/${req.params.id}/${req.params.component}/welcome.jpg`
      )
    } else {
      return
    }
  } else if (req.params.component == 'portfolio') {
    if (!fs.existsSync(`photo/${req.params.id}`)) {
      fs.mkdirSync(`photo/${req.params.id}`)
    }
    for (let key in req.files) {
      if (req.files) {
        fs.mkdir(`photo/${req.params.id}/portfolio`, () => {
          req.files[key].mv(
            `photo/${req.params.id}/${req.params.component}/${key}.jpg`
          )
          return
        })

        req.files[key].mv(
          `photo/${req.params.id}/${req.params.component}/${key}.jpg`
        )
      } else {
        return
      }
    }
  }
})
//Для компонента About================================================
router.post('/setMainAbout', async (req, res) => {
  // console.log(req.files)
  //Поиск Пользователя
  const userSearch = await User.find({ token: req.body.token })
  //Поиск записи
  const userAboutSearch = await userAbout.find({
    idUser: userSearch[0]._id,
  })
  // Проверка на количество записей
  if (userAboutSearch.length == 0) {
    //Еси нет, то добавляем новую
    const newUserAbout = new userAbout({
      idUser: userSearch[0]._id,
      aboutText: req.body.aboutText,
    })
    await newUserAbout.save()
  } else {
    //Иначе редактируем старую
    const setUserWelcome = await userAbout.updateOne(
      { idUser: userSearch[0]._id },
      { $set: { aboutText: req.body.aboutText } }
    )
  }
})
router.post(
  '/getMainAbout',

  async (req, res) => {
    //Получаем данные для отправки в компонент Welcome
    const userSearch = await User.find({ token: req.body.token })
    const getUserAbout = await usersAbout.find({
      idUser: userSearch[0]._id,
    })
    if (getUserAbout.length != 0) {
      res.send({
        aboutText: getUserAbout[0].aboutText,
      })
    }
  }
)
router.post('/setMainPortfolioCard', async (req, res) => {
  //Поиск Пользователя
  const userSearch = await User.find({ token: req.body.token })
  //Поиск записи
  const userPortfolioCardsSearch = await userPortfolioCards.find({
    idUser: userSearch[0]._id,
  })
  // Проверка на количество записей
  if (userPortfolioCardsSearch.length == 0) {
    //Еси нет, то добавляем новую
    const newUserPortfolioCards = new userPortfolioCards({
      idUser: userSearch[0]._id,
      H2: req.body.H2,
      cards: req.body.cards,
    })
    await newUserPortfolioCards.save()
  } else {
    //Иначе редактируем старую
    const setUserPortfolioCards = await userPortfolioCards.updateOne(
      { idUser: userSearch[0]._id },
      {
        $set: { cards: req.body.cards, H2: req.body.H2 },
      }
    )
  }
})
router.post(
  '/getMainPortfolioCard',

  async (req, res) => {
    //Получаем данные для отправки в компонент Welcome
    const userSearch = await User.find({ token: req.body.token })
    const getUserPortfolioCards = await userPortfolio.find({
      idUser: userSearch[0]._id,
    })
    if (getUserPortfolioCards.length != 0) {
      res.send({
        cards: getUserPortfolioCards[0].cards,
        H2: getUserPortfolioCards[0].H2,
      })
    }
  }
)
router.post('/setMainContact', async (req, res) => {
  //Поиск Пользователя
  const userSearch = await User.find({ token: req.body.token })
  //Поиск записи
  const userContactSearch = await userContact.find({
    idUser: userSearch[0]._id,
  })
  // Проверка на количество записей
  if (userContactSearch.length == 0) {
    //Еси нет, то добавляем новую
    const newUserContact = new userContact({
      idUser: userSearch[0]._id,
      contnacts: req.body.contacts,
    })
    await newUserContact.save()
  } else {
    //Иначе редактируем старую
    const setUserContact = await userContact.updateOne(
      { idUser: userSearch[0]._id },
      { $set: { contnacts: req.body.contacts } }
    )
  }
})
router.post(
  '/getMainContact',

  async (req, res) => {
    //Получаем данные для отправки в компонент Welcome
    const userSearch = await User.find({ token: req.body.token })
    const getUserContact = await userContact.find({
      idUser: userSearch[0]._id,
    })
    if (getUserContact.length != 0) {
      res.send({
        contacts: getUserContact[0].contnacts,
      })
    }
  }
)
// ==========================================================================
// //Удаление
// router.delete('/:id', async (req, res) => {
//   const user = await User.deleteOne({ _id: req.params.id })
//   console.log(req.params)
// })
// //Редактирование
// router.put('/', async (req, res) => {
// const user = await User.updateOne(
//   { _id: req.body._id },
//   { $set: { name: req.body.name, age: req.body.age, email: req.body.email } }
// )
//   console.log(req.body)
// })
module.exports = router
