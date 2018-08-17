const assert = require('chai').assert;
const should = require('chai').should();
const websiteController = require('../src/server/website');

describe('Website Analysis Tests', () => {
    it('should return the web page analysis', (done) => {
        websiteController.analyseWebsite({body: {website: 'http://honeypot.io/'}}).then((data) => {
            data[0].should.include.keys(["key", "value"]);
            data[0].should.includes.keys(["key", "value"]);
            data[0].should.contain.keys(["key", "value"]);
            data[0].should.includes.keys(["key", "value"]);
            done();
        });
    }).timeout(6000);

    it('should throw exception if http or https is not present in web url', (done) => {
        websiteController.analyseWebsite({body: {website: 'honeypot.io'}}).then((data) => {
        }).catch( e => {
            assert.equal(e.length, 0);
            done();
        });
    });
})