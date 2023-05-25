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

jest.mock('../../lib/treat-locks/npm.lock');
jest.mock('../../lib/treat-locks/yarn.lock');
jest.mock('../../lib/treat-locks/npm.options');

const npmLockMock = require('../../lib/treat-locks/npm.lock');
const yarnLockMock = require('../../lib/treat-locks/yarn.lock');
const pnpmLockMock = require('../../lib/treat-locks/pnpm.lock');
const NpmOptionsMock = require('../../lib/treat-locks/npm.options');

const spy = jest.fn();

function Mock(...args) {
  spy(...args);
  NpmOptionsMock.apply(this, args);
}
Mock.prototype = NpmOptionsMock.prototype;

global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('treat-lock-files no args', () => {
  beforeEach(() => {
    process.argv = [];
    NpmOptionsMock.mockClear();
  });

  test('Run without args', () => {
    // Arrange
    const treatLockFiles = require('../../script/treat-lock-files');

    // Act
    treatLockFiles();

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(NpmOptionsMock).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
    expect(npmLockMock).toHaveBeenCalledWith(
      '.',
      '.',
      expect.any(NpmOptionsMock),
    );
    expect(yarnLockMock).toHaveBeenCalledWith(
      '.',
      '.',
      expect.any(NpmOptionsMock),
    );
    expect(pnpmLockMock).toHaveBeenCalledWith(
      '.',
      '.',
      expect.any(NpmOptionsMock),
    );
  });
});
