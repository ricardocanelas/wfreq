This utility allows you to get frequency of words from a file.

[![Build Status](https://travis-ci.org/ricardocanelas/wfreq.svg)](https://travis-ci.org/ricardocanelas/wfreq/)
<a href="https://www.npmjs.com/package/wfreq">
  <img src="https://img.shields.io/npm/dt/wfreq.svg" alt="NPM Downloads" />
</a>
<a href="https://www.npmjs.com/package/wfreq">
  <img src="https://img.shields.io/npm/v/wfreq.svg" alt="NPM Version" />
</a> (beta)

# Features

- Type file available: txt, pdf, epub
- Output: terminal or html file
- Filter by: minimum, maximum, limit, order
- Ignore a list of words

# Installation

```
npm install -g wfreq
```

# Usage

```
wfreq ./myfile.txt
```

# Commands

- Min
- Max
- Order
- Limit
- Ignore
- Output

## Min

```
wfreq ./myfile.txt --min 10
```

## Max

```
wfreq ./myfile.txt --max 5
```

## Order

```
wfreq ./myfile.txt --order desc
wfreq ./myfile.txt --order asc
```

## Limit

```
wfreq ./myfile.txt --limit 25
```

## Ignore

```
wfreq ./myfile.txt --ignore "foo, bar"
```

## Output

```
wfreq ./myfile.txt --output html
wfreq ./myfile.txt --output shell
```

# License

MIT