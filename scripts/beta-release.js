const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const packageJson = require('../package.json');
const version = packageJson.version.split('.');

packageJson.version = `${version[0]}.${version[1]}.${process.argv[process.argv.length-1].substr(0, 7)}`;
packageJson.preview = true;

console.log(packageJson.version);
core.summary.addHeading(`Version info`).addDetails(`${packageJson.version}`);

fs.writeFileSync(path.join(path.resolve('.'), 'package.json'), JSON.stringify(packageJson, null, 2));