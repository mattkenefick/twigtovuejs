
export default function preg_match_all(regex, str) { // eslint-disable-line camelcase
    let matches = [...str.matchAll(regex)];
    let output = [];

    matches.forEach(item => {
        item.forEach((value, index) => {
            output[index] = output[index] || [];
            output[index].push(value);
        });
    });

    return output;
}
