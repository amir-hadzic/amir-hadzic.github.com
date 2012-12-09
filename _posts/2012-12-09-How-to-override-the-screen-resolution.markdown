---
layout: post
title: How to override the screen resolution in Arch Linux
---

This guide will show you how to set a custom resolution (that your monitor
supports) when it’s not automatically detected. I’m using the open source
radeon driver and the HD 5870 graphics card on Arch Linux but the process
should be very similar on other configurations.

<!-- more start -->

My monitor is connected through a VGA cable to my graphics card using a DVI-VGA
converter. In a lot of cases this will cause issues with reading the EDID
information from your monitor. EDID contains among other things the information
about your native screen resolution(s) and the refresh rate.

When EDID exchange between your PC and monitor fails you will not be able to
use your native resolution (1920x1080 in my case). In that case you will have
to override the screen resolution using the Xorg configuration. There’s a lot
of information around the Internet on how you might do that but here’s a
hopefully simplified guide to overriding the screen resolution. You will need
to do a couple of things:

  - Find out which port is used by your monitor 
  - Generate a modeline for your native resolution 
  - Add the modeline to your Xorg configuration

Most of these steps are pretty simple. In order to find out which port you are
using open your Xorg log (/var/log/Xorg.0.log in Arch Linux). I’m using the
open source driver radeon so one part of the log looks like this:

    [    17.311] (II) RADEON(0): Output DisplayPort-0 disconnected
    [    17.311] (II) RADEON(0): Output HDMI-0 disconnected
    [    17.312] (II) RADEON(0): Output DVI-0 disconnected
    [    17.312] (II) RADEON(0): Output DVI-1 connected

As you can see the monitor is connected to the DVI-1 port. If you are using
some different driver the output will be different but hopefully you will be
able to find similar information.

Now that we have the port we can continue with generating the modeline for our
custom resolution. You can use the cvt utility to generate the modeline. For
example if you want the resolution to be 1920x1080 at 60Hz refresh rate execute
the following:

    cvt 1920 1080 60

The output should be something like:

    # 1920x1080 59.96 Hz (CVT 2.07M9) hsync: 67.16 kHz; pclk: 173.00 MHz
    Modeline "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync

You can ignore the first line. Now we need to add this modeline to the Xorg
configuration file. A basic Xorg configuration might look like this (if you
don’t have one, create it by copying the configuration shown below):

    Section "Monitor"
        Identifier "Main monitor"
        Modeline "1920x1080"  172.80  1920 2040 2248 2576  1080 1081 1084 1118  -HSync +Vsync
        Option "PreferredMode" "1920x1080"
    EndSection
    Section "Device"
        Identifier "HD5870"
        Driver "radeon"
        Option "Monitor-DVI-1" "Main monitor"
    EndSection
    Section "Screen"
        Identifier "Primary screen"
        Device "HD5870"
        DefaultDepth 24
        SubSection "Display"
                Depth   24
                Modes   "1920x1080"
        EndSubSection
    EndSection

    Section "ServerLayout"
        Identifier "Default Layout"
        Screen "Primary Screen"
    EndSection

You’ve probably noticed the Modeline configuration option. You should use the
output from the cvt utility and paste it to that configuration option. You
should also change the port name (Monitor-DVI-1 is used in the above example).

That’s it. Reboot your system or restart the Xorg server. Note that your system
might still use one of the old resolutions on startup. Go to your display
settings and select the new resolution to make the change permanent.

<!-- more end -->
