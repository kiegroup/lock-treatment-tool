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

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const npmLock = require('../../lib/treat-locks/npm.lock');
const commonLock = require('../../lib/treat-locks/common.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

function isDependencyOk(dependency, npmOptions = new NpmOptions()) {
  const resolvedCheck = npmOptions.replacePackageLockRegistry === true
    ? dependency.resolved !== undefined && dependency.resolved !== `${npmOptions.registry}${commonLock.getHost(dependency.resolved)}`
    : dependency.resolved === undefined;

  const integrityCheck = npmOptions.skipIntegrity === false
    ? dependency.registry === undefined
    : dependency.registry !== undefined;

  return resolvedCheck && integrityCheck;
}

function checkDependencies(dependencies, npmOptions) {
  return Object.keys(dependencies).find((prop) => {
    const dependency = dependencies[prop];
    return dependency.dependencies
      ? checkDependencies(dependency.dependencies)
      : isDependencyOk(dependency, npmOptions);
  }) !== undefined;
}

test('Verify still working if the file package-lock.json does not exist', () => {
  expect(npmLock('./test', './test')).toBe(false);
});

test('Verify it works when the file package-lock.json exists', () => {
  const uuid = uuidv4();
  expect(npmLock('./test/resources', `./test/resources/execution-${uuid}`)).toBe(true);
});

test('Verify package-lock.json', () => {
  const uuid = uuidv4();
  npmLock('./test/resources', `./test/resources/execution-${uuid}`);
  const json = JSON.parse(fs.readFileSync(`./test/resources/execution-${uuid}/package-lock.json`, 'utf8'));
  expect(checkDependencies(json.dependencies, undefined)).toBe(true);
});

test('Verify registry replacement', () => {
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com', true);
  npmLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
  const json = JSON.parse(fs.readFileSync(`./test/resources/execution-${uuid}/package-lock.json`, 'utf8'));
  expect(checkDependencies(json.dependencies, npmOptions)).toBe(true);
});

test('Verify skipRegistry', () => {
  const uuid = uuidv4();
  const npmOptions = new NpmOptions(undefined, false, true);
  npmLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
  const json = JSON.parse(fs.readFileSync(`./test/resources/execution-${uuid}/package-lock.json`, 'utf8'));
  expect(checkDependencies(json.dependencies, npmOptions)).toBe(true);
});
