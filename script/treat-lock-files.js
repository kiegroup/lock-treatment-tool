#!/usr/bin/env node
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.argv._
 */

'use strict';

const npmLock = require('../lib/treat-fields/npm.lock');
const yarnLock = require('../lib/treat-fields/yarn.lock');

var argv = require('yargs').argv;

function run() {
    console.log("Treating fields...");
    const folderPath = argv.folder === undefined ? '.' : argv.folder;
    const outputFolderPath = argv.outputFolder === undefined ? folderPath : argv.outputFolder;
    _checkOutputFolderExistance(outputFolderPath);

    npmLock.run(folderPath, outputFolderPath);
    yarnLock.run(folderPath, outputFolderPath, argv.registry);
}

function _checkOutputFolderExistance(outputFolderPath) {
    var fs = require('fs');
    if (!fs.existsSync(outputFolderPath)) {
        console.log(`${outputFolderPath} folder does not exist. Creating it`);
        fs.mkdirSync(outputFolderPath);
    }
}

module.exports.run = run;