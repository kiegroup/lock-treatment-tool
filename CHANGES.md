2019-10-29, Version 0.3.0
=========================

 - commander library replaced by yargs due to commander can't handle not defined arguments

2019-10-28, Version 0.2.0
=========================

 - yarn.lock: replace the `resolved` host by the one from `--registry` value

2019-10-28, Version 0.0.3
=========================

 - remove the integrity field from yarn.lock file

2019-10-25, Version 0.0.1
=========================

lock files treatment tool added:
 - look for package-lock.json, npm-shrinkwrap.json and yarn.lock files
 - remove the `resolved` and `integrity` fields from package-lock.json and/or npm-shrinkwrap.json in case it finds it
 - replace the `resolved` field from yarn.lock file adding `<INTERNAL_REGISTRY>` instead of the host
 - save the file/s

