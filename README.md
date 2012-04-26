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

# Tutorial ###############################################################

Let's walk through the basic syntax of an Evy program:

    hello

This program publishes the `hello` event.

    hello
    goodbye

This program publishes the `hello` event and the `goodbye` event, but in no
particular order.

    hello
      goodbye

This program publishes the `hello` event, then publishes the `goodbye` event.

    @ hello

This program subscribes to the `hello` event.

    @ hello
      goodbye

This program publishes the `goodbye` event after the `hello` event occurs. Note
that the `hello` event is not actually published in this program.

    @ hello
      goodbye
    hello

This program publishes the `goodbye` event after the `hello` event occurs. Subscriptions
are given priority over publications, so the `hello` event is not published until after
the subscription occurs.

    hello
    @ hello
      goodbye

This program is functionally identical to the previous one. It demonstrates how priority
is given to subscriptions.

    print "Hello, world!"

This program publishes the `print` event with an unnamed parameter whose value is "Hello, world!".

    http_request url="/test/user.json"

This program publishes the `http_request` event with a named `url` parameter whose value is "/test/user.json".

    @ http_request url
      print url

This program subscribes to `http_request` events that contain a named `url` parameter. This subscription
publishes the `print` event with a named `url` parameter whose value is equal to the value of the most
recently published `url` parameter. In this case, it is the value published by the `http_request` event.

    http_request method="GET" url="/test/user.json"

This program publishes the `http_request` event with two named parameters: `method` and `url`.

    @ http_request url
      print url
    http_request method="GET" url="/test/user.json"
    
This program subscribes to `http_request` events that contain a named `url` parameter. The subscriber defined
here will match even though the `http_request` event contains both a `method` parameter and a `url` parameter.

    @ http_request url
      print method url
    http_request method="GET" url="/test/user.json"

Even though the subscriber does not define the `method` parameter, because it is included with this publication,
the subscriber has access to it. Though this is not recommended (you should always declare your dependencies!),
it can make some code more readable.

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

I believe that an entire application can be built around the
principle of publishing and subscribing to events. I also believe that
this architecture would result in an inherently efficient and scalable
application. Evy is my attempt to prove this to be true.

# Design ##############################################################

Evy's grammar has very few rules:

    EVENT: IDENTIFIER (' ' CONTEXT)*;
    CONTEXT: (IDENTIFIER '=')? (STRING|INT|FLOAT|BOOLEAN);
    IDENTIFIER: ('!'|'#'..'&'|'('..'/'|':'..'~')('!'|'#'..'&'|'('..'~')*

Every statement in Evy is an event. Identifiers can be virtually any
printable character, with the following exceptions:

 * An identifier may not begin with a number.
 * An identifier may not contain a single-quote ('), a double-quote ("),
   or whitespace.
