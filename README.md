# Vanilla

Vanilla is a jQuery-like library created for a series of Front-End workshops revolving around JavaScript.

We'll be using it as a way to explain what jQuery is doing under the covers and learn a bit more about how JavaScript works and also to explore es2015 and some of the improvements it brings to writing JavaScript.

This fairly close to final version of the library contains some potential improvements to the way that jQuery handles some of the methods we recreate and some small quality-of-life updates that make the library easy to work with as a developer.

## Concepts We Will Cover in the Workshops

In the workshops we will cover many things, including:

- Fluent Interface Pattern
- Command Query Separation
- Prototypal Inheritance
- `arguments` Object
- Rest Parameters and Spread Operator
- `className` property of Element Node Objects
- Array-like Objects
- Enumerable properties
- `.querySelectorAll()`
-  various methods of iteration (and when certain methods are better than others):
    - `forEach`
    - `for`
    - `for..in`
    - `every`
    - `some`
- es2015 and transpiling with `babel`
- `gulp`
- How/Why jQuery does certain things:
    - How does method chaining work? (see:  Fluent Interface Pattern)
    - How does plugin extension work? (see:  Prototypal Inheritance)
    - Why the `$`?
    - What is `$.fn` and why do plugins use it?
    - How can plugins override other jQuery methods?


## What Vanilla Does Not Do

Vanilla does not recreate the vast majority of the methods found in jQuery and is not meant to be a replacement as much as a learning exercise.

Vanilla also does not:

- Create a facade over browser inconsistencies
- Integrate polyfills for some missing functionality
- Use a robust selector engine
- Deal with `document`/`window` states like `ready` and `load`
- Deal with event binding and triggering (though this may change in the future)

## What Vanilla Does Do

Vanilla currently recreates the following jQuery methods in an es5 JavaScript file that can be included in a project or an es2015 module that can be imported into any es6 modules:

- `hasClass()`
- `toggleClass()`
- `addClass()`
- `removeClass()`
- `attr()`
- `data()`
- `extend()`
- `find()`