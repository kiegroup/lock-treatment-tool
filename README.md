lock-treatment-tool
============

Helpers for treating npm lock files

Install from npmjs.org:

    npm install -g lock-treatment-tool

## Current commands

 * `locktt`
   * Runs the lock treatment tool

### locktt

```
usage: locktt

What locktt will do:
 - look for package-lock.json, npm-shrinkwrap.json and yarn.lock files
 - remove the `resolved` and `integrity` fields from the package-lock.json and/or npm-shrinkwrap.json files in case it finds them
 - replace the `resolved` field from yarn.lock file adding `<INTERNAL_REGISTRY>` instead of the host
 - save the file

locktt will abort if:
 - the package-json.lock or npm-shrinkwrap.json file formats are not correct

locktt will NOT abort if:
 - the package-json.lock, npm-shrinkwrap.json or yarn.lock does not exist

Typical usage, if you want to remove the fields:

  locktt

```

#### copyright

Looks at all the .js files in the current git repo and adds/updates a
standard copyright notice to the top. The exact wording of the copyright
statement is based on the license declared in package.json, your git author
details, and the first and last commits made to a file (years only).
