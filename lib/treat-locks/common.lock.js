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

const REG_EX = /(https?:\/\/[^\s$#^@]*\/)((@[^\s/$]*\/)?[^\s/$]*\/-\/.*)/;

/**
 *
 * @param {string} resolvedField the resolved field
 * @param {string} registry the registry to replace for
 * @returns {string} the resolved line with the INTERNAL_REGISTRY flag
 */
function replaceHost(resolvedField, registry) {
  const treatedRegistry = registry.charAt(registry.length - 1) !== '/' ? `${registry}/` : registry;
  return resolvedField.replace(REG_EX, `${treatedRegistry}$2`);
}

/**
 *
 * @param {sring} resolvedField the resolved field
 */
function getHost(resolvedField) {
  return resolvedField.match(REG_EX)[1];
}

module.exports.replaceHost = replaceHost;
module.exports.getHost = getHost;
