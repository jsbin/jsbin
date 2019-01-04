# Thoughts on using Github to back the Data

1. Create new repo
2. Use updateInformationAboutPagesSite to set "master" as published
3. Be able to create new files (ala bin) and do all the github dance

From this? https://octokit.github.io/rest.js/

## Create repo

const result = await octokit.repos.createForAuthenticatedUser({name, description, homepage, private, has_issues, has_projects, has_wiki, team_id, auto_init, gitignore_template, license_template, allow_squash_merge, allow_merge_commit, allow_rebase_merge})

Private by deafult. Then set the pages to master

## Managing files

Can we use this?

```
const result = await octokit.repos.updateFile({owner, repo, path, message, content, sha, branch, committer, committer.name, committer.email, author, author.name, author.email})
```
