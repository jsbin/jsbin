Git
---

We have only one main branch in the JS Bin repository.

- master: Contains the very latest stable version of JS Bin. This is the one
  that will be live at the moment.

All features should be created in a new branch named
`feature/description-of-feature` eg. `feature/preprocessors`. A pull request
should be created for each feature branch, when it's ready it'll be merged into
development.

### Merging pull requests

Ideally pull requests should be applied using `git am` as [described
here][#am]. GitHub [happily generates][#ex] this patch by applying `.patch`
to the pull request url.

So to check a pull request does what it says it does you'll probably go
through a couple of steps. From the master branch create a test branch:

    $ git checkout -b pull-request-123 # Create a test branch

Then apply the users patch:

    $ curl https://github.com/jsbin/jsbin/pull/123.patch | git am

Then run and check the code works. If all's good merge it into master
and push it up to GitHub.

    $ git checkout master              # Jump back to master
    $ git merge pull-request-123       # Merge the pull request in
    $ git push origin master           # Push it up to GitHub
    $ git branch -D pull-request-123   # Delete your testing branch

And you're done.

If for some reason the code fails to apply or it doesn't do what you expect
you can just delete the test branch.

    $ git am --abort                   # Abort if the patch failed to apply
    $ git checkout master              # Jump back to master
    $ git branch -D pull-request-123   # Delete the broken test branch

Then in the pull request let the original author know what went wrong.

Deleting branches on GitHub
---------------------------

To delete a branch on GitHub you use the following command:

    $ git push origin :<branch-to-delete>

[#am]: http://git-scm.com/book/ch5-3.html#Applying-Patches-from-E-mail
[#ex]: https://github.com/jsbin/jsbin/pull/190.patch
