
const QueryPath = require('../../util/query-path.js');

/**
 * Converter
 *
 * This class attempts to fix attributes that have logic in them
 * such as:
 *
 *     <div class="{{ foo }}">
 *
 * Becomes:
 *
 *     <div :class="foo">
 */
class ConvertAttributes
{
    /**
     * Attributes we'll convert
     *
     * @todo Why don't we convert all attributes that have tags?
     *  I'm guessing because it's easier to NOT do it with query path?
     *
     * @var array
     */
    static $attributesHtml = [
        'class',
        'href',
        'id',
        'style',
        'title',
    ];

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
    static convert($queryPath)
    {
        let $attributes, $html;

        $html = $queryPath.html() || '';
        $html = encodeURIComponent($html);
        $attributes = ConvertAttributes.getAttributesFromHtml($html);

        // Parse attributes
        $attributes.forEach(($attribute) => {
            let $elements;

            $elements = $queryPath.findAll('[' + $attribute + '*="{{"]');

            // Loop through presentation attributes with variables
            $elements.forEach(($element) => {
                let $attributeValue, $newAttribute, $newValue;

                $attributeValue = $element.getAttribute($attribute);

                // Set values
                $newAttribute = ':' + $attribute;
                $newValue = $attributeValue;
                // $newValue = Util\StringUtility.removeTags($attributeValue);

                // Convert brackets to quotes
                $newValue = $newValue.replaceAll('{{', "' + ");
                $newValue = $newValue.replaceAll('}}', " + '");
                $newValue = "'" + $newValue + "'";

                // Fix empty brackets
                $newValue = $newValue.replaceAll("'' + ", '');
                $newValue = $newValue.replaceAll("' ' + ", '');
                $newValue = $newValue.replaceAll(" + ''", '');
                $newValue = $newValue.replaceAll(" + ' '", '');

                // Trim
                $newValue = $newValue.trim();

                // Set Vue style attribute
                $element.setAttribute($newAttribute, $newValue);

                console.log('Setting attribute:', $newAttribute, $newValue);

                // Remove old attribute
                $element.removeAttribute($attribute);
            });
        });

        return $queryPath.html() || '';
    }

    /**
     * Extract attributes using variables from HTML
     */
    static getAttributesFromHtml($html)
    {
        let $matches, $pattern;

        // v2: Adding the brackets
        $pattern = new RegExp('\s([a-zA-Z\_\-]+)=["\'][^"\']+["\']', 'img');

        // v1: Why did we ignore the {{ brackets?
        // $regex = '#\s([a-zA-Z\_\-]+)=["\'](?={{)[^"\']+["\']#im';

        // $regex = '#\s([a-zA-Z\_]+)=["\'](?={{)["\']#im';
        // $html = '<a href="{{ header.href }}" title="{{ header.text">{{ header.title }}</a>';

        // Run matching
        $matches = [...$html.matchAll($pattern)];

        // Return matches
        if ($matches.length > 1) {
            return $matches[1].filter((el, index, arr) => {
                return index == arr.indexOf(el);
            });
        }
        else {
            return ConvertAttributes.$attributesHtml;
        }
    }

}


// For testing
// ----------------------------------------------------------------------------

if (require.main === module) {
    // Not implemented
}
else {
    module.exports = ConvertAttributes;
}
