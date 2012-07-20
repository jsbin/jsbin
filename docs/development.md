Git
---

We have two main branches on the jsbin repository.

- master: Contains the very latest stable version of JSBin. This is the one
  that will be live at the moment.
- development: The currently in development version. This should be stable
  but y'know it might not be.

All features should be created in a new branch named
`feature/description-of-feature` eg. `feature/preprocessors`. A pull request
should be created for each feature branch, when it's ready it'll be merged into
development.

### Merging pull requests

Ideally pull requests should be applied using `git am` as [described
here][#am]. GitHub happily generates this patch by applying `.patch` to the
pull request url:

    $ curl http://github.com/remy/jsbin/pull/123.patch | git am

So to check a pull request does what it says it does you'll probably go
through a couple of steps. From the development branch create a test branch:

    $ git checkout -b pull-request-123 # Create a test branch

Then apply the users patch:

    $ curl http://github.com/remy/jsbin/pull/123.patch | git am

Then run and check the code works. If all's good merge it into development
and push it up to GitHub.

    $ git checkout development         # Jump back to development
    $ git merge pull-request-123       # Merge the pull request in
    $ git push origin development      # Push it up to GitHub
    $ git branch -D pull-request-123   # Delete your testing branch

And you're done.

[#am]: http://git-scm.com/book/ch5-3.html#Applying-Patches-from-E-mail
