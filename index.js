#!/usr/bin/env node

const program = require('commander');
const WFreq = require('./src/WFreq')
const Write = require('./src/Write')

program
    .version('0.2')
    .description('Word Frequency Counter system')
    .option('--min <n>')
    .option('--max <n>')
    .option('--limit <n>')
    .option('--order <s>')
    .option('--ignore <s>')
    .option('--ignorefile <s>')
    .option('--output <s>')

program.parse(process.argv);

if (program.args[0] && program.args[0] !== 'serve') {
    const filename = program.args[0]
    const wfreq = new WFreq()
    const output = program.output || 'shell'

    wfreq.file(filename)
    if (program.min) wfreq.min(program.min)
    if (program.max) wfreq.max(program.max)
    if (program.order) wfreq.order(program.order)
    if (program.limit) wfreq.limit(program.limit)
    if (program.ignore) wfreq.ignore(program.ignore)
    if (program.ignorefile) wfreq.ignoreFile(program.ignorefile)

    wfreq.get()
        .then(data => {
            if (output === 'html') {
                Write.html(data)
            } else {
                Write.shell(data, filename)
            }
        })
} else {
    console.log('Serve: ', program.args[0]);

    if (program.args[0] === 'serve') {
        const app = require('./src/Server1')
        app.start();
    }
}