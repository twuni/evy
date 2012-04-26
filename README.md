# Introduction ###########################################################

Evy is an interpreted, event-oriented, dynamic, general purpose functional
language. It is built on the paradigm of asynchronous application design,
where components communicate with each other by publishing and subscribing
to events.

# Examples ###############################################################

A simple *Hello, world* program in Evy:

    print "Hello, world!"

A familiar scene:

    @@ ask question
      @ reply question answer
        print ">" answer
      broadcast question
      
    @@ broadcast question
      print question
    
    @ broadcast question="What is your name?"
      reply question answer="My name is Sir Launcelot of Camelot."
    @ broadcast question="What is your quest?"
      reply question answer="To seek the Holy Grail."
    @ broadcast question="What is your favorite color?"
      reply question answer="Blue."
    
    ask question="What is your name?"
    ask question="What is your quest?"
    ask question="What is your favorite color?"

Using the HTTP API:

    @ http_response
      print method url status body
  
    http_request "/foo"

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

Evy has a very simple grammar:

    EVENT: IDENTIFIER (' ' CONTEXT)*;
    CONTEXT: (IDENTIFIER '=')? (STRING|INT|FLOAT|BOOLEAN);
    IDENTIFIER: ('!'|'#'..'&'|'('..'/'|':'..'~')('!'|'#'..'&'|'('..'~')*

Every statement in Evy is an event. Identifiers can be virtually any
printable character, with the following exceptions:

 * An identifier may not begin with a number.
 * An identifier may not contain a single-quote ('), a double-quote ("),
   or whitespace.

In practice, Evy follows a publisher/subscriber model. Two built-in
functions facilitate this:

 * The lambda function **publishes** a named event.
 * The `@` function **subscribes to** a named event.

The Evy language is ultimately broken down into scopes that communicate
with each other via events. Reservations allow a scope to defer some
processing until a later time without closing the communications channel
with the publisher.

Interfaces are defined in Evy as sets of published events and sets of
subscribed events. For example, a form validation program might be
written as follows:

    @ validate_email email
        ? email ~= .+@.+\..+
    @ validate_username username
        http_request method="HEAD" url="/users/#{username}"
          @ response status
            ? status != 200

Here is a "Hello, world!" example written in Evy.

    @ main
        print "Hello, world!"

This program subscribes to the `main` event with no qualifiers, then
publishes the text "Hello, world!" to subscribers of the `print` event.
The Evy interpreter subscribes to this event and performs the native
methods necessary to print the text to the screen.

When an Evy program is executed, the `main` event is published by default.
Any number of initial events can be published by specifying them as
arguments on the command-line. For example, to run the `hello` event:

    $ ev hello
    
