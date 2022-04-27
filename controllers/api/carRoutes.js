const router = require('express').Router();
const { Car } = require('../../models');

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

module.exports = router;
