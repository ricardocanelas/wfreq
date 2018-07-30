const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

class Write {

    static getTable(data) {
        const head = () => {
            return `<tr>
                        <th class='col0'></th>
                        <th class='col1'>Word</th>
                        <th class='col2'>Frequency</th>
                    </tr>`
        }

        const row = (value) => {
            const id = 'word_' + value.label
            return `
            <tr>
                <td class='col0'><input type='checkbox' id='${id}' name='${id}' value='${value.label}'></td>
                <td class='col1'><label for='${id}'>${value.label}</label></td>
                <td class='col2'>${value.counter}</td>
            </tr>
            `
        }

        let dom = '<table>'
        dom += head()
        for (const word of data) {
            dom += row(word)
        }
        dom += '</table>'
        return dom;
    }

    static shell(data, file = undefined) {
        log('')
        if(file) log('File:', file)
        log('-------------------------')
        log(chalk.white.bgBlack.bold('Frequency | Word'))
        log('-------------------------')
        for (const word of data) {
            log(`       ${word.counter <= 9 ? ' ' + word.counter : word.counter} | ${word.label} `)
        }
        log('-------------------------')
        log(`Total: ${data.length} words`)
        log('')
    }

    static html(data, fileName = 'stat.html') {

        let html = `
        <html>
        <style>
            .col0 {
                padding: 0 10px 0 0;
            }
            .col1 {
                border-right: 1px solid #ccc;
                padding: 0 10px 0 0;
            }
            .col2 {
                padding: 0 0 0 10px;
            }
            .selected {
                position: fixed;
                top: 10px;
                right: 10px;
                bottom: 10px;
            }
            .selected textarea {
                width: 400px;
                height: 100%;
            }
        </style>
        <body>
        `
        html += `
            <head>
                <h1>Statistic</h1>
                <div class='summary'>
                    <div>Total: ${data.length} words</div>
                </div>
            </head>
        `

        html += Write.getTable(data)

        html += '<div class="selected"><textarea></textarea></div>'
        html += `
        <script>
            function triggerEvent(el, type){
                var e = document.createEvent('HTMLEvents');
                e.initEvent(type, false, true);
                el.dispatchEvent(e);
            }

            function getAllChecked() {
                var arr = []
                var checkboxes = document.querySelectorAll('input[type="checkbox"]');
                for (var i = 0; i < checkboxes.length; i++) {
                    if(checkboxes[i].checked) {
                        arr.push(checkboxes[i].value)
                    }
                }
                var textarea = document.querySelector('.selected textarea')
                textarea.value = arr.join('\\n')
            }

            var $checkboxes = document.querySelectorAll("input[type='checkbox']");
            for (var i = 0; i < $checkboxes.length; i++) {
                $checkboxes[i].addEventListener('change', function(event) {
                    getAllChecked();
                });
            }


        </script>
        `
        html += '</body></html>'

        const stream = fs.createWriteStream(fileName);

        stream.once('open', function(fd) {
            stream.end(html);
        });
    }
}

module.exports = Write