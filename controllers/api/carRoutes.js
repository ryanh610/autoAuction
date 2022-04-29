const fs = require('fs')
const path = require('path')
const multer = require('multer')
const router = require('express').Router();
const { Car, Bid, User } = require('../../models');
const { authenticated } = require('../../helpers/middleware')

const upload = multer({ dest: 'uploads/' })

router.post('/',  upload.single('uploaded_file'), async (req, res) => {
  try {
    if (req.body.file) {
    const fileExt = req.file.originalname.substring(req.file.originalname.indexOf('.'))
    
    const fileName = req.file.filename + fileExt

    fs.renameSync(
      path.join(__dirname, '../', '../', 'uploads', req.file.filename),
      path.join(__dirname, '../', '../', 'uploads', fileName), 
    )

    let linodeModule = await import('@aicore/linode-object-storage-lib');
    linodeModule = linodeModule.default

    await linodeModule.uploadFileToLinodeBucket(
      process.env.LINODE_ACCESS_KEY, 
      process.env.LINODE_SECRET, 
      'us-east-1', 
      path.join(__dirname, '../', '../', 'uploads', fileName), 
      'auto-auction'
    )
    fs.unlinkSync(
      path.join(__dirname, '../', '../', 'uploads', fileName)
      )
    const fileURL = await linodeModule.fetchObjectUrl(
      process.env.LINODE_API_KEY, 
      'us-east-1', 
      'auto-auction', 
      fileName
    );
    Car.create({
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      color: req.body.color,
      ending_date: req.body.ending_date,
      description: req.body.description,
      file_path: fileURL.url
    })
  } else {
      console.log("HEEEEEEEEEEEEEEEEY");
      
      const carData = await Car.create({
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        mileage: req.body.mileage,
        color: req.body.color,
        ending_date: req.body.ending_date,
        description: req.body.description
      })
      console.log(carData);
      res.status(200).json(carData);
    }
  } catch(err) {
    res.redirect('/cars/create')
    // res.status(400).json(console.log(err))
  }
});

router.put("/:id", async (req, res) => {
  try {
    const carData = await Car.update({
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      color: req.body.color,
      description: req.body.description
    },
    { where: {id: req.params.id}})
    res.status(200).json(carData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let carData = await Car.findAll({
      include: [
        {model: User, attributes: ['username']},
        {model: Bid, attributes: ['price']}
      ]})
    res.status(200).json(carData)
  } catch(err) {res.status(400).json(err)}
});

router.get("/:id", async (req, res) => {
  try {  
    let carData = await Car.findOne({
      where: {id: req.params.id},
      include: [
        {model: User, attributes: ['username']},
        {model: Bid, attributes: ['price']}
      ]})
    res.status(200).json(carData)
  } catch(err) {res.status(400).json(err)}
  });
  

router.delete('/:id', async (req, res) => {
  try {
    const carData = await Car.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!carData) {
      res.status(404).json({ message: 'No car found with this id!' });
      return;
    }

    res.status(200).json(carData);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.post('/:id/bids', authenticated, async (req, res) => {
  try {
    await Bid.create({
      price: req.body.price,
      user_id: req.session.user.id,
      car_id: req.params.id
    });

    // res.status(200).json(bid);
    res.redirect(`/cars/${req.params.id}`)
  } catch (err) {
    res.status(400).json(err);
  }
})

module.exports = router;
