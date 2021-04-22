
module.exports = function preg_replace_callback(pattern, callback, string) {
    [...string.matchAll(pattern)].forEach(value => {
        string = string.replace(value[0], callback(value));
    });

    return string;
}
