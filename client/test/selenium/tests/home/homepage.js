describe('OpenFDAViz app homepage', function() {
  beforeEach(function(){
    browser.get('http://localhost:8001/#/');
  });
  it('should show a header region', function() {
    var headerElement = by.css('div[ui-view="nav"] > .cover-container');
    expect(browser.isElementPresent(headerElement)).toBeTruthy();

    var titleElement = by.css('div[ui-view="nav"] h3.masthead-brand > strong');
    expect(browser.findElement(titleElement).getText()).toEqual('FDA Visualizer');
  });

  it('should show a content region with a learn more button', function() {

  });

  it('should have a link to the OpenFDA webpage', function() {

  });

  it('should have a link to the OGSystems webpage', function() {

  });


});