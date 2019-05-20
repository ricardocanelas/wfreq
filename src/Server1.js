const express = require('express');
const fs = require('fs');
const dirTree = require("directory-tree");
const wfreq = require("./WFreq");

const translate = require('@k3rn31p4nic/google-translate-api');

const config = { PORT: 3001 }
const app = express();

const getFile = (filename, root = './') => {
  try {
      return fs.readFileSync(root + filename, 'utf8');
  } catch(e) {
      return undefined;
  }
}

// const ignorefile = getFile('ignoreWords.txt', './files/');
// console.log('Ignore')
// console.log(ignorefile)


app.set('port', config.PORT);

app.use('/static', express.static('./'));

// app.use(function(req, res, next) {
//   res.status(404).send('Sorry cant find that!');
// });

// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// })


app.get('/tree', function (req, res) {
  const data = dirTree("./", {
    extensions: /\.(txt|pdf|mobi|epub)$/,
    exclude: [/.git/, /node_modules/]
  })
  res.send({status: 'success', data: data });
});

app.get('/words/**', function (req, res) {
  let ignorefile = false
  if (req.query.ignore) ignorefile = getFile(req.query.ignore, './');

  // const data = getFile(req.params['0']);
  // if(data) {
    const freq = new wfreq();
    freq.file(req.params['0']);

    if(req.query.min) freq.min(req.query.min);
    if(req.query.max) freq.max(req.query.max);
    if(req.query.limit) freq.limit(req.query.limit);
    if(ignorefile) freq.ignore(ignorefile.toString());
    freq.get().then(response => {
      console.log("RESPONSE")
      console.log(response)
      return res.send({status: 'success', data: response});
    }).catch(error => {
      return res.send({status: 'error'});
    })

    // return res.send({status: 'success', data: words});
  // } else {
  //   return res.send({status: 'error'});
  // }
})
app.get('/translate/', async function (req, res) {

  translate('I speak\nEnglish very well!\nThanks', {from: 'en', to: 'pt'}).then(response => {
    console.log(response.text);
    res.send(response.text);
      //=> nl
  }).catch(err => {
    console.error(err);
    res.send('ops');
  });
})

app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

module.exports = {
  start: () => {
    app.listen(app.get('port'), function () {
      console.log('App listening on port ' + config.PORT);
    });
  }
}