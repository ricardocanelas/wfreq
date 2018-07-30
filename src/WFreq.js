const _ = require('lodash')
const ExtractFile = require('./ExtractFile')

class WFreq {

    constructor(text = undefined) {
        this._text = text
        this._file = undefined
        this._limit = undefined
        this._max = undefined
        this._min = undefined
        this._order = 'desc'
        this._ignore = undefined
    }

    text(value) {
        this._text = value
        return this
    }

    file(value) {
        this._file = value
    }

    ignoreFile(value) {
        this._ignoreFile = value
        return this
    }

    limit(value) {
        this._limit = value
        return this
    }

    max(value) {
        this._max = value
        return this
    }

    min(value) {
        this._min = value
        return this
    }

    order(value) {
        this._order = value === 'asc' ? 'asc' : 'desc'
        return this
    }

    ignore(value) {
        if (Array.isArray(value)) {
            this._ignore = value
        } else {
            this._ignore = this.sanitize(value).replace(/[;:,.?¿\-!¡]+/g, '').match(/\S+/ig)
        }
        return this
    }

    sanitize(str) {
        str = str.trim();
        str = str.toLowerCase();
        str = str.replace(/\.{3}/gm, "")
        str = str.replace(/\-{2}/gm, "")
        str = str.replace(/\'/g, "\"")
        str = str.replace(/[\“\”]/g, "")
        str = str.replace(/[\.\,\;\:\!\?\(\)\&]/g, ' ');
        return str
    }

    process() {
        let str = this.sanitize(this._text)

        const re = /\S+/ig;
        let m, word;
        const counts = {};

        while ((m = re.exec(str)) != null) {
            word = m[0];

            if (!counts[word]) counts[word] = { label: word, counter: 0 }

            counts[word].counter = counts[word].counter + 1;
        }

        if (this._ignore) {
            for (const key of Object.keys(counts)) {
                if (this._ignore.indexOf(counts[key].label) !== -1) {
                    delete counts[key]
                }
            }
        }

        let result

        // Order
        result = _.orderBy(counts, ['counter', 'label'], [this._order, 'asc'])

        // Min
        if (this._min != undefined) {
            result = result.filter(word => {
                return word.counter >= this._min;
            })
        }

        // Max
        if (this._max != undefined) {
            result = result.filter(word => {
                return word.counter <= this._max;
            })
        }

        // Limit
        if (this._limit !== undefined) {
            result = result.slice(0, this._limit)
        }

        return result
    }

    async get() {
        if (this._ignoreFile) {
            const ignoreFile = new ExtractFile(this._ignoreFile)
            await ignoreFile.data().then(data => this.ignore(data))
        }

        if (this._file) {
            const file = new ExtractFile(this._file)
            await file.data().then(data => this.text(data))
        }

        return this.process()
    }
}

module.exports = WFreq