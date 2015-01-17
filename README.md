NAME
====

kgb.js

SYNOPSIS
========

an ultra-lightweight javascript tool for building wizard-y 'if that then this'
workflows and multi-step forms.

USAGE
=====

kgb.js takes the tedium out of building multi-step forms that show/hide steps
based on answers.  it accumulates the answers from every step and makes these
available to client code to perform arbitrary processing on.

given a multi-step form organized like this:

```javascript


  <!-- -->
    <form data-kgb-key='question-1'>

      <input type='radio' name='question' value='a'>
      <input type='radio' name='question' value='b'>

      <br>
      <input type='submit'>
    </form>



  <!-- -->
    <form data-kgb-key='question-2' style='display:none;'>

      <input type='radio' name='question' value='c'>
      <input type='radio' name='question' value='d'>

      <br>
      <input type='submit'>
    </form>



  <!-- -->
    <form data-kgb-key='question-3' style='display:none;'>

      <input type='radio' name='question' value='e'>
      <input type='radio' name='question' value='f'>

      <br>
      <input type='submit'>
    </form>


```

you can use kgb to easily transform these forms into a multi-step workflow
based on each form's answer.  the 'on' method takes an event first argument,
one of 'submit', 'show', or 'hide', and a second, the 'data-kgb-key' of the
form.

each callback will be passed the params from the form in question, which are a
hash of input names to input values.  the submit callback should return the
'data-kgb-key' of the *next* form to show, if any, and you can determine this
based on arbitrary javascript code. for example, given:

```javascript

  <script>
    jQuery(function(){
    //
      var jq = jQeury;

    //
      var k = kgb.ify('question-1');

    //
      k.on('submit', 'question-1', function(params){

        var answer = params['question'];

        switch(answer){
          case 'a':
            return 'question-2';

          case 'b':
            return 'question-3';
        };
      });

    //
      k.on('submit', 'question-2', function(params){
        console.dir(params);
      });

    //
      k.on('submit', 'question-3', function(params){
        console.dir(params);
      });

    });
  </script>

```

the callbacks would fire the first time with params=

```javascript

 { 'question' : 'a' }

```

and, the 2nd time, assuming the above, with

```javascript

 { 'question' : 'c' }


```

in plain english each callback is passed the data for that form, when
submitted.

you may need access to global data about other forms, and the order they were
traveled in by the user.  kgb provides this to you via an array of params
called 'results':

```javascript

    //
      var k = kgb.ify('question-1');


    // ...


    //
      k.on('submit', 'question-17', function(params){

        var answer = params['question'];

        var results = k.results; // an array of hashes for for each form the user has visited

      });

```

in plain english, all callbacks have access to the total set of all
submissions seen, in order.

note that that kdb intercepts the 'submit' event on all forms it touches, so
it up to you to eventually do something with the accumulated params, such as
ajax submit them to your server.

also note that arbitrary flows, including those containing cycles, can be
configured, since the logic for moving from flow to flow is completely
arbitrary javascript.

EXAMPLE
=======

as with many things, kgb is best learned through an example

  http://ahoward.github.io/kgb/

also, be sure to read the source, it is small and clear

  https://github.com/ahoward/kgb/blob/master/src/kgb.js

