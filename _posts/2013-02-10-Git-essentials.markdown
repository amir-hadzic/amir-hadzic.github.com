---
layout: post
title: Git essentials
---

I believe that there are a few things that are essential to having a clean and
informative source code revision history when using distributed version control
systems such as Git. Let me try to explain a few of them and why it's so
important to care about your project's source code history.

<!-- more start --> 

Your revision history should tell a story. It should tell a story of how you
and your team built the project. It should tell a story to the new developer
about which problems you encountered and what you changed in order to resolve
those problems. It should tell a story to you about what your teammates are
working on. That's why the history needs to be clean and informative.

## Avoid unnecessary merge commits when pulling

When you try to pull changes from a remote repository and you already committed
some changes in your local repository git will create a merge commit and prompt
you to write a commit message. If you worked with git in a team you probably
came across this behaviour. The first few times this happened to me I just made
the merge commit and didn't think too much about it.

Doing this often will pollute your history. It's kinda hard to read who
committed what when every other commit is a unnecessary merge commit. Being
guilty of doing this more than once I searched for a solution and found one
fairly fast: **use "git pull -\-rebase" when pulling from a remote
repository**.  This will pull the remote commits and apply your commits on top
of them. It will look like you had the remote changes in your repository the
whole time and you will avoid creating unnecessary merge commits.

## Write meaningful commit messages

This is the basic requirement for having a informative history. There are quite
a few rants out there on the Internet about good (and bad) commit messages from
people far smarter than I so I suggest looking them up. Most of them boil down
to having a header line (in imperative voice) that summarizes the changes and a
more detailed description in a separate paragraph if necessary. 

Your commit message should look like this:

    Show daily expenses on the dashboard

    - Daily expenses are now grouped by category and shown on the dashboard
    - Added test that checks if the daily expenses are properly displayed

The header line should summarize your changes and you should use the
description area to add more specific details about your changes. Note that the
header line is in imperative voice. Think of it as ordering your source code to
change instead of admitting that you changed it (eg.  "Show daily expenses on
the dashboard" instead of "Added a list of daily expenses on the dashboard"). 

I've used the description field to add usage instructions when building command
line tools too since that increases the chances that a coworker will spot that
something is missing or he/she will have less problems using and testing the
tool. Remember, the history should tell a story.

If you want some real-world examples of good commit messages you can always
browse some well-known open source projects.

## Commit often and don't be afraid to reorganize local (unpublished) changes

Whenever you feel like you just completed one logical chunk of work required to
implement something, commit the changes. Think of these commits as checkpoints.
Remember, in git you don't have to publish all these commits individually, you
can reorganize them once you are ready to push the changes to your project's
main git repository for everyone to see and use.

Imagine the following scenario. Your blog engine doesn't display posts in
chronological order and you need to fix this. First order of business is to
create a test which checks if blog posts are ordered chronologically. You run
the test and it's failing as you noticed earlier. You commit the added test.

    1bbc73 Add test which checks if posts are ordered chronologically.

Now you need to actually add ordering to your database query which retrieves
the posts from the database. This will fix the test that you just added. You do
that and test the functionality by running the previously added test. The test
is passing so you commit the changes. Your history now looks like this:


    1bbc73 Add test which checks if posts are ordered chronologically.  
    fab213 Order posts chronologically.

Everything seems fine but you also check it manually by running the engine on
your local machine just to be sure. You open the archive page and you notice
that the posts are not ordered correctly. You remember that you wanted to
refactor that part of the blog so that it uses the same mechanism for
retrieving posts as your main page. You go back to the editor and make the
necessary modifications. Your history now contains three commits.


    1bbc73 Add test which checks if posts are ordered chronologically.  
    fab213 Order posts chronologically.  
    4g3jbb Fix order of posts on the archive page.

It's time to share your changes with others. You run all of your tests to see
if you broke anything and take a sip of your water/coffee to reward yourself.
As I said before, the commits that you made were checkpoints and it's up to you
to decide if you want to share them as such with others. This set of commits
don't look that bad on their own and you could push them to your main git
repository as such but I invite you to consider a different approach.

You see, if someone checks out the first commit only without the other two
commits his tests will be in a bad state. If he checks out the second commit
without the last commit then the posts on the archive page are not going to be
ordered properly.  Your teammates really need all three commits to agree that
the problem with ordering is fixed.

Also, think about the story that this history would tell to the reader. It's
straightforward but it's also very verbose. This is where you start using git
rebase. Your goal is to squash these three commits into one commit.

    git rebase --interactive HEAD~3

The above command would open your editor with a message similar to the one
shown below. HEAD~3 means "three last commits".


    pick Add test which checks if posts are ordered chronologically.  
    pick Order posts chronologically.  
    pick Fix order of posts on the archive page.

In order to squash commits you need to change the pick keyword into squash next
to the commit that you want to squash to the previous commit.


    pick Add test which checks if posts are ordered chronologically.  
    squash Order posts chronologically.  
    squash Fix order of posts on the archive page.

If you were to modify the list as shown above the bottom two commits would be
squashed with the first one. If you save the changes and close the editor git
would open a new one and let you write a new commit message for the squashed
commit. Commit messages from the previous commits would be shown too so that
you can reuse them. Your end results might look like this:

    1fc2bc Order posts chronologically.
    
    - Added tests for the fix

Much better! Other team members now only need to read one very accurate commit.
Git rebase is very powerful and I suggest that you look at the git docs to find
out what else you can do with it.

Of course never do this if you have already pushed your changes!

<!-- more end -->
