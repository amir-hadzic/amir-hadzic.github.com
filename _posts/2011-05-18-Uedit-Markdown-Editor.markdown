---
layout: post
title: Uedit markdown editor
---

  [0]: http://www.tutorijali.net
  [1]: https://github.com/amir-hadzic/uedit
  [2]: https://github.com/amir-hadzic/uedit/zipball/master
  [3]: http://www.radar404.com
  [4]: http://amir-hadzic.github.com/uedit

While working on the new, improved version of [Tutorijali.net][0] we have decided to use
the WMD markdown editor. While using it we have discovered that it has many
annoying bugs and isn't very easy to modify. Searching for a better markdown
editor which is small and doesn't have external dependicies yielded no results.
So I decided to write a small, easy to modify, markdown editor.

<!-- more start -->

The result is [Uedit][4], a markdown editor that **Just Works** in IE6+, Opera,
Firefox, Chromium and Safari. Uedit supports automatic insertion of list items
and a custom state manager for fine control of undo/redo operations. Note that I haven't tested it in IE9 since that means installing an instance of Windows 7 in a virtual machine just for that. Someone will test it eventually in IE9 (if you do, please let me know of any bugs you find).

## How to get it

You can download the upstream version of uedit packaged in a Zip file [here][2].
Or you can clone the [repository at github][1].

## Bugs, suggestions, patches

Please let me know if you find any bugs in uedit. I'm sure that I have forgot 
about something. Suggestions are welcome, patches even more so. Just drop me a 
pull request on github if you have a patch ready.

## Thank you

[Goran Zdjelar][3] has helped with the design of uedit. He's responsible for the
nice forms design. Thanks!

<!-- more end -->
