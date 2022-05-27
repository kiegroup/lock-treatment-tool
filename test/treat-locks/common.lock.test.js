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

const commonLock = require('../../lib/treat-locks/common.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

test('Verify register has an appended final slash when input does not have a final slash', () => {
  const options = new NpmOptions('http://redhat.com');
  // Act
  expect(options.registry).toBe('http://redhat.com/');
});

test('Verify register has a single appended final slash when input does have a final slash', () => {
  const options = new NpmOptions('http://redhat.com/');
  // Act
  expect(options.registry).toBe('http://redhat.com/');
});

test('Verify yarnlock host replaced', () => {
  // Act
  expect(commonLock.replaceHost('  resolved "https://repository.engineering.redhat.com/nexus/repository/registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz#06e2ab19bdb535385559aabb5ba59729482800f8"', 'http://redhat.com/'))
    .toBe('  resolved "http://redhat.com/@babel/code-frame/-/code-frame-7.0.0.tgz#06e2ab19bdb535385559aabb5ba59729482800f8"');
});

test('Verify yarnlock getHost Ok', () => {
  // Act
  expect(commonLock.getHost('  resolved "https://repository.engineering.redhat.com/nexus/repository/registry.npmjs.org/@babel/code-frame/-/code-frame-7.0.0.tgz#06e2ab19bdb535385559aabb5ba59729482800f8"'))
    .toBe('https://repository.engineering.redhat.com/nexus/repository/registry.npmjs.org/');
});

test('Verify package-lock.json getHost Ok', () => {
  // Act
  expect(commonLock.getHost('https://repository.engineering.redhat.com/nexus/repository/registry.npmjs.org/@babel/code-frame/-/code-frame-7.5.5.tgz'))
    .toBe('https://repository.engineering.redhat.com/nexus/repository/registry.npmjs.org/');
});
