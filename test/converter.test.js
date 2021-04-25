
const fs = require('fs');
const path = require('path');
const should = require('should');

const converter = require('../build/converter.js').default;

// https://github.com/tj/should.js
describe('converter', function () {
    it('should convert a template', function (done) {
        const tpl = `<div class="{{ foo }}">test</div>`;
        const html = converter.convert(tpl);

        // String
        html.should.have.type('string');

        // Match
        html.should.equal('<div :class="foo">test</div>');

        // Complete
        done();
    });

    it('should convert comments', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/basic-comments.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<!-- Test Comment -->';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert complex comments', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/complex-comments.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '{{ imageUrl(...) }}';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert comments by string', function (done) {
        let a, b;
        const html = '<div>{# Test Two #}</div>';
        const vueHtml = converter.convert(html);

        a = '<div><!-- Test Two --></div>';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert a else-if', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/basic-if-else.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<div v-else-if="something == \'something\'">';
        b = vueHtml;

        b.should.containEql(a);

        a = '<p v-else="">';
        b = vueHtml;

        b.should.containEql(a);

        a = '<h3 v-if="foo">';
        b = vueHtml;

        b.should.containEql(a);

        // Complete
        done();
    });

    it('should convert comments', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/kitchen-sink.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<div class="second-loop" v-for="(model, index) of collection" v-bind:key="index">';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert include objects', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/include-objects.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = ' :header="\'Literal String\'';
        b = vueHtml;

        b.should.containEql(a);

        a = ' :integer="5"';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert multiple attributes', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/multiple-attributes.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<a :href="header.href" :title="header.text">';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert namespaced includes', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/kitchen-sink.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<headermain';
        b = vueHtml;

        b.should.containEql(a);

        a = '<viewfootermain';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });

    it('should convert sequential duplicate endings', function (done) {
        let a, b;
        const html = fs.readFileSync('lib/data/kitchen-sink.twig', 'utf8');
        const vueHtml = converter.convert(html);

        a = '<viewfilmindex :films="[]"></viewfilmindex>';
        b = vueHtml;

        b.should.containEql(a);

        done()
    });
});
