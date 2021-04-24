'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * This file is part of the PolymerMallard\TwigToVue package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright () Matt Kenefick <matt@polymermallard.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

var _htmlEntities = require('html-entities');

var _htmlEntities2 = _interopRequireDefault(_htmlEntities);

var _preg_replace = require('./polyfill/preg_replace.js');

var _preg_replace2 = _interopRequireDefault(_preg_replace);

var _queryPath = require('./util/query-path.js');

var _queryPath2 = _interopRequireDefault(_queryPath);

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _tagIdentifier = require('./tag-identifier.js');

var _tagIdentifier2 = _interopRequireDefault(_tagIdentifier);

var _convertFor = require('./convert/twigtoxml/convert-for.js');

var _convertFor2 = _interopRequireDefault(_convertFor);

var _convertIf = require('./convert/twigtoxml/convert-if.js');

var _convertIf2 = _interopRequireDefault(_convertIf);

var _convertInclude = require('./convert/twigtoxml/convert-include.js');

var _convertInclude2 = _interopRequireDefault(_convertInclude);

var _convertAttributes = require('./convert/xmltovue/convert-attributes.js');

var _convertAttributes2 = _interopRequireDefault(_convertAttributes);

var _convertConditionals = require('./convert/xmltovue/convert-conditionals.js');

var _convertConditionals2 = _interopRequireDefault(_convertConditionals);

var _convertIncludes = require('./convert/xmltovue/convert-includes.js');

var _convertIncludes2 = _interopRequireDefault(_convertIncludes);

var _convertLoops = require('./convert/xmltovue/convert-loops.js');

var _convertLoops2 = _interopRequireDefault(_convertLoops);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Converter
 *
 * The `tags` class represents converters based on found tags
 * in the templates.
 *
 * The `convert` method parses templates into comments, methods,
 * tags, and variables then uses those to convert it to a Vue template.
 *
 * Usage:
 *     node converter.js
 */
