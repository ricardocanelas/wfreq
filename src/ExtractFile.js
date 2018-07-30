const fs = require('fs')
const easyPdfParser = require('easy-pdf-parser')
const parsePdf = easyPdfParser.parsePdf
const extractPlainText = easyPdfParser.extractPlainText
const EPub = require("epub");
const striptags = require('striptags');

class ExtractFile {
    constructor(filePath) {
        this._filePath = filePath
        this._type = filePath.substr(filePath.lastIndexOf('.') + 1);
    }

    readTXT(path, opts = 'utf8')  {
        return new Promise((res, rej) => {
            fs.readFile(path, opts, (err, data) => {
                if (err) rej(err)
                else res(data)
            })
        })
    }

    readPDF(path) {
        return parsePdf(path).then(extractPlainText)
    }

    readEPub(path) {
        return new Promise((res, rej) => {
            const epub = new EPub(path);
            let content = ''

            epub.on("end", err => {
                const hasFinished = (i) => {
                    if ((epub.flow.length - 1) === i) {
                        res(content)
                    }
                }

                if (err) rej(err)
                epub.flow.forEach(async function (chapter, index) {
                    epub.getChapter(chapter.id, function (err, text) {
                        content += striptags(text);
                        hasFinished(index)
                    });
                })
            })

            epub.parse()
        })
    }

    data() {
        if (this._type === 'txt') {
            return this.readTXT(this._filePath)
        } else if(this._type === 'epub') {
            return this.readEPub(this._filePath)
        } else if(this._type === 'pdf') {
            return this.readPDF(this._filePath)
        }
    }
}



module.exports = ExtractFile