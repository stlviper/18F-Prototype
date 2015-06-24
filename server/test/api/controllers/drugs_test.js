var chai = require('chai').expect;

// This is primarily just a test endpoint and may end up being removed
describe('Drugs eventRangeCount endpoint:', function() {
  describe('Should return data in range of 2010/05/21 to 2015/04/10', function(){
    it("Should return ", function () {

      var mockReq = {swagger: {
        params: {
          start: {
            value: "20100521"
          },

      }}};

    });
  });
});