var Converter = function () {
    function Converter() {
        _classCallCheck(this, Converter);

        /**
         * HTML tags
         *
         * Value can have `tag` to return or
         * we can `convert` it to something else
         *
         * @var array
         */
        this.$tags = {
            'for': _convertFor2.default,
            'endfor': _convertFor2.default,
            'include': _convertInclude2.default,
            'if': _convertIf2.default,
            'elseif': _convertIf2.default,
            'else': _convertIf2.default,
            'endif': _convertIf2.default
        };
    }

    /**
     * Converts a Twig file to VueJS based on filepath or template
     *
     * @param  $filepathOrTemplate
     *
     * @return string
     */


    _createClass(Converter, [{
        key: 'twigToHtml',


        /**
         * Convert
         *
         * The outer array [0] has tags {% foo %}
         * The inner array [1] has no tags: foo
         *
         * @param  Parser $parser
         *
         * @return void
         */
        value: function twigToHtml($parser) {
            var _this = this;

            var $template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var $html = void 0,
                $innerItems = void 0,
                $outerItems = void 0,
                $tags = void 0;

            $tags = $parser.tags || [];
            $outerItems = $tags[0] || [];
            $innerItems = $tags[1] || [];
            $html = $template;

            // Loop through found tags like {% for ... %} and
            // convert them to HTML elements
            $outerItems.forEach(function ($outerValue, $index) {
                var $class = void 0,
                    $innerValue = void 0,
                    $params = void 0,
                    $tag = void 0;

                $innerValue = $innerItems[$index];

                // Get tag as identified
                $tag = _tagIdentifier2.default.identify($innerValue);
                $params = _tagIdentifier2.default.replace($innerValue);

                // Convert tags to HTML elements
                $class = _this.$tags[$tag];

                // Run convert on tag class
                $html = $class ? $class.convert($html, $tag, $outerValue, $params) : $html;
            });

            // Convert appends
            $html = Converter.fixAppends($html);

            // Convert comments
            $html = Converter.fixComments($html);

            return this.html = $html;
        }

        /**
         * Convert HTML to XML
         *
         * @param  $html
         *
         * @return object
         */

    }, {
        key: 'htmlToXml',
        value: function htmlToXml($html) {
            // @urgent, it has a problem with .decode
            // For some reason, `entities` is undefined when compiled?
            $html = _htmlEntities2.default.decode($html);
            $html = Converter.xmlEscape($html);

            // Replace tag openings inside quotes
            $html = (0, _preg_replace2.default)(/(?<=")([^"]+)( < )([^"]+)(?=")/gm, '$1 &lt; $3', $html);
            $html = (0, _preg_replace2.default)(/(?<=")([^"]+)( > )([^"]+)(?=")/gm, '$1 &gt; $3', $html);

            // Replace tag openings in quotes again? Not sure why. This one works
            // for `test.twig`, but what's up with the above?
            $html = (0, _preg_replace2.default)(/(?:=")([^"]+)(<)([^"]+)(?=")/gm, '="$1Xlt;$3', $html);
            $html = (0, _preg_replace2.default)(/(?:=")([^"]+)(>)([^"]+)(?=")/gm, '="$1Xgt;$3', $html);

            // Remove XMLNS attributes from SVG elements. This is a strange bug that will
            // unwrap the <svg> element and move is attributes to parent elements. The
            // best solution is to remove the xmlns="..." part
            $html = (0, _preg_replace2.default)(/(xmlns=\"[^"]+\")/gm, '', $html);

            return this.xml = $html;
        }

        /**
         * Convert XML to QP
         *
         * @see https://www.w3schools.com/xml/xpath_examples.asp
         * XPath examples:
         *
         *     .get('//div')
         *     .get("//span[contains(@class, 'my-span')]")
         *     .get("//div/div/span")
         *     .get("//div/div/span[2]")   <-- Index starts at 1
         *     .get("//div/div/strong")
         *
         * .get(...) Gets the first one
         * .find(...) Returns an array of them
         *
         * @param  $xml
         *
         * @return object
         */

    }, {
        key: 'xmlToQueryPath',
        value: function xmlToQueryPath($xml) {
            // Set
            // this.qp = libxmljs.parseXml($xml || this.xml);
            this.qp = new _queryPath2.default($xml || this.xml);

            return this.qp;
        }

        /**
         * Query Path to VueJS
         *
         * $queryPath[...]
         *    _encoding
         *    _getDtd
         *    _rngValidate
         *    _root
         *    _setDtd
         *    _toString
         *    _validate
         *    _version
         *    child
         *    childNodes
         *    encoding
         *    errors
         *    find
         *    get
         *    getDtd
         *    namespaces
         *    node
         *    rngValidate
         *    root
         *    setDtd
         *    toString
         *    type
         *    validate
         *    version
         *
         * childNodes()[0][...]
         *    _attr
         *    addCData
         *    addChild
         *    addNextSibling
         *    addPrevSibling
         *    attr
         *    attrs
         *    cdata
         *    child
         *    childNodes
         *    clone
         *    defineNamespace
         *    doc
         *    find
         *    get
         *    line
         *    name
         *    namespace
         *    namespaces
         *    nextElement
         *    nextSibling
         *    node
         *    parent
         *    path
         *    prevElement
         *    prevSibling
         *    remove
         *    replace
         *    text
         *    toString
         *    type
         *
         * .attr('...');
         *     clone
         *     doc
         *     line
         *     name
         *     namespace
         *     namespaces
         *     nextSibling
         *     node
         *     parent
         *     prevSibling
         *     remove
         *     toString
         *     type
         *     value()
         *
         * @param  $queryPath
         *
         * @return string
         */

    }, {
        key: 'queryPathToVue',
        value: function queryPathToVue($queryPath) {
            var $html = void 0;

            $html = _convertAttributes2.default.convert($queryPath);

            $html = _convertLoops2.default.convert($queryPath);

            $html = _convertIncludes2.default.convert($queryPath);

            $html = _convertConditionals2.default.convert($queryPath);

            $html = this.cleanup($queryPath.html() || '<!-- Failed to parse in QueryPath -->');

            return $html;
        }

        /**
         * Post HTML work after converting things
         *
         * @param  $html
         * @return string
         */

    }, {
        key: 'cleanup',
        value: function cleanup($html) {
            // Typically this is used for conditionals and shouldn't be encoded
            $html = $html.replaceAll('&amp;&amp;', '&&');

            // We want "&gt;" as literal within conditional attributes. It's not
            // standard XML, but it's used for templates.
            // @todo, we should regex here to check for quote wrappers
            $html = $html.replaceAll(' &gt; ', ' > ');
            $html = $html.replaceAll(' &lt; ', ' < ');

            // Replace arrows inside quotes
            $html = $html.replaceAll('Xgt;', '>');
            $html = $html.replaceAll('Xlt;', '<');

            return $html;
        }

        /**
         * Replace appends
         *
         * @param  $value
         *
         * @return string
         */

    }], [{
        key: 'convert',
        value: function convert($filepathOrTemplate) {
            var $html = void 0,
                $instance = void 0,
                $parser = void 0,
                $qp = void 0,
                $vueHtml = void 0,
                $xml = void 0;

            // Parse out comments, methods, tags, and variables
            $parser = new _parser2.default($filepathOrTemplate);
            $parser.parse();

            // Create instance of Converter
            $instance = new Converter();

            // Convert
            // @todo, do we need to pass in everything from parser?
            $html = $instance.twigToHtml($parser, $parser.template);

            // Convert our HTML tags into generic XML which helps
            // us find closing tags
            $xml = $instance.htmlToXml($html);

            // Use QueryPath to traverse through XML easier
            $qp = $instance.xmlToQueryPath($xml);

            // Convert our new XML into a Vue template
            $vueHtml = $instance.queryPathToVue($qp);

            return $vueHtml;
        }
    }, {
        key: 'fixAppends',
        value: function fixAppends($value) {
            $value = $value.replaceAll(' ~ ', ' + ');
            return $value;
        }

        /**
         * Replace comments
         *
         * @param  $value
         *
         * @return string
         */

    }, {
        key: 'fixComments',
        value: function fixComments($value) {
            $value = $value.replaceAll('{#', '<!--');
            $value = $value.replaceAll('#}', '-->');
            $value = $value.trim();
            return $value;
        }

        /**
         * Escape ampersands and others for the htmlToXml function
         *
         * @param  $string
         *
         * @return string
         */

    }, {
        key: 'xmlEscape',
        value: function xmlEscape($string) {
            return $string.replaceAll('&', '&amp;');
        }
    }]);

    return Converter;
}();

exports.default = Converter;