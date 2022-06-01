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

class NpmOptions {
  constructor(registry = undefined, replacePackageLockRegistry = false, skipIntegrity = false) {
    this.registry = (registry !== undefined && registry.charAt(registry.length - 1) !== '/') ? `${registry}/` : registry;
    this.replacePackageLockRegistry = replacePackageLockRegistry;
    this.skipIntegrity = skipIntegrity;
  }

  toString() {
    return `{registry: ${this.registry},
    replacePackageLockRegistry: ${this.replacePackageLockRegistry},
    skipIntegrity: ${this.skipIntegrity}}`;
  }

  clone() {
    return new NpmOptions(this.registry, this.replacePackageLockRegistry, this.skipIntegrity);
  }
}

module.exports = NpmOptions;
