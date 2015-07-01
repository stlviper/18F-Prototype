describe('openFDAViz app navigation functionality', function() {
  beforeEach(function(){
    browser.get('http://localhost:8000/');
  });

  it('should start on the home page', function() {
    expect(element.all(by.css('.cover-container')).count()).toEqual(3);
  });

  it('should navigate to search when the search menu is clicked', function() {
    element(by.css('button[href="#/search"]')).click();

    var searchMainContent = by.css('div[ui-view="content"] > .container.main-contents');

    browser.findElement(searchMainContent);

    expect(browser.isElementPresent(searchMainContent)).toBeTruthy();
  });
});