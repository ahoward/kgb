/*
  
  require jquery.js
  require jquery.cookie.js

  <form action='/foobar' class='kgb' data-survey='foobar : a' data-question'a'>



  </form>

  
*/


(function(namespace){
  var jq = namespace['jQuery'];

  if(!namespace['kgb'] || !namespace['kgb']['_kgb']){
  //
    var kgb = { '_kgb' : true };

  //
    kgb.survey = new Function();

  //
    kgb.ify = function(key){
      var args = Array.prototype.slice.apply(arguments);

      var k = new kgb.survey;

      k.initialize.apply(k, args);

      return(k);
    };

  //
    kgb.survey.prototype.initialize = function(key){
      var k = this;

      var args = Array.prototype.slice.apply(arguments);
      var options = {};

      var opts = [];

      if(args.length == 1 && typeof(args[0]) == 'object'){
        options = args[0];
      } else {
        for(var i = 0; i < opts.length; i++){
          options[opts[i]] = args[i];
        }
      }


      k.forms = [];
      k.results = [];
      k.callbacks = { 'submit' : {}, 'hide' : {}, 'show' : {} };
      k.history = [];

      k.callbacks['submit']['*'] = function(){};
      k.callbacks['hide']['*'] = function(){};
      k.callbacks['show']['*'] = function(){};

      var key = args.shift();
      var selector = kgb.selector_for(key);

      k.key = key;
      k.selector = selector;

      var form = kgb.select(selector);

      k.history.push(form);

      k.formify(form);
    };

  //
    kgb.survey.prototype.formify = function(form){
      var k = this;

      var form = kgb.select(form);

      if(!form.data('kgb-formified')){
        form.submit(function(e){ 
          try {
            return k.on_form_submit(form);
          } catch(e) {
            e.preventDefault();
            return false;
          }
        });

        k.forms.push(form);

        form.data('kgb-formified', true);
      }

      return(form);
    };

  //
    kgb.survey.prototype.on_form_submit = function(form){
      var k = this;
      var form = kgb.select(form);

      var serialized = kgb.serialize(form);

//console.dir(serialized);

      var key = kgb.key_for(form);

//console.dir(key);

      var result = {};
      result[key] = serialized;
      k.results.push(result);

      var cb = k.callbacks['submit'][key];

      var key_next;

      if(cb){
        key_next = cb(serialized, k);
      } else {
        key_next = form.data('kgb-next');
      }

      if(key_next){
        var selector = kgb.selector_for(key_next);
        var f = kgb.select(selector);

        k.formify(f);

        if(k.callbacks['hide'][key]) k.callbacks['hide'][key](form, k);
        if(k.callbacks['hide']['*']) k.callbacks['hide']['*'](form, k);

        form.hide(0,
          function(){
            if(k.callbacks['show'][key_next]) k.callbacks['show'][key_next](f, k);
            if(k.callbacks['show']['*']) k.callbacks['show']['*'](f, k);
            k.history.push(f);
            f.show(0);
          }
        );

        return false;
      } else {
        return(cb ? key_next : true);
      }
    };

  //
    kgb.survey.prototype.on = function(a, b, f){
      var k = this;
      k.callbacks[a] = k.callbacks[a] || {};
      k.callbacks[a][b] = f;
      return(f);
    };

  //
    kgb.survey.prototype.back = function(){
      var k = this;

      if(k.history.length > 1){
        var curr = k.history[k.history.length - 1];
        var back = k.history[k.history.length - 2];

        k.history.pop();

        curr.hide(0, function(){
          back.show(0);
        });
      }
    };

  //
    kgb.survey.prototype.to_json = function(){
      var k = this;
      return JSON.stringify(k.as_json(), null, 4);
    };

  //
    kgb.survey.prototype.as_json = function(){
      var k = this;
      return(k.results);
    };

  //
    kgb.key_for = function(form){
      var form = jq(form);

      var key = (
        form.data('kgb-key') ||
        form.attr('id') ||
        '/'
      );

      return(key);
    };

  //
    kgb.selector_for = function(key){
    // http://alexandregiannini.blogspot.com/2011/05/escaping-strings-for-jquery-selectors.html
    //
      var escaped = ('' + key).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');

      var selector = '[data-kgb-key=' + escaped + ']';

      return(selector);
    };

  //
    kgb.select = function(selector){
      var selected = jq(selector);
      if(selected.size() == 0){
        alert('shite selector: ' + selector);
      }
      return(selected);
    };

  //
    kgb.serialize = function(form){
       var o = {};
       var a = jq(form).serializeArray();
       jq.each(a, function() {
         if (o[this.name]) {
           if (!o[this.name].push) {
             o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
         } else {
           o[this.name] = this.value || '';
         }
       });
       return o;
    };

  //
    kgb.response = new Function();

  //
    namespace['kgb'] = kgb;
  }
})(this);
