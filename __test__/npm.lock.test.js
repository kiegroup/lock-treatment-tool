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

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const npmLock = require('../lib/treat-fields/npm.lock');

function checkDependencies(dependencies) {
  return Object.keys(dependencies).find((prop) => {
    const element = dependencies[prop];
    return element.dependencies ? checkDependencies(element.dependencies)
      : !(element.resolved !== undefined || element.integrity !== undefined);
  }) !== undefined;
}

test('Verify still working if the file does not exist', () => {
  expect(npmLock('./test', './test')).toBe(false);
});

test('Verify package-lock.json', () => {
  const uuid = uuidv4();
  npmLock('./__test__/resources', `./__test__/resources/execution-${uuid}`);
  const json = JSON.parse(fs.readFileSync(`./__test__/resources/execution-${uuid}/package-lock.json`, 'utf8'));
  expect(checkDependencies(json.dependencies)).toBe(true);
});
