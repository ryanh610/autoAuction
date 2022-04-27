const router = require('express').Router();
const { Car, Bid } = require('../../models');

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('uploaded_file'), async (req, res) => {
  (async () => {
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
      description: req.body.description,
      file_path: fileURL.url
    })
  })().catch(err => console.error(err));
  res.redirect('/cars')
})

router.get("/", async (req, res) => {
  try {
    await Car.findAll({ include: {model: User, attributes: ['username']}, include: {model: Bid, attributes: ['price']}})
    res.status(200).json(data)
  } catch(err) {res.status(400).json(err)}
});

router.get("/:id", async (req, res) => {
  try {  
    Car.findOne({ where: {id: req.params.id}, include: {model: User, attributes: ['username']}, include: {model: Bid, attributes: ['price']}})
    res.status(200).json(data)
  } catch(err) {res.status(400).json(err)}
  });
  

router.delete('/:id', async (req, res) => {
  try {
    const carData = await Car.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
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

module.exports = router;
