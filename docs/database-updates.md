# Database upgrades

There is a post-install and post-update script that runs when npm users update
jsbin. If you need to modify the database, you should put all your updates (for
each database type - currently we officially support MySQL & SQLite) in the
current version of jsbin.

When the update runs, the `build/post-update.js` script will look at the
previous version range to the current version, and search for `build/upgrade`
directories that match this range using [semver](http://semver.org/).

Steps:

1. Create new directory with the **current** version of jsbin (read from `package.json`)
2. Save your file as `<short-desc>-<date>.<db-type>.sql`

When jsbin is released to npm, the version will be bumped and upon install, the
user will be notified as to which migration scripts they need to run.