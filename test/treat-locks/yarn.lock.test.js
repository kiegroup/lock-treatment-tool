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

const { v4: uuidv4 } = require('uuid');
const fileUtil = require('../../lib/utils/file.util');
const yarnLock = require('../../lib/treat-locks/yarn.lock');
const commonLock = require('../../lib/treat-locks/common.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});

function checkLine(line, npmOptions) {
  if (line.startsWith('  resolved "http')) {
    return npmOptions.registry === commonLock.getHost(line);
  }
  if (line.startsWith('  integrity ') && npmOptions.skipIntegrity === false) {
    return npmOptions.skipIntegrity === false;
  }
  return true;
}

test('Verify still working if the file yarn.lock does not exist', () => {
  // Act && Assert
  expect(yarnLock('./test', './test')).toBe(false);
});

test('Verify it does not work when the file yarn.lock exists but registry', () => {
  // Arrange
  const uuid = uuidv4();

  // Act && Assert
  expect(yarnLock('./test/resources', `./test/resources/execution-${uuid}`)).toBe(false);
});

test('Verify it works when the file yarn.lock exists', async () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com/');

  // Act && Assert
  expect(yarnLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions)).toBe(true);

  await expect(fileUtil.readLineSync(`./test/resources/execution-${uuid}/yarn.lock`, async (line) => {
    expect(checkLine(line, npmOptions)).toBe(true);
  })).resolves.toBeUndefined();
});
