
import QueryPath from '../../util/query-path.js';

const staticObject = {
    /**
     * Attributes we'll convert
     *
     * @todo Why don't we convert all attributes that have tags?
     *  I'm guessing because it's easier to NOT do it with query path?
     *
     * @var array
     */
    $attributesHtml: [
        'class',
        'href',
        'id',
        'style',
        'title',
    ]
}


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
export default class ConvertAttributes
{
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
        // $html = encodeURIComponent($html);
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

                // Kill new lines
                $newValue = $newValue.replaceAll('\n', '');
                $newValue = $newValue.replaceAll(/\s+/img, ' ');

                // Kill trailing empty strings + opening strings
                $newValue = $newValue.replaceAll(/^'\s/img, '\'');
                $newValue = $newValue.replaceAll(/\+\s''$/img, '');

                // Trim
                $newValue = $newValue.trim();

                // Set Vue style attribute
                $element.setAttribute($newAttribute, $newValue);

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
        let m, matches = [], regex, str;

        // v2: Adding the brackets
        regex = /\s([a-zA-Z\_\-]+)=["\'][^"\']+["\']/gmi;

        // v1: Why did we ignore the {{ brackets?
        // $regex = '#\s([a-zA-Z\_\-]+)=["\'](?={{)[^"\']+["\']#im';

        // $regex = '#\s([a-zA-Z\_]+)=["\'](?={{)["\']#im';
        // $html = '<a href="{{ header.href }}" title="{{ header.text">{{ header.title }}</a>';

        while ((m = regex.exec($html)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex == 1) {
                    matches.push(match);
                }
                // console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        }

        // Return matches
        if (matches.length > 1) {
            return matches.filter((el, index, arr) => {
                return index == arr.indexOf(el);
            });
        }
        else {
            return staticObject.$attributesHtml;
        }
    }
}
