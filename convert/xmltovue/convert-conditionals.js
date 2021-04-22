
const QueryPath = require('../../util/query-path.js');

/**
 * Converter
 */
class ConvertConditionals
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
        ConvertConditionals._convert($queryPath, 'if');
        ConvertConditionals._convert($queryPath, 'elseif', 'else-if');
        ConvertConditionals._convert($queryPath, 'else');

        return $queryPath.html() || '';
    }

    /**
     *
     */
    static _convert($queryPath, $searchType, $attributeType = null)
    {
        // Convert one type to another
        if ($attributeType === null) {
            $attributeType = $searchType;
        }

        // Check for conditionals
        const $results = $queryPath.findAll($searchType);

        // Iterate through results
        $results.forEach(($item, key) => {
            let $attributeValue, $condition, $child;

            // Get condition type
            $condition = $item.getAttribute('condition');

            // Get child
            $child = $item.querySelector('*');

            // Apply
            $attributeValue = $condition;
            $attributeValue = $attributeValue.replaceAll(' and ', ' && ');
            $attributeValue = $attributeValue.replaceAll(' or ', ' || ');
            $attributeValue = $attributeValue.replaceAll('&gt;', '>');
            $attributeValue = $attributeValue.replaceAll('&lt;', '<');

            $child.setAttribute('v-' + $attributeType, $attributeValue);

            // Remove the for loop
            $queryPath.unwrap($child.parentNode);
        });

        return $queryPath;
    }
}


// For testing
// ----------------------------------------------------------------------------

if (require.main === module) {
    // Not implemented
}
else {
    module.exports = ConvertConditionals;
}
