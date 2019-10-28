// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.argv._

'use strict';

const FILE_NAME = 'yarn.lock';

/**
 * In the yarn case the host from 'resolved' should be replaced by <INTERNAL_REGISTRY> https://github.com/yarnpkg/yarn/issues/5892#issuecomment-414796103
 * @param {string} folderPath the path where the lock file is
 * @param {string} outputFolder the path where the lock should be saved
 */
function run(folderPath, outputFolder, npmRegistry) {
    console.log(`npmRegistry ${npmRegistry}`)
    const fs = require('fs');
    const readline = require('line-reader');
    const filePath = `${folderPath}/${FILE_NAME}`;
    const output = `${outputFolder}/${FILE_NAME}`;

    let content = "";

    fs.readFile(filePath, 'utf8', (readErr) => {
        if (readErr) {
            console.warn(`${filePath} does not exist`);
        } else {
            if (npmRegistry === undefined) {
                console.warn(`${filePath} file exist but the registry has not been set. Please use --registry=<NPM_REGISTRY>`);
            } else {
                readline.eachLine(filePath, function (line, last) {
                    content = content.concat(_treatLine(line, npmRegistry));
                    if (last) {
                        fs.writeFile(`${output}`, content, writeErr => {
                            if (writeErr) {
                                console.log(`Error writing file ${output}`, writeErr);
                            } else {
                                console.log(`${output} resolved url replaced.`);
                            }
                        });
                    }

                });
            }
        }
    });
}

function _treatLine(line, npmRegistry) {
    if (line.startsWith('  resolved "http')) {
        return _replaceHost(line, npmRegistry).concat('\n');
    }
    if (line.startsWith('  integrity ')) {
        return '';
    }
    return line.concat('\n');
}

/**
 * 
 * @param {string} line the resolved line
 * @returns {string} the resolved line with the INTERNAL_REGISTRY flag
 */
function _replaceHost(line, npmRegistry) {
    return line.replace(/(https?):\/\/[^\s/$#]*\//, npmRegistry);
}

module.exports.run = run;