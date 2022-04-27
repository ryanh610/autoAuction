const router = require('express').Router();
const { Bid } = require('../../models');

router.get("/", async (req, res) => {
  try {
    Bid.findAll({ include: {model: User, attributes: ['username']}, include: {model: Car, attributes: ['year', 'manufacturer', 'model']}})
    res.status(200).json(data)
  } catch(err) {res.status(400).json(err)}
});

router.get("/:id", async (req, res) => {
  try {
    Bid.findOne({ where: {id: req.params.id}, include: {model: User, attributes: ['username']}, include: {model: Car, attributes: ['year', 'manufacturer', 'model']}})
    res.status(200).json(data)
  } catch(err) {res.status(400).json(err)}
  });
  

router.post('/', async (req, res) => {
  try {
    const newBid = await Bid.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBid);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const BidData = await Bid.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!BidData) {
      res.status(404).json({ message: 'No bid found with this id!' });
      return;
    }

    res.status(200).json(bidData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
