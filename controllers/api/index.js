const router = require('express').Router();
const userRoutes = require('./userRoutes');
const carRoutes = require('./carRoutes');
const bidRoutes = require('./bidRoutes')

router.use('/users', userRoutes);
router.use('/cars', carRoutes);
router.use('/bids', bidRoutes);

module.exports = router;
