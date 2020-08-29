const R = require("ramda");
const fs = require("fs");

class ExtractFile {
  constructor(filePath) {
    this._filePath = filePath;
    this._type = filePath.substr(filePath.lastIndexOf(".") + 1);
  }

  readTXT(path, opts = "utf8") {
    return new Promise((res, rej) => {
      fs.readFile(path, opts, (err, data) => {
        if (err) rej(err);
        else res(data);
      });
    });
  }

  data() {
    if (this._type === "txt") {
      return this.readTXT(this._filePath);
    }

    return null;
  }
}

class WFreq {
  constructor(text = undefined) {
    this._text = text;
    this._file = undefined;
    this._limit = undefined;
    this._max = undefined;
    this._min = undefined;
    this._order = "desc";
    this._ignore = undefined;

    this.sortBy = {
      counterAndLabel: R.sortWith([
        R.descend(R.prop("counter")),
        R.ascend(R.prop("label")),
      ]),
    };
  }

  text(value) {
    this._text = value;
    return this;
  }

  file(value) {
    this._file = value;
  }

  ignoreFile(value) {
    this._ignoreFile = value;
    return this;
  }

  limit(value) {
    this._limit = value;
    return this;
  }

  max(value) {
    this._max = value;
    return this;
  }

  min(value) {
    if (isNaN(value)) return this;
    this._min = Number(value);
    return this;
  }

  order(value) {
    this._order = value === "asc" ? "asc" : "desc";
    return this;
  }

  ignore(value) {
    if (Array.isArray(value)) {
      this._ignore = value;
    } else {
      this._ignore = this.sanitize(value)
        .replace(/[;:,.?¿\-!¡]+/g, "")
        .match(/\S+/gi);
    }
    return this;
  }

  sanitize(str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/\.{3}/gm, "");
    str = str.replace(/\-{2}/gm, "");
    str = str.replace(/\'/g, '"');
    str = str.replace(/\’/g, '"');
    str = str.replace(/[\“\”]/g, "");
    str = str.replace(/[\.\,\;\:\!\?\(\)\&]/g, " ");
    return str;
  }

  process() {
    let str = this.sanitize(this._text);

    const re = /\S+/gi;
    let m, word;
    const counts = {};

    while ((m = re.exec(str)) != null) {
      word = m[0];

      if (!counts[word]) counts[word] = { label: word, counter: 0 };

      counts[word].counter = counts[word].counter + 1;
    }

    if (this._ignore) {
      for (const key of Object.keys(counts)) {
        if (this._ignore.indexOf(counts[key].label) !== -1) {
          delete counts[key];
        }
      }
    }

    // Transform to Array
    let result = Object.entries(counts).map(([key, values]) => values);

    // Sort + Order
    result = this.sortBy.counterAndLabel(result);

    // Min
    if (this._min != undefined) {
      result = result.filter((word) => {
        return word.counter >= this._min;
      });
    }

    // Max
    if (this._max != undefined) {
      result = result.filter((word) => {
        return word.counter <= this._max;
      });
    }

    // Limit
    if (this._limit !== undefined) {
      result = result.slice(0, this._limit);
    }

    return result;
  }

  async get() {
    if (this._ignoreFile) {
      const ignoreFile = new ExtractFile(this._ignoreFile);
      await ignoreFile.data().then((data) => this.ignore(data));
    }

    if (this._file) {
      const file = new ExtractFile(this._file);
      await file.data().then((data) => this.text(data));
    }

    return this.process();
  }
}

module.exports = WFreq;
