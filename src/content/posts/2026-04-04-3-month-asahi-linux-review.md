---
title: 3 month Asahi Linux review
date: 2026-04-04
---

I used Asahi Linux as my daily driver for 3 months on a M1 MacBook Pro. Here's what I'd tell you before you try it.

## The Good

Once I've installed Asahi and pulled all my configs and projects, I never needed to login into MacOS again for the next 3 months. Sway worked very well as the window manager, and since I'm used to tiling window managers, working on Asahi was a very pleasant experience.

There were no stutters or unnecessary animations as I moved from the terminal to the IDE or the browser. I can't emphasise enough how important it is for me to be able to focus only on the task at hand and have the OS get out of my way. I got closer than I ever was on macOS to that feeling of being one with the laptop and Asahi made that possible.

Memory usage was as expected - very low.

There were no issues with Docker either.

## The Bad

Disk encryption doesn't work. I tried to make it work but after a couple of hours of trying I gave up. This turned out to be the only real blocker for long term use. I assume most other professionals would be in a similar situation as they need to use full disk encryption due to compliance (and really just good security posture).

Display over USB-C doesn't work. HDMI works but with major caveats. You can't close the laptop and later connect it to HDMI. Sometimes turning it on with HDMI already plugged in would not work. Sleep or hibernate doesn't work as you expect it. You can't close the laptop, and a few hours later continue as nothing happened. In other words, the laptop becomes much more like a desktop.

I always had at least two cables plugged in, USB-C for charging and HDMI for the external display.

Battery life was noticeably worse, but I was plugged in most of the time. The battery would not last a whole work day, if you are wondering about that.

Arm64 architecture means that some packages you use for work will simply not run. Unfortunately, I rely on Aptible and their CLI doesn't ship an arm64 package. Claude Code valiantly made a package that semi-works (db tunnel doesn't work).

Running Linux on Apple hardware was already enough of a complication due to hardware incompatibilities. Running arm64 added a second complication at the software layer.

You could say that all of these were known issues. Some I was able to workaround, some are just the price of using Linux on a MacBook. The new information for me is that I don't want to tolerate these downsides.

I'd probably be happier with an x86 Linux desktop for daily work and a separate MacBook Air for travel and office days.
