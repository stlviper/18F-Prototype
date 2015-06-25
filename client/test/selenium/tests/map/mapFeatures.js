describe('The openFDAViz app map', function () {
  beforeEach(function () {
    browser.get('http://localhost:8000/#/search');
  });
  it('should display a leaflet map', function () {
    var mapElement = by.id('map');
    expect(browser.isElementPresent(mapElement)).toBeTruthy();
  });

  it('should update start date when right slider is adjusted', function () {

  });

  it('should update end date when left slider is adjusted', function () {

  });
});