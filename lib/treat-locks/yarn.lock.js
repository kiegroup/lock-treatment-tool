// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.argv._

const FILE_NAME = 'yarn.lock';
const fs = require('fs');
const fileUtil = require('../utils/file.util');
const commonLock = require('./common.lock');
const NpmOptions = require('./npm.options');

function treatLine(line, npmOptions) {
  if (line.startsWith('  resolved "http')) {
    return commonLock.replaceHost(line, npmOptions.registry).concat('\n');
  }
  if (line.startsWith('  integrity ') && npmOptions.skipIntegrity === false) {
    return '';
  }
  return line.concat('\n');
}

/**
 * In the yarn case the host from 'resolved' should be replaced by <INTERNAL_REGISTRY> https://github.com/yarnpkg/yarn/issues/5892#issuecomment-414796103
 * @param {string} folderPath the path where the lock file is
 * @param {string} outputFolder the path where the lock should be saved
 */
async function run(folderPath, outputFolder, npmOptions = new NpmOptions()) {
  fileUtil.checkOutputFolderExistance(outputFolder);
  const filePath = `${folderPath}/${FILE_NAME}`;
  const output = `${outputFolder}/${FILE_NAME}`;

  if (fs.existsSync(filePath, 'utf8')) {
    if (npmOptions.registry === undefined) {
      console.warn(`${filePath} file exist but the registry has not been set. Please use --registry=<NPM_REGISTRY>`);
      return false;
    }
    let content = '';
    await fileUtil.readLineSync(filePath, async (line) => {
      content = content.concat(treatLine(line, npmOptions));
    });
    fs.writeFileSync(`${output}`, content);
    console.info(`${filePath} treated`);
    return true;
  }
  console.warn(`${filePath} does not exist`);
  return false;
}

module.exports = run;
