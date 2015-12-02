# Vanilla

Vanilla is a jQuery-like library created for a series of Front-End workshops revolving around JavaScript.

We'll be using it as a way to explain what jQuery is doing under the covers and learn a bit more about how JavaScript works and also to explore es2015 and some of the improvements it brings to writing JavaScript.

This fairly close to final version of the library contains some potential improvements to the way that jQuery handles some of the methods we recreate.

## Concepts We Will Cover in the Workshops

In the workshops we will cover:

- Fluent Interface Pattern
- Command Query Separation
- Prototypal Inheritance
- `arguments` Object
- Rest Parameters and Spread Operator
- `className` property of Element Node Objects
- Array-like Objects
- Enumerable properties

## What Vanilla Does Not Do

Vanilla does not recreate the vast majority of the methods found in jQuery and is not meant to be a replacement as much as a learning exercise.

Vanilla also does not:

- Create a facade over browser inconsistencies
- Integrate polyfills for some missing functionality
- Use a robust selector engine

## What Vanilla Does Do

Vanilla recreates the following jQuery methods:

- `hasClass()`
- `toggleClass()`
- `addClass()`
- `removeClass()`
- `attr()`
- `data()`
- `extend()`
- `find()`