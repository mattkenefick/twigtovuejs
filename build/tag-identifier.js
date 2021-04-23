'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

var staticObject = {
    /**
     * HTML tags
     *
     * Value can have `tag` to return or
     * we can `convert` it to something else
     *
     * @var array
     */
    $tags: {
        'for ': { 'tag': 'for' },
        'endfor': { 'tag': 'endfor' },
        'include ': { 'tag': 'include' },
        'if ': { 'tag': 'if' },
        'elseif ': { 'tag': 'elseif' },
        'else if ': { 'tag': 'elseif' },
        'else-if ': { 'tag': 'elseif' },
        'else': { 'tag': 'else' },
        'endif': { 'tag': 'endif' }
    }

    /**
     * TagIdentifier
     *
     * The purpose of this class is to idenitfy and normalize different types
     * of tags.
     *
     * This is used by the converter to extract tags from identified statements:
     *
     *        Found: if matt == "true"
     *     Returned: matt == "true"
     *
     *        Found: endif
     *     Returned:
     */
};
var TagIdentifier = function () {
    function TagIdentifier() {
        _classCallCheck(this, TagIdentifier);
    }

    _createClass(TagIdentifier, null, [{
        key: 'identify',

        /**
         * Try to identify tags
         *
         * The grabbed value is a section, like an innerValue,
         * which would be "include 'xyz' " as opposed to "{% include 'xyz' %}"
         *
         * @param  string $value
         *
         * @return string
         */
        value: function identify($value) {
            var $key = void 0,
                $options = void 0,
                $possibleKey = void 0;

            // Clean
            $value = TagIdentifier.fixString($value);

            for ($key in staticObject.$tags) {
                $options = staticObject.$tags[$key];
                $possibleKey = $value.substr(0, $key.length);

                if ($possibleKey === $key) {
                    return $options['convert'] || $options['tag'];
                }
            }

            return '';
        }

        /**
         * Try to replace tags
         *
         * @param  string $value
         *
         * @return string
         */

    }, {
        key: 'replace',
        value: function replace($value) {
            var $identifiedTag = void 0;
            $identifiedTag = TagIdentifier.identify($value);

            var regex = new RegExp($identifiedTag + '[^a-zA-Z]', 'is');
            $value = $value.replace(regex, '');

            return TagIdentifier.fixString($value);
        }

        /**
         * Replace tags accidentally added
         *
         * @param  string $value
         *
         * @return string
         */

    }, {
        key: 'fixString',
        value: function fixString($value) {
            $value = $value.replaceAll('{%', '');
            $value = $value.replaceAll('%}', '');
            $value = $value.trim();

            return $value;
        }
    }]);

    return TagIdentifier;
}();

exports.default = TagIdentifier;