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


const PACKAGE_LOCK_FILE_NAME = 'package-lock.json';
const SHRINKWRAP_FILE_NAME = 'npm-shrinkwrap.json';
const fileUtil = require('../utils/file.util');

function removeFields(dependencies) {
  Object.keys(dependencies).forEach((prop) => {
    const element = dependencies[prop];
    delete element.resolved;
    delete element.integrity;
    if (element.dependencies) {
      removeFields(element.dependencies);
    }
  });
}

/**
 * In the npm case the resolved and integrity fields should be removed
 * @param {string} folderPath the path where the lock file is
 * @param {string} outputFolder the path where the lock should be saved
 * @param {string} fileName the lock file name
 */
function removeLockFields(folderPath, outputFolder, fileName) {
  fileUtil.checkOutputFolderExistance(outputFolder);
  const fs = require('fs');
  const filePath = `${folderPath}/${fileName}`;
  const output = `${outputFolder}/${fileName}`;

  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    removeFields(json.dependencies);
    fs.writeFileSync(`${output}`, JSON.stringify(json, null, 2));
    console.log(`${output} fields removed.`);
    return false;
  }
  console.warn(`${filePath} does not exist`);
  return false;
}

function run(folderPath, outputFolder) {
  return removeLockFields(folderPath, outputFolder, PACKAGE_LOCK_FILE_NAME)
  || removeLockFields(folderPath, outputFolder, SHRINKWRAP_FILE_NAME);
}

module.exports = run;
