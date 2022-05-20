const halper = require('../../halpers/halper');
const Deals = require('./../../Model/dealsTable');
const Prize = require('./../../Model/prizesTable');
const Category = require('./../../Model/categoryTable');
const User = require('./../../Model/userTable');
const multer = require('multer');
const { check_obj } = require('../../halpers/halper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/deals/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/prizes/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage }).single('deals');
var uploadPrize = multer({ storage: storage1 }).single('image');
// const multiUpload = multer({ storage: storage }).any('image_link');


class addManagementSystemController {
  async viewDeals(req, res, next) {
    try {
      Deals.getDeals(100, (err, resdata) => {
        // return res.json(resdata);
        return res.render('admin/deals/viewDeals', {
          rosta: halper,
          page_url: req.url,
          deals: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  viewDealPage(req, res, next) {
    try {
      Deals.getDealFromId(req.params.deal_id, (err, resdata) => {
        Category.getCategory(100, (err, catdata) => {
          return res.render('admin/deals/addDeals', {
            formAction: `./../add-deals/${req.params.deal_id}`,
            dealData: resdata,
            rosta: halper,
            page_url: req.url,
            categories: catdata,
          });
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addDeals(req, res, next) {
    try {
      Category.getCategory(100, (err, resdata) => {
        return res.render('admin/deals/addDeals', {
          formAction: 'add-deals',
          dealData: {},
          rosta: halper,
          page_url: req.url,
          categories: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async viewPrize(req, res, next) {
    try {
      Prize.getPrize(100, (err, resdata) => {
        return res.render('admin/prizes/viewPrizes', {
          rosta: halper,
          page_url: req.url,
          prizes: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  viewPrizePage(req, res, next) {
    try {
      Prize.getPrizeFromId(req.params.prize_id, (err, resdata) => {
        return res.render('admin/prizes/addPrizes', {
          formAction: `./../add-prize/${req.params.prize_id}`,
          dealData: resdata,
          rosta: halper,
          page_url: req.url,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async updatePrizePost(req, res, next) {
    try {
      let prize_id = req.params.prize_id;
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image = 'prizes/' + req.file.filename;
        }
        let delData = halper.obj_multi_select(inputData, [
          'name',
          'email',
          'url',
          'price',
          'image',
          'description',
        ]);
        Prize.updatePrize(
          { id: prize_id, data: delData },
          async (err, resdata) => {
            if (check_obj(resdata)) {
              return res
                .status(200)
                .json(
                  halper.web_response(
                    true,
                    false,
                    halper.request_message('updatePrizePost'),
                    halper.web_link('admin/view-prize'),
                  ),
                );
            }
          },
        );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addPrize(req, res, next) {
    try {
      return res.render('admin/prizes/addPrizes', {
        formAction: 'add-prize',
        dealData: {},
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addPrizePost(req, res, next) {
    try {
      uploadPrize(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image = 'prizes/' + req.file.filename;
        }
        let prizesData = halper.obj_multi_select(req.body, [
          'name',
          'email',
          'url',
          'price',
          'image',
          'description',
        ]);
        Prize.addPrize(prizesData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addPrizePost'),
                  'view-prize',
                ),
              );
          }
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async updateDealPost(req, res, next) {
    try {
      let deal_id = req.params.deal_id;
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image = 'deals/' + req.file.filename;
        }
        let delData = halper.obj_multi_select(inputData, [
          'name',
          'email',
          'url',
          'price',
          'image',
          'best_seller',
          'stock',
          'description',
        ]);
        Deals.updateDeals(
          { id: deal_id, data: delData },
          async (err, resdata) => {
            if (check_obj(resdata)) {
              return res
                .status(200)
                .json(
                  halper.web_response(
                    true,
                    false,
                    halper.request_message('updateDealPost'),
                    halper.web_link('admin/view-deals'),
                  ),
                );
            }
          },
        );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addDealPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image = 'deals/' + req.file.filename;
        }
        let delData = halper.obj_multi_select(req.body, [
          'name',
          'email',
          'url',
          'price',
          'image',
          'best_seller',
          'stock',
          'description',
        ],false);
        Deals.addDeals(delData, async (err, resdata) => {
          if (check_obj(resdata)) {
            Category.addDealCategory(inputData.category, resdata._id);
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addDealPost'),
                  'view-deals',
                ),
              );
          }
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async viewCategory(req, res, next) {
    try {
      Category.getCategory(100, (err, resdata) => {
        // return res.json(resdata);
        return res.render('admin/category/viewCategory', {
          rosta: halper,
          page_url: req.url,
          categories: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async addCategory(req, res, next) {
    try {
      return res.render('admin/category/addCategory', {
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addCategoryPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        Category.addCategory(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addCategoryPost'),
                  'view-category',
                ),
              );
          }
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new addManagementSystemController();

