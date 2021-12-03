lock-treatment-tool
============

Helpers for treating npm lock files, like removing/replacing the registry from there...

Install from npmjs.org:

    `npm install -g @kie/lock-treatment-tool`

or run using `npx` or `exec`

    `npm exec @kie/lock-treatment-tool`
    `npx @kie/lock-treatment-tool`

> **_Note:_** In case you are behind a proxy or you need to use and internal registry please check [The `--registry` problem](#the-registry-problem)


## Current commands

 * **`locktt`**
   * Runs the lock treatment tool

## locktt

**What locktt will do**:
 - looks for package-lock.json, npm-shrinkwrap.json and yarn.lock files
 - removes the `resolved` and `integrity` fields from the package-lock.json and/or npm-shrinkwrap.json files in case it finds them
 - replaces the `resolved` field from yarn.lock file adding the `--registry` value instead of the host and remove the `integrity` field
 - overwrites/saves the file

**Usage**: `locktt [options]`

**Options**:
   * `--registry` *sets the registry to replace the host from lock files' `resolved` field*
   * `-p, --replacePackageLockRegistry` *replaces the package-lock.json the registry instead of removing it*
   * `-s, --skipIntegrity` *skips integrity removal*
   * `--folder` *sets the project folder to be treated*
   * `--outputFolder` *sets the output folder to save the lock files, otherwise will use the project folder and the files will be overwritten*

**Examples**:
  * `locktt --registry=https://npmregistry.redhat.com`        *sets the registry just for the yarn.lock file*
  * `locktt --registry=https://npmregistry.redhat.com -p`     *sets the registry for every lock file*
  * `locktt -s`                                               *skips the integrity field removal*

**locktt will abort if**:
 - the package-json.lock or npm-shrinkwrap.json file formats are not correct

**locktt will NOT abort if**:
 - the package-json.lock, npm-shrinkwrap.json or yarn.lock does not exist

**Typical usage, if you want to remove the fields**:

  locktt

## The `--registry` problem

One of the problems `locktt` tries to solve is to be able to install npm packages behing a proxy by using your own registry, and let's suppose the first thing you do is to execute locktt by executing `npx` or `npm exec` like:

`npm exec @kie/lock-treatment-tool`

It will fail (in case you haven't define `@kie` for using your registry on .npmrc file) since `@kie/lock-treatment-tool` library is not installed (let's supposed that) and you are behind a proxy, so you decide to specify a `--registry=THE_URL_TO_YOUR_REGISTRY` expecting to install the library using your registry. Fine!! It now works!! but... due to the [`-- npm problem`](https://docs.npmjs.com/cli/v8/commands/npm-run-script#description) you are not able to specify `--registry` either for `npm` and `locktt` execution.
We are glad to tell you this problems dissapears since locktt version >0.0.1, we decided to parse `process.env.npm_config_argv` arguments in case registry is not specified for locktt (`npm exec @kie/lock-treatment-tool -- --registry=THE_URL_TO_YOUR_REGISTRY`) but for npm (`npm exec @kie/lock-treatment-tool --registry=THE_URL_TO_YOUR_REGISTRY`).

> **_Note:_** In case you are behind a proxy or you need to use and internal registry just add `@kie:registry=YOUR_NPM_REGISTRY_URL` (replace `YOUR_NPM_REGISTRY_URL` by yours) or even `@kie:registry=${NPM_REGISTRY_URL}` (being `NPM_REGISTRY_URL` the environment variable pointing to your npm registry, you can use any other variable name)

## `frontend-maven-plugin` example

```
<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <executions>
      <execution>
          <id>install node and npm</id>
          <phase>initialize</phase>
          <goals>
              <goal>install-node-and-npm</goal>
          </goals>
          <configuration>
              <nodeVersion>${node.version}</nodeVersion>
              <npmVersion>${npm.version}</npmVersion>
          </configuration>
      </execution>
      <execution>
          <id>lock-treatment-tool execution</id>
          <phase>initialize</phase>
          <goals>
              <goal>npx</goal>
          </goals>
          <configuration>
              <arguments>@kie/lock-treatment-tool</arguments>
          </configuration>
      </execution>
  </executions>
</plugin>
```

> **_Note:_** In case you are behind a proxy or you need to use and internal registry please check [The `--registry` problem](#the-registry-problem)

### Restrictions

* Version **>=0.4.1**:
  * *NodeJS* >= 7.6.0
* Version **<=0.4.0**:
  * *NodeJS* >= 5.0.0

#### copyright

Looks at all the .js files in the current git repo and adds/updates a
standard copyright notice to the top. The exact wording of the copyright
statement is based on the license declared in package.json, your git author
details, and the first and last commits made to a file (years only).
