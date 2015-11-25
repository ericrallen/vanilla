
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
        return this.utils.convertDelimitedStringToArray(element.className);
    };

    //this utility will take an array of classes and return the joined class list
    $v.fn.utils.createClassList = function(classes) {
        return classes.join(' ');
    };

    //this utility checks to see if an array contains the specified value
    $v.fn.utils.arrayContains = function(array, search, index) {
        //if we are looking for a string, we'll want to trim it just in case there were leftover spaces
        var atIndex = array.indexOf((typeof search === 'string' ? search.trim() : search));

        //if item was found in array
       if(atIndex !== -1) {
            //return the index (if specified) or just a boolean
            return (index ? atIndex : true);
        }

        return false;
    };

    //this utility takes a string and converts it into an array
    //this can be done with a specified delimiter or it will use commas (if present in the string) or spaces
    //it iterates through the array and trims any strings before returning it
    $v.fn.utils.convertDelimitedStringToArray = function(str, delimiter) {
        //declare a variable to store our array of strings
        var items;

        //if a delimiter was provided
        if(typeof delimiter !== 'undefined') {
            items = str.split(delimiter);
        } else {
            items = str.split((str.indexOf(',') !== -1 ? ',' : ' '));
        }

        //iterate through our items array and trim any strings
        //then return the new array
        return items.forEach(function(item) {
            if(typeof item === 'string') {
                item = item.trim();
            }
        });
    };

    //replaces the current collection with a new collection created by running `querySelectorAll()` from each item in the collection and looking for
    //a specified selector
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
        //we return a boolean from this method, so it is not eligible for any chaining after beng called
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
                //get class list
                //we cache this in it's own variable so we can use it for a push call later on
                var classList = this.utils.getClassList(item);

                //check to see if our this item already has the class, add it if not
                if(!this.utils.arrayContains(classList, this.utils.convertSelectorToString(str))) {
                    array[index].className = this.utils.createClassList(classList.push(str));
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for removing a class from elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.removeClass = function() {
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
                //get class list
                //we cache this in it's own variable so we can use it for a splice call later on
                var classList = this.utils.getClassList(item);

                //check to see if class exists in class list
                //we cache this in it's own variable so we can use it for a splice call later on
                var removeIndex = this.utils.arrayContains(classList, str, true);

                //if the specified class was found in this element's class list
                if(removeIndex !== -1) {
                    //remove it from the class list
                    array[index].className = this.utils.createClassList(classList.splice(removeIndex, 1));
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for toggling a class on elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.toggleClass = function() {
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
            this.elements.forEach(function(item, index, array) {
                //get class list
                //we cache this in it's own variable so we can use it for a splice or push call later on
                var classList = this.utils.getClassList(item);

                //check to see if class exists in class list
                //we cache this in it's own variable so we can use it for a splice call later on
                var toggleIndex = this.utils.arrayContains(classList, str, true);

                if(toggleIndex !== -1) {
                    array[index].className = this.utils.createClassList(classList.push(str));
                } else {
                    array[index].className = this.utils.createClassList(classList.splice(toggleIndex, 1));
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };