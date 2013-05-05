--- 
layout: post 
title: Ember and Google Analytics
---

I haven't been able to find simple and complete instructions for integrating
Google Analytics and EmberJS. In this article I will try to show you how to
accomplish that by hooking into the `Router` class. I also assume that you are
using the hashchange event for ember urls (your urls look like /#/my/url) which
is the default setting.

<!-- more start --> 

All the articles I've read on this topic have completely ignored the fact that
you don't really get a complete overview of how users are navigating your site.
They rely on the application controller's `currentPath` attribute which doesn't
change when the model of an `ObjectController` is changed.

Let's say that you have a blog application written in EmberJS and you want to
track every article page view. We are also going to assume that your article
route looks like "/article/:slug". That means that you might have article urls
like:

 - http://yoursite.com/#/article/getting-started-with-emberjs
 - http://yoursite.com/#/article/handlebars-templates-101

If you watch the application controller's `currentPath` attribute for changes
then you will notice that it will change to "article" once you visit the first
link. If you then try to access the next article (via a sidebar link for
example) the `currentPath` attribute will still be "article" even though we
just navigated to a completely different article. As you can see, this is not
very useful for Google Analytics as we would only record the first page view.

I've solved this by hooking into the `didTransition` method of the `Router`
class. This method is triggered each time a transition is completed. Using that
method we can track each page view just like we would if our blog application
was a regular web site.

{% highlight javascript linenos %}
Navigator.Router.reopen({ 
  /**
   * Tracks pageviews if google analytics is used
   */
  didTransition: function(infos) {
    if (window._gaq === undefined) { return; }

    Ember.run.next(function(){
      _gaq.push(['_trackPageview', window.location.hash.substr(1)]);
    });
  }
});
{% endhighlight %}

Add the above code to your application's router.js file. You will need to load
google analytics too so insert the following snippet into your application
layout:

{% highlight html linenos %}
<script>
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-XXXX']);

  (function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
   })();
</script>
{% endhighlight %}

Change the account id and you are done. Notice that we are stripping the hash
symbol from the window.location.hash attribute since GA is rejecting everything
after the hash in urls. This is important since otherwise every pageview sent
to GA would register as "/".

You can test if this works using the GA realtime dashboard or you can use the
[Google Analytics Debugger][ga-debugger] plugin for Chrome. I'm new to EmberJS
and would love to hear your thoughts on this solution so please feel free to
leave your comments. 

<!-- more end -->

 [ga-debugger]: https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en

