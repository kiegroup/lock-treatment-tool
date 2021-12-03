#!/usr/bin/env node
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

const { argv } = require('yargs')
  .usage('Usage: $0 [options]')
  .boolean(['p', 's'])
  .alias('r', 'registry')
  .nargs('r', 1)
  .describe(
    'r',
    'sets the registry to replace the host from yarn.lock resolved field',
  )
  .example(
    '$0 --registry=https://npmregistry.redhat.com',
    'sets the registry just for the yarn.lock file',
  )
  .alias('p', 'replacePackageLockRegistry')
  .nargs('p', 0)
  .describe(
    'p',
    'replaces the package-lock.json registry instead of removing it',
  )
  .example(
    '$0 --registry=https://npmregistry.redhat.com --replacePackageLockRegistry',
    'sets the registry just for the yarn.lock file',
  )
  .alias('s', 'skipIntegrity')
  .nargs('s', 0)
  .describe('s', 'skips integrity removal')
  .example(
    '$0 --skipIntegrity',
    'sets the registry just for the yarn.lock file',
  )
  .alias('f', 'folder')
  .nargs('f', 1)
  .describe('f', 'sets the project folder')
  .example(
    '$0 --folder=/path/to/project',
    'treats the lock files from `/path/to/project` folder',
  )
  .alias('o', 'outputFolder')
  .nargs('o', 1)
  .describe('o', 'sets the output folder to save the lock files')
  .example(
    '$0 --outputFolder=/path/to/output/folder',
    'saves the treated lock files to `/path/to/output/folder` folder',
  )
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2019');

const npmLock = require('../lib/treat-locks/npm.lock');
const yarnLock = require('../lib/treat-locks/yarn.lock');
const NpmOptions = require('../lib/treat-locks/npm.options');

/**
 * It gets the registry from the line command in case registry is defined before `--`
 */
function getRegistryFromNpmCommand() {
  const original = process.env.npm_config_argv
    && JSON.parse(process.env.npm_config_argv).original;
  const registryArgument = original
    ? original.find((e) => e.startsWith('--registry='))
    : undefined;
  if (registryArgument) {
    const registry = registryArgument.trim().split('=');
    const registryValue = registry[1];
    console.log(
      '--registry value taken from npm/yarn arguments',
      registryValue,
    );
    return registryValue;
  }
  return undefined;
}

function run() {
  console.log('Treating fields...');
  const folderPath = argv.folder === undefined ? '.' : argv.folder;
  const outputFolderPath = argv.outputFolder === undefined ? folderPath : argv.outputFolder;
  const npmOptions = new NpmOptions(
    argv.registry || getRegistryFromNpmCommand(),
    argv.replacePackageLockRegistry,
    argv.skipIntegrity,
  );
  npmLock(folderPath, outputFolderPath, npmOptions);
  yarnLock(folderPath, outputFolderPath, npmOptions);
}

module.exports = run;
