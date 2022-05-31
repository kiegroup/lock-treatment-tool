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

const FILE_NAME = 'pnpm-lock.yaml';
const fs = require('fs');
const fileUtil = require('../utils/file.util');
const NpmOptions = require('./npm.options');

const DOMAIN_REG_EX = /((https?:\/\/)|\s+)(([a-zA-Z0-9]+\.[a-zA-Z0-9]+)+\/)(([^\s/$]*\/)?[^\s]*)/;
const INTEGRITY_REG_EX = /^\s*((resolution:)|{)\s*integrity/;
const HTTP_REGEX = /(https?):\/\//;

function treatLine(line, npmOptions) {
  if (INTEGRITY_REG_EX.test(line) && !npmOptions.skipIntegrity) return '';
  return line.replace(DOMAIN_REG_EX, `$1${npmOptions.registry}$5`).concat('\n');
}

/**
 * In the yarn case the host from 'resolved' should be replaced by <INTERNAL_REGISTRY> https://github.com/yarnpkg/yarn/issues/5892#issuecomment-414796103
 * @param {string} folderPath the path where the lock file is
 * @param {string} outputFolder the path where the lock should be saved
 */
function run(folderPath, outputFolder, npmOptions = new NpmOptions()) {
  fileUtil.checkOutputFolderExistance(outputFolder);
  const filePath = `${folderPath}/${FILE_NAME}`;
  const output = `${outputFolder}/${FILE_NAME}`;

  if (fs.existsSync(filePath, 'utf8')) {
    if (npmOptions.registry === undefined) {
      console.warn(`${filePath} file exist but the registry has not been set. Please use --registry=<NPM_REGISTRY>`);
      return false;
    }
    const npmOptionsClone = npmOptions.clone();
    npmOptionsClone.registry = npmOptionsClone.registry.replace(HTTP_REGEX, '');
    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const content = data.reduce((acc, curr) => `${acc}${treatLine(curr, npmOptionsClone)}`, '');
    fs.writeFileSync(`${output}`, content);
    console.info(`${filePath} treated`);
    return true;
  }
  console.warn(`${filePath} does not exist`);
  return false;
}

module.exports = run;
