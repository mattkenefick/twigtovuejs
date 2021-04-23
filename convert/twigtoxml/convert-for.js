
/**
 * Converter
 */
export default class ConvertFor
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
    static convert($str, $tag, $outerValue, $attributeValue)
    {
        switch ($tag) {
            case 'for':
                return ConvertFor.convertFor($str, $outerValue, $attributeValue);

            case 'endfor':
                return ConvertFor.convertEndFor($str, $outerValue, $attributeValue);
        }
    }

    /**
     * Convert For
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertFor($str, $outerValue, $attributeValue)
    {
        let $value;

        $value = $str.replaceAll($outerValue, '<for iterator="' + $attributeValue + '">');

        return $value;
    }

    /**
     * Convert EndFor
     *
     * @param  string $str
     * @param  string $tag
     * @param  string $outerValue
     * @param  string $attributeValue
     *
     * @return string
     */
    static convertEndFor($str, $outerValue, $attributeValue)
    {
        let $value;

        $value = $str.replaceAll($outerValue, '</for>');
        return $value;
    }
}
