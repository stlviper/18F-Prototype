var defaultController = defaultController || {};

defaultController.home = {
  get: function (req, res, next) {
    res.render('index', {title: 'Express'});
  }
};

module.exports = defaultController;