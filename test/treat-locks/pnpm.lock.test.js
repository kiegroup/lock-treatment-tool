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
const { v4: uuidv4 } = require('uuid');
const pnpmLock = require('../../lib/treat-locks/pnpm.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

const DOMAIN_REG_EX = /((https?:\/\/)|\s+)(([a-zA-Z0-9]+\.[a-zA-Z0-9]+)+\/)(([^\s/$]*\/)?[^\s]*)/;
const INTEGRITY_REG_EX = /^\s*((resolution:)|{)\s*integrity/;

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});

function checkDependencies(file, npmOptions) {
  const data = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < data.length; i += 1) {
    if (DOMAIN_REG_EX.test(data[i]) && !data[i].includes(npmOptions.registry)) return false;
    if (INTEGRITY_REG_EX.test(data[i]) && !npmOptions.skipIntegrity) return false;
  }
  return true;
}

test('Verify still working if the file pnpm-lock.yaml does not exist', async () => {
  // Assert pnpm lock treatment should not throw an error when yaml file is missing
  expect(pnpmLock('./test', './test')).toBe(false);
});

test('Verify it does not work when the file yarn.lock exists but registry does not', async () => {
  // Arrange
  const uuid = uuidv4();
  const baseFilename = './test/resources';

  // Assert pnpm lock treatment function should treat anything and not throw an error
  expect(
    pnpmLock(`${baseFilename}/pnpm/actual-file-test`, `${baseFilename}/execution-${uuid}/`),
  ).toBe(false);

  // Assert pnpm-lock.yaml file should not be created
  expect(
    fs.existsSync(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`),
  ).toBe(false);
});

test('Verify with a basic pnpm-lock.yaml file', async () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('redhat.com/');
  const baseFilename = './test/resources';

  // Assert yaml file was treated
  expect(
    pnpmLock(`${baseFilename}/pnpm/basic-test`, `${baseFilename}/execution-${uuid}/`, npmOptions),
  ).toBe(true);

  // Assert that yaml file was created
  expect(
    fs.existsSync(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`),
  ).toBe(true);

  // Assert that yaml file was treated correctly
  expect(checkDependencies(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`, npmOptions)).toBe(true);
});

test('Verify with a large pnpm-lock.yaml file', async () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('redhat.com/');
  const baseFilename = './test/resources';

  // Assert yaml file was treated
  expect(
    pnpmLock(`${baseFilename}/pnpm/actual-file-test`, `${baseFilename}/execution-${uuid}/`, npmOptions),
  ).toBe(true);

  // Assert that yaml file was created
  expect(
    fs.existsSync(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`),
  ).toBe(true);

  // Assert that yaml file was treated correctly
  expect(checkDependencies(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`, npmOptions)).toBe(true);
});

test('Verify skip integrity', async () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('redhat.com/', false, true);
  const baseFilename = './test/resources';

  // Assert yaml file was treated
  expect(
    pnpmLock(`${baseFilename}/pnpm/actual-file-test`, `${baseFilename}/execution-${uuid}/`, npmOptions),
  ).toBe(true);

  // Assert that yaml file was created
  expect(
    fs.existsSync(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`),
  ).toBe(true);

  // Assert that yaml file was treated correctly
  expect(checkDependencies(`${baseFilename}/execution-${uuid}/pnpm-lock.yaml`, npmOptions)).toBe(true);
});
