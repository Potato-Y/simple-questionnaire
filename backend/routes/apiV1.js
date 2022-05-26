const DBController = require('../db/DBController/DBController');
const QuestionnaireResultDBController = require('../db/DBController/QuestionnaireResultDBController');

const express = require('express');
const router = express.Router();

const mainController = new DBController();
mainController.connectDB();

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send('error');
});

router.post('/upload_data', (req, res) => {
  try {
    if (isNaN(req.body.phone_number)) {
      return res.send({ db_process: false, message: 'number' });
    }
    new QuestionnaireResultDBController().updateData(mainController, req.body, res);
  } catch (err) {
    console.log('err:' + err);
  }
});

module.exports = router;
