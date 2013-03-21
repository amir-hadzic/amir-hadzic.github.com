--- 
layout: post 
title: How to expose your local server to the Internet 
---

I occasionally have the need to temporarily expose my local development server
to the Internet. I say temporarily since you should never expose your
development server to the Internet unless it’s absolutely required and even
then it should be only temporarily. This article should save me (and hopefully
someone else) some time the next time I need to expose my local server to the
Internet.

<!-- more start --> 

Your local development server could be anything but let's pretend that we are
developing a Ruby on Rails application and we want to demo the application to
someone who is out of the office. Assuming that you are behind a firewall your
best option is to route the traffic through a remote server that has a public
ip address.  There is an [alternative](#alternative) but it's less reliable.

Below are the steps that you need to take in order to expose your rails
application to the Internet. I will assume that the remote server has a public
dns entry "remote.company.com".

 - Setup your remote server to allow tcp forwarding
 - Create an ssh tunnel between you and the remote server

It really is simple as that. Let's get to work.

## Setup your remote server to allow tcp forwarding

Connect to your server and execute the following commands:

    sudo echo "AllowTcpForwarding yes" >> /etc/ssh/sshd_config
    sudo echo "GatewayPorts yes" >> /etc/ssh/sshd_config 
    sudo service ssh restart

Please note that you should check if these options are already set in the sshd
configuration to avoid duplicate entries.

You are all done and you can move to the next step. For the curious ones,
here's what you did. AllowTcpForwarding is self-explanatory—it enables tcp
forwarding. Without this we wouldn't be able to forward any ports.
GatewayPorts enables remote hosts to connect to the forwarded ports. If we
didn't specify this no one would be able to connect to the forwarded port on
our remote server.

## Create an ssh tunnel between you and the remote server

This step is even easier, just run the following command:

    ssh -R0.0.0.0:7000:localhost:3000 user@remote.company.com

The above command will tunnel all traffic between remote.company.com:7000 and
localhost:3000. Now everyone on Internet can access your local development
server at remote.company.com:7000 (assuming that remote.company.com is
accessible from the Internet).  

<a id="alternative"></a>

## Alternative

I've mentioned that there is an alternative if you don't have a public facing
remote server. I've briefly used [localtunnel][localtunnel] which when executed
returns you a link which you can send to anyone who needs to connect to your
local server.

However I had some issues with the service since it was very unstable when I
used it. With that said I didn't use it for more than an hour or two so it
might have been a temporary hickup. 

There's also a new, [beta version][localtunnelv2] of localtunnel.

<!-- more end -->

 [localtunnel]: http://progrium.com/localtunnel/
 [localtunnelv2]: https://github.com/progrium/localtunnel 

