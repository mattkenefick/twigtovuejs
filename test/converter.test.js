
import fs from 'fs';
import path from 'path';
import should from 'should';

import converter from '../lib/converter.js';

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
});
