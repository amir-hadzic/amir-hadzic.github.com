---
layout: post
title: Memcache python decorators
---

Using memcache on google app engine was always recommended but now it's a must. Since the GAE pricing changed it became a lot more important to keep the resources required to run your application as low as possible since you don't want to throw your money away. Using memcache is a simple way to increase the performance of your application while lowering the daily costs of running your application. One particular use case of caching expensive computations is when running queries against the datastore. It's always faster to get a value from memcache than it is from the datastore. I have used memcache on one of my GAE projects, [texd][0].

<!-- more start -->

Memcache usage can be simplified down to getting and removing values using a unique key. When I tried integrating memcache into texd it became obvious that I will need a simple way to cache results from methods and also invalidate cache entries before running some methods. For example, the result of an expensive query will be cached but that result might need to deleted from the cache when a part of the result is modified in the datastore. What follows is a code listing that can be found [here][1] in the texd project on github.



{% highlight python linenos %}
from functools import wraps
from google.appengine.api import memcache

def get_args(f, args, kwargs):
    """Returns all passed arguments to a certain function."""
    
    import inspect
    args_names, _, _, defaults = inspect.getargspec(f)
    passed_args = {}
        
    if defaults is not None:
        passed_args = dict(zip(args_names[-len(defaults):], defaults))

    passed_args.update(dict(zip(args_names, args)))
    passed_args.update(kwargs)

    passed_varargs = args[len(args_names):]

    return passed_args, passed_varargs
    
    
class cache_entry(object):
    """Decorator for functions that return cacheable results."""
    
    def __init__(self, name_format):
        self.name_format = name_format

    def __call__(self, f):
        def wrapped(*args, **kwargs):
            args_values, _ = get_args(f, args, kwargs)
            entry_name = self.name_format.format(**args_values)
            value = memcache.get(entry_name)
            
            if value is None:
                value = f(*args, **kwargs)
                memcache.set(entry_name, value)

            return value

        return wrapped

class cache_invalidate(object):
    """Decorator for functions that need to invalidate some cache
    entries before they are executed."""
    
    def __init__(self, name_formats):
        self.name_formats = name_formats

    def __call__(self, f):
        def wrapped(*args, **kwargs):
            args_values, _ = get_args(f, args, kwargs)

            names = [ name.format(**args_values) for name in self.name_formats ]
            memcache.delete_multi(names)

            return f(*args, **kwargs)

        return wrapped
{% endhighlight %}

Here are some examples of using these decorators:

{% highlight python linenos %}
    @cache_entry("{param}_expensive_function")
    def expensive_function(param):
        pass
    
    @cache_invalidate(["{param}_expensive_function"])
    def another_function(param):
        pass
{% endhighlight %}

As you can see we are using the `cache_entry` decorator where we need to cache method return value(s) and the `cache_invalidate` decorator where we need to delete cache entries before running the method. Key names are formed with function arguments that can be used in the key name using python standard string formatting options. For more concrete examples take a look at [texd models][2].

<!-- more end -->

 [0]: https://texd-app.appspot.com
 [1]: https://github.com/amir-hadzic/texd/blob/master/cache/decorators.py
 [2]: https://github.com/amir-hadzic/texd/tree/master/models
