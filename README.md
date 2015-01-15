NAME
====

kgb.js

SYNOPSIS
========

an ultra-lightweight javascript tool for building wizard-y 'if that then this' workflows and multi-step forms.

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
based on each form's answer.  the 'on' method takes an event first parameter,
one of 'submit', 'show', or 'hide', and a second, data-kgb-key of the form.
the callback will be pass the params of the flow, which are a hash of
data-kgb-key mapping to the keys/values of that form.  note that the params
object accumulates data under the data-kgb-keys, so if the the form above was
configured like this:


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

 {
   'question-1' : { 'question' : 'a' }  // or 'b' depending on the answer...
 }

```

and, the 2nd time, assuming the above, it would look like

```javascript

 {
   'question-2' : { 'question' : 'c' }  // or 'd' depending on the answer...
 }

```

EXAMPLE
=======

as with many things, kgb is best learned through an example

  http://ahoward.github.io/kgb/

also, be sure to read the source, it is small and clear

  https://github.com/ahoward/kgb/blob/master/src/kgb.js

