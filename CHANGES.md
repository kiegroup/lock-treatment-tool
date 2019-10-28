2019-10-25, Version 0.0.1
=========================

`integrity` field removed from yarn.lock:
 - remove the integrity field from yarn.lock file

lock files treatment tool added:
 - look for package-lock.json, npm-shrinkwrap.json and yarn.lock files
 - remove the `resolved` and `integrity` fields from package-lock.json and/or npm-shrinkwrap.json in case it finds it
 - replace the `resolved` field from yarn.lock file adding `<INTERNAL_REGISTRY>` instead of the host
 - save the file/s

