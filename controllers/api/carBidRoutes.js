const express = require('express')

const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req)
  try {
    const newBid = await Bid.create({
      price: req.body.price,
      user_id: req.session.user_id,
      car_id: req.params.id
    });

    res.status(200).json(newBid);
  } catch (err) {
    res.status(400).json(err);
  }
})

module.exports = router