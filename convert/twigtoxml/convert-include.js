
const array_slice = require('../../polyfill/array_slice.js');
const preg_match = require('../../polyfill/preg_match.js');
const preg_replace = require('../../polyfill/preg_replace.js');
const preg_replace_callback = require('../../polyfill/preg_replace_callback.js');

const dJSON = require('dirty-json');
const StringUtility = require('../../util/string.js');

/**
 * Converter
 */
class ConvertInclude
{
    /**
     * Prevents us from creating attributes for object references
     * and only allows literal values, like :property="'String'"
     * as opposed to :foo="bar"
     *
     * @todo  Why did we want this?
     * @todo  How can we toggle this from an app?
     *
     * @var boolean
     */
    static $onlyLiteralAttributes = false;

    /**
     * Convert
     *
     * @param  $str
     * @param  $tag
     * @param  $outerValue
     * @param  $attributeValue
     *
     * @return string
     */
    static convert($str, $tag, $outerValue, $attributeValue)
    {
        switch ($tag) {
            case 'include':
                return ConvertInclude.convertInclude($str, $outerValue, $attributeValue);
        }
    }

    /**
     * Convert Include
     *
     * @param  $str
     * @param  $tag
     * @param  $outerValue
     * @param  $attributeValue
     *
     * @return string
     */
    static convertInclude($str, $outerValue, $attributeValue)
    {
        let $a, $attributes, $b, $bob,
            $component, $filepath, $jsonStr,
            $matches, $parts, $with, $value;

        // Take the latter half of the concatenation to simplify the regex
        $a = $attributeValue.indexOf(' ~ ') > 1
            ? $attributeValue.substr($attributeValue.indexOf(' ~ ') + 3)
            : $attributeValue;

        // Convert outerValue to use new attributeValue
        $b = $outerValue.replaceAll($attributeValue, $a);

        // Parse out the filename
        // This new regex asks for the last version
        $matches = preg_match(/(\'|\")((.*)\/?)(\.twig)?(\'|\")\s+?(?:%}|with)/gm, $b);

        // Get items within the quotes, "view/inner/foo/bar.twig"
        $matches = array_slice($matches, 2, -2);
        $filepath = $matches[0].replaceAll('.twig', '');
        $filepath = preg_replace(/[^a-zA-Z0-9\/]/gm, '', $filepath);

        // Break up path into words
        $parts = $filepath.split('/');

        // Check if last two items the same
        if ($parts.length >= 2 && $parts[$parts.length - 1] === $parts[$parts.length - 2]) {
            $parts.pop();
        }

        // Combine into things like ViewInnerFooBar
        $component = $parts.map(x => x[0].toUpperCase() + x.substr(1)).join('');

        // Attributes between with { } brackets
        $attributes = '';

        // @todo implement me
        $with = StringUtility.between($attributeValue, '{', '}', true);

        $jsonStr = '{ ' + $with + ' }';

        // Convert inner commas otherwise we'd have to do some sort of lookahead
        // expression that I'm unsure how to do
        $jsonStr = preg_replace_callback(/\(([^)]+)\)/g, function($matches) {
            return $matches[0].replaceAll(',', '^^^');
        }, $jsonStr);

        // Convert functions and variables to literals for JSON conversion
        // $jsonStr = preg_replace_callback('#:\s?([a-zA-Z][^,]+),#im', function($matches) {
        // $jsonStr = preg_replace_callback('#:\s?([a-zA-Z0-9\_]+),?$#im', function($matches) {
        $jsonStr = preg_replace_callback(/:\s?([a-zA-Z][^,]+),?$/gm, function($matches) {
            $value = $matches[1];
            $value = $value.replaceAll('"', '\'');
            $value = $value.replaceAll(',', '^^^');
            return ': "@@' + $value + '",';
        }, $jsonStr);

        // Convert to JSON
        $bob = dJSON.parse($jsonStr);

        // Iterate through
        for (var $key in $bob) {
            let $x, $value;

            $value = $bob[$key];

            // Remove null array data
            if (typeof($value) == 'array') {
                $value = $value.filter(x => x != '');
                // $value = array_filter($value);
            }

            // Encode
            $x = JSON.stringify($value);

            // Revert functions, variables, and commas
            $x = preg_replace(/["]?@@([^"]+)"?/gm, '$1', $x);
            $x = $x.replaceAll('\/', '/');
            $x = $x.replaceAll('^^^', ',');

            // Escape existing singles
            $x = $x.replaceAll('\'', '\\\'');

            // Convert doubles to singles
            $x = $x.replaceAll('"', '\'');

            // Wrap in quotes
            $x = "\"" + $x + "\"";

            // Fix literal strings
            $x = preg_replace(/""(.*)""/gm, "\"'$1'\"", $x);

            $attributes += ":" + $key + "=" + $x + "\n\n\n";
        };

        // Convert concatenated variables
        $attributes = $attributes.replaceAll("\' ~", "' ~");
        $attributes = $attributes.replaceAll("~ \'", "~ '");

        $value = $str.replace($outerValue, '<include component="' + $component + '" ' + $attributes + ' />');

        return $value;
    }
}


// For testing
// ----------------------------------------------------------------------------

if (require.main === module) {
    // Not implemented
}
else {
    module.exports = ConvertInclude;
}
