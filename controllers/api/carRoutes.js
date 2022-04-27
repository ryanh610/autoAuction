const router = require('express').Router();
const { Car, Bid } = require('../../models');

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
  

router.post('/', async (req, res) => {
  try {
    const newCar = await Car.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newCar);
  } catch (err) {
    res.status(400).json(err);
  }
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
});

module.exports = router;
