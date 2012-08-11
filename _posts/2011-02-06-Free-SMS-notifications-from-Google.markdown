---
layout: post
title: Free SMS notifications from Google
---

Google is known for having an API for just about everything and one of them can
be used to receive SMS notifications from your embedded electronics project,
your robot or from some sensor grid in your evil underground laboratory. In
this case “free” comes with a price. You’r limited to ~60 characters. But, that
should be enough for sending simple notifications or alerts. I have originally
used this to alert users that they have received a new message in a project
that was supposed to make texting from mobile phones a lot cheaper. And it did
(the cost of one SMS was around 0.01$) but the project never gained momentum,
mainly because I didn’t need cheap text messages anymore. Long story short, the
project involved one HTTP API implemented in Python (on Google App Engine) and
one J2ME application for phones. This worked because mobile Internet access was
cheaper than SMS messages in my country.

Anyways, let’s get back to free SMS notifications. Here’s a simple Python class
that you can use to send SMS notifications:

{% highlight python linenos %}
import atom
import gdata.calendar
import gdata.calendar.service
import time
 
TIME_FORMAT = '%Y-%m-%dT%H:%M:%S.000Z'
CALENDAR_URL = 'http://www.google.com/calendar/feeds/default/private/full'
 
class GoogleSms:
    def __init__(self, username, password):
        self.username = username
        self.password = password
 
        service = gdata.calendar.service.CalendarService()
        service.email = username
        service.password = password
        service.source = 'GoogleSms'
        service.ProgrammaticLogin()
 
        self.calendar_service = service
 
    def send(self, message):
        # Set time to one hour from now
        event_time = time.strftime(TIME_FORMAT, time.gmtime(time.time()+3600))
 
        event = gdata.calendar.CalendarEventEntry()
        event.title = atom.Title(text=message)
        event.content = atom.Content(text=message)
 
        # Send a reminder 60 minutes before the event.
        # Since the event is 60 minutes from now, we will receive the message
        # in a few seconds.
        reminder = gdata.calendar.Reminder(minutes=60)
        reminder.method = 'sms'
 
        when = gdata.calendar.When(event_time)
        when.reminder.append(reminder)
 
        event.when.append(when)
 
        try:
            # Add the entry to calendar
            cal_event = self.calendar_service.InsertEvent(event, CALENDAR_URL)
        except gdata.service.RequestError, request_exception:
            raise
 
if __name__ == '__main__':
    sms = GoogleSms('account@gmail.com', 'yourpassword')
    sms.send('Alert!')
{% endhighlight %}

Basically, we are abusing the Google Calendar API in order to send SMS
notifications. We create an event that is one hour from now and setup a
reminder one hour before the event. This way the reminder is sent in a few
seconds from inserting the event. So, there you have it, a simple and free way
of sending SMS notifications. There’s a lot of space for improvements here but
I will leave that as an exercise for the reader.

Update: You need to have a mobile phone number associated with your Google
Calendar. Go to Settings → Mobile Setup in Google Calendar to setup your phone
number.
