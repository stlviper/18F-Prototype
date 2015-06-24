var chai = require('chai').expect;


describe('Testing Drugs Controller.', function(){

  beforeEach("Setup mock req/res objects", function(){
    this.mockReq = {
      swagger: {
        params: {}
      }
    };
    this.mockRes = {};

  });

  // This is primarily just a test endpoint and may end up being removed
  describe('Drugs eventRangeCount endpoint:', function() {
    describe('Should return data in range of 2010/05/21 to 2015/04/10', function(){
      it("Should return ", function () {
        var mockReq = this.mockReq.swagger.params;
        mockReq.start = {value: "20100521"};
        mockReq.end = {value: "20150410"};
        mockReq.field = {value: 'patient.patientsex'};
        console.log(this.mockReq);

      });
    });
  });


});