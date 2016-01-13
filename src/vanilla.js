
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

    //this utility will take a container object and extend it with another object
    //`deep` is a Boolean that tells the utility whether it should copy deeply or not
    $v.fn.utils.mergeObjects = function(container, extendWith, deep) {
        //if we need to do a deep merge, return the result of deepMergeObjects() utility method
        if(deep) {
            return this.deepMergeObjects(container, extendWith);
        }

        //iterate through properties in `extendWith` object
        for(var prop in extendWith) {
            //make sure this is an enumerable property
            if(extendWith.hasOwnProperty(prop)) {
                //set the value of our container object's property to the value of our extension object's property
                container[prop] = extendWith[prop];
            }
        }

        //return our extended object
        return container;
    };

    //this utility will take a container object and extend it with another object
    //this is a deep copy
    $v.fn.utils.deepMergeObjects = function(container, extendWith) {
        //iterate through properties in `extendWith` object
        for(var prop in extendWith) {
            //check to see if this is an enumerable property of our extension object
            if(extendWith.hasOwnProperty(prop)) {
                //check to see if this is an enumerable proerty of our container object
                //if this property already exists on our container, we will want to treat it a bit differently
                if(container.hasOwnProperty(prop)) {
                    //if this property is an object
                    if(typeof extendWith[prop] === 'object') {
                        //recursively deep merge the object before setting our property's value
                        container[prop] = this.deepMergeObjects((typeof container[prop] === 'object' ? container[prop] : {}), extendWith[prop]);
                    //otherwise, we'll just set the container object's property to the value of the extension object's property
                    } else {
                        container[prop] = extendWith[prop];
                    }
                //if this property didn't exist on our container
                } else {
                    //define a new property on our container object with this proprety's value from our extension object
                    Object.defineProperty(container, prop, {
                        value: extendWith[prop],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        }

        //return our extended container object
        return container;
    };

    //this utility will take a node and return an object of it's attributes and values
    $v.fn.utils.generateAttributesObject = function(element, data) {
        //intialize empty object to store our attribute values
        var returnAttrs = {};

        //cache the attribute node list from our element so it's easier to reference
        var elementAttrs = element.attributes;

        //if the data attribute wasn't provided, explicitly set it to false
        if(typeof data === 'undefined') {
            data = false;
        }

        //iterate through our attributes node list
        //we are using a `for()` loop because this node list is an Array-like object and not an actual Array
        for(var i = 0; i < elementAttrs.length; i++) {
            //if we are only looking for data attributes and this is one, or if we aren't only looking for data attributes
            if(data && elementAttrs[i].nodeName.indexOf('data-') === 0 || !data) {
                //add attribute: value pair to our attribute object
                returnAttrs[elementAttrs[i].nodeName] = elementAttrs[i].nodeValue;
            }
        }

        //return our object of attributes
        return returnAttrs;
    };

    //replaces the current collection with a new collection created by running `querySelectorAll()`
    //from each item in the collection and looking for a specified selector
    $v.fn.find = function(str) {
        //1: cache current this.elements

        //2: clear current this.elements

        //3: Iterate through cached elements

          //3a: querySelectorAll on the current element in your iteration
          //3b: add the results of 3a to this.elements

        //4: return reference to $v for method chaining

        /*var elements = this.elements;

        this.elements = [];

        elements.forEach(function(item) {
            this.elements = this.elements.concat([].slice.call(item.querySelectorAll(str)));
        }, this);

        return this;*/
    };

    //method for getting/setting an attribute's value
    //if only the attribute parameter is provided, returns the attributes value from the first item in the collection
    //if both parameters are provided, sets the attribute to the provided value for each element in the collection
    //if the value provided is equal to `null`, removes the attribute for each element in the collection
    //if both the attribute and value are omitted, returns value of all attributes from the first item in the collection
    $v.fn.attr = function(attribute, value, data) {
        //if this wasn't called from the `$v.data()` method
        if(typeof data === 'undefined') {
            //explicitly define `data` as false
            data = false;
        }

        //if value was provided
        if(typeof value !== 'undefined') {
            //iterate through collection of elements
            this.elements.forEach(function(item, index, array) {
                //if the value being passed is null, we want to remove the attribute
                if(value === null) {
                    array[index].removeAttribute(attribute);
                //if the value isn't null, we want to set the attribute
                } else {
                    array[index].setAttribute(attribute, value);
                }
            }, this);

            //return reference to `$v` for method chaining
            return this;
        //if value wasn't provided
        //we return the actual value in this case, so the getter version of this method is not eligible for any method chaining
        } else {
            //if attribute name was provided
            if(typeof attribute !== 'undefined') {
                //return value of `attribute` for first item in collection
                return this.elements[0].getAttribute(attribute);
            //if no attribute was provided
            } else {
                //return values of all attributes for first item in collection
                return this.utils.generateAttributesObject(this.elements[0], data);
            }
        }
    };

    //method for getting/setting a reflexive attribute's value
    //if only the attribute parameter is provided, returns the attributes value from the first item in the collection
    //if both parameters are provided, sets the attribute to the provided value for each element in the collection
    //if the value provided is equal to `null`, removes the attribute for each element in the collection
    //if both the attribute and value are omitted, returns value of all attributes from the first item in the collection
    $v.fn.prop = function(attribute, value) {
        //if value was provided
        if(typeof value !== 'undefined') {
            value = !!value;
            //iterate through collection of elements
            this.elements.forEach(function(item, index, array) {
                //if the value being passed is null, we want to remove the attribute
                if(value === null) {
                    array[index].removeAttribute(attribute);
                //if the value isn't null, we want to set the attribute
                } else {
                    array[index].attribute = value;
                }
            }, this);

            //return reference to `$v` for method chaining
            return this;
        //if value wasn't provided
        //we return the actual value in this case, so the getter version of this method is not eligible for any method chaining
        } else {
            //if attribute name was provided
            if(typeof attribute !== 'undefined') {
                //return value of `attribute` for first item in collection
                return this.elements[0][attribute];
            }
        }
    };

    //method for getting/setting a `data-` atrribute's value
    //calls the `$v.attr()` method, but prepends "data-" to the attribute name if necessary
    //will return all data attributes when called without either parameter
    $v.fn.data = function(attribute, value) {
        //return the result of `$v.attr()` with "data-" prepended to the provided attribute name
        return this.attr((attribute && attribute.indexOf('data-') !== 0 ? 'data-' + attribute : attribute), value, true);
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

      /*
      //initialize empty array to store references to our objects that are currently in the  `arguments` object
      var objs = [];

      //initialize a boolean for whether we want to do a deep merge or not
      //this method performs a shallow merge by default
      var deep = false;

      //iterate through our arguments Array-like object
      for(var a = 0; a < arguments.length; a++) {
          //add each argument to our `objs` array
          objs[a] = arguments[a];
      }

      //if the first argument was a boolean
      if(typeof objs[0] === 'boolean') {
          //we'll make it our new `deep` setting and remove it from the array
          deep = objs.shift();
      }

      //take the first object from the arguments, store it as our container, and remove it from the array
      var container = objs.shift();

      //iterate through the rest of our argument objects
      objs.forEach(function(item) {
          //mutate our container object by merging it with this item in the array
          container = this.fn.utils.mergeObjects(container, item, deep);
      }, this);

      //return the merged objects as a single object
      return container;
      */
    };