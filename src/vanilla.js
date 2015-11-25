
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

        //return our object so that we can chain methods from our prototype
        return this;
    };

    //set up our prototype and alias it is `$v.fn` much like jQuery has `jQuery.fn` (often aliased as `$.fn`)
    $v.fn = $v.prototype = {};

    //set up a property of our prototype for storing utility and convenience methods
    //some of these will seem extraneous, but it will help us have `DRY`er code
    $v.fn.utils = {};

    //this utility will strip a `.` or `#` from the beginning of a string
    //we'll use it for times when we want an id or class name as a string but the user might have passed us a selector string like `#id` or `.class`
    $v.fn.utils.convertSelectorToString = function(str) {
        var checkCharacter = str[0];

        switch(checkChracter) {
            case '.':
            case '#':
                return str.substr(1);
            default:
                return str;
        }
    };

    //this utility will take an element and split it's `className` attribute into an array
    $v.fn.utils.getClassList = function(element) {
        return element.className.split(' ');
    };

    //this utility will take an array of classes and return the joined class list
    $v.fn.utils.createClassList = function(classes) {
        return classes.join(' ');
    };

    $v.fn.utils.arrayContains = function(array, search) {
        if(array.indexOf(search.trim()) !== -1) {
            return true;
        }

        return false;
    };

    $v.fn.utils.convertDelimitedStringToArray = function(str, delimiter) {
        if(typeof delimiter !== 'undefined') {
            return item.split(delimiter);
        }

        return item.split((item.indexOf(',') !== -1 ? ',' : ' '));
    };

    $v.fn.find = function(str) {
        var elements = this.elements;

        this.elements = [];

        elements.forEach(function(item) {
            this.elements.concat([].slice.call(item.querySelectorAll(str)));
        });

        return this;
    };

    //method for checking if the items in the current collection have a specified class
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `hasClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.hasClass = function() {
        //declare variable we'll use to store an array of class names
        var classes;

        //initialize empty array to store our arguments
        var args = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
            args.push(arguments[a]);
        }

        //iterate through our new args array and split out any comma or space-delimited lists of class names
        classes = args.map(function(item) {
            return this.utils.convertDelimitedStringToArray(item);
        }, this);

        //iterate through the classes we need to check for
        //we are using `.every()` so that we can break out of the loop when the class is not found on an element
        return classes.every(function(str) {
            //iterate through the elements in our collection
            return this.elements.every(function(item) {
                if(this.utils.arrayContains(this.utils.getClassList(item), this.utils.convertSelectorToString(str))) {
                    return false;
                }

                return true;
            }, this);
        }, this);
    };

    //method for adding a class to elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.addClass = function(str) {
        //declare variable we'll use to store an array of class names
        var classes;

        //initialize empty array to store our arguments
        var args = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
            args.push(arguments[a]);
        }

        //iterate through our new args array and split out any comma or space-delimited lists of class names
        classes = args.map(function(item) {
            return this.utils.convertDelimitedStringToArray(item);
        }, this);

        //iterate through the classes we need to check for
        //we are using `.every()` so that we can break out of the loop when the class is not found on an element
        classes.forEach(function(str) {
            //iterate through the elements in our collection
            this.elements.forEach(function(item, index, array) {
                var classes = this.utilities.getClassList(item);

                if(!this.utils.arrayContains(this.utils.getClassList(item), this.utils.convertSelectorToString(str))) {
                    array[index].className = this.utils.createClassList(classes.push(str));
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    $v.fn.removeClass = function(str) {
        this.elements.forEach(function(item, index, array) {
            var classes = item.className.split(' ');

            var removeIndex = classes.indexOf(str);

            if(removeIndex !== -1) {
                array[index].className = classes.splice(removeIndex, 1).join(' ');
            }
        });

        return this;
    };

    $v.fn.toggleClass = function(str) {
        this.elements.forEach(function(item, index, array) {
            var classes = this.utility.getClassArray(item.className);

            var toggleIndex = classes.indexOf(str);

            if(toggleIndex !== -1) {
                array[index].className = classes.push(str).join(' ');
            } else {
                array[index].className = classes.splice(toggleIndex, 1).join(' ');
            }
        });

        return this;
    };