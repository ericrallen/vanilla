(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
    Vanilla
     A basic JavaScript Library that will mimic some jQuery funcitonality
    and allow us to explore some of the ways that jQuery achieves things
    as well as illustrating places where we really might not need jQuery
    to perform certain actions.
*/

//this will be the basis of our library, much like jQuery's `jQuery` function (often aliased as `$`)
var $v = function $v(selector) {
    //if this constructor was called without the `new` keyword, we should do that
    if (this === window || typeof this === 'undefined') {
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
$v.fn.utils.convertSelectorToString = function (str) {
    var checkCharacter = str[0];

    switch (checkCharacter) {
        case '.':
        case '#':
            return str.substr(1);
        default:
            return str;
    }
};

//this utility will take an element and split it's `className` attribute into an array
$v.fn.utils.getClassList = function (element) {
    return this.convertDelimitedStringToArray(element.className);
};

//this utility will take an array of classes and return the joined class list
$v.fn.utils.createClassList = function (classes) {
    return classes.join(' ');
};

//this utility checks to see if an array contains the specified value
$v.fn.utils.arrayContains = function (array, search) {
    var index = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    //if we are looking for a string, we'll want to trim it just in case there were leftover spaces
    var atIndex = array.indexOf(typeof search === 'string' ? search.trim() : search);

    //if item was found in array
    if (atIndex !== -1) {
        //return the index (if specified) or just a boolean
        return index ? atIndex : true;
    }

    return false;
};

//this utility takes a string and converts it into an array
//this can be done with a specified delimiter or it will use commas (if present in the string) or spaces
//it iterates through the array and trims any strings before returning it
$v.fn.utils.convertDelimitedStringToArray = function (str) {
    var delimiter = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    //split string on delimiter, comma, or space
    var items = str.split(delimiter ? delimiter : str.indexOf(',') !== -1 ? ',' : ' ');

    //iterate through our items array and trim any strings
    //then return the new array
    items.forEach(function (item, index, array) {
        if (typeof item === 'string') {
            array[index] = item.trim();
        }
    });

    return items;
};

//this utility will take a node and return an object of it's attributes and values
$v.fn.utils.generateAttributesObject = function (element) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    //intialize empty object to store our attribute values
    var returnAttrs = {};

    //cache the attribute node list from our element so it's easier to reference
    var elementAttrs = element.attributes;

    //iterate through our attributes node list
    //we are using a `for()` loop because this node list is an Array-like object and not an actual Array
    for (var i = 0; i < elementAttrs.length; i++) {
        //if we are only looking for data attributes and this is one, or if we aren't only looking for data attributes
        if (data && elementAttrs[i].nodeName.indexOf('data-') === 0 || !data) {
            //add attribute: value pair to our attribute object
            returnAttrs[elementAttrs[i].nodeName] = elementAttrs[i].nodeValue;
        }
    }

    //return our object of attributes
    return returnAttrs;
};

//this utility will take a container object and extend it with another object
//`deep` is a Boolean that tells the utility whether it should copy deeply or not
$v.fn.utils.mergeObjects = function (container, extendWith) {
    var deep = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    //if we need to do a deep merge, return the deepMergeObjects() utility method
    if (deep) {
        return this.deepMergeObjects(container, extendWith);
    }

    //use Object.assign for a nice shallow merge
    return Object.assign(container, extendWith);
};

//this utility will take a container object and extend it with another object
//this is a deep copy
$v.fn.utils.deepMergeObjects = function (container, extendWith) {
    //iterate through properties in `extendWith` object
    for (var prop in extendWith) {
        //check to see if this is an enumerable property of our extension object
        if (extendWith.hasOwnProperty(prop)) {
            //check to see if this is an enumerable proerty of our container object
            //if this property already exists on our container, we will want to treat it a bit differently
            if (container.hasOwnProperty(prop)) {
                //if this property is an object
                if (_typeof(extendWith[prop]) === 'object') {
                    //recursively deep merge the object before setting our property's value
                    container[prop] = this.deepMergeObjects(container[prop] ? container[prop] : {}, extendWith[prop]);
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

//replaces the current collection with a new collection created by running `querySelectorAll()` from each item in the collection and looking for
//a specified selector
$v.fn.find = function (str) {
    var _this = this;

    var elements = this.elements;

    this.elements = [];

    elements.forEach(function (item) {
        _this.elements.concat([].slice.call(item.querySelectorAll(str)));
    });

    return this;
};

//method for checking if the items in the current collection have a specified class
//we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
//1: We will allow the `hasClass()` method to accept any number of parameters
//2: We will accept space, or comma-delimited lists of class names for each parameter
$v.fn.hasClass = function () {
    var _this2 = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    //iterate through our new args array and split out any comma or space-delimited lists of class names
    var classes = args.map(function (item) {
        return this.utils.convertDelimitedStringToArray(item);
    });

    //iterate through the classes we need to check for
    //we are using `.every()` so that we can break out of the loop when the class is not found on an element
    //we return a boolean from this method, so it is not eligible for any chaining after beng called
    return classes.every(function (str) {
        //iterate through the elements in our collection
        return _this2.elements.every(function (item) {
            if (_this2.utils.arrayContains(_this2.utils.getClassList(item), _this2.utils.convertSelectorToString(str))) {
                return false;
            }

            return true;
        });
    });
};

//method for adding a class to elements in collection
//we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
//1: We will allow the `addClass()` method to accept any number of parameters
//2: We will accept space, or comma-delimited lists of class names for each parameter
$v.fn.addClass = function () {
    var _this3 = this;

    //iterate through our new args array and split out any comma or space-delimited lists of class names
    var classes = [];

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    args.forEach(function (item) {
        classes = classes.concat(_this3.utils.convertDelimitedStringToArray(item));
    });

    //iterate through the classes we need to check for
    //we are using `.every()` so that we can break out of the loop when the class is not found on an element
    classes.forEach(function (str) {
        //iterate through the elements in our collection
        _this3.elements.forEach(function (item, index, array) {
            //get class list
            //we cache this in it's own variable so we can use it for a push call later on
            var classList = _this3.utils.getClassList(item);

            //check to see if our this item already has the class, add it if not
            if (!_this3.utils.arrayContains(classList, _this3.utils.convertSelectorToString(str))) {
                classList.push(str);

                array[index].className = _this3.utils.createClassList(classList);
            }
        });
    });

    //return reference to `$v` for method chaining
    return this;
};

//method for removing a class from elements in collection
//we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
//1: We will allow the `addClass()` method to accept any number of parameters
//2: We will accept space, or comma-delimited lists of class names for each parameter
$v.fn.removeClass = function () {
    var _this4 = this;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    //iterate through our new args array and split out any comma or space-delimited lists of class names
    var classes = args.map(function (item) {
        return _this4.utils.convertDelimitedStringToArray(item);
    });

    //iterate through the classes we need to check for
    //we are using `.every()` so that we can break out of the loop when the class is not found on an element
    classes.forEach(function (str) {
        //iterate through the elements in our collection
        _this4.elements.forEach(function (item, index, array) {
            //get class list
            //we cache this in it's own variable so we can use it for a splice call later on
            var classList = _this4.utils.getClassList(item);

            //check to see if class exists in class list
            //we cache this in it's own variable so we can use it for a splice call later on
            var removeIndex = _this4.utils.arrayContains(classList, str, true);

            //if the specified class was found in this element's class list
            if (removeIndex !== -1) {
                //remove it from the class list
                array[index].className = _this4.utils.createClassList(classList.splice(removeIndex, 1));
            }
        });
    });

    //return reference to `$v` for method chaining
    return this;
};

//method for toggling a class on elements in collection
//we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
//1: We will allow the `addClass()` method to accept any number of parameters
//2: We will accept space, or comma-delimited lists of class names for each parameter
$v.fn.toggleClass = function () {
    var _this5 = this;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    //iterate through our new args array and split out any comma or space-delimited lists of class names
    var classes = args.map(function (item) {
        return _this5.utils.convertDelimitedStringToArray(item);
    });

    //iterate through the classes we need to check for
    //we are using `.every()` so that we can break out of the loop when the class is not found on an element
    classes.forEach(function (str) {
        _this5.elements.forEach(function (item, index, array) {
            //get class list
            //we cache this in it's own variable so we can use it for a splice or push call later on
            var classList = _this5.utils.getClassList(item);

            //check to see if class exists in class list
            //we cache this in it's own variable so we can use it for a splice call later on
            var toggleIndex = _this5.utils.arrayContains(classList, str, true);

            if (toggleIndex !== -1) {
                array[index].className = _this5.utils.createClassList(classList.push(str));
            } else {
                array[index].className = _this5.utils.createClassList(classList.splice(toggleIndex, 1));
            }
        });
    });

    //return reference to `$v` for method chaining
    return this;
};

//method for getting/setting an attribute's value
//if only the attribute parameter is provided, returns the attributes value from the first item in the collection
//if both parameters are provided, sets the attribute to the provided value for each element in the collection
//if the value provided is equal to `null`, removes the attribute for each element in the collection
//if both the attribute and value are omitted, returns value of all attributes from the first item in the collection
$v.fn.attr = function (attribute, value) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    //if value was provided
    if (typeof value !== 'undefined') {
        //iterate through collection of elements
        this.elements.forEach(function (item, index, array) {
            //if the value being passed is null, we want to remove the attribute
            if (value === null) {
                array[index].removeAttribute(attribute);
                //if the value isn't null, we want to set the attribute
            } else {
                    array[index].setAttribute(attribute, value);
                }
        });

        //return reference to `$v` for method chaining
        return this;
        //if value wasn't provided
        //we return the actual value in this case, so the getter version of this method is not eligible for any method chaining
    } else {
            //if attribute name was provided
            if (typeof attribute !== 'undefined') {
                //return value of `attribute` for first item in collection
                return this.elements[0].getAttribute(attribute);
                //if no attribute was provided
            } else {
                    //return values of all attributes for first item in collection
                    return this.utils.generateAttributesObject(this.elements[0], data);
                }
        }
};

//method for getting/setting a `data-` atrribute's value
//calls the `$v.attr()` method, but prepends "data-" to the attribute name if necessary
//will return all data attributes when called without either parameter
$v.fn.data = function (attribute, value) {
    //return the result of `$v.attr()` with "data-" prepended to the provided attribute name
    return this.attr(attribute && attribute.indexOf('data-') !== 0 ? 'data-' + attribute : attribute, value, true);
};

//method for extending an object with any other number of objects
//if the first parameter is a boolean and is true, it means we want to deeply merge the objects
//the first object provided will be used as a container object, to prevent mutation, pass an empty object `{}` as your container
//we aren't defining any parameters explicitly because the parameters are fluid in this case
//this method returns an object and is not eligible for any method chaining
$v.extend = function () {
    var _this6 = this;

    //initialize a boolean for whether we want to do a deep merge or not
    //this method performs a shallow merge by default
    var deep = false;

    //if the first argument was a boolean

    for (var _len5 = arguments.length, objs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        objs[_key5] = arguments[_key5];
    }

    if (typeof objs[0] === 'boolean') {
        //we'll make it our new `deep` setting and remove it from the array
        deep = objs.shift();
    }

    //take the first object from the arguments, store it as our container, and remove it from the array
    var container = objs.shift();

    //iterate through the rest of our argument objects
    objs.forEach(function (item) {
        //mutate our container object by merging it with this item in the array
        container = _this6.fn.utils.mergeObjects(container, item, deep);
    });

    //return the merged objects as a single object
    return container;
};

exports.default = $v;

},{}],2:[function(require,module,exports){
'use strict';

var _vanilla = require('../../es6/src/vanilla');

var _vanilla2 = _interopRequireDefault(_vanilla);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _vanilla2.default)('.testing-p').addClass('red-text'); /* jshint esnext: true */

},{"../../es6/src/vanilla":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczYvc3JjL3ZhbmlsbGEuanMiLCJ0ZXN0L2pzL3Rlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1dJLElBQU0sRUFBRSxHQUFHLFNBQUwsRUFBRSxDQUFZLFFBQVEsRUFBRTs7QUFFMUIsUUFBRyxJQUFJLEtBQUssTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUMvQyxlQUFPLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzNCOzs7O0FBQUEsQUFJRCxRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBQUMsQUFHbkUsV0FBTyxJQUFJLENBQUM7Q0FDZjs7O0FBQUMsQUFHRixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRTs7OztBQUFDLEFBSTFCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUU7Ozs7QUFBQyxBQUlqQixFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxVQUFTLEdBQUcsRUFBRTtBQUNoRCxRQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLFlBQU8sY0FBYztBQUNqQixhQUFLLEdBQUcsQ0FBQztBQUNULGFBQUssR0FBRztBQUNKLG1CQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBQSxBQUN6QjtBQUNJLG1CQUFPLEdBQUcsQ0FBQztBQUFBLEtBQ2xCO0NBQ0o7OztBQUFDLEFBR0YsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLFVBQVMsT0FBTyxFQUFFO0FBQ3pDLFdB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QUMsQ0FBQztDQUNwSDs7Ozs7OztBQUFDLEFBT0YsRUFBRSxDQUFDLE1BQU0sR0FBRyxZQUFrQjs7Ozs7QUFHMUIsUUFBSSxJQUFJLEdBQUcsS0FBSzs7O0FBQUM7dUNBSEcsSUFBSTtBQUFKLFlBQUk7OztBQU14QixRQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTs7QUFFN0IsWUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN2Qjs7O0FBQUEsQUFHRCxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFOzs7QUFBQyxBQUc3QixRQUFJLENBQUMsT0FBTyxDQUFFLFVBQUMsSUFBSSxFQUFLOztBQUVwQixpQkFBUyxHQUFHLE9BQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqRSxDQUFDOzs7QUFBQyxBQUdILFdBQU8sU0FBUyxDQUFDO0NBQ3BCLENBQUM7O2tCQUVhLEVBQUU7Ozs7Ozs7Ozs7O0FDaFhqQix1QkFBRyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDOztBQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuICAgIC8qKlxuICAgICAgICBWYW5pbGxhXG5cbiAgICAgICAgQSBiYXNpYyBKYXZhU2NyaXB0IExpYnJhcnkgdGhhdCB3aWxsIG1pbWljIHNvbWUgalF1ZXJ5IGZ1bmNpdG9uYWxpdHlcbiAgICAgICAgYW5kIGFsbG93IHVzIHRvIGV4cGxvcmUgc29tZSBvZiB0aGUgd2F5cyB0aGF0IGpRdWVyeSBhY2hpZXZlcyB0aGluZ3NcbiAgICAgICAgYXMgd2VsbCBhcyBpbGx1c3RyYXRpbmcgcGxhY2VzIHdoZXJlIHdlIHJlYWxseSBtaWdodCBub3QgbmVlZCBqUXVlcnlcbiAgICAgICAgdG8gcGVyZm9ybSBjZXJ0YWluIGFjdGlvbnMuXG4gICAgKi9cblxuICAgIC8vdGhpcyB3aWxsIGJlIHRoZSBiYXNpcyBvZiBvdXIgbGlicmFyeSwgbXVjaCBsaWtlIGpRdWVyeSdzIGBqUXVlcnlgIGZ1bmN0aW9uIChvZnRlbiBhbGlhc2VkIGFzIGAkYClcbiAgICBjb25zdCAkdiA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIC8vaWYgdGhpcyBjb25zdHJ1Y3RvciB3YXMgY2FsbGVkIHdpdGhvdXQgdGhlIGBuZXdgIGtleXdvcmQsIHdlIHNob3VsZCBkbyB0aGF0XG4gICAgICAgIGlmKHRoaXMgPT09IHdpbmRvdyB8fCB0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgJHYoc2VsZWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pbnN0ZWFkIG9mIGEgY29tcGxpY2F0ZWQgc2VsZWN0b3IgZW5naW5lIGxpa2UgU2l6emxlLCB3ZSdsbCBqdXN0IGJlIHJlbHlpbmcgb24gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoKWBcbiAgICAgICAgLy93ZSBhcmUgdXNpbmcgYFtdLnNsaWNlLmNhbGwoKWAgdG8gdHVybiB0aGUgQXJyYXktbGlrZSBsaXN0IG9mIEhUTUwgTm9kZXMgaW50byBhbiBhY3R1YWwgYXJyYXkgdGhhdCB3ZSBjYW4gdXNlIG5hdGl2ZSBBcnJheSBtZXRob2RzIG9uXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcblxuICAgICAgICAvL3JldHVybiByZWZlcmVuY2UgdG8gdGhpcyBvYmplY3RcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vc2V0IHVwIG91ciBwcm90b3R5cGUgYW5kIGFsaWFzIGl0IGlzIGAkdi5mbmAgbXVjaCBsaWtlIGpRdWVyeSBoYXMgYGpRdWVyeS5mbmAgKG9mdGVuIGFsaWFzZWQgYXMgYCQuZm5gKVxuICAgICR2LmZuID0gJHYucHJvdG90eXBlID0ge307XG5cbiAgICAvL3NldCB1cCBhIHByb3BlcnR5IG9mIG91ciBwcm90b3R5cGUgZm9yIHN0b3JpbmcgdXRpbGl0eSBhbmQgY29udmVuaWVuY2UgbWV0aG9kc1xuICAgIC8vc29tZSBvZiB0aGVzZSB3aWxsIHNlZW0gZXh0cmFuZW91cywgYnV0IGl0IHdpbGwgaGVscCB1cyBoYXZlIGBEUllgZXIgY29kZVxuICAgICR2LmZuLnV0aWxzID0ge307XG5cbiAgICAvL3RoaXMgdXRpbGl0eSB3aWxsIHN0cmlwIGEgYC5gIG9yIGAjYCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJpbmdcbiAgICAvL3dlJ2xsIHVzZSBpdCBmb3IgdGltZXMgd2hlbiB3ZSB3YW50IGFuIGlkIG9yIGNsYXNzIG5hbWUgYXMgYSBzdHJpbmcgYnV0IHRoZSB1c2VyIG1pZ2h0IGhhdmUgcGFzc2VkIHVzIGEgc2VsZWN0b3Igc3RyaW5nIGxpa2UgYCNpZGAgb3IgYC5jbGFzc2BcbiAgICAkdi5mbi51dGlscy5jb252ZXJ0U2VsZWN0b3JUb1N0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBjb25zdCBjaGVja0NoYXJhY3RlciA9IHN0clswXTtcblxuICAgICAgICBzd2l0Y2goY2hlY2tDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy90aGlzIHV0aWxpdHkgd2lsbCB0YWtlIGFuIGVsZW1lbnQgYW5kIHNwbGl0IGl0J3MgYGNsYXNzTmFtZWAgYXR0cmlidXRlIGludG8gYW4gYXJyYXlcbiAgICAkdi5mbi51dGlscy5nZXRDbGFzc0xpc3QgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnREZWxpbWl0ZWRTdHJpbmdUb0FycmF5KGVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICB9O1xuXG4gICAgLy90aGlzIHV0aWxpdHkgd2lsbCB0YWtlIGFuIGFycmF5IG9mIGNsYXNzZXMgYW5kIHJldHVybiB0aGUgam9pbmVkIGNsYXNzIGxpc3RcbiAgICAkdi5mbi51dGlscy5jcmVhdGVDbGFzc0xpc3QgPSBmdW5jdGlvbihjbGFzc2VzKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgICB9O1xuXG4gICAgLy90aGlzIHV0aWxpdHkgY2hlY2tzIHRvIHNlZSBpZiBhbiBhcnJheSBjb250YWlucyB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgJHYuZm4udXRpbHMuYXJyYXlDb250YWlucyA9IGZ1bmN0aW9uKGFycmF5LCBzZWFyY2gsIGluZGV4ID0gZmFsc2UpIHtcbiAgICAgICAgLy9pZiB3ZSBhcmUgbG9va2luZyBmb3IgYSBzdHJpbmcsIHdlJ2xsIHdhbnQgdG8gdHJpbSBpdCBqdXN0IGluIGNhc2UgdGhlcmUgd2VyZSBsZWZ0b3ZlciBzcGFjZXNcbiAgICAgICAgY29uc3QgYXRJbmRleCA9IGFycmF5LmluZGV4T2YoKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnID8gc2VhcmNoLnRyaW0oKSA6IHNlYXJjaCkpO1xuXG4gICAgICAgIC8vaWYgaXRlbSB3YXMgZm91bmQgaW4gYXJyYXlcbiAgICAgICBpZihhdEluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgLy9yZXR1cm4gdGhlIGluZGV4IChpZiBzcGVjaWZpZWQpIG9yIGp1c3QgYSBib29sZWFuXG4gICAgICAgICAgICByZXR1cm4gKGluZGV4ID8gYXRJbmRleCA6IHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvL3RoaXMgdXRpbGl0eSB0YWtlcyBhIHN0cmluZyBhbmQgY29udmVydHMgaXQgaW50byBhbiBhcnJheVxuICAgIC8vdGhpcyBjYW4gYmUgZG9uZSB3aXRoIGEgc3BlY2lmaWVkIGRlbGltaXRlciBvciBpdCB3aWxsIHVzZSBjb21tYXMgKGlmIHByZXNlbnQgaW4gdGhlIHN0cmluZykgb3Igc3BhY2VzXG4gICAgLy9pdCBpdGVyYXRlcyB0aHJvdWdoIHRoZSBhcnJheSBhbmQgdHJpbXMgYW55IHN0cmluZ3MgYmVmb3JlIHJldHVybmluZyBpdFxuICAgICR2LmZuLnV0aWxzLmNvbnZlcnREZWxpbWl0ZWRTdHJpbmdUb0FycmF5ID0gZnVuY3Rpb24oc3RyLCBkZWxpbWl0ZXIgPSBmYWxzZSkge1xuICAgICAgICAvL3NwbGl0IHN0cmluZyBvbiBkZWxpbWl0ZXIsIGNvbW1hLCBvciBzcGFjZVxuICAgICAgICBsZXQgaXRlbXMgPSBzdHIuc3BsaXQoKGRlbGltaXRlciA/IGRlbGltaXRlciA6IChzdHIuaW5kZXhPZignLCcpICE9PSAtMSA/ICcsJyA6ICcgJykpKTtcblxuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCBvdXIgaXRlbXMgYXJyYXkgYW5kIHRyaW0gYW55IHN0cmluZ3NcbiAgICAgICAgLy90aGVuIHJldHVybiB0aGUgbmV3IGFycmF5XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0gPSBpdGVtLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH07XG5cbiAgICAvL3RoaXMgdXRpbGl0eSB3aWxsIHRha2UgYSBub2RlIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGl0J3MgYXR0cmlidXRlcyBhbmQgdmFsdWVzXG4gICAgJHYuZm4udXRpbHMuZ2VuZXJhdGVBdHRyaWJ1dGVzT2JqZWN0ID0gZnVuY3Rpb24oZWxlbWVudCwgZGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIC8vaW50aWFsaXplIGVtcHR5IG9iamVjdCB0byBzdG9yZSBvdXIgYXR0cmlidXRlIHZhbHVlc1xuICAgICAgICBsZXQgcmV0dXJuQXR0cnMgPSB7fTtcblxuICAgICAgICAvL2NhY2hlIHRoZSBhdHRyaWJ1dGUgbm9kZSBsaXN0IGZyb20gb3VyIGVsZW1lbnQgc28gaXQncyBlYXNpZXIgdG8gcmVmZXJlbmNlXG4gICAgICAgIGNvbnN0IGVsZW1lbnRBdHRycyA9IGVsZW1lbnQuYXR0cmlidXRlcztcblxuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCBvdXIgYXR0cmlidXRlcyBub2RlIGxpc3RcbiAgICAgICAgLy93ZSBhcmUgdXNpbmcgYSBgZm9yKClgIGxvb3AgYmVjYXVzZSB0aGlzIG5vZGUgbGlzdCBpcyBhbiBBcnJheS1saWtlIG9iamVjdCBhbmQgbm90IGFuIGFjdHVhbCBBcnJheVxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudEF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvL2lmIHdlIGFyZSBvbmx5IGxvb2tpbmcgZm9yIGRhdGEgYXR0cmlidXRlcyBhbmQgdGhpcyBpcyBvbmUsIG9yIGlmIHdlIGFyZW4ndCBvbmx5IGxvb2tpbmcgZm9yIGRhdGEgYXR0cmlidXRlc1xuICAgICAgICAgICAgaWYoZGF0YSAmJiBlbGVtZW50QXR0cnNbaV0ubm9kZU5hbWUuaW5kZXhPZignZGF0YS0nKSA9PT0gMCB8fCAhZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vYWRkIGF0dHJpYnV0ZTogdmFsdWUgcGFpciB0byBvdXIgYXR0cmlidXRlIG9iamVjdFxuICAgICAgICAgICAgICAgIHJldHVybkF0dHJzW2VsZW1lbnRBdHRyc1tpXS5ub2RlTmFtZV0gPSBlbGVtZW50QXR0cnNbaV0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9yZXR1cm4gb3VyIG9iamVjdCBvZiBhdHRyaWJ1dGVzXG4gICAgICAgIHJldHVybiByZXR1cm5BdHRycztcbiAgICB9O1xuXG4gICAgLy90aGlzIHV0aWxpdHkgd2lsbCB0YWtlIGEgY29udGFpbmVyIG9iamVjdCBhbmQgZXh0ZW5kIGl0IHdpdGggYW5vdGhlciBvYmplY3RcbiAgICAvL2BkZWVwYCBpcyBhIEJvb2xlYW4gdGhhdCB0ZWxscyB0aGUgdXRpbGl0eSB3aGV0aGVyIGl0IHNob3VsZCBjb3B5IGRlZXBseSBvciBub3RcbiAgICAkdi5mbi51dGlscy5tZXJnZU9iamVjdHMgPSBmdW5jdGlvbihjb250YWluZXIsIGV4dGVuZFdpdGgsIGRlZXAgPSBmYWxzZSkge1xuICAgICAgICAvL2lmIHdlIG5lZWQgdG8gZG8gYSBkZWVwIG1lcmdlLCByZXR1cm4gdGhlIGRlZXBNZXJnZU9iamVjdHMoKSB1dGlsaXR5IG1ldGhvZFxuICAgICAgICBpZihkZWVwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWVwTWVyZ2VPYmplY3RzKGNvbnRhaW5lciwgZXh0ZW5kV2l0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3VzZSBPYmplY3QuYXNzaWduIGZvciBhIG5pY2Ugc2hhbGxvdyBtZXJnZVxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihjb250YWluZXIsIGV4dGVuZFdpdGgpO1xuICAgIH07XG5cbiAgICAvL3RoaXMgdXRpbGl0eSB3aWxsIHRha2UgYSBjb250YWluZXIgb2JqZWN0IGFuZCBleHRlbmQgaXQgd2l0aCBhbm90aGVyIG9iamVjdFxuICAgIC8vdGhpcyBpcyBhIGRlZXAgY29weVxuICAgICR2LmZuLnV0aWxzLmRlZXBNZXJnZU9iamVjdHMgPSBmdW5jdGlvbihjb250YWluZXIsIGV4dGVuZFdpdGgpIHtcbiAgICAgICAgLy9pdGVyYXRlIHRocm91Z2ggcHJvcGVydGllcyBpbiBgZXh0ZW5kV2l0aGAgb2JqZWN0XG4gICAgICAgIGZvcih2YXIgcHJvcCBpbiBleHRlbmRXaXRoKSB7XG4gICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGlzIGlzIGFuIGVudW1lcmFibGUgcHJvcGVydHkgb2Ygb3VyIGV4dGVuc2lvbiBvYmplY3RcbiAgICAgICAgICAgIGlmKGV4dGVuZFdpdGguaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGlzIGlzIGFuIGVudW1lcmFibGUgcHJvZXJ0eSBvZiBvdXIgY29udGFpbmVyIG9iamVjdFxuICAgICAgICAgICAgICAgIC8vaWYgdGhpcyBwcm9wZXJ0eSBhbHJlYWR5IGV4aXN0cyBvbiBvdXIgY29udGFpbmVyLCB3ZSB3aWxsIHdhbnQgdG8gdHJlYXQgaXQgYSBiaXQgZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICBpZihjb250YWluZXIuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiB0aGlzIHByb3BlcnR5IGlzIGFuIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZXh0ZW5kV2l0aFtwcm9wXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVjdXJzaXZlbHkgZGVlcCBtZXJnZSB0aGUgb2JqZWN0IGJlZm9yZSBzZXR0aW5nIG91ciBwcm9wZXJ0eSdzIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJbcHJvcF0gPSB0aGlzLmRlZXBNZXJnZU9iamVjdHMoKGNvbnRhaW5lcltwcm9wXSA/IGNvbnRhaW5lcltwcm9wXSA6IHt9KSwgZXh0ZW5kV2l0aFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vb3RoZXJ3aXNlLCB3ZSdsbCBqdXN0IHNldCB0aGUgY29udGFpbmVyIG9iamVjdCdzIHByb3BlcnR5IHRvIHRoZSB2YWx1ZSBvZiB0aGUgZXh0ZW5zaW9uIG9iamVjdCdzIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJbcHJvcF0gPSBleHRlbmRXaXRoW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9pZiB0aGlzIHByb3BlcnR5IGRpZG4ndCBleGlzdCBvbiBvdXIgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9kZWZpbmUgYSBuZXcgcHJvcGVydHkgb24gb3VyIGNvbnRhaW5lciBvYmplY3Qgd2l0aCB0aGlzIHByb3ByZXR5J3MgdmFsdWUgZnJvbSBvdXIgZXh0ZW5zaW9uIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udGFpbmVyLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXh0ZW5kV2l0aFtwcm9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3JldHVybiBvdXIgZXh0ZW5kZWQgY29udGFpbmVyIG9iamVjdFxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH07XG5cbiAgICAvL3JlcGxhY2VzIHRoZSBjdXJyZW50IGNvbGxlY3Rpb24gd2l0aCBhIG5ldyBjb2xsZWN0aW9uIGNyZWF0ZWQgYnkgcnVubmluZyBgcXVlcnlTZWxlY3RvckFsbCgpYCBmcm9tIGVhY2ggaXRlbSBpbiB0aGUgY29sbGVjdGlvbiBhbmQgbG9va2luZyBmb3JcbiAgICAvL2Egc3BlY2lmaWVkIHNlbGVjdG9yXG4gICAgJHYuZm4uZmluZCA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuY29uY2F0KFtdLnNsaWNlLmNhbGwoaXRlbS5xdWVyeVNlbGVjdG9yQWxsKHN0cikpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vbWV0aG9kIGZvciBjaGVja2luZyBpZiB0aGUgaXRlbXMgaW4gdGhlIGN1cnJlbnQgY29sbGVjdGlvbiBoYXZlIGEgc3BlY2lmaWVkIGNsYXNzXG4gICAgLy93ZSB3YW50IHRoZSB1c2VyIHRvIGJlIGFibGUgdG8gcGFzcyBpbiBhcyBtYW55IGNsYXNzZXMgYXMgdGhleSB3YW50LCB3ZSdsbCBhY2hlaXZlIHRoaXMgaW4gdHdvIHdheXNcbiAgICAvLzE6IFdlIHdpbGwgYWxsb3cgdGhlIGBoYXNDbGFzcygpYCBtZXRob2QgdG8gYWNjZXB0IGFueSBudW1iZXIgb2YgcGFyYW1ldGVyc1xuICAgIC8vMjogV2Ugd2lsbCBhY2NlcHQgc3BhY2UsIG9yIGNvbW1hLWRlbGltaXRlZCBsaXN0cyBvZiBjbGFzcyBuYW1lcyBmb3IgZWFjaCBwYXJhbWV0ZXJcbiAgICAkdi5mbi5oYXNDbGFzcyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgLy9pdGVyYXRlIHRocm91Z2ggb3VyIG5ldyBhcmdzIGFycmF5IGFuZCBzcGxpdCBvdXQgYW55IGNvbW1hIG9yIHNwYWNlLWRlbGltaXRlZCBsaXN0cyBvZiBjbGFzcyBuYW1lc1xuICAgICAgICBsZXQgY2xhc3NlcyA9IGFyZ3MubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmNvbnZlcnREZWxpbWl0ZWRTdHJpbmdUb0FycmF5KGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCB0aGUgY2xhc3NlcyB3ZSBuZWVkIHRvIGNoZWNrIGZvclxuICAgICAgICAvL3dlIGFyZSB1c2luZyBgLmV2ZXJ5KClgIHNvIHRoYXQgd2UgY2FuIGJyZWFrIG91dCBvZiB0aGUgbG9vcCB3aGVuIHRoZSBjbGFzcyBpcyBub3QgZm91bmQgb24gYW4gZWxlbWVudFxuICAgICAgICAvL3dlIHJldHVybiBhIGJvb2xlYW4gZnJvbSB0aGlzIG1ldGhvZCwgc28gaXQgaXMgbm90IGVsaWdpYmxlIGZvciBhbnkgY2hhaW5pbmcgYWZ0ZXIgYmVuZyBjYWxsZWRcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuZXZlcnkoIChzdHIpID0+IHtcbiAgICAgICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHRoZSBlbGVtZW50cyBpbiBvdXIgY29sbGVjdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuZXZlcnkoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy51dGlscy5hcnJheUNvbnRhaW5zKHRoaXMudXRpbHMuZ2V0Q2xhc3NMaXN0KGl0ZW0pLCB0aGlzLnV0aWxzLmNvbnZlcnRTZWxlY3RvclRvU3RyaW5nKHN0cikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9tZXRob2QgZm9yIGFkZGluZyBhIGNsYXNzIHRvIGVsZW1lbnRzIGluIGNvbGxlY3Rpb25cbiAgICAvL3dlIHdhbnQgdGhlIHVzZXIgdG8gYmUgYWJsZSB0byBwYXNzIGluIGFzIG1hbnkgY2xhc3NlcyBhcyB0aGV5IHdhbnQsIHdlJ2xsIGFjaGVpdmUgdGhpcyBpbiB0d28gd2F5c1xuICAgIC8vMTogV2Ugd2lsbCBhbGxvdyB0aGUgYGFkZENsYXNzKClgIG1ldGhvZCB0byBhY2NlcHQgYW55IG51bWJlciBvZiBwYXJhbWV0ZXJzXG4gICAgLy8yOiBXZSB3aWxsIGFjY2VwdCBzcGFjZSwgb3IgY29tbWEtZGVsaW1pdGVkIGxpc3RzIG9mIGNsYXNzIG5hbWVzIGZvciBlYWNoIHBhcmFtZXRlclxuICAgICR2LmZuLmFkZENsYXNzID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCBvdXIgbmV3IGFyZ3MgYXJyYXkgYW5kIHNwbGl0IG91dCBhbnkgY29tbWEgb3Igc3BhY2UtZGVsaW1pdGVkIGxpc3RzIG9mIGNsYXNzIG5hbWVzXG4gICAgICAgIGxldCBjbGFzc2VzID0gW107XG5cbiAgICAgICAgYXJncy5mb3JFYWNoKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMuY29uY2F0KHRoaXMudXRpbHMuY29udmVydERlbGltaXRlZFN0cmluZ1RvQXJyYXkoaXRlbSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCB0aGUgY2xhc3NlcyB3ZSBuZWVkIHRvIGNoZWNrIGZvclxuICAgICAgICAvL3dlIGFyZSB1c2luZyBgLmV2ZXJ5KClgIHNvIHRoYXQgd2UgY2FuIGJyZWFrIG91dCBvZiB0aGUgbG9vcCB3aGVuIHRoZSBjbGFzcyBpcyBub3QgZm91bmQgb24gYW4gZWxlbWVudFxuICAgICAgICBjbGFzc2VzLmZvckVhY2goIChzdHIpID0+IHtcbiAgICAgICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHRoZSBlbGVtZW50cyBpbiBvdXIgY29sbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKCAoaXRlbSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgLy9nZXQgY2xhc3MgbGlzdFxuICAgICAgICAgICAgICAgIC8vd2UgY2FjaGUgdGhpcyBpbiBpdCdzIG93biB2YXJpYWJsZSBzbyB3ZSBjYW4gdXNlIGl0IGZvciBhIHB1c2ggY2FsbCBsYXRlciBvblxuICAgICAgICAgICAgICAgIGxldCBjbGFzc0xpc3QgPSB0aGlzLnV0aWxzLmdldENsYXNzTGlzdChpdGVtKTtcblxuICAgICAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIG91ciB0aGlzIGl0ZW0gYWxyZWFkeSBoYXMgdGhlIGNsYXNzLCBhZGQgaXQgaWYgbm90XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMudXRpbHMuYXJyYXlDb250YWlucyhjbGFzc0xpc3QsIHRoaXMudXRpbHMuY29udmVydFNlbGVjdG9yVG9TdHJpbmcoc3RyKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnB1c2goc3RyKTtcblxuICAgICAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0uY2xhc3NOYW1lID0gdGhpcy51dGlscy5jcmVhdGVDbGFzc0xpc3QoY2xhc3NMaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9yZXR1cm4gcmVmZXJlbmNlIHRvIGAkdmAgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy9tZXRob2QgZm9yIHJlbW92aW5nIGEgY2xhc3MgZnJvbSBlbGVtZW50cyBpbiBjb2xsZWN0aW9uXG4gICAgLy93ZSB3YW50IHRoZSB1c2VyIHRvIGJlIGFibGUgdG8gcGFzcyBpbiBhcyBtYW55IGNsYXNzZXMgYXMgdGhleSB3YW50LCB3ZSdsbCBhY2hlaXZlIHRoaXMgaW4gdHdvIHdheXNcbiAgICAvLzE6IFdlIHdpbGwgYWxsb3cgdGhlIGBhZGRDbGFzcygpYCBtZXRob2QgdG8gYWNjZXB0IGFueSBudW1iZXIgb2YgcGFyYW1ldGVyc1xuICAgIC8vMjogV2Ugd2lsbCBhY2NlcHQgc3BhY2UsIG9yIGNvbW1hLWRlbGltaXRlZCBsaXN0cyBvZiBjbGFzcyBuYW1lcyBmb3IgZWFjaCBwYXJhbWV0ZXJcbiAgICAkdi5mbi5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgLy9pdGVyYXRlIHRocm91Z2ggb3VyIG5ldyBhcmdzIGFycmF5IGFuZCBzcGxpdCBvdXQgYW55IGNvbW1hIG9yIHNwYWNlLWRlbGltaXRlZCBsaXN0cyBvZiBjbGFzcyBuYW1lc1xuICAgICAgICBsZXQgY2xhc3NlcyA9IGFyZ3MubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY29udmVydERlbGltaXRlZFN0cmluZ1RvQXJyYXkoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHRoZSBjbGFzc2VzIHdlIG5lZWQgdG8gY2hlY2sgZm9yXG4gICAgICAgIC8vd2UgYXJlIHVzaW5nIGAuZXZlcnkoKWAgc28gdGhhdCB3ZSBjYW4gYnJlYWsgb3V0IG9mIHRoZSBsb29wIHdoZW4gdGhlIGNsYXNzIGlzIG5vdCBmb3VuZCBvbiBhbiBlbGVtZW50XG4gICAgICAgIGNsYXNzZXMuZm9yRWFjaCggKHN0cikgPT4ge1xuICAgICAgICAgICAgLy9pdGVyYXRlIHRocm91Z2ggdGhlIGVsZW1lbnRzIGluIG91ciBjb2xsZWN0aW9uXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLmZvckVhY2goIChpdGVtLCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAvL2dldCBjbGFzcyBsaXN0XG4gICAgICAgICAgICAgICAgLy93ZSBjYWNoZSB0aGlzIGluIGl0J3Mgb3duIHZhcmlhYmxlIHNvIHdlIGNhbiB1c2UgaXQgZm9yIGEgc3BsaWNlIGNhbGwgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NMaXN0ID0gdGhpcy51dGlscy5nZXRDbGFzc0xpc3QoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiBjbGFzcyBleGlzdHMgaW4gY2xhc3MgbGlzdFxuICAgICAgICAgICAgICAgIC8vd2UgY2FjaGUgdGhpcyBpbiBpdCdzIG93biB2YXJpYWJsZSBzbyB3ZSBjYW4gdXNlIGl0IGZvciBhIHNwbGljZSBjYWxsIGxhdGVyIG9uXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlSW5kZXggPSB0aGlzLnV0aWxzLmFycmF5Q29udGFpbnMoY2xhc3NMaXN0LCBzdHIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgc3BlY2lmaWVkIGNsYXNzIHdhcyBmb3VuZCBpbiB0aGlzIGVsZW1lbnQncyBjbGFzcyBsaXN0XG4gICAgICAgICAgICAgICAgaWYocmVtb3ZlSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vcmVtb3ZlIGl0IGZyb20gdGhlIGNsYXNzIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdLmNsYXNzTmFtZSA9IHRoaXMudXRpbHMuY3JlYXRlQ2xhc3NMaXN0KGNsYXNzTGlzdC5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9yZXR1cm4gcmVmZXJlbmNlIHRvIGAkdmAgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy9tZXRob2QgZm9yIHRvZ2dsaW5nIGEgY2xhc3Mgb24gZWxlbWVudHMgaW4gY29sbGVjdGlvblxuICAgIC8vd2Ugd2FudCB0aGUgdXNlciB0byBiZSBhYmxlIHRvIHBhc3MgaW4gYXMgbWFueSBjbGFzc2VzIGFzIHRoZXkgd2FudCwgd2UnbGwgYWNoZWl2ZSB0aGlzIGluIHR3byB3YXlzXG4gICAgLy8xOiBXZSB3aWxsIGFsbG93IHRoZSBgYWRkQ2xhc3MoKWAgbWV0aG9kIHRvIGFjY2VwdCBhbnkgbnVtYmVyIG9mIHBhcmFtZXRlcnNcbiAgICAvLzI6IFdlIHdpbGwgYWNjZXB0IHNwYWNlLCBvciBjb21tYS1kZWxpbWl0ZWQgbGlzdHMgb2YgY2xhc3MgbmFtZXMgZm9yIGVhY2ggcGFyYW1ldGVyXG4gICAgJHYuZm4udG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIG91ciBuZXcgYXJncyBhcnJheSBhbmQgc3BsaXQgb3V0IGFueSBjb21tYSBvciBzcGFjZS1kZWxpbWl0ZWQgbGlzdHMgb2YgY2xhc3MgbmFtZXNcbiAgICAgICAgbGV0IGNsYXNzZXMgPSBhcmdzLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmNvbnZlcnREZWxpbWl0ZWRTdHJpbmdUb0FycmF5KGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2l0ZXJhdGUgdGhyb3VnaCB0aGUgY2xhc3NlcyB3ZSBuZWVkIHRvIGNoZWNrIGZvclxuICAgICAgICAvL3dlIGFyZSB1c2luZyBgLmV2ZXJ5KClgIHNvIHRoYXQgd2UgY2FuIGJyZWFrIG91dCBvZiB0aGUgbG9vcCB3aGVuIHRoZSBjbGFzcyBpcyBub3QgZm91bmQgb24gYW4gZWxlbWVudFxuICAgICAgICBjbGFzc2VzLmZvckVhY2goIChzdHIpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCggKGl0ZW0sIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vZ2V0IGNsYXNzIGxpc3RcbiAgICAgICAgICAgICAgICAvL3dlIGNhY2hlIHRoaXMgaW4gaXQncyBvd24gdmFyaWFibGUgc28gd2UgY2FuIHVzZSBpdCBmb3IgYSBzcGxpY2Ugb3IgcHVzaCBjYWxsIGxhdGVyIG9uXG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzTGlzdCA9IHRoaXMudXRpbHMuZ2V0Q2xhc3NMaXN0KGl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgY2xhc3MgZXhpc3RzIGluIGNsYXNzIGxpc3RcbiAgICAgICAgICAgICAgICAvL3dlIGNhY2hlIHRoaXMgaW4gaXQncyBvd24gdmFyaWFibGUgc28gd2UgY2FuIHVzZSBpdCBmb3IgYSBzcGxpY2UgY2FsbCBsYXRlciBvblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZUluZGV4ID0gdGhpcy51dGlscy5hcnJheUNvbnRhaW5zKGNsYXNzTGlzdCwgc3RyLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmKHRvZ2dsZUluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0uY2xhc3NOYW1lID0gdGhpcy51dGlscy5jcmVhdGVDbGFzc0xpc3QoY2xhc3NMaXN0LnB1c2goc3RyKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdLmNsYXNzTmFtZSA9IHRoaXMudXRpbHMuY3JlYXRlQ2xhc3NMaXN0KGNsYXNzTGlzdC5zcGxpY2UodG9nZ2xlSW5kZXgsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9yZXR1cm4gcmVmZXJlbmNlIHRvIGAkdmAgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy9tZXRob2QgZm9yIGdldHRpbmcvc2V0dGluZyBhbiBhdHRyaWJ1dGUncyB2YWx1ZVxuICAgIC8vaWYgb25seSB0aGUgYXR0cmlidXRlIHBhcmFtZXRlciBpcyBwcm92aWRlZCwgcmV0dXJucyB0aGUgYXR0cmlidXRlcyB2YWx1ZSBmcm9tIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgLy9pZiBib3RoIHBhcmFtZXRlcnMgYXJlIHByb3ZpZGVkLCBzZXRzIHRoZSBhdHRyaWJ1dGUgdG8gdGhlIHByb3ZpZGVkIHZhbHVlIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAvL2lmIHRoZSB2YWx1ZSBwcm92aWRlZCBpcyBlcXVhbCB0byBgbnVsbGAsIHJlbW92ZXMgdGhlIGF0dHJpYnV0ZSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uXG4gICAgLy9pZiBib3RoIHRoZSBhdHRyaWJ1dGUgYW5kIHZhbHVlIGFyZSBvbWl0dGVkLCByZXR1cm5zIHZhbHVlIG9mIGFsbCBhdHRyaWJ1dGVzIGZyb20gdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAkdi5mbi5hdHRyID0gZnVuY3Rpb24oYXR0cmlidXRlLCB2YWx1ZSwgZGF0YSA9IGZhbHNlKSB7XG4gICAgICAgIC8vaWYgdmFsdWUgd2FzIHByb3ZpZGVkXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIGNvbGxlY3Rpb24gb2YgZWxlbWVudHNcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCggKGl0ZW0sIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vaWYgdGhlIHZhbHVlIGJlaW5nIHBhc3NlZCBpcyBudWxsLCB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIC8vaWYgdGhlIHZhbHVlIGlzbid0IG51bGwsIHdlIHdhbnQgdG8gc2V0IHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0uc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3JldHVybiByZWZlcmVuY2UgdG8gYCR2YCBmb3IgbWV0aG9kIGNoYWluaW5nXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgLy9pZiB2YWx1ZSB3YXNuJ3QgcHJvdmlkZWRcbiAgICAgICAgLy93ZSByZXR1cm4gdGhlIGFjdHVhbCB2YWx1ZSBpbiB0aGlzIGNhc2UsIHNvIHRoZSBnZXR0ZXIgdmVyc2lvbiBvZiB0aGlzIG1ldGhvZCBpcyBub3QgZWxpZ2libGUgZm9yIGFueSBtZXRob2QgY2hhaW5pbmdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vaWYgYXR0cmlidXRlIG5hbWUgd2FzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZih0eXBlb2YgYXR0cmlidXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHZhbHVlIG9mIGBhdHRyaWJ1dGVgIGZvciBmaXJzdCBpdGVtIGluIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIC8vaWYgbm8gYXR0cmlidXRlIHdhcyBwcm92aWRlZFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiB2YWx1ZXMgb2YgYWxsIGF0dHJpYnV0ZXMgZm9yIGZpcnN0IGl0ZW0gaW4gY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmdlbmVyYXRlQXR0cmlidXRlc09iamVjdCh0aGlzLmVsZW1lbnRzWzBdLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL21ldGhvZCBmb3IgZ2V0dGluZy9zZXR0aW5nIGEgYGRhdGEtYCBhdHJyaWJ1dGUncyB2YWx1ZVxuICAgIC8vY2FsbHMgdGhlIGAkdi5hdHRyKClgIG1ldGhvZCwgYnV0IHByZXBlbmRzIFwiZGF0YS1cIiB0byB0aGUgYXR0cmlidXRlIG5hbWUgaWYgbmVjZXNzYXJ5XG4gICAgLy93aWxsIHJldHVybiBhbGwgZGF0YSBhdHRyaWJ1dGVzIHdoZW4gY2FsbGVkIHdpdGhvdXQgZWl0aGVyIHBhcmFtZXRlclxuICAgICR2LmZuLmRhdGEgPSBmdW5jdGlvbihhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgICAgIC8vcmV0dXJuIHRoZSByZXN1bHQgb2YgYCR2LmF0dHIoKWAgd2l0aCBcImRhdGEtXCIgcHJlcGVuZGVkIHRvIHRoZSBwcm92aWRlZCBhdHRyaWJ1dGUgbmFtZVxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLmluZGV4T2YoJ2RhdGEtJykgIT09IDAgPyAnZGF0YS0nICsgYXR0cmlidXRlIDogYXR0cmlidXRlKSwgdmFsdWUsIHRydWUpO1xuICAgIH07XG5cbiAgICAvL21ldGhvZCBmb3IgZXh0ZW5kaW5nIGFuIG9iamVjdCB3aXRoIGFueSBvdGhlciBudW1iZXIgb2Ygb2JqZWN0c1xuICAgIC8vaWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBhIGJvb2xlYW4gYW5kIGlzIHRydWUsIGl0IG1lYW5zIHdlIHdhbnQgdG8gZGVlcGx5IG1lcmdlIHRoZSBvYmplY3RzXG4gICAgLy90aGUgZmlyc3Qgb2JqZWN0IHByb3ZpZGVkIHdpbGwgYmUgdXNlZCBhcyBhIGNvbnRhaW5lciBvYmplY3QsIHRvIHByZXZlbnQgbXV0YXRpb24sIHBhc3MgYW4gZW1wdHkgb2JqZWN0IGB7fWAgYXMgeW91ciBjb250YWluZXJcbiAgICAvL3dlIGFyZW4ndCBkZWZpbmluZyBhbnkgcGFyYW1ldGVycyBleHBsaWNpdGx5IGJlY2F1c2UgdGhlIHBhcmFtZXRlcnMgYXJlIGZsdWlkIGluIHRoaXMgY2FzZVxuICAgIC8vdGhpcyBtZXRob2QgcmV0dXJucyBhbiBvYmplY3QgYW5kIGlzIG5vdCBlbGlnaWJsZSBmb3IgYW55IG1ldGhvZCBjaGFpbmluZ1xuICAgICR2LmV4dGVuZCA9IGZ1bmN0aW9uKC4uLm9ianMpIHtcbiAgICAgICAgLy9pbml0aWFsaXplIGEgYm9vbGVhbiBmb3Igd2hldGhlciB3ZSB3YW50IHRvIGRvIGEgZGVlcCBtZXJnZSBvciBub3RcbiAgICAgICAgLy90aGlzIG1ldGhvZCBwZXJmb3JtcyBhIHNoYWxsb3cgbWVyZ2UgYnkgZGVmYXVsdFxuICAgICAgICBsZXQgZGVlcCA9IGZhbHNlO1xuXG4gICAgICAgIC8vaWYgdGhlIGZpcnN0IGFyZ3VtZW50IHdhcyBhIGJvb2xlYW5cbiAgICAgICAgaWYodHlwZW9mIG9ianNbMF0gPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgLy93ZSdsbCBtYWtlIGl0IG91ciBuZXcgYGRlZXBgIHNldHRpbmcgYW5kIHJlbW92ZSBpdCBmcm9tIHRoZSBhcnJheVxuICAgICAgICAgICAgZGVlcCA9IG9ianMuc2hpZnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdGFrZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIGFyZ3VtZW50cywgc3RvcmUgaXQgYXMgb3VyIGNvbnRhaW5lciwgYW5kIHJlbW92ZSBpdCBmcm9tIHRoZSBhcnJheVxuICAgICAgICB2YXIgY29udGFpbmVyID0gb2Jqcy5zaGlmdCgpO1xuXG4gICAgICAgIC8vaXRlcmF0ZSB0aHJvdWdoIHRoZSByZXN0IG9mIG91ciBhcmd1bWVudCBvYmplY3RzXG4gICAgICAgIG9ianMuZm9yRWFjaCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIC8vbXV0YXRlIG91ciBjb250YWluZXIgb2JqZWN0IGJ5IG1lcmdpbmcgaXQgd2l0aCB0aGlzIGl0ZW0gaW4gdGhlIGFycmF5XG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmZuLnV0aWxzLm1lcmdlT2JqZWN0cyhjb250YWluZXIsIGl0ZW0sIGRlZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL3JldHVybiB0aGUgbWVyZ2VkIG9iamVjdHMgYXMgYSBzaW5nbGUgb2JqZWN0XG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfTtcblxuICAgIGV4cG9ydCBkZWZhdWx0ICR2OyIsIiAgICAvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbiAgICBpbXBvcnQgJHYgZnJvbSAnLi4vLi4vZXM2L3NyYy92YW5pbGxhJztcblxuICAgICR2KCcudGVzdGluZy1wJykuYWRkQ2xhc3MoJ3JlZC10ZXh0Jyk7Il19
