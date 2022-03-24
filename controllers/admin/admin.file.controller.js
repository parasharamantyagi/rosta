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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/questions/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage }).single('question_file');

class adminFileController {
  async questionUploadPost(req, res, next) {
    try {
      // const neatCsv = require('neat-csv');
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.question = 'public/questions/' + req.file.filename;

          const data = [];
          let question_obj = {};
          fs.createReadStream(inputData.question)
            .pipe(csv())
            .on('data', (row) => {
              question_obj = filterCsv(Object.values(row));
              data.push(question_obj);
            })
            .on('end', () => {
              if (halper.check_array_length(data,1)) {
                Question.deleteQuestion(halper.current_date());
              }
              for(let my_data of data){
                if (check_obj(my_data)) {
                  Question.saveQuestion(my_data);
                }
              }
              return res
                .status(200)
                .json(
                  halper.web_response(
                    true,
                    false,
                    halper.request_message('file_upload'),
                    halper.web_link('admin/system-configuration'),
                  ),
                );
            });
        } else {
          return res
            .status(200)
            .json(
              halper.web_response(
                false,
                false,
                halper.request_message('file_exit'),
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
