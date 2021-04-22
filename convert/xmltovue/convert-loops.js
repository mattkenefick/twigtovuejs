
const QueryPath = require('../../util/query-path.js');

/**
 * Converter
 */
class ConvertLoops
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
        const $results = $queryPath.findAll('for');

        // Apply for loops
        $results.forEach(($item) => {
            let $attributeValue, $child, $collection,
                $iterator, $matches, $model, $original;

            $iterator = $item.getAttribute('iterator');
            $matches = /([^ ]+) (?:of|in) (.*)$/.exec($iterator);

            // Deconstruct matches
            [$original, $model, $collection] = $matches;

            // Get child
            $child = $item.children[0];

            // Apply
            $attributeValue = '(' + $model + ', index) of ' + $collection;
            $child.setAttribute('v-for', $attributeValue);
            $child.setAttribute('v-bind:key', 'index');

            // Remove the for loop
            $queryPath.unwrap($child.parentNode);
        });

        return $queryPath.html() || '';
    }
}


// For testing
// ----------------------------------------------------------------------------

if (require.main === module) {
    // Not implemented
}
else {
    module.exports = ConvertLoops;
}
