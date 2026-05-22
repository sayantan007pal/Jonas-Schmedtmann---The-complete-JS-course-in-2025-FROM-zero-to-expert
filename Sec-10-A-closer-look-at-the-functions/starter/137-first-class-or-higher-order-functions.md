# 137 — First-Class & Higher-Order Functions in JavaScript

> **Section:** 10 — A Closer Look at Functions
> **Key Theme:** How JS treats functions as values, and what powerful patterns that unlocks

---

## Table of Contents

1. [The Mental Model — Functions Are Values](#1-the-mental-model)
2. [First-Class Functions — The Language Feature](#2-first-class-functions)
   - 2.1 Storing in a Variable
   - 2.2 Storing in Object Properties
   - 2.3 Passing as an Argument
   - 2.4 Returning from a Function
   - 2.5 Functions Have Their Own Properties & Methods
   - 2.6 Function Types Quick Reference
3. [Higher-Order Functions — The Coding Pattern](#3-higher-order-functions)
   - 3.1 HOF That Receives a Function (Callback Pattern)
   - 3.2 HOF That Returns a Function (Factory Pattern)
   - 3.3 HOF That Both Receives AND Returns (Decorator Pattern)
4. [The Critical Difference](#4-critical-difference)
5. [Real-World Analogies](#5-real-world-analogies)
6. [Arrow Functions as Callbacks — Key Differences & Gotchas](#6-arrow-functions-gotchas)
7. [Built-in Higher-Order Functions in JS](#7-built-in-hofs)
8. [Deep Dive — Practical Examples](#8-deep-dive)
   - 8.1 Building Your Own `map` from Scratch
   - 8.2 Function Composition
   - 8.3 Currying & Partial Application
   - 8.4 `once` — One-Time Execution
   - 8.5 Memoization
   - 8.6 `bind()` for Partial Application
   - 8.7 IIFE — Functions as Immediately-Used Values
   - 8.8 `pipe` — Left-to-Right Composition
   - 8.9 Express Middleware — HOF in the Wild
   - 8.10 Debounce — Interview Classic HOF
   - 8.11 Throttle — Interview Classic HOF
   - 8.12 Building Custom Array HOFs (filter, find, some, every)
9. [Common Pitfalls & Gotchas](#9-common-pitfalls)
10. [Interview Q&A](#10-interview-qa)
11. [Code Tracing Exercise](#11-code-tracing)
12. [Event Loop & Callbacks — How Async HOFs Work](#12-event-loop)
13. [Cheat Sheet](#13-cheat-sheet)

---

## 1. The Mental Model

> **Key Insight:** In JavaScript, functions are simply **values** — just like numbers, strings, or objects. This single idea is the foundation of almost all advanced JavaScript patterns.

```
Number:   const age = 25;
String:   const name = "Alice";
Object:   const user = { name: "Alice" };
Function: const greet = function() { return "Hello!"; };  ← this is just a VALUE
```

Because functions are values, you can:
- **Store** them (in variables, arrays, objects)
- **Pass** them (as arguments to other functions)
- **Return** them (from other functions)
- **Call** them later (they "remember" their context via closures)

This property is called **first-class functions** and it's a characteristic of the JavaScript **language itself** — not something you write, but something JS *supports*.

---

## 2. First-Class Functions

> First-class functions = **the language feature** that says "functions are just values."
> Think of a function as a "first-class citizen" — it has all the rights that any other value has.

### 2.1 — Storing a Function in a Variable

```js
// Function Expression — the function itself is assigned as a value
const add = function (a, b) {
  return a + b;
};

// Arrow Function (same idea, shorter syntax)
const multiply = (a, b) => a * b;

// You can COPY a function to another variable, just like a number
const addAlias = add;
console.log(addAlias(3, 4)); // 7  ← same function, different reference

// Proof: both point to the same function
console.log(add === addAlias); // true
```

> **Analogy:** It's like saving a phone number. `add` is the contact, `addAlias` is the same number saved under a different name. Both ring the same phone.

---

### 2.2 — Storing a Function in Object Properties (Methods)

When a function lives inside an object, we call it a **method**. This is still just "storing a function as a value."

```js
const calculator = {
  // These are functions stored as object properties
  add: function (a, b) {
    return a + b;
  },
  subtract: (a, b) => a - b,

  // ES6 shorthand method syntax
  multiply(a, b) {
    return a * b;
  },
};

console.log(calculator.add(5, 3));      // 8
console.log(calculator.subtract(5, 3)); // 2
console.log(calculator.multiply(5, 3)); // 15

// You can even store a method in a variable
const doAdd = calculator.add;
console.log(doAdd(10, 20)); // 30
```

> Functions can also be stored in arrays:
> ```js
> const operations = [
>   (a, b) => a + b,
>   (a, b) => a - b,
>   (a, b) => a * b,
> ];
> console.log(operations[0](10, 5)); // 15  ← calling a function from an array!
> ```

---

### 2.3 — Passing a Function as an Argument

This is one of the most powerful use cases. You pass a function *into* another function so it can be used/called *inside* that function. The passed-in function is called a **callback function**.

```js
// greet is a regular function
function greet(name) {
  return `Hello, ${name}!`;
}

// processUser RECEIVES a function as its second argument
function processUser(name, callbackFn) {
  const message = callbackFn(name); // calling the passed-in function
  console.log(message);
}

// Passing the 'greet' function as a value (no parentheses! — we don't CALL it, we PASS it)
processUser("Alice", greet); // "Hello, Alice!"

// You can also pass an anonymous function inline
processUser("Bob", function (name) {
  return `Hey there, ${name}!`;
}); // "Hey there, Bob!"

// Or an arrow function inline
processUser("Charlie", (name) => `Yo, ${name}!`); // "Yo, Charlie!"
```

> **Critical Rule:** When passing a function as an argument, write it **without parentheses** — `greet` not `greet()`. With `()` you are *calling* the function immediately and passing its *return value*. Without `()` you are passing the *function itself*.

```js
// ✅ Correct — passing the FUNCTION itself
processUser("Alice", greet);

// ❌ Wrong — calling greet() immediately and passing undefined/result
processUser("Alice", greet());
```

---

### 2.4 — Returning a Function from a Function

A function can *produce* and *return* another function. The returned function "remembers" the outer function's variables — this is called a **closure**.

```js
// createGreeter RETURNS a function (it doesn't return a string or number)
function createGreeter(greeting) {
  return function (name) {
    // This inner function CLOSES OVER the 'greeting' variable
    return `${greeting}, ${name}!`;
  };
}

// createGreeter("Hello") doesn't print anything — it RETURNS a function
const greetInEnglish = createGreeter("Hello");
const greetInSpanish = createGreeter("Hola");
const greetInFrench  = createGreeter("Bonjour");

console.log(greetInEnglish("Alice"));  // "Hello, Alice!"
console.log(greetInSpanish("Alice"));  // "Hola, Alice!"
console.log(greetInFrench("Alice"));   // "Bonjour, Alice!"

// You can even call both at once (double invocation)
console.log(createGreeter("Hi")("Bob")); // "Hi, Bob!"
```

> **Arrow function version (same thing, more concise):**
> ```js
> const createGreeter = (greeting) => (name) => `${greeting}, ${name}!`;
> ```

---

### 2.5 — Functions Have Their Own Properties and Methods

Because functions are objects in JS, they carry metadata:

```js
function greetUser(name, age) {
  return `Hi ${name}, you are ${age}`;
}

// Built-in properties
console.log(greetUser.name);   // "greetUser"  ← the function's own name
console.log(greetUser.length); // 2            ← number of parameters

// Functions have methods like .call(), .apply(), .bind()
const user = { name: "Alice" };
const bound = greetUser.bind(user);
// (covered in detail in later sections)
```

**The three function invocation methods — `call`, `apply`, `bind`:**

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };

// .call(thisArg, arg1, arg2, ...) — invokes immediately, args passed one-by-one
console.log(introduce.call(alice, "Hello", "!"));   // "Hello, I'm Alice!"
console.log(introduce.call(bob,   "Hi",    "..."));  // "Hi, I'm Bob..."

// .apply(thisArg, [argsArray]) — invokes immediately, args passed as ARRAY
console.log(introduce.apply(alice, ["Hey", "?"]));  // "Hey, I'm Alice?"

// .bind(thisArg, arg1, ...) — does NOT invoke; RETURNS a new bound function
const greetAlice = introduce.bind(alice, "Howdy");  // 'greeting' pre-filled
console.log(greetAlice("!!"));   // "Howdy, I'm Alice!!"
console.log(greetAlice("~"));    // "Howdy, I'm Alice~"  ← reusable!

// Mnemonic: call = comma, apply = array, bind = borrow (or "bookmark")
```

> **MDN Source:** `bind()` creates a new function that, when called, has its `this` set to the provided value, with a given sequence of arguments *prepended*. This means `bind()` is also a form of **partial application** (pre-filling arguments).

> **Arrow functions CANNOT be re-bound** — `.call()`, `.apply()`, `.bind()` are ineffective at changing `this` for arrow functions. (See Section 6 for full details.)

---

### 2.6 — Function Types Quick Reference

JavaScript has four function types and multiple syntax forms. Knowing this is essential for interviews:

```js
// 1. FUNCTION DECLARATION — hoisted fully (available before its line)
greetDecl("Alice"); // ✅ Works! Hoisted.
function greetDecl(name) { return `Hello, ${name}`; }

// 2. FUNCTION EXPRESSION — NOT hoisted (only variable is hoisted, not the value)
// greetExpr("Bob"); // ❌ TypeError: greetExpr is not a function
const greetExpr = function (name) { return `Hello, ${name}`; };
greetExpr("Bob"); // ✅ Works after assignment.

// 3. ARROW FUNCTION — also NOT hoisted; no own 'this', 'arguments', 'super'
const greetArrow = (name) => `Hello, ${name}`;

// 4. METHOD (shorthand inside object/class)
const greeter = {
  greetMethod(name) { return `Hello, ${name}`; }, // method syntax
};
```

| Syntax | Hoisted? | Own `this`? | Own `arguments`? | Constructable? |
|---|---|---|---|---|
| Function Declaration | ✅ Fully | ✅ Yes | ✅ Yes | ✅ Yes |
| Function Expression | ⚠️ Var only | ✅ Yes | ✅ Yes | ✅ Yes |
| Arrow Function | ⚠️ Var only | ❌ No (lexical) | ❌ No | ❌ No |
| Method (shorthand) | ⚠️ Var only | ✅ Yes | ✅ Yes | ❌ No |

> **Key for HOFs:** When passing a function as a callback, use an **arrow function** if you need access to the surrounding `this` (e.g., in a class method). Use a **regular function** if the HOF needs to control `this` via `.call()/.apply()`.

---

## 3. Higher-Order Functions

> **Higher-Order Function (HOF)** = a function that either:
> 1. **Takes** one or more functions as arguments, **OR**
> 2. **Returns** a function as its result (or both)

This is a **coding pattern / technique** — something you *write* — made possible *because* JS has first-class functions.

### 3.1 — HOF That Receives a Function (Callback Pattern)

The function that the HOF receives is called a **callback** because it gets *called back* later by the HOF.

```js
// 'applyToAll' is the Higher-Order Function
// 'operation' is the callback function it receives
function applyToAll(arr, operation) {
  const result = [];
  for (const item of arr) {
    result.push(operation(item)); // calling the callback
  }
  return result;
}

// We can reuse the SAME HOF with different callbacks
const numbers = [1, 2, 3, 4, 5];

const doubled  = applyToAll(numbers, (x) => x * 2);     // [2, 4, 6, 8, 10]
const squared  = applyToAll(numbers, (x) => x ** 2);    // [1, 4, 9, 16, 25]
const asString = applyToAll(numbers, (x) => `#${x}`);   // ["#1", "#2", ...]

console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(squared);  // [1, 4, 9, 16, 25]
console.log(asString); // ["#1", "#2", "#3", "#4", "#5"]
```

> **Why is this powerful?** The HOF (`applyToAll`) handles the **repetitive structure** (looping over the array). You only need to plug in the **unique logic** (the callback). This is the core of **abstraction** in functional programming.

---

### 3.2 — HOF That Returns a Function (Factory Pattern)

```js
// 'createValidator' RETURNS a function — it's a HOF
function createValidator(minAge) {
  return function (age) {
    return age >= minAge;
  };
}

const isAdult    = createValidator(18); // Returns a validator function
const isSenior   = createValidator(65);
const isTeen     = createValidator(13);

console.log(isAdult(20));  // true
console.log(isAdult(16));  // false
console.log(isSenior(70)); // true
console.log(isTeen(15));   // true

// Real-world use: event handlers with pre-configured behavior
function createClickLogger(context) {
  return function (event) {
    console.log(`[${context}] clicked:`, event.target);
  };
}

const headerLogger = createClickLogger("Header");
const footerLogger = createClickLogger("Footer");

document.querySelector("header")?.addEventListener("click", headerLogger);
document.querySelector("footer")?.addEventListener("click", footerLogger);
```

---

### 3.3 — HOF That Both Receives AND Returns (Decorator Pattern)

A function can **both** receive a function AND return a function. This is called a **function decorator** (or wrapper) — it wraps an existing function to enhance or modify its behavior *without changing the original function's source code*.

```js
// withLogging is a HOF: receives fn, returns fn
function withLogging(fn) {
  return function (...args) {
    console.log(`▶ Calling "${fn.name}" with args:`, args);
    const result = fn(...args);
    console.log(`◀ "${fn.name}" returned:`, result);
    return result;
  };
}

// Original function — untouched
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

// Decorated versions — same logic + logging added
const loggedAdd      = withLogging(add);
const loggedMultiply = withLogging(multiply);

loggedAdd(3, 4);
// ▶ Calling "add" with args: [3, 4]
// ◀ "add" returned: 7

loggedMultiply(5, 6);
// ▶ Calling "multiply" with args: [5, 6]
// ◀ "multiply" returned: 30
```

> **Why it matters:** The decorator pattern is the foundation of **middleware** (Express.js, Redux), **Higher-Order Components** in React (now replaced by hooks), and **TypeScript decorators** (`@Injectable`, `@Component`). Understanding it at this level puts you ahead in interviews.

```
withLogging(add)
     │                     ┌──────────────────────────────┐
     │  receives fn         │  Returned (enhanced) function│
     └──────────────────────►  - logs before              │
                            │  - calls original fn        │
                            │  - logs after               │
                            │  - returns result           │
                            └──────────────────────────────┘
```

---

## 4. Critical Difference

| Feature | First-Class Functions | Higher-Order Functions |
|---|---|---|
| **What it is** | A **language property** | A **coding pattern** |
| **Who defines it** | The JS spec/engine | You, the developer |
| **What it means** | Functions CAN be treated as values | A function IS treated as a value (takes/returns functions) |
| **Analogy** | A country that grants full civil rights | A citizen who actually uses those rights |
| **Exists without the other?** | Yes — JS has it whether you use it or not | No — only possible because of first-class functions |

> **One-liner for interviews:**
> _"First-class functions is what JavaScript IS; higher-order functions is what you DO with it."_

```
┌─────────────────────────────────────────────────┐
│           JavaScript Language                   │
│                                                 │
│   First-Class Functions (Language Feature)      │
│   ┌──────────────────────────────────────────┐  │
│   │  Makes HOFs possible                     │  │
│   │  ┌────────────────────────────────────┐  │  │
│   │  │  Higher-Order Functions (Pattern)  │  │  │
│   │  │  - Callbacks (receive fn)          │  │  │
│   │  │  - Factories (return fn)           │  │  │
│   │  └────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 5. Real-World Analogies

### Analogy 1: First-Class Citizens & Full Rights
> In some countries, certain people are "first-class citizens" — they can own property, travel freely, vote, and hold any job. Functions being "first-class" in JS means they have ALL the rights of any value — store anywhere, pass anywhere, return from anywhere.

### Analogy 2: HOF as a Vending Machine with Interchangeable Modules
> Imagine a vending machine (the HOF) that accepts different **ingredient modules** (callbacks). You plug in a "Coffee Module" and it makes coffee. You plug in a "Tea Module" and it makes tea. The machine's *structure* (looping, async handling, iteration) stays the same — only the *plugged-in behavior* changes.
>
> ```js
> // The machine:        arr.map(  )
> // Coffee module:              x => x * 2
> // Tea module:                 x => x ** 2
> ```

### Analogy 3: HOF Returning Function = A Cookie Cutter Factory
> A factory that makes **cookie cutters** (HOF that returns function):
> - You say: "Give me a star-shaped cutter" → `createShape("star")`
> - Factory produces a cutter → returns a function
> - The cutter **remembers** its shape (closure)
> - You use the cutter on any dough anytime → `starCutter(dough)`
>
> ```js
> const createCutter = (shape) => (dough) => `${shape}-shaped ${dough} cookie`;
> const starCutter = createCutter("star");
> console.log(starCutter("chocolate")); // "star-shaped chocolate cookie"
> ```

### Analogy 4: Callbacks = Pizza Order with a "Call Me Back" Instruction
> - You call the pizza place (invoke HOF: `fetch`, `setTimeout`, `addEventListener`)
> - You say: _"When the pizza is ready, call this number and say the order is done"_ (pass callback)
> - The pizza place handles the process (async work, iteration, event handling)
> - When done, **they call you back** → callback is invoked
>
> ```js
> // "call me in 3 seconds"
> setTimeout(function () {
>   console.log("Pizza is ready!"); // called BACK after 3s
> }, 3000);
> ```

---

## 6. Arrow Functions as Callbacks — Key Differences & Gotchas

Arrow functions are the most common way to write callbacks for HOFs. But they are **NOT** a full replacement for regular functions. Understanding the differences is critical for avoiding bugs and acing interviews.

### 6.1 — What Arrow Functions Lack (vs Regular Functions)

| Feature | Regular Function | Arrow Function |
|---|---|---|
| Own `this` binding | ✅ Yes (dynamic) | ❌ No (lexical — inherits from outer scope) |
| Own `arguments` object | ✅ Yes | ❌ No (use `...rest` instead) |
| Can be a constructor (`new`) | ✅ Yes | ❌ No — throws `TypeError` |
| Has `prototype` property | ✅ Yes | ❌ No |
| Can use `yield` (generator) | ✅ Yes | ❌ No |
| `.call()/.apply()/.bind()` change `this` | ✅ Yes | ❌ No effect on `this` |

---

### 6.2 — The `this` Problem When Passing Methods as Callbacks (Critical!)

This is one of the most common JavaScript bugs. When you extract an object method and pass it as a callback, **`this` is lost**.

```js
const counter = {
  count: 0,
  increment() {
    this.count++;  // 'this' should be the counter object
  },
};

// ✅ Direct call — works fine
counter.increment();
console.log(counter.count); // 1

// ❌ Passing the method as a callback — 'this' is LOST
const numbers = [1, 2, 3];
numbers.forEach(counter.increment); // 'this' inside increment is now 'undefined' (strict) or window
console.log(counter.count); // Still 1 — not incremented!
```

**Three solutions:**

```js
// Solution 1: Bind — pre-attach 'this' to the method before passing it
numbers.forEach(counter.increment.bind(counter)); // ✅ 'this' = counter

// Solution 2: Arrow function wrapper — arrow closes over the outer 'this'
numbers.forEach(() => counter.increment()); // ✅ calls method via object reference

// Solution 3: In a class, define the method as an arrow function field
//             (it auto-binds 'this' at construction time)
class Counter {
  count = 0;
  increment = () => { this.count++; }; // arrow as class field — auto-bound
}
const c = new Counter();
numbers.forEach(c.increment); // ✅ Safe!
```

---

### 6.3 — The `setTimeout` / `setInterval` `this` Gotcha

```js
const timer = {
  seconds: 0,
  start() {
    // ❌ Problem: regular function in setInterval loses 'this'
    setInterval(function () {
      this.seconds++; // 'this' is window/undefined, NOT 'timer'
      console.log(this.seconds); // NaN
    }, 1000);
  },
};

// ✅ Fix: use arrow function — it inherits 'this' from start()
const timer2 = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // 'this' correctly refers to timer2
      console.log(this.seconds); // 1, 2, 3, ...
    }, 1000);
  },
};
timer2.start();
```

> **MDN quote:** "Perhaps the greatest benefit of using arrow functions is with methods like `setTimeout()` and `addEventListener()` that usually require some kind of closure, `call()`, `apply()`, or `bind()` to ensure that the function is executed in the proper scope."

---

### 6.4 — Arrow Functions Cannot Return Object Literals Directly (Gotcha!)

```js
// ❌ BUG: JS reads the {} as a block statement, not an object literal
const makeUser = (name) => { name: name }; // returns undefined!

// ✅ Fix: wrap the object literal in parentheses
const makeUser2 = (name) => ({ name: name });
const makeUser3 = (name) => ({ name });      // ES6 shorthand — same thing

console.log(makeUser("Alice"));   // undefined  ← silent bug
console.log(makeUser2("Alice"));  // { name: "Alice" }  ✅
```

---

### 6.5 — Arrow Functions Have No `arguments` Object

```js
function regularFn() {
  console.log(arguments); // works — [1, 2, 3]
}
regularFn(1, 2, 3);

const arrowFn = () => {
  console.log(arguments); // ❌ ReferenceError (or refers to outer scope's arguments)
};
arrowFn(1, 2, 3);

// ✅ Use rest parameters in arrow functions instead:
const arrowWithRest = (...args) => {
  console.log(args); // [1, 2, 3]  ✅
};
arrowWithRest(1, 2, 3);
```

---

## 7. Built-in Higher-Order Functions in JS

These are HOFs you use every day:

```js
const nums = [1, 2, 3, 4, 5, 6];

// map — transforms every element via callback
const doubled = nums.map((n) => n * 2);
// [2, 4, 6, 8, 10, 12]

// filter — keeps elements where callback returns true
const evens = nums.filter((n) => n % 2 === 0);
// [2, 4, 6]

// reduce — accumulates elements into a single value
const sum = nums.reduce((acc, n) => acc + n, 0);
// 21

// forEach — executes callback for each element (returns undefined)
nums.forEach((n) => console.log(n));

// find — returns first element where callback is true
const firstBig = nums.find((n) => n > 3);
// 4

// sort — sorts using callback comparator
const desc = [...nums].sort((a, b) => b - a);
// [6, 5, 4, 3, 2, 1]

// setTimeout / setInterval — async HOFs
setTimeout(() => console.log("Done!"), 1000);

// addEventListener — event-driven HOF
document.querySelector("button")?.addEventListener("click", () => {
  console.log("Button clicked!");
});

// Promise.then / catch — async chain HOFs
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

---

## 8. Deep Dive — Practical Examples

### 8.1 — Building Your Own `map` from Scratch

Understanding how HOFs work internally:

```js
// Native: [1,2,3].map(x => x * 2)  →  [2, 4, 6]

// Let's BUILD our own map to understand HOF internals
function myMap(array, transformFn) {
  //            ↑ array     ↑ callback (first-class function passed in)
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transformFn(array[i], i, array)); // calling the callback
    //          ↑ same signature as native map: (element, index, array)
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];

console.log(myMap(numbers, (x) => x * 2));       // [2, 4, 6, 8, 10]
console.log(myMap(numbers, (x) => x ** 2));       // [1, 4, 9, 16, 25]
console.log(myMap(numbers, (x, i) => `${i}:${x}`)); // ["0:1", "1:2", "2:3", ...]
```

---

### 8.2 — Function Composition (Combining HOFs)

```js
// Three small, focused functions
const double  = (x) => x * 2;
const addTen  = (x) => x + 10;
const square  = (x) => x ** 2;

// A compose HOF that chains functions right-to-left
function compose(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
    //   reduceRight = apply functions from right to left
  };
}

const transform = compose(square, addTen, double);
//  Order of execution: double → addTen → square

console.log(transform(3));
// double(3) = 6  →  addTen(6) = 16  →  square(16) = 256
```

---

### 8.3 — Currying Using HOF That Returns Function

**Currying** = transforming `f(a, b, c)` into `f(a)(b)(c)`.

```js
// Regular function (not curried)
const regularAdd = (a, b, c) => a + b + c;
console.log(regularAdd(1, 2, 3)); // 6

// Curried version using HOF (each call returns a new function)
const curriedAdd = (a) => (b) => (c) => a + b + c;

console.log(curriedAdd(1)(2)(3)); // 6

// Power of currying: PARTIAL APPLICATION
const addOne      = curriedAdd(1);       // fixes 'a' to 1
const addOneAndTwo = curriedAdd(1)(2);   // fixes 'a' to 1, 'b' to 2

console.log(addOne(5)(10));   // 16   (1 + 5 + 10)
console.log(addOneAndTwo(7)); // 10   (1 + 2 + 7)

// Real-world example: configurable logger
const createLogger = (level) => (context) => (message) =>
  `[${level.toUpperCase()}] [${context}] ${message}`;

const warn = createLogger("warn");
const warnAuth = warn("AuthService");
const warnPayment = warn("PaymentService");

console.log(warnAuth("Token expired"));        // [WARN] [AuthService] Token expired
console.log(warnPayment("Card declined"));     // [WARN] [PaymentService] Card declined
```

---

### 8.4 — Once Function (HOF Enforcing One-Time Execution)

```js
// A classic interview pattern: function that can only be called ONCE
function once(fn) {
  //   ↑ HOF — receives function
  let hasBeenCalled = false;
  let result;

  return function (...args) {
    //   ↑ HOF — also returns function
    if (!hasBeenCalled) {
      result = fn(...args);
      hasBeenCalled = true;
    }
    return result;
  };
}

const initializeApp = once(function () {
  console.log("App initialized!");
  return "init-token-123";
});

initializeApp(); // "App initialized!"  → fn runs
initializeApp(); // (nothing printed)   → fn does NOT run again
initializeApp(); // (nothing printed)

// Returns same result every time after first call
console.log(initializeApp()); // "init-token-123"
```

---

### 8.5 — Memoization (HOF for Caching Results)

```js
// memoize is a HOF that takes a function and returns a cached version
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for [${key}]`);
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Slow Fibonacci without memoization: O(2^n)
const slowFib = (n) => (n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2));

// Memoized version: O(n) after first call
const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fastFib(n - 1) + fastFib(n - 2);
});

console.log(fastFib(40)); // Fast! Results cached
console.log(fastFib(40)); // "Cache hit for [40]" — instant
```

---

### 8.6 — `bind()` for Partial Application

`bind()` doesn't just fix `this` — it pre-fills arguments, acting as a **partial application** tool. The resulting function is a pre-configured callback ready to be passed to a HOF.

```js
function multiply(factor, number) {
  return factor * number;
}

// bind(null, 2) creates a new function with 'factor' pre-filled as 2
// null → we don't care about 'this' here
const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);
const times10 = multiply.bind(null, 10);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(times10(5)); // 50

// Power: pass these as pre-configured callbacks to HOFs
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map(double));   // [2, 4, 6, 8, 10]
console.log(numbers.map(triple));   // [3, 6, 9, 12, 15]
console.log(numbers.map(times10));  // [10, 20, 30, 40, 50]

// Real-world: partial application for event handlers
function handleEvent(context, event) {
  console.log(`[${context}] event: ${event.type}`);
}

const handleHeaderClick = handleEvent.bind(null, "Header");
const handleFooterClick = handleEvent.bind(null, "Footer");

document.querySelector("header")?.addEventListener("click", handleHeaderClick);
document.querySelector("footer")?.addEventListener("click", handleFooterClick);
// Each listener already knows its 'context' — no closure needed!
```

> **`bind()` vs Currying:** Both achieve partial application. `bind()` is a built-in method for pre-filling args; currying is a design pattern using HOFs that return functions. They solve the same problem differently.

---

### 8.7 — IIFE — Functions as Immediately-Used Values

An **IIFE** (Immediately Invoked Function Expression, pronounced "iffy") is a function that is defined *and* called in the same expression. It's proof that a function is truly "just a value" — you can use it the moment you create it.

```js
// Standard IIFE syntax — wrap in () to make it an expression, then call with ()
(function () {
  const secret = "I live only in my own scope!";
  console.log("IIFE ran:", secret);
})();
// "IIFE ran: I live only in my own scope!"

// console.log(secret); // ❌ ReferenceError — secret is NOT in outer scope

// Arrow function IIFE
(() => {
  console.log("Arrow IIFE!");
})();

// IIFE with arguments
const result = (function (a, b) {
  return a + b;
})(10, 20);
console.log(result); // 30

// Async IIFE — useful when you need await at the top level
(async () => {
  const data = await fetch("https://api.example.com/users").then(r => r.json());
  console.log(data);
})();
```

**Why use IIFEs?**

```js
// Use case 1: Avoid polluting the global namespace
(function () {
  const config = { apiUrl: "https://api.example.com" }; // scoped, not global
  // ... setup code using config
})();

// Use case 2: Create a private module with a public interface
const BankAccount = (function () {
  let balance = 0; // PRIVATE — not accessible outside

  return {
    // PUBLIC methods
    deposit(amount) { balance += amount; },
    withdraw(amount) { balance = Math.max(0, balance - amount); },
    getBalance() { return balance; },
  };
})();

BankAccount.deposit(100);
BankAccount.withdraw(30);
console.log(BankAccount.getBalance()); // 70
console.log(BankAccount.balance);      // undefined ← truly private!
```

> **Historical note:** Before ES6 modules (`import`/`export`), IIFEs were the *primary way* to create private scope in JavaScript. Today, ES modules handle this, but IIFEs still appear in bundled code and legacy codebases.

---

### 8.8 — `pipe` — Left-to-Right Composition

`compose` applies functions right-to-left (mathematical notation: $f \circ g = f(g(x))$). `pipe` applies them **left-to-right** (more readable for most developers):

```js
// compose: right-to-left f(g(h(x)))
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

// pipe: left-to-right h(g(f(x))) ← easier to read as a pipeline
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

// Same transformations
const double  = (x) => x * 2;
const addTen  = (x) => x + 10;
const square  = (x) => x ** 2;

const withCompose = compose(square, addTen, double); // reads backwards: double→addTen→square
const withPipe    = pipe(double, addTen, square);    // reads naturally: double→addTen→square

console.log(withCompose(3)); // 256
console.log(withPipe(3));    // 256 — same result, more readable

// Real-world data pipeline
const processUser = pipe(
  (user) => ({ ...user, name: user.name.trim() }),        // step 1: trim name
  (user) => ({ ...user, name: user.name.toLowerCase() }), // step 2: lowercase
  (user) => ({ ...user, isVerified: user.age >= 18 }),    // step 3: add flag
);

console.log(processUser({ name: "  Alice  ", age: 25 }));
// { name: "alice", age: 25, isVerified: true }
```

---

### 8.9 — Express Middleware — HOF in the Wild

Express.js middleware is one of the most common real-world HOF patterns. Middleware is a **function that returns a function** — or a function that takes a function (the `next` callback).

```js
// Pattern 1: Middleware as a function that RECEIVES callbacks (req, res, next)
// app.use(), app.get(), etc. are HOFs that receive middleware functions

const express = require("express");
const app = express();

// This middleware is a function passed to app.use() — classic HOF callback pattern
app.use(function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // call the next middleware (passed by Express — HOF gives us a callback!)
});

// Pattern 2: Middleware FACTORY — HOF that returns middleware (returns function)
function requireRole(role) {
  // Returns middleware function — this IS the HOF returning function pattern
  return function (req, res, next) {
    if (req.user?.role === role) {
      next(); // authorized — continue
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
}

// Usage: pre-configured middleware created by the factory
app.get("/admin",   requireRole("admin"),   (req, res) => res.send("Admin page"));
app.get("/manager", requireRole("manager"), (req, res) => res.send("Manager page"));

// Pattern 3: HOF that wraps async route handlers (decorator pattern in Express)
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next); // auto-catches async errors
  };
}

app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find(); // if this throws, Express error handler catches it
  res.json(users);
}));
```

> **The pattern in one sentence:** Express is built around HOFs — `app.use()` and route methods are HOFs that receive functions (middleware), and middleware factories are HOFs that return functions (configured middleware).

---

### 8.10 — Debounce — Interview Classic HOF 🔥

**Debounce** is one of the most frequently asked HOF interview questions. It's a function that *delays* the execution of another function until a certain amount of time has passed *without the function being called again*.

> **Analogy: The Elevator Door**
> Imagine an elevator door that waits for people to stop entering before closing. Every time someone walks in, the door resets its "closing timer." The door only closes when no one has entered for, say, 3 seconds. This is debouncing — you wait until the *activity stops* for a period before executing.

**When to use debounce:**
- Search input fields (wait until user stops typing before making API call)
- Window resize events (wait until resizing stops before recalculating layout)
- Form auto-save (wait until user stops editing before saving)
- Scroll event for infinite scroll (but throttle is often better here)

```js
// debounce is a HOF: receives fn, returns fn (with delayed execution)
function debounce(fn, delay) {
  let timeoutId = null; // Closure! This persists across calls

  return function (...args) {
    // Clear any existing timer — this "resets the elevator door timer"
    clearTimeout(timeoutId);

    // Set a new timer — fn will only run if no new calls come within 'delay' ms
    timeoutId = setTimeout(() => {
      fn.apply(this, args); // Preserve 'this' and pass all arguments
    }, delay);
  };
}

// Usage: search input
const searchAPI = (query) => {
  console.log(`🔍 Searching for: "${query}"`);
  // In reality: fetch(`/api/search?q=${query}`)
};

const debouncedSearch = debounce(searchAPI, 300); // 300ms debounce

// Simulate user typing "hello" quickly
debouncedSearch("h");      // timer starts
debouncedSearch("he");     // timer RESETS
debouncedSearch("hel");    // timer RESETS
debouncedSearch("hell");   // timer RESETS
debouncedSearch("hello");  // timer RESETS

// After 300ms of no calls: "🔍 Searching for: "hello"" — only ONCE!

// In a real input handler:
// inputElement.addEventListener('input', (e) => debouncedSearch(e.target.value));
```

**Step-by-step execution visualization:**

```
Time:   0ms   50ms  100ms  150ms  200ms  250ms  300ms  350ms  400ms  500ms
        │      │      │      │      │      │      │      │      │      │
Call:   "h"   "he"  "hel" "hell""hello"                                
        │      │      │      │      │      │      │      │      │      │
Timer:  ──▶╳   ──▶╳  ──▶╳  ──▶╳   ──────────────────▶ 🎯 API call!
        set   clear  clear clear  set
        reset reset  reset reset  (no more calls for 300ms)

Only ONE API call is made — after the user stops typing!
```

**Advanced debounce with leading/trailing options (Lodash-style):**

```js
function debounce(fn, delay, options = {}) {
  let timeoutId = null;
  const { leading = false, trailing = true } = options;

  return function (...args) {
    const isFirstCall = timeoutId === null;

    clearTimeout(timeoutId);

    // Leading edge: call immediately on first call (if enabled)
    if (leading && isFirstCall) {
      fn.apply(this, args);
    }

    timeoutId = setTimeout(() => {
      // Trailing edge: call at the end (if enabled)
      if (trailing && !isFirstCall) {
        fn.apply(this, args);
      }
      timeoutId = null; // Reset for next sequence
    }, delay);
  };
}

// Usage:
// { leading: true }  — call immediately, ignore subsequent calls within delay
// { trailing: true } — call after delay (default behavior)
// { leading: true, trailing: true } — call at start AND end
```

---

### 8.11 — Throttle — Interview Classic HOF 🔥

**Throttle** ensures a function is called *at most once* within a specified time period, no matter how many times it's invoked.

> **Analogy: Traffic Light / Rate Limiter**
> A traffic light lets cars through at a fixed rate — one batch every X seconds. No matter how many cars queue up, they pass at a controlled rate. This is throttling — you execute at a *steady rate*, not after activity stops.

> **Analogy 2: Fire Alarm**
> A fire alarm can only be triggered once per minute. Even if smoke keeps coming, the alarm won't sound again until the minute is up. Throttle says "you can only run me X times per second."

**When to use throttle:**
- Scroll event handling (run at most every 100ms while scrolling)
- Mouse move events (update position at most every 50ms)
- API rate limiting (max 10 requests per second)
- Button click spam prevention (ignore rapid clicks)
- Game loops (cap FPS)

```js
// throttle is a HOF: receives fn, returns fn (with rate-limited execution)
function throttle(fn, limit) {
  let lastCallTime = 0; // Closure! Tracks when fn was last called

  return function (...args) {
    const now = Date.now();

    // Only execute if enough time has passed since last execution
    if (now - lastCallTime >= limit) {
      lastCallTime = now;
      fn.apply(this, args);
    }
    // Otherwise, silently ignore the call (or queue it — see advanced version)
  };
}

// Usage: scroll handler
const handleScroll = () => {
  console.log(`📜 Scroll position: ${window.scrollY}px`);
  // In reality: complex calculations, animations, or API calls
};

const throttledScroll = throttle(handleScroll, 100); // Max once every 100ms

window.addEventListener("scroll", throttledScroll);

// During rapid scrolling, handleScroll runs at most every 100ms — not on every pixel!
```

**Step-by-step execution visualization:**

```
Time:   0ms   20ms  40ms  60ms  80ms  100ms 120ms 140ms 160ms 180ms 200ms
        │      │      │     │     │      │      │      │      │      │
Calls:  ×      ×      ×     ×     ×      ×      ×      ×      ×      ×
        │      │      │     │     │      │      │      │      │      │
Exec:   🎯     ─      ─     ─     ─      🎯     ─      ─      ─      ─
        ▲                                ▲
        First call executes              Next allowed execution (100ms later)

Even with 10 scroll events, only 2 actual executions!
```

**Debounce vs Throttle — The Key Difference:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DEBOUNCE vs THROTTLE                               │
├───────────────────┬─────────────────────────────────────────────────────┤
│ Debounce          │ "Wait until the storm passes"                       │
│                   │ Executes ONCE after activity stops for X ms         │
│                   │ Use: search input, resize, form auto-save          │
├───────────────────┼─────────────────────────────────────────────────────┤
│ Throttle          │ "Allow at a steady rate"                            │
│                   │ Executes at MOST once every X ms (rate limiter)     │
│                   │ Use: scroll, mousemove, API rate limits, FPS cap   │
└───────────────────┴─────────────────────────────────────────────────────┘

Visual comparison (10 rapid calls over 300ms, delay/limit = 100ms):

         Time:  0    50   100  150  200  250  300  350  400  450  500
         Calls: ×    ×     ×    ×    ×    ×    ×    ×    ×    ×
                │    │     │    │    │    │    │    │    │    │
Debounce exec: ───────────────────────────────────────────────▶ 🎯 (1 call at end)
Throttle exec: 🎯─────────🎯─────────🎯─────────🎯─────────🎯 (5 calls, evenly spaced)
```

---

### 8.12 — Building Custom Array HOFs (filter, find, some, every)

Interviewers love to ask: *"Implement `filter` (or `map`) from scratch."* This proves you understand HOFs at a fundamental level.

#### Implement `filter` from Scratch

```js
// Native: [1,2,3,4,5].filter(x => x > 2)  →  [3, 4, 5]

function myFilter(array, predicateFn) {
  //                   ↑ callback that returns true/false
  const result = [];

  for (let i = 0; i < array.length; i++) {
    // Call the predicate with same signature as native filter: (element, index, array)
    if (predicateFn(array[i], i, array)) {
      result.push(array[i]); // Keep element if predicate returns truthy
    }
  }

  return result;
}

// Test
const nums = [1, 2, 3, 4, 5, 6];
console.log(myFilter(nums, (x) => x % 2 === 0));     // [2, 4, 6]
console.log(myFilter(nums, (x, i) => i < 3));         // [1, 2, 3]
console.log(myFilter(nums, (x) => x > 10));           // []
```

#### Implement `find` from Scratch

```js
// Native: [1,2,3,4,5].find(x => x > 3)  →  4 (first match)

function myFind(array, predicateFn) {
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i], i, array)) {
      return array[i]; // Return FIRST match immediately
    }
  }
  return undefined; // No match found
}

// Test
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

console.log(myFind(users, (u) => u.age > 28));       // { name: "Bob", age: 30 }
console.log(myFind(users, (u) => u.name === "Dave")); // undefined
```

#### Implement `some` from Scratch

```js
// Native: [1,2,3].some(x => x > 2)  →  true (at least one matches)

function mySome(array, predicateFn) {
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i], i, array)) {
      return true; // Found at least one match — short-circuit
    }
  }
  return false; // No matches found
}

// Test
console.log(mySome([1, 2, 3], (x) => x > 2));   // true
console.log(mySome([1, 2, 3], (x) => x > 10));  // false
console.log(mySome([], (x) => x > 0));           // false (empty array → false)
```

#### Implement `every` from Scratch

```js
// Native: [1,2,3].every(x => x > 0)  →  true (ALL must match)

function myEvery(array, predicateFn) {
  for (let i = 0; i < array.length; i++) {
    if (!predicateFn(array[i], i, array)) {
      return false; // Found one that DOESN'T match — short-circuit
    }
  }
  return true; // All matched (or array was empty → vacuously true)
}

// Test
console.log(myEvery([1, 2, 3], (x) => x > 0));   // true
console.log(myEvery([1, 2, 3], (x) => x > 2));   // false
console.log(myEvery([], (x) => x > 0));           // true (empty array → true, vacuous truth)
```

#### Implement `reduce` from Scratch (Bonus)

```js
// Native: [1,2,3].reduce((acc, x) => acc + x, 0)  →  6

function myReduce(array, reducerFn, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  // If no initial value provided, use first element as accumulator
  if (accumulator === undefined) {
    if (array.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = reducerFn(accumulator, array[i], i, array);
  }

  return accumulator;
}

// Test
console.log(myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0));     // 10
console.log(myReduce([1, 2, 3, 4], (acc, x) => acc * x, 1));     // 24
console.log(myReduce(["a", "b", "c"], (acc, x) => acc + x, "")); // "abc"
```

---

## 9. Common Pitfalls & Gotchas

A quick-reference of the mistakes that trip up developers in interviews and production code:

### Pitfall 1: Calling vs Passing a Function

```js
// ❌ Wrong — calls greet() immediately, passes its return value (undefined)
btn.addEventListener("click", greet());

// ✅ Correct — passes the function reference; addEventListener will call it
btn.addEventListener("click", greet);

// ❌ Wrong — same problem with map
const result = arr.map(transform()); // passes return value of transform(), not transform itself

// ✅ Correct
const result = arr.map(transform);
// OR inline: arr.map(x => transform(x))
```

---

### Pitfall 2: `this` Loss When Extracting Methods

```js
const obj = { value: 42, getValue() { return this.value; } };

const fn = obj.getValue;  // ← 'this' detaches!
fn();                      // undefined (or error in strict mode)

// Fix: bind it
const fn2 = obj.getValue.bind(obj);
fn2(); // 42
```

---

### Pitfall 3: Arrow Function Returning Object Literal

```js
// ❌ Silently returns undefined — curly brace is parsed as block, not object
const makeObj = (x) => { val: x };

// ✅ Wrap in parentheses
const makeObj2 = (x) => ({ val: x });
```

---

### Pitfall 4: Mutation Inside `map` / `forEach`

```js
const users = [{ name: "Alice" }, { name: "Bob" }];

// ❌ map should return NEW values, not mutate — this is a side effect
const result = users.map((u) => { u.name = u.name.toUpperCase(); return u; });

// ✅ Return a new object — keep data immutable in map
const result2 = users.map((u) => ({ ...u, name: u.name.toUpperCase() }));
```

---

### Pitfall 5: Forgetting the Initial Value in `reduce`

```js
const nums = [1, 2, 3];

// ❌ Without initial value, first element is used as accumulator — can cause bugs on empty arrays
const sum1 = nums.reduce((acc, n) => acc + n);        // 6 (works here)
const sum2 = [].reduce((acc, n) => acc + n);           // ❌ TypeError on empty array!

// ✅ Always provide initial value
const sum3 = [].reduce((acc, n) => acc + n, 0);       // 0 — safe
const sum4 = nums.reduce((acc, n) => acc + n, 0);     // 6 — safe
```

---

### Pitfall 6: `sort()` Sorts Lexicographically by Default

```js
const nums = [10, 1, 21, 2];

// ❌ Default sort — sorts as STRINGS, not numbers!
console.log(nums.sort()); // [1, 10, 2, 21]  ← WRONG!

// ✅ Pass a comparator callback (HOF!)
console.log(nums.sort((a, b) => a - b)); // [1, 2, 10, 21]  ✅ ascending
console.log(nums.sort((a, b) => b - a)); // [21, 10, 2, 1]  ✅ descending
```

---

## 10. Interview Q&A

### Q1: What are first-class functions in JavaScript?
> **A:** In JavaScript, functions are **first-class citizens** (or first-class objects). This means functions can be:
> - Assigned to variables: `const fn = function() {}`
> - Stored in object properties: `obj.method = function() {}`
> - Passed as arguments: `arr.map(fn)`
> - Returned from functions: `return function() {}`
> - Have properties: `fn.name`, `fn.length`
>
> This is a **property of the language** — JS treats functions as values.

---

### Q2: What is a higher-order function?
> **A:** A higher-order function (HOF) is a function that either:
> 1. **Accepts** one or more functions as arguments (callback pattern)
> 2. **Returns** a function as its result (factory/closure pattern)
>
> Examples of built-in HOFs: `Array.map()`, `Array.filter()`, `Array.reduce()`, `setTimeout()`, `addEventListener()`.

---

### Q3: What is the difference between first-class functions and higher-order functions?
> **A:** First-class functions is a **language trait** — it describes what JavaScript *is* (functions are values). Higher-order functions is a **coding pattern** — it describes something you *write* (a function that works with other functions). First-class functions *enable* higher-order functions. You can't have HOFs in a language that doesn't have first-class functions.

---

### Q4: What is a callback function?
> **A:** A callback is a function passed as an argument to another function, to be invoked at a later time or after some condition is met. For example: `setTimeout(callbackFn, 1000)` — `callbackFn` is called after 1 second.

---

### Q5: Why are higher-order functions useful?
> **A:** HOFs enable **abstraction** and **reusability**:
> - They separate *what* to do (callback) from *how* to apply it (HOF structure)
> - You write less repetitive code — one HOF can work with many different callbacks
> - They enable powerful patterns: composition, currying, memoization, middleware

---

### Q6: What is a closure and how does it relate to HOFs?
> **A:** A closure is when an inner function retains access to variables from its outer function's scope, even after the outer function has returned. HOFs that *return functions* almost always create closures:
> ```js
> function outer(x) {
>   return function inner(y) {
>     return x + y; // 'inner' closes over 'x'
>   };
> }
> const addFive = outer(5);
> addFive(3); // 8 — 'x' is still accessible via closure
> ```

---

### Q7: What happens if you call a function with `()` vs without `()` when passing it?
> **A:**
> - `someHOF(myFn)` — passes the **function reference** (the function itself). `someHOF` will call it later.
> - `someHOF(myFn())` — **calls `myFn` immediately** and passes the **return value** to `someHOF`. Usually a bug when you meant to pass a callback.

---

### Q8: Can you give an example of a function that is both — a HOF that receives AND returns a function?
> **A:** Yes — the `memoize` function, `once` function, and `compose` function are classic examples. They receive a function and return an enhanced version of it (this pattern is called a **function decorator** or **function wrapper**).
> ```js
> function withLogging(fn) {     // receives fn → HOF
>   return function (...args) {  // returns fn  → HOF
>     console.log(`Calling with`, args);
>     const result = fn(...args);
>     console.log(`Result:`, result);
>     return result;
>   };
> }
> const loggedAdd = withLogging((a, b) => a + b);
> loggedAdd(3, 4);
> // Calling with [3, 4]
> // Result: 7
> ```

---

### Q9: What is the difference between `call`, `apply`, and `bind`?
> **A:**
> - **`fn.call(thisArg, arg1, arg2)`** — invokes `fn` *immediately* with `this` set to `thisArg`. Args passed individually (comma-separated).
> - **`fn.apply(thisArg, [arg1, arg2])`** — invokes `fn` *immediately* with `this` set to `thisArg`. Args passed as an **array**.
> - **`fn.bind(thisArg, arg1)`** — does **not** invoke `fn`. Returns a **new function** with `this` pre-bound and optional args pre-filled (partial application).
>
> **Mnemonic:** `call` = **c**omma (args separate), `apply` = **a**rray, `bind` = **b**ookmark (save for later).
> ```js
> function greet(greeting) { return `${greeting}, ${this.name}`; }
> const obj = { name: "Alice" };
> greet.call(obj, "Hello");        // "Hello, Alice"  — immediate
> greet.apply(obj, ["Hi"]);        // "Hi, Alice"     — immediate
> const fn = greet.bind(obj, "Hey"); // not called yet
> fn();                             // "Hey, Alice"   — called later
> ```

---

### Q10: What is partial application? How does `bind` enable it?
> **A:** Partial application means creating a new function by **pre-filling some arguments** of an existing function. `bind()` enables this by accepting extra arguments after `thisArg`:
> ```js
> function add(a, b, c) { return a + b + c; }
>
> // Partial application: pre-fill 'a' = 1
> const addFrom1 = add.bind(null, 1);      // a=1 is fixed
> console.log(addFrom1(2, 3)); // 6  (1 + 2 + 3)
>
> // Pre-fill 'a' and 'b'
> const addFrom1And2 = add.bind(null, 1, 2); // a=1, b=2 fixed
> console.log(addFrom1And2(10)); // 13  (1 + 2 + 10)
> ```

---

### Q11: What is an IIFE and when would you use it?
> **A:** An **IIFE** (Immediately Invoked Function Expression) is a function that is defined and invoked in the same expression:
> ```js
> (function () { /* code */ })();
> (() => { /* code */ })();
> ```
> **Use cases:**
> 1. **Avoid global scope pollution** — variables inside an IIFE don't leak to the global scope
> 2. **One-time initialization** — run setup code once without leaving residue
> 3. **Async at top level** — `(async () => { await ... })()` before ES2022 top-level await
> 4. **Module pattern** (pre-ES6) — create private variables with a public interface

---

### Q12: What is the difference between `map`, `filter`, and `reduce`?
> **A:** All three are built-in HOFs on arrays. They share the same HOF signature (take a callback), but differ in what they return:
> - **`map(fn)`** — transforms *every* element; returns a new array of **same length**
> - **`filter(fn)`** — keeps elements where `fn` returns truthy; returns a new array of **≤ same length**
> - **`reduce(fn, init)`** — accumulates all elements into **a single value** (any type)
> ```js
> const nums = [1, 2, 3, 4, 5];
> nums.map(x => x * 2);          // [2, 4, 6, 8, 10] — same length
> nums.filter(x => x % 2 === 0); // [2, 4]           — shorter
> nums.reduce((acc, x) => acc + x, 0); // 15          — single value
> ```
> **Everything `map` and `filter` can do, `reduce` can do** — but map and filter are more readable for their specific purposes.

---

### Q13: Why can't arrow functions be used as object methods or constructors?
> **A:**
> - **Object methods:** Arrow functions don't have their own `this`. Inside an arrow method, `this` refers to the *enclosing scope* (often `window`/`undefined`), not the object. Use regular function syntax for methods.
> - **Constructors:** Arrow functions have no `prototype` property, so they can't set up the prototype chain for `new`-created objects. Calling `new ArrowFn()` throws a `TypeError`.
> ```js
> const obj = {
>   value: 10,
>   badMethod: () => this.value,    // ❌ 'this' = outer scope, not obj
>   goodMethod() { return this.value; } // ✅ 'this' = obj
> };
> console.log(obj.badMethod());  // undefined
> console.log(obj.goodMethod()); // 10
>
> const ArrowFn = () => {};
> new ArrowFn(); // ❌ TypeError: ArrowFn is not a constructor
> ```

---

### Q14: What is the difference between debounce and throttle? When would you use each?
> **A:**
> - **Debounce**: Delays execution until a *quiet period* — waits for activity to stop for X ms before executing. Use for: search inputs (wait until user stops typing), window resize handlers, form auto-save.
> - **Throttle**: Limits execution to *at most once* every X ms — maintains a steady rate. Use for: scroll events, mouse move tracking, API rate limiting.
>
> **Memory trick:**
> - Debounce = "Don't bug me until things calm down" (waits for silence)
> - Throttle = "I'll only respond at a steady pace" (rate limiter)
>
> ```js
> // Debounce: Only ONE call after 300ms of no activity
> const debouncedSearch = debounce(search, 300);
> // User types: h-e-l-l-o → waits 300ms → ONE search("hello")
>
> // Throttle: Calls every 100ms during activity
> const throttledScroll = throttle(updateUI, 100);
> // User scrolls continuously → updates every 100ms (steady rate)
> ```

---

### Q15: Implement `filter` from scratch. Walk through how it works.
> **A:**
> ```js
> function myFilter(array, predicateFn) {
>   const result = [];
>   for (let i = 0; i < array.length; i++) {
>     if (predicateFn(array[i], i, array)) {
>       result.push(array[i]);
>     }
>   }
>   return result;
> }
>
> // How it works:
> // 1. myFilter receives an array and a callback (predicate)
> // 2. It loops through each element
> // 3. For each element, it calls the predicate with (element, index, array)
> // 4. If predicate returns truthy, element is included in result
> // 5. Returns new array with only matching elements
>
> // Example trace:
> myFilter([1, 2, 3, 4], x => x % 2 === 0);
> // i=0: predicateFn(1) → false → skip
> // i=1: predicateFn(2) → true  → push 2
> // i=2: predicateFn(3) → false → skip
> // i=3: predicateFn(4) → true  → push 4
> // Result: [2, 4]
> ```

---

### Q16: How does the event loop interact with callbacks in `setTimeout`?
> **A:** When you call `setTimeout(callback, delay)`:
> 1. The timer is registered in the **Web APIs** (browser) or **libuv** (Node.js)
> 2. JS execution continues immediately (non-blocking)
> 3. After the delay, the callback is placed in the **callback queue** (task queue)
> 4. The **event loop** checks if the **call stack** is empty
> 5. When empty, it picks the callback from the queue and pushes it to the call stack
> 6. The callback executes
>
> ```js
> console.log("1");
> setTimeout(() => console.log("2"), 0); // Even with 0ms delay!
> console.log("3");
>
> // Output: 1, 3, 2
> // Why? "2" goes to callback queue, only runs after call stack is empty
> ```
>
> **Key insight:** `setTimeout(fn, 0)` doesn't mean "run immediately" — it means "run as soon as possible *after* the current execution context finishes."

---

### Q17: What is function currying and why is it useful?
> **A:** Currying transforms a function with multiple arguments into a sequence of functions, each taking a single argument: `f(a, b, c)` → `f(a)(b)(c)`.
>
> **Why it's useful:**
> 1. **Partial application** — Pre-fill some arguments to create specialized functions
> 2. **Reusability** — Create variations from one base function
> 3. **Composition** — Curried functions work well with `pipe` and `compose`
>
> ```js
> // Regular function
> const add = (a, b, c) => a + b + c;
> add(1, 2, 3); // 6
>
> // Curried version
> const curriedAdd = a => b => c => a + b + c;
> curriedAdd(1)(2)(3); // 6
>
> // Power: partial application
> const addOne = curriedAdd(1);       // a is fixed to 1
> const addOneAndTwo = addOne(2);     // b is fixed to 2
> console.log(addOneAndTwo(10));       // 13 (1 + 2 + 10)
>
> // Real use: configurable logger
> const log = level => context => msg => `[${level}] [${context}] ${msg}`;
> const warn = log("WARN");
> const warnDB = warn("Database");
> console.log(warnDB("Connection failed")); // [WARN] [Database] Connection failed
> ```

---

### Q18: Write a `once` function that ensures a function can only be called once.
> **A:**
> ```js
> function once(fn) {
>   let called = false;
>   let result;
>
>   return function (...args) {
>     if (!called) {
>       called = true;
>       result = fn.apply(this, args);
>     }
>     return result; // Return cached result on subsequent calls
>   };
> }
>
> // Usage:
> const initApp = once(() => {
>   console.log("Initializing...");
>   return "initialized";
> });
>
> initApp(); // "Initializing..." → returns "initialized"
> initApp(); // (no log) → returns "initialized" (cached)
> initApp(); // (no log) → returns "initialized" (cached)
> ```
>
> **How it works:** Uses closure to track `called` state. First call sets `called = true` and caches `result`. Subsequent calls return cached result without executing `fn`.

---

### Q19: What's the difference between `compose` and `pipe`?
> **A:** Both combine multiple functions into one. The difference is **execution order**:
> - **`compose`**: Right-to-left (mathematical notation: $f \circ g = f(g(x))$)
> - **`pipe`**: Left-to-right (more readable, like a data pipeline)
>
> ```js
> const double = x => x * 2;
> const addTen = x => x + 10;
> const square = x => x ** 2;
>
> // compose: reads right-to-left
> const composed = compose(square, addTen, double);
> composed(3); // double(3)=6 → addTen(6)=16 → square(16)=256
>
> // pipe: reads left-to-right (same result, more intuitive)
> const piped = pipe(double, addTen, square);
> piped(3); // double(3)=6 → addTen(6)=16 → square(16)=256
>
> // Implementation:
> const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
> const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
> ```

---

### Q20: Explain closures in the context of HOFs that return functions.
> **A:** When a HOF returns a function, the returned function *closes over* (remembers) variables from the outer function's scope — even after the outer function has finished executing. This is called a **closure**.
>
> ```js
> function createCounter(start) {
>   let count = start; // This variable is "closed over"
>
>   return function () {
>     count++; // Inner function accesses outer scope's 'count'
>     return count;
>   };
> }
>
> const counter1 = createCounter(0);
> const counter2 = createCounter(100);
>
> console.log(counter1()); // 1
> console.log(counter1()); // 2  — 'count' persists between calls
> console.log(counter2()); // 101 — different closure, different 'count'
> ```
>
> **Why closures matter for HOFs:**
> - Factory functions (like `createCounter`) create independent instances
> - Memoization uses closures to cache results
> - Curried functions close over pre-filled arguments
> - Debounce/throttle use closures to track timers and state

---

## 11. Code Tracing Exercise

### Exercise: Trace the Execution of a Curried Function with Closures

```js
function createMultiplier(factor) {
  console.log(`[Outer] factor = ${factor}`);
  
  return function multiply(number) {
    console.log(`[Inner] number = ${number}, factor = ${factor}`);
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));
console.log(triple(5));
console.log(double(10));
```

**Step-by-Step Execution:**

```
STEP 1: createMultiplier(2) is called
        ├── Logs: "[Outer] factor = 2"
        ├── Creates inner function 'multiply' (with factor=2 in closure)
        ├── Returns the inner function
        └── 'double' now holds the inner function (factor=2 closed over)

STEP 2: createMultiplier(3) is called
        ├── Logs: "[Outer] factor = 3"
        ├── Creates NEW inner function (with factor=3 in closure)
        ├── Returns the inner function
        └── 'triple' now holds a DIFFERENT function (factor=3 closed over)

STEP 3: double(5) is called
        ├── Logs: "[Inner] number = 5, factor = 2"  (factor from closure!)
        ├── Returns: 5 * 2 = 10
        └── console.log prints: 10

STEP 4: triple(5) is called
        ├── Logs: "[Inner] number = 5, factor = 3"  (different closure!)
        ├── Returns: 5 * 3 = 15
        └── console.log prints: 15

STEP 5: double(10) is called
        ├── Logs: "[Inner] number = 10, factor = 2" (same closure as step 3)
        ├── Returns: 10 * 2 = 20
        └── console.log prints: 20
```

**Complete Output:**
```
[Outer] factor = 2
[Outer] factor = 3
[Inner] number = 5, factor = 2
10
[Inner] number = 5, factor = 3
15
[Inner] number = 10, factor = 2
20
```

**Memory Diagram:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MEMORY STATE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Global Scope                                                           │
│  ├── createMultiplier: [function]                                       │
│  ├── double: [function multiply] ──┐                                    │
│  └── triple: [function multiply] ──┼──┐                                 │
│                                    │  │                                 │
│                                    │  │                                 │
│  Closure 1 (created by call 1)     │  │                                 │
│  ┌─────────────────────────────┐   │  │                                 │
│  │ factor: 2                   │◄──┘  │                                 │
│  │ (closed over by 'double')   │      │                                 │
│  └─────────────────────────────┘      │                                 │
│                                       │                                 │
│  Closure 2 (created by call 2)        │                                 │
│  ┌─────────────────────────────┐      │                                 │
│  │ factor: 3                   │◄─────┘                                 │
│  │ (closed over by 'triple')   │                                        │
│  └─────────────────────────────┘                                        │
│                                                                         │
│  'double' and 'triple' have DIFFERENT closures with DIFFERENT values!   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Event Loop & Callbacks — How Async HOFs Work

Understanding the event loop is crucial for working with async callbacks like `setTimeout`, `addEventListener`, and `Promise.then`.

### The Event Loop Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      JAVASCRIPT RUNTIME                                 │
│                                                                         │
│  ┌───────────────┐                      ┌────────────────────────────┐  │
│  │  CALL STACK   │                      │       WEB APIs             │  │
│  │               │                      │  (Browser/Node.js)         │  │
│  │ ┌───────────┐ │                      │                            │  │
│  │ │ function  │ │  ─── setTimeout ───▶ │  • setTimeout timers       │  │
│  │ ├───────────┤ │                      │  • DOM events              │  │
│  │ │ function  │ │                      │  • fetch requests          │  │
│  │ └───────────┘ │                      │  • setInterval timers      │  │
│  └───────────────┘                      └───────────┬────────────────┘  │
│         ▲                                           │                   │
│         │                                           │ (after delay/     │
│         │                                           │  event occurs)    │
│         │                                           ▼                   │
│         │                               ┌────────────────────────────┐  │
│  ┌──────┴──────┐                        │     CALLBACK QUEUE         │  │
│  │ EVENT LOOP  │◄─── picks callback ─── │  (Task Queue)              │  │
│  │ "Is stack   │                        │                            │  │
│  │  empty?"    │                        │  callback1 │ callback2 │...│  │
│  └─────────────┘                        └────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tracing `setTimeout` Callback Execution

```js
console.log("Start");                          // 1️⃣

setTimeout(() => {                             // 2️⃣
  console.log("Timeout callback");
}, 0);

Promise.resolve().then(() => {                 // 3️⃣
  console.log("Promise callback");
});

console.log("End");                            // 4️⃣

// Output:
// Start
// End
// Promise callback  ← Microtask queue (higher priority)
// Timeout callback  ← Callback queue (lower priority)
```

**Execution Order Explained:**

```
CALL STACK                  CALLBACK QUEUE       MICROTASK QUEUE
───────────────────────────────────────────────────────────────────
1. console.log("Start")     [ ]                  [ ]
   → prints "Start"

2. setTimeout(cb, 0)        [ ]                  [ ]
   → registers timer in Web APIs
   → JS continues (non-blocking!)

3. Promise.resolve().then   [ ]                  [Promise cb]
   → promise resolved
   → callback added to MICROTASK queue

4. console.log("End")       [setTimeout cb]      [Promise cb]
   → prints "End"
   → (timer finished, callback queued)

STACK IS NOW EMPTY — Event loop checks queues!

5. Microtasks run FIRST     [setTimeout cb]      [ ]
   → Promise cb executes
   → prints "Promise callback"

6. Callback queue runs      [ ]                  [ ]
   → setTimeout cb executes
   → prints "Timeout callback"
```

**Key Insight:** Microtasks (Promises) have **higher priority** than macrotasks (setTimeout). The event loop *drains the entire microtask queue* before picking from the callback queue.

### Why This Matters for HOFs

When you pass callbacks to async HOFs like `setTimeout`, `fetch().then()`, or `addEventListener`:

1. **Your callback is NOT executed immediately** — it's scheduled
2. **The HOF handles the async work** (timer, network, event)
3. **Your callback runs later** when the event loop picks it up
4. **Closures preserve context** — your callback "remembers" variables from when it was created

```js
function createDelayedLogger(message) {
  // 'message' is closed over by the callback
  setTimeout(() => {
    console.log(message); // Can still access 'message' even after createDelayedLogger returned!
  }, 1000);
}

createDelayedLogger("Hello");  // Immediately returns, callback runs 1 second later
createDelayedLogger("World");  // Another independent callback with different closure
```

---

## 13. Cheat Sheet

```
┌────────────────────────────────────────────────────────────────────────┐
│                 FIRST-CLASS FUNCTIONS — Quick Reference                │
├────────────────────────────┬───────────────────────────────────────────┤
│ Store in variable          │ const fn = function() {};                 │
│ Store in object property   │ obj.method = function() {};               │
│ Store in array             │ const arr = [fn1, fn2, fn3];              │
│ Pass as argument           │ arr.map(fn)  ← no ()                      │
│ Return from function       │ return function() {};                     │
│ Has properties             │ fn.name, fn.length                        │
│ Has methods                │ fn.call(), fn.apply(), fn.bind()          │
└────────────────────────────┴───────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│               HIGHER-ORDER FUNCTIONS — Quick Reference                 │
├────────────────────────────┬───────────────────────────────────────────┤
│ Receives function          │ function hof(arr, callbackFn) {}          │
│ Returns function           │ function hof(x) { return fn => fn + x; } │
│ Both                       │ function memoize(fn) { return (...args)…} │
├────────────────────────────┴───────────────────────────────────────────┤
│ Built-in HOFs: map, filter, reduce, forEach, find, sort, some, every   │
│                setTimeout, setInterval, addEventListener, then, catch   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                     KEY PATTERNS USING HOFs                            │
├────────────────────────────┬───────────────────────────────────────────┤
│ Callback Pattern           │ Pass fn, let HOF call it when ready       │
│ Factory Pattern            │ HOF returns customized function           │
│ Currying                   │ fn(a)(b)(c) — partial application         │
│ Partial Application        │ fn.bind(null, preFilledArg)               │
│ Memoization                │ HOF caches fn results                     │
│ Composition (compose)      │ compose(f, g, h)(x) = f(g(h(x)))         │
│ Pipeline (pipe)            │ pipe(f, g, h)(x) = h(g(f(x)))            │
│ Decorator/Wrapper          │ HOF enhances a function's behavior        │
│ Once                       │ HOF ensures fn runs only once             │
│ IIFE                       │ (fn)() — define + call immediately        │
│ Middleware (Express)       │ fn that returns fn; HOF in frameworks     │
│ Debounce 🔥                │ Wait for quiet period before executing    │
│ Throttle 🔥                │ Execute at most once per time interval    │
└────────────────────────────┴───────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│              DEBOUNCE vs THROTTLE — Quick Reference 🔥                 │
├────────────────────────────┬───────────────────────────────────────────┤
│ Debounce                   │ "Wait until activity stops"               │
│   → Use for               │ Search input, resize, auto-save           │
│   → Behavior              │ Resets timer on each call; runs once      │
│                           │ after delay with no new calls             │
├────────────────────────────┼───────────────────────────────────────────┤
│ Throttle                   │ "Run at a steady rate"                    │
│   → Use for               │ Scroll, mousemove, API rate limiting      │
│   → Behavior              │ Runs at most once per interval            │
└────────────────────────────┴───────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│              ARROW FUNCTION LIMITATIONS AS CALLBACKS                   │
├────────────────────────────┬───────────────────────────────────────────┤
│ No own 'this'              │ Use when you WANT lexical this            │
│ No 'arguments' object      │ Use ...rest params instead               │
│ Cannot be constructor      │ Don't use 'new ArrowFn()'                │
│ No 'prototype' property    │ Cannot serve as base class               │
│ .call/.apply/.bind 'this'  │ Cannot override 'this' of arrow fn       │
│ Cannot return {} directly  │ Must wrap: () => ({ key: val })          │
└────────────────────────────┴───────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│               call / apply / bind — Quick Reference                    │
├────────────────────────────┬───────────────────────────────────────────┤
│ fn.call(obj, a, b)         │ Invoke now, args: comma-separated         │
│ fn.apply(obj, [a, b])      │ Invoke now, args: array                   │
│ fn.bind(obj, a)            │ Return new fn, 'this' + args pre-set      │
│ Mnemonic                   │ Call=Comma  Apply=Array  Bind=Bookmark    │
└────────────────────────────┴───────────────────────────────────────────┘
```

---

> **Summary in one paragraph:**
> JavaScript has **first-class functions** — a language feature meaning functions are values. Because they are values, you can store them in variables/objects, pass them to other functions (as callbacks), and return them from functions (as factories). This enables **higher-order functions** (HOFs) — a powerful pattern where functions either receive or return other functions. HOFs like `map`, `filter`, `reduce`, and `addEventListener` abstract away repetitive logic. Patterns like currying, memoization, composition (`compose`/`pipe`), decorators, IIFE, **debounce**, and **throttle** are all built on top of HOFs. Arrow functions are the preferred callback syntax but have no own `this`, `arguments`, or `prototype` — knowing when to use regular vs arrow functions separates junior devs from senior ones. Understanding how callbacks interact with the **event loop** (call stack, callback queue, microtask queue) is essential for async JavaScript. Mastering all of this is key to writing clean, reusable, functional-style JavaScript and crushing front-end/full-stack interviews.

---

> **References:**
> - [MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
> - [MDN — Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)
> - [MDN — Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
> - [MDN — Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
> - [MDN — IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
