# pibeac: A Physical Approach to Navigating the Web

The piBeac protocol makes use of Bluetooth LE (Low Energy) technology to allow a piBeac beacon (i.e., a Raspberry Pi) to broadcast a unique ID that can be picked up by a mobile device. A mobile application is able to automatically scan for these IDs and query the web server for information related to the beacon (e.g., owner information, URL, menu, etc.). Beacon owners can modify beacon mappings and view live foot traffic data in the web ui.

![web-ui](https://i.imgur.com/o9yXkyo.png)

## Backend/Frontend Deployment - https://pibeac.herokuapp.com/
Automated testing will occur for any branch pushed to the repository. Automatic deployment to the production server on Heroku occurs on changes to master. To deploy your changes, create a PR for your branch to master. After test scripts are run and passing, the site will be deployed once the changes are merged into master.


## Documentation
- [Backend Documentation](./backend/)
- [Frontend Documentation](https://janbro.github.io/pibeac/)

## Backend Development
First, make sure that you have `key.pem` and `cert.pem` files. You can generate them using this command:

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

Then create a private key to sign jwt user tokens

`export TOKEN_SIG=private_key`

Finally create the file `secrets.json` with mongodb credentials

```
{
    "MONGO_CREDENTIALS": "USER:PASSWORD"
}
```

`npm run start`

## Frontend Development
Change [config.ts](./frontend/src/app/helpers/config.ts) to point to `https://localhost:8080/api`

`npm run devbuild`

`npm run start`

## Git Flow
Create a branch for the feature you're working on from the master branch

`git checkout master`

`git checkout -b [mybranchname]`

Make your file changes, create commits, implement feature eg.

`git add *`

`git commit -m "[commitdescription]"`

After a commiting, it's probably a good idea to push your changes to the remote repository in case of the unfortunate event your computer bursts into flames and your local changes are unrecoverable.

`git push -u origin [mybranchname]`

Travis CI should run automated tests on the repo once its pushed and you can sleep safely knowing your changes will be saved.

After verifying the tests were succesful and the feature works, make a PR (pull request) on the master branch. Making a PR allows collaborators to review the code before pushing potentially breaking changes in master. Once you create the PR, get someone else to review it and if all tests are passing and the code is approved by a peer, then the branch can be merged.

Once the branch is merged into master, travis-ci will run final tests and push the changes to heroku to auto deploy. Any errors in the testing and auto deployment can be seen at https://github.com/janbro/???/deployments. After successfully merging, delete your upstream branch if it hasn't been already

`git push --delete origin [mybranchname]`

Before merging your feature branch into master, your commit log will probably look something like

```
commit 65e919a487d85278a5956bceac6d388ef4149a24 (HEAD -> my-feature-implementation, origin/my-feature-implementation)
Author: ??? <???@gmail.com>
Date:   Wed Oct 31 01:04:40 2018 -0400

    fix?

commit f2e99e62d7866ebe3ad97ece3618cc03787b7c26
Merge: 929ace1 5f1bab0
Author: ??? <???@gmail.com>
Date:   Wed Oct 31 00:55:39 2018 -0400

    Travis Deployment Scripts Test

commit 5f1bab032845f329316bbd206a79e619469f3891
Author: ??? <???@gmail.com>
Date:   Tue Oct 30 22:45:35 2018 -0400

    Added travis ci config and heroku deployment scripts, fixed garages endpoint

commit 929ace137be7db13564308e4b7404660d74ec66a (origin/master, master)
Author: ??? <???@gmail.com>
Date:   Mon Oct 22 21:13:06 2018 -0400

    Added garages and get garage by id endpoint
```

As you can see, the current branch is ahead of master by 3 commits. If the current branch were to be merged into master, all those commits will be retained, which leads to a bit of a messy commit history. What we can do is squash the commits for my feature into one commit ahead of master. To do this is relatively simple, first run 

`git rebase -i HEAD~3`

where 3 is the number of commits ahead from master, or 

`git rebase -i [commithash]`

where `[commithash]` is the hash of the commit the master branch is on. You'll be thrown into vim which is where this gets a bit dicey, but all that needs to be done is press `i` to insert into the document, change all the `pick`'s after your first commit from `pick` to `squash`. Git needs a commit to squash into which is why your first commit will stay `pick`. Now comes the vims worst feature, exiting. To exit the editor without saving changes, press `esc` and type `:q!`. To save the changes and continue with the rebase, type `:x` instead. When continuing with the rebase, git will ask you to squash the commit messages as well. Get rid of all lines without a `#` at the beginning and create a single commit message for all commits. After editing and saving the file, `:x`, your commits should now be squashed! No more lengthy commit logs being added to the commit history, features will now be squashed into single commits without losing version controlling within your own feature branch.

When your feature is done and you've squashed (or not) your commits into one, it's now time to push your branch to the remote repository.
