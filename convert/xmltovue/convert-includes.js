
import QueryPath from '../../util/query-path.js';

/**
 * Converter
 */
export default class ConvertIncludes
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
        // Check for conditionals
        const $results = $queryPath.findAll('include');

        // Apply for includes
        $results.forEach(($item) => {
            let $attributes, $component;

            $component = $item.getAttribute('component');
            $attributes = $item.attributes;

            // Create element
            const element = $queryPath.createWith($component, $attributes);

            // Add to child
            $item.parentNode.insertBefore(element, $item);

            // Unwrap
            $queryPath.unwrap($item);
        });

        return $queryPath.html() || '';
    }
}
