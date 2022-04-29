const router = require('express').Router();
const { Car, Bid, User } = require('../../models');
const { authenticated } = require('../../helpers/middleware')


router.get("/", async (req, res) => {
  try {
    const bidData = await Bid.findAll({
      include: [
        {model: User, attributes: ['username']},
        {model: Car, attributes: ['year', 'manufacturer', 'model']}
      ]})
    res.status(200).json(bidData)
  } catch(err) {res.status(400).json(err)}
});

router.get("/:id", async (req, res) => {
  try {
    const bidData = await Bid.findOne({
      where: {id: req.params.id},
      include: [
        {model: User, attributes: ['username']},
        {model: Car, attributes: ['year', 'manufacturer', 'model']}
      ]})
    res.status(200).json(bidData)
  } catch(err) {res.status(400).json(err)}
  });
  

router.post('/', authenticated, async (req, res) => {
  try {
    console.log(req.body)
    const newBid = await Bid.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBid);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const bidData = await Bid.update({ price: req.body.price},
    { where: {id: req.params.id}})
    res.status(200).json(bidData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bidData = await Bid.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!bidData) {
      res.status(404).json({ message: 'No bid found with this id!' });
      return;
    }

    res.status(200).json(bidData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
