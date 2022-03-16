const halper = require('../../halpers/halper');
const csv = require('csv-parser');
const fs = require('fs');
// const Party = require('./../../Model/partyTable');
// const Collaboration = require('./../../Model/collaborationTable');
// const User = require('./../../Model/userTable');
// const Configration = require('./../../Model/configrationTable');
const Question = require('./../../Model/questionTable');
const multer = require('multer');
const { check_obj } = require('../../halpers/halper');
const { filterCsv } = require('../../halpers/FilterData');
const rn = require('random-number');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/questions/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage }).any('question_file');

class adminFileController {

  async questionUploadPost(req, res, next) {
    try {
      // const neatCsv = require('neat-csv');
      upload(req, res, async function (err) {
        let inputData = req.body;
        return res.status(200).json(req.files);
        if (req.file) {
          // inputData.question = 'public/questions/' + req.file.filename;
          return res.status(200).json(req.file);
        // const data = [];
        // fs.createReadStream(inputData.question)
        //   .pipe(csv())
        //   .on('data', (row) => {
        //     Question.saveQuestion(filterCsv(Object.values(row)[0]));
        //     data.push(filterCsv(Object.values(row)[0]));
        //   })
        //   .on('end', () => {
        //     return res
        //       .status(200)
        //       .json(
        //         halper.web_response(
        //           true,
        //           false,
        //           'File upload successfully',
        //           halper.web_link('admin/system-configuration'),
        //         ),
        //       );
        //   });
        }else{
          return res
            .status(200)
            .json(
              halper.web_response(
                false,
                false,
                "File does't exit",
                halper.web_link('admin/system-configuration'),
              ),
            );
        }
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new adminFileController();

