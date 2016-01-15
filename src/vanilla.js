
    /**
        Vanilla

        A basic JavaScript Library that will mimic some jQuery funcitonality
        and allow us to explore some of the ways that jQuery achieves things
        as well as illustrating places where we really might not need jQuery
        to perform certain actions.
    */

    //this will be the basis of our library, much like jQuery's `jQuery` function (often aliased as `$`)
    var $v = function(selector) {
        //if this constructor was called without the `new` keyword, we should do that
        if(this === window) {
            return new $v(selector);
        }

        //instead of a complicated selector engine like Sizzle, we'll just be relying on `document.querySelectorAll()`
        //we are using `[].slice.call()` to turn the Array-like list of HTML Nodes into an actual array that we can use native Array methods on
        this.elements = [].slice.call(document.querySelectorAll(selector));

        //return reference to this object
        return this;
    };

    //set up our prototype and alias it is `$v.fn` much like jQuery has `jQuery.fn` (often aliased as `$.fn`)
    $v.fn = $v.prototype = {};

    //set up a property of our prototype for storing utility and convenience methods
    //some of these will seem extraneous, but it will help us have `DRY`er code
    $v.fn.utils = {};

    //replaces the current collection with a new collection created by running `querySelectorAll()`
    //from each item in the collection and looking for a specified selector
    $v.fn.find = function(str) {
        //logic here
    };

    //method for getting/setting an attribute's value
    $v.fn.attr = function(attribute, value) {
      //logic here
    };

    //method for getting/setting a boolean attribute's value
    $v.fn.prop = function(attribute, value) {
        //logic here
    };

    //method for getting/setting a `data-` atrribute's value
    $v.fn.data = function(attribute, value) {
        //logic here
    };

    //What if we wanted to use convenience methods for other namespaced attributes, like "aria-" attributes?

    //method for extending an object with any other number of objects
    //the first object provided will be used as a container object, to prevent mutation, pass an empty object `{}` as your container object
    //this method returns an object and is not eligible for any method chaining
    $v.extend = function() {
      //1: Utilize the arguments for() loop we've used previously
        //to convert our arguments Array-like Object into an Array

      //2: Check if args[0] is boolean && true

        //2a: if it is we want a deep merge
        //2b: remove args[0] and store it in a variable named deep

      //3: Take first object from args and remove it, storing it in a variable named container
        //this will be the primary object that we extend

      //iterate through all objects passed as arguments and merge them with our container
        //be sure to respect the deep setting if necessary

      //return the newly extended container object
    };