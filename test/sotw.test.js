
const fs = require('fs');
const path = require('path');
const should = require('should');

const converter = require('../build/converter.js').default;

// https://github.com/tj/should.js
describe('sotw', function () {
    it('should convert a template', function (done) {
        const tpl = fs.readFileSync('lib/data/sotw-complex.twig', 'utf8');
        const html = converter.convert(tpl);

        // String
        html.should.have.type('string');

        // Match
        html.should.containEql('<lottie-animation class="view-animation" path="image/animations/infinity.json" width="300" height="300" :loop="true" :autoplay="true" :speed="1">');

        // Complete
        done();
    });
});