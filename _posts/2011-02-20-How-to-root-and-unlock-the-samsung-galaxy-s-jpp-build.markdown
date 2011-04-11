---
layout: post
title: How to root & unlock the Samsung Galaxy S (JPP build)
---

  [0]: http://forum.xda-developers.com/showthread.php?t=788108
  [1]: http://dl.dropbox.com/u/1868408/Galaxy_S_Root_Unlock_Kit.zip
  [2]: http://dl.dropbox.com/u/1868408/ADB.zip
  [3]: http://forum.xda-developers.com/showthread.php?t=761045
  
<img src="http://i.imgur.com/DM73W.png" align="right" style="margin-left: 10px;">
I got my hands on a brand new, SIM locked and unrooted Galaxy S and well, I had to take action as I couldn’t use SIM cards from other cellular service providers. It turns out that the solution is (assuming that your phone is already rooted) as easy as changing one byte (literally). I had some issues while trying to root my phone because I couldn’t find a corresponding CF-Root file for my JPP build of Android 2.2. So if you’r in the same situation, simply upgrade your Galaxy S to 2.2.1 first and then apply the CF-Root patch for the JPY build. You can find more information about CF-Root patches on the [xda-developers forum][0].

As you can see, there is no CF-Root patch for the JPP firmware build. The solution is to upgrade to android 2.2.1 (JPY build). Turn off your phone and press the volume, power and home buttons at the same time to enter the “Download” mode and follow these steps:

 * Download the required files for these steps [here][1]
 * Run Odin.exe
 * While in “Download” mode, connect your phone via usb
 * Click on the PIT button and select the s1_odin_20100512.pit file
 * Click on the PDA button and select the JPY.tar file
 * Make sure “Re-partition” is selected and press Start
 * Wait until the phone is rebooted and power it off again. Now enter the “Download” mode again.
 * Run Odin.exe again
 * Click on the PDA button and select the Voodo-Stable-PDA.tar
 * Make sure “Re-partition” is not selected and press Start
 
You will need to wait until the phone reboots itself. If everything went well, at this point you have Android 2.2.1 installed and running. Now we need to root the device:

 * Run Odin.exe
 * Power off the phone, enter the “Download” mode
 * Click on the PDA button and select the CF-Root-JPY.tar file
 * Make sure “Re-partition” is not selected and press Start
 
Again, wait until the phone is rebooted. When I was rooting my phone it didn’t work from the first try, so try applying the CF-Root patch again if it doesn’t work for the first time. Now we need to unlock the phone, so that we can use other SIM cards. I have found many guides on how to do this with the Galaxy S, and there are even automated scripts and applications that can help you unlock your phone. For some reason, none of them worked for me, so I did it manually:

 * Download ADB from [here][2]
 * Connect your phone in USB Debugging Mode (Settings → Applications → Development → USB debugging)
 * Goto Start → Run and type “cmd” (without quotes)
 * Extract the downloaded ADB.zip file to your desktop into a folder named “adb”. Type “cd Desktop/adb” into the cmd and then “adb.exe shell”.
 * Now type the following:

{% highlight bash linenos %}
su
cp /efs/nv_data.bin /sdcard/nv_data.orig.bin
{% endhighlight %}

 * Disconnect your phone and connect it again in USB Mass Storage mode. Copy the nv_data.orig.bin file to your PC. **Warning:** Keep a backup copy of this file!
 * Open the copied file in your favorite hex editor and goto offset 0×181468. You should see the following byte stream: ff 01 00 00 00 00 46 46. Change the second byte from 01 to 00.
 * Save the modified file and copy it to your phone. Name it “nv_data.mod.bin”
 * Disconnect your phone and connect it again in USB Debugging mode. Run the adb shell as previously shown in steps above and run the following commands:

{% highlight bash linenos %}
su
rm /efs/nv_data.bin
rm /efs/nv_data.bin.md5
cp /sdcard/nv_data.mod.bin /efs/nv_data.bin
chmod 755 /efs/nv_data.bin
chown radio.radio /efs/nv_data.bin || chown 1001.1001 /efs/nv_data.bin
reboot
{% endhighlight %}

Your phone will reboot now and it will be rooted and unlocked.

_Source: [XDA Developers forums][3]_
