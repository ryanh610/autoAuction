const fs = require('fs')
const path = require('path')
const multer = require('multer')
const express = require('express')
const { Bid, Car, User } = require('../models')

const router = express.Router()

router.get('/:id', async (req, res) => {
  const car = await Car.findByPk(req.params.id, {
    include: [
      {
        model: Bid,
        as: 'bids',
        include: User
      },
      User
    ],
    order: [
      ['bids', 'price', 'DESC']
    ]
  })
  car.bids = car.bids.map(bid => {
    bid.price = bid.formatPrice()
    bid.get({ plain: true })
  })
  if (!car) return res.status(404).render('errors/404')
  car.get({ plain: true })
  if (car.is_active()) {
    var {days, hours, minutes, seconds} = car.time_values()
  }

  res.render('cars/show', {
    car: car.get({ plain: true}),
    is_active: car.is_active(),
    time_values: {
      days, hours, minutes, seconds
    },
    user: req.session.user
  })
})

const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('uploaded_file'), async (req, res) => {
  // const fileExt = '.' + req.file.originalname.substring(req.file.originalname.indexOf('.') + 1)
  const fileExt = '.jpg'
  fs.renameSync(
    path.join(__dirname, '../', 'uploads', req.file.filename),
    path.join(__dirname, '../', 'uploads', `${req.file.filename}${fileExt}`) 
  )
  
  import('@aicore/linode-object-storage-lib')
    .then(linodeModule => linodeModule.default)
    .then(async linodeModule => {
      await linodeModule.uploadFileToLinodeBucket(process.env.LINODE_ACCESS_KEY, 
            process.env.LINODE_SECRET, 
            'us-east-1', 
            path.join(__dirname, '../', 'uploads', `${req.file.filename}${fileExt}`), 
            'auto-auction'
      )
        // fs.unlinkSync(
        //   path.join(__dirname, '../', 'uploads', req.file.filename + fileExt)
        // )
        const fileURL = await linodeModule.fetchObjectUrl(
          process.env.LINODE_API_KEY, 
          'us-east-1', 
          'auto-auction', 
          req.file.filename + fileExt
        );
        const car = await Car.create({
          manufacturer: req.body.manufacturer,
          model: req.body.model,
          year: req.body.year,
          mileage: req.body.mileage,
          color: req.body.color,
          ending_date: req.body.ending_date,
          description: req.body.description,
          file_path: fileURL.url
        })
        return res.redirect(`/cars/${car.id}`)
    })
  // (async() => {

  //   let linodeModule = await import('@aicore/linode-object-storage-lib');
  //   linodeModule = linodeModule.default
  //   console.log(linodeModule)
  //   await linodeModule.uploadFileToLinodeBucket(
  //     process.env.LINODE_ACCESS_KEY, 
  //     process.env.LINODE_SECRET, 
  //     'us-east-1', 
  //     path.join(__dirname, '../', 'uploads', req.file.filename + fileExt), 
  //     'auto-auction'
  //   )

  //   fs.unlinkSync(
  //     path.join(__dirname, '../', 'uploads', req.file.filename + fileExt)
  //   )

  //   const fileURL = await linodeModule.fetchObjectUrl(
  //     process.env.LINODE_API_KEY, 
  //     'us-east-1', 
  //     'auto-auction', 
  //     fileName
  //   );
  //   Car.create({
  //     manufacturer: req.body.manufacturer,
  //     model: req.body.model,
  //     year: req.body.year,
  //     mileage: req.body.mileage,
  //     color: req.body.color,
  //     ending_date: req.body.ending_date,
  //     description: req.body.description,
  //     file_path: fileURL.url
  //   })
  // })()
})


module.exports = router