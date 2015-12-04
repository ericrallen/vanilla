# Vanilla v1.1.1

**Note**:  Want to [skip to the Workshop Notes](#workshop-notes)?

Vanilla is a jQuery-like library created for a series of Front-End workshops revolving around JavaScript.

We'll be using it as a way to explain what jQuery is doing under the covers and learn a bit more about how JavaScript works and also to explore es2015 and some of the improvements it brings to writing JavaScript.

This fairly close to final version of the library contains some potential improvements to the way that jQuery handles some of the methods we recreate and some small quality-of-life updates that make the library easy to work with as a developer.

## Concepts We Will Cover in the Workshops

In the workshops we will cover many things, including:

- Fluent Interface Pattern
- Command Query Separation
- DRY
- Prototypal Inheritance
- `arguments` Object
- Rest Parameters and Spread Operator
- `className` and `classList`
- Array-like Objects
- Enumerable properties
- `.querySelectorAll()`
- Array methods:  `split()`, `join()`, `concat()`, and `indexOf()`
-  various methods of iteration (and when certain methods are better than others):
    - `forEach`
    - `for`
    - `for..in`
    - `every`
    - `some`
- es2015 and transpiling with `babel`
- task automation with `gulp`
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

Vanilla currently recreates the following jQuery methods in an es5 JavaScript file that can be included in a project or an es2015 module that can be imported into any es2015 modules:

- `hasClass()`
- `toggleClass()`
- `addClass()`
- `removeClass()`
- `attr()`
- `data()`
- `extend()`
- `find()`

## Helpful Resources

- jQuery Source Viewer: [http://james.padolsey.com/jquery/](http://james.padolsey.com/jquery/)


<a href="javascript:void(0);" id="workshop-notes" name="workshop-notes"></a>
## Workshop Notes

#### Table of Contents

1. [Workshop[0]](#workshop-0)

<a href="javascript:void(0);" id="workshop-0" name="workshop-0"></a>
### Workshop[0]:  Classy jQuery

The first in our series of workshops is an introduction to the basics of how jQuery is designed and how we can recreate that design on our own.

We also delve into jQuery's class convenience methods and recreate them for ourselves.

**Presentation**:  [https://slides.com/allenericr/workshop-0-classy-jquery/](https://slides.com/allenericr/workshop-0-classy-jquery/)

**Branch**:  `workshop/0`

**Topics**:

- [x] Fluent Interface Pattern (*method chaining*)
- [x] DRY
- [x] `arguments`
- [x] Prototypal Inheritance
- [x] `className` and `classList`
- [x] Array-like Objects
- [x] `querySelectorAll()`
- [x] `split()`, `join()`, and `indexOf()`
- [x] Why `$`?
- [x] Why `$.fn`?
- [x] `hasClass()`, `addClass()`, `toggleClass()`, `removeClass()`