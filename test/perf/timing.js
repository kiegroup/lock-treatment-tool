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
const { performance } = require('perf_hooks');
const npmLock = require('../../lib/treat-locks/npm.lock');
const yarnLock = require('../../lib/treat-locks/yarn.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

const { log } = console;
console.log = () => {};
console.warn = () => {};
console.info = () => {};

const perfNPMv7 = () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com', true);

  // Act
  const startTime = performance.now();
  npmLock('./test/resources/npmv7', `./test/resources/npmv7/execution-${uuid}`, npmOptions);
  const endTime = performance.now();
  const duration = endTime - startTime;
  log(`npmv7 ran in: ${duration}`);
};

const perfNPM = () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com', true);

  // Act
  const startTime = performance.now();
  npmLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
  const endTime = performance.now();
  const duration = endTime - startTime;
  log(`npm ran in: ${duration}`);
};

const perfNPMShrinkWrap = async () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com', true);

  // Act
  const startTime = performance.now();
  npmLock('./test/resources/shrinkwrap', `./test/resources/shrinkwrap/execution-${uuid}`, npmOptions);
  const endTime = performance.now();
  const duration = endTime - startTime;
  log(`npm-shrinkwrap ran in: ${duration}`);
};

const perfYarn = () => {
  // Arrange
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com', false);

  // Act
  const startTime = performance.now();
  yarnLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
  const endTime = performance.now();
  const duration = endTime - startTime;
  log(`yarn ran in: ${duration}`);
};

perfNPMv7();
perfNPM();
perfYarn();
perfNPMShrinkWrap();
