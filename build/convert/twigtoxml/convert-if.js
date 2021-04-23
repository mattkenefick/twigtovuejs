'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preg_quote = require('../../polyfill/preg_quote.js');

var _preg_quote2 = _interopRequireDefault(_preg_quote);

var _preg_replace = require('../../polyfill/preg_replace.js');

var _preg_replace2 = _interopRequireDefault(_preg_replace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * JS imports are yelling about using these as static variables
 * on the class due to loaders. So we moved it out.
 *
 * ERROR in ./node_modules/twigtovuejs/convert/twigtoxml/convert-if.js 15:18
 * Module parse failed: Unexpected token (15:18)
 * You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
 * |      * @var int
 * |      *
 * >     static $depth = 0;
 *
 */
var staticObject = {
    $depth: 0,
    $tagHistory: []

    /**
     * Converter
     */
};
var ConvertIf = function () {
    function ConvertIf() {
        _classCallCheck(this, ConvertIf);
    }

    _createClass(ConvertIf, null, [{
        key: 'convert',

        /**
         * Convert
         *
         * @param  string $str
         * @param  string $tag
         * @param  string $outerValue
         * @param  string $attributeValue
         *
         * @return string
         */
        value: function convert($str, $tag, $outerValue, $attributeValue) {
            switch ($tag) {
                case 'if':
                    return ConvertIf.convertIf($str, $outerValue, $attributeValue);

                case 'elseif':
                    return ConvertIf.convertElseIf($str, $outerValue, $attributeValue);

                case 'else':
                    return ConvertIf.convertElse($str, $outerValue, $attributeValue);

                case 'endif':
                    return ConvertIf.convertEndIf($str, $outerValue, $attributeValue);
            }
        }

        /**
         * Convert If
         *
         * @param  string $str
         * @param  string $tag
         * @param  string $outerValue
         * @param  string $attributeValue
         *
         * @return string
         */

    }, {
        key: 'convertIf',
        value: function convertIf($str, $outerValue, $attributeValue) {
            var $previousTag = void 0,
                $value = void 0;

            // $previousTag = ConvertIf.getPreviousTag();
            $previousTag = staticObject.$tagHistory[staticObject.$tagHistory.length - 1] != 'if' ? ConvertIf.getPreviousTag() : '';
            $attributeValue = ConvertIf.cleanAttributes($attributeValue);
            $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<if condition="' + $attributeValue + '">', $str);

            // increase depth
            staticObject.$depth++;

            // add conditional to history
            ConvertIf.addPreviousTag('if');

            return $value;
        }

        /**
         * Convert ElseIf
         *
         * @param  string $str
         * @param  string $tag
         * @param  string $outerValue
         * @param  string $attributeValue
         *
         * @return string
         */

    }, {
        key: 'convertElseIf',
        value: function convertElseIf($str, $outerValue, $attributeValue) {
            var $previousTag = void 0,
                $value = void 0;

            $previousTag = ConvertIf.getPreviousTag();
            $attributeValue = ConvertIf.cleanAttributes($attributeValue);
            $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<elseif condition="' + $attributeValue + '">', $str);

            // add conditional to history
            ConvertIf.addPreviousTag('elseif');

            return $value;
        }

        /**
         * Convert Else
         *
         * @param  string $str
         * @param  string $tag
         * @param  string $outerValue
         * @param  string $attributeValue
         *
         * @return string
         */

    }, {
        key: 'convertElse',
        value: function convertElse($str, $outerValue, $attributeValue) {
            var $previousTag = void 0,
                $value = void 0;

            $previousTag = ConvertIf.getPreviousTag();
            $attributeValue = ConvertIf.cleanAttributes($attributeValue);
            $value = ConvertIf.str_replace_first($outerValue, $previousTag + '<else condition="' + $attributeValue + '">', $str);

            // add conditional to history
            ConvertIf.addPreviousTag('else');

            return $value;
        }

        /**
         * Convert End If
         *
         * @param  string $str
         * @param  string $tag
         * @param  string $outerValue
         * @param  string $attributeValue
         *
         * @return string
         */

    }, {
        key: 'convertEndIf',
        value: function convertEndIf($str, $outerValue, $attributeValue) {
            var $previousTag = void 0,
                $value = void 0;

            $previousTag = ConvertIf.getPreviousTag();

            $value = ConvertIf.str_replace_first($outerValue, $previousTag, $str);

            // $value = str_replace($outerValue, $previousTag + "\n", $str);
            // switch ($previousTag) {
            //     case '</else>':
            //         $value = str_replace($outerValue, '</else>', $str);
            //         break;

            //     case '</elseif>':
            //         $value = str_replace($outerValue, '</elseif>', $str);
            //         break;

            //     default:
            //     case '</if>':
            //         $value = str_replace($outerValue, '</if>', $str);
            //         break;
            // }

            // decrease depth
            staticObject.$depth--;

            // Unset previous tag because block is closed
            // ConvertIf.$previousTag = null;

            return $value;
        }

        /**
         * Clean attribute values
         *
         * XML validation specifically has an issue with "<" even when
         * wrapped within quotes. Safer here to just convert both.
         *
         * @return string
         */

    }, {
        key: 'cleanAttributes',
        value: function cleanAttributes($attributeValue) {
            $attributeValue = $attributeValue.replaceAll("'", "\'");
            $attributeValue = $attributeValue.replaceAll('"', '\'');
            $attributeValue = $attributeValue.replaceAll('<', '&lt;');
            $attributeValue = $attributeValue.replaceAll('>', '&gt;');

            return $attributeValue;
        }

        /**
         * Return closing tag if necessary
         *
         * @return string
         */

    }, {
        key: 'addPreviousTag',
        value: function addPreviousTag($tag) {
            // echo ' o tag = ' + $tag + "   (" + implode(', ', staticObject.$tagHistory) + ") \n";
            staticObject.$tagHistory.push($tag);
        }

        /**
         * Return closing tag if necessary
         *
         * @return string
         */

    }, {
        key: 'getPreviousTag',
        value: function getPreviousTag() {
            var $tag = void 0;

            if (staticObject.$tagHistory.length) {
                // echo ' x ' + (end(staticObject.$tagHistory)) + "   {" + implode(', ', staticObject.$tagHistory) + "} \n";
                $tag = staticObject.$tagHistory.pop();
                return '</' + $tag + '>';
            }

            return '';
        }

        /**
         * Replace only first instance
         *
         * @param  string $from
         * @param  string $to
         * @param  string $content
         * @return string
         */

    }, {
        key: 'str_replace_first',
        value: function str_replace_first($from, $to, $content) {
            $from = '/' + (0, _preg_quote2.default)($from, '#') + '/';

            return (0, _preg_replace2.default)($from, $to, $content || '', 1);
        }
    }]);

    return ConvertIf;
}();

exports.default = ConvertIf;