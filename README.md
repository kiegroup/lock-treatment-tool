lock-treatment-tool
============

Helpers for treating npm lock files

Install from npmjs.org:

    npm install -g lock-treatment-tool

## Current commands

 * `locktt`
   * Runs the lock treatment tool
   * `--registry` sets the registry to replace the host from yarn.lock resolved field

### locktt

```
usage: locktt

What locktt will do:
 - look for package-lock.json, npm-shrinkwrap.json and yarn.lock files
 - remove the `resolved` and `integrity` fields from the package-lock.json and/or npm-shrinkwrap.json files in case it finds them
 - replace the `resolved` field from yarn.lock file adding the `--registry` value instead of the host and remove the `integrity` field
 - save the file

locktt will abort if:
 - the package-json.lock or npm-shrinkwrap.json file formats are not correct

locktt will NOT abort if:
 - the package-json.lock, npm-shrinkwrap.json or yarn.lock does not exist

Typical usage, if you want to remove the fields:

  locktt

```

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
          <id>npm install lock-treatment-tool and run-node</id>
          <phase>initialize</phase>
          <goals>
              <goal>npm</goal>
          </goals>
          <configuration>
              <arguments>install lock-treatment-tool --global-style --no-package-lock</arguments>
          </configuration>
      </execution>
      <execution>
          <id>lock-treatment-tool execution</id>
          <phase>initialize</phase>
          <goals>
              <goal>npm</goal>
          </goals>
          <configuration>
              <arguments>run env -- locktt</arguments>
          </configuration>
      </execution>
      <execution>
          <id>lock-treatment-tool execution</id>
          <phase>initialize</phase>
          <goals>
              <goal>npm</goal>
          </goals>
          <configuration>
              <arguments>run env -- locktt</arguments>
          </configuration>
      </execution>
      <execution>
          <id>yarn install</id>
          <goals>
              <goal>yarn</goal>
          </goals>
          <configuration>
              <arguments>install</arguments>
          </configuration>
      </execution>                            
  </executions>
</plugin>
```

#### copyright

Looks at all the .js files in the current git repo and adds/updates a
standard copyright notice to the top. The exact wording of the copyright
statement is based on the license declared in package.json, your git author
details, and the first and last commits made to a file (years only).
