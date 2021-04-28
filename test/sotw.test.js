
const fs = require('fs');
const path = require('path');
const should = require('should');

const converter = require('../dist/converter.js').default;

// https://github.com/tj/should.js
describe('sotw', function () {

    it('should convert menu attributes', function (done) {
        const tpl = fs.readFileSync('src/data/sotw-menu.twig', 'utf8');
        const html = converter.convert(tpl);

        // String
        html.should.have.type('string');

        // Match
        html.should.containEql('<a :href="pageUrl(\'/account/messages\')" :title="twigNavigateCaption(\'account.messages\')">');

        // Complete
        done();
    });

    it('should convert all attributes', function (done) {
        const tpl = fs.readFileSync('src/data/sotw-attributes.twig', 'utf8');
        const html = converter.convert(tpl);

        // String
        html.should.have.type('string');

        // Match
        html.should.containEql('<a type="action" v-on:click="Handle_OnClickRemovePress" :film_id="film.id" :link_id="link.id">');

        // Complete
        done();
    });
});