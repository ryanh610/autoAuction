
const router = require('express').Router();
const { Car, Bid, User } = require('../../models');
const { authenticated } = require('../../helpers/middleware')


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
