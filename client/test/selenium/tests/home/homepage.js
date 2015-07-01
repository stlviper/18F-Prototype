describe('openFDAViz app homepage', function() {
  beforeEach(function(){
    browser.get('http://localhost:8000/#/');
  });
  it('should show a header region', function() {
    var headerElement = by.css('div[ui-view="nav"] > .cover-container');
    expect(browser.isElementPresent(headerElement)).toBeTruthy();

    var titleElement = by.css('div[ui-view="nav"] h3.masthead-brand > strong');
    expect(browser.findElement(titleElement).getText()).toEqual('FDA Visualizer');
  });

  it('should show a content region with a Submit button', function() {
    //detailed selector to test structure of view
    var learnMoreElement = by.css('div[ui-view="content"] .inner.cover button[href="#/search"]');
    expect(browser.findElement(learnMoreElement).getText()).toEqual('Submit');
  });

  it('should have a link to the openFDA webpage', function() {
    var fdaPageNavItem = by.css('ul.nav.masthead-nav li > a[href="http://open.fda.gov/api/reference/"]');
    expect(browser.findElement(fdaPageNavItem).getText()).toEqual('openFDA');
  });

  it('should have a link to the OGSystems webpage', function() {
    var ogsPageNavItem = by.css('ul.nav.masthead-nav li > a[href="http://www.ogsystems.com/"]');
    expect(browser.findElement(ogsPageNavItem).getText()).toEqual('OGSystems');
  });
});