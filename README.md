# Introduction ###########################################################

Evy is an event-oriented programming language. It is built on the paradigm
of asynchronous application design, where components communicate with each
other by publishing and subscribing to events.

# Background #############################################################

Programming UI for desktop, mobile, and web applications involves a great
deal of event handling. From low-level user interactions such as key press
and mouse movement, to object lifecycle events such as creation and
destruction, to domain-specific events such as login success and specific
page accesses, event handling has become a significant part of application
development.

Evy is inspired by the heavy usage of event-driven development in
JavaScript, especially in frameworks such as jQuery and Node.js. These
frameworks have seen a great deal of success, largely in part due to their
simplification of event handling.

It was not until June, 2008, that I realized how powerful event-driven
development could be and how much of an impact it could make on performance
and component interactivity. In developing the integration system for the
Wetpaint Injected embedded wiki platform, I stumbled upon the holy grail
of event-driven design: asynchronous event callbacks. This breakthrough
allows for asynchronous component interactivity; a conversation between
a publisher and its subscribers. This has yet to be imitated by any of
the major frameworks in use today, but the concept is quite simple.

I have since ported this design to Java, and reimplemented it in
JavaScript as a standalone eventing system. These languages, however, lack
the elegance and simplicity that would befit a language designed for this
purpose. I believe that an entire application can be built around the
principle of publishing and subscribing to events. I also believe that
this architecture would result in an inherently efficient and scalable
application. Evy is my attempt to prove this to be true.

# Design ##############################################################

Evy is built around a publisher/subscriber model with the following
basic constructs:

 * `publish`: Any component may publish any number of events.
 * `subscribe`: Any component may subscribe to any number of events.
 * `event`: An event establishes a communications channel between a
   publisher and a subscriber.
 * `reserve`: A subscriber may retain the event beyond its initial
   scope by placing a reservation on the event.
 * `release`: When a subscriber is finished with an event on which
   it has placed a reservation, it must release that reservation.

The Evy language is ultimately broken down into scopes that communicate
with each other via events. Reservations allow a scope to defer some
processing until a later time without closing the communications channel
with the publisher.

Interfaces are defined in Evy as sets of published events and sets of
subscribed events. For example, a form validation program might be
written as follows:

    @validate_email email
        event /.+@.+\..+/.test(email)
    @validate_username username
        reserve
        @http_response method="HEAD" url="/users/#{username}" status
            release
            event status != 200

The `@` symbol defines a subscriber for the named event. Any arguments
that follow are qualifiers. Each statement that is not a subscription
must be a publication.

Here is a "Hello, world!" example written in Evy.

    @main
        print "Hello, world!"

This program subscribes to the `main` event with no qualifiers, then
publishes the text "Hello, world!" to subscribers of the `print` event.
The Evy interpreter subscribes to this event and performs the native
methods necessary to print the text to the screen.

When an Evy program is executed, the `main` event is published by default.
Any number of initial events can be published by specifying them as
arguments on the command-line. For example, to run the `hello` event:

    $ ev hello

    