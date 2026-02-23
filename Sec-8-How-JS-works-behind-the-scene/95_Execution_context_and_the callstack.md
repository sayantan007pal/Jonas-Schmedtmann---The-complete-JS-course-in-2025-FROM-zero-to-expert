# JavaScript Execution Context & The Call Stack - Complete Interview Guide

## 📌 Table of Contents

1. [What is Execution Context?](#what-is-execution-context)
2. [Types of Execution Context](#types-of-execution-context)
3. [How JavaScript Code is Executed - The 3 Phases](#how-javascript-code-is-executed)
4. [What's Inside an Execution Context?](#whats-inside-an-execution-context)
5. [The Call Stack](#the-call-stack)
6. [Arrow Functions - The Special Case](#arrow-functions---the-special-case)
7. [Interview Questions & Answers](#interview-questions--answers)

---

## What is Execution Context?

### 🎯 Simple Definition

> **Execution Context (EC)** is the environment in which JavaScript code is evaluated and executed. Think of it as a "box" or "container" that stores all the necessary information for a piece of code to be executed.

### 🏠 Real-World Analogy: The Kitchen Analogy

Imagine you're cooking a recipe (your JavaScript code):

- **The Kitchen** = Execution Context
- **Ingredients on counter** = Variables in Variable Environment
- **Recipe book open to current page** = Current code being executed
- **Access to pantry** = Scope Chain (access to outer ingredients)
- **Chef (you)** = The `this` keyword (who's doing the cooking)

Just like you need a kitchen setup to cook, JavaScript needs an execution context to run code!

---

## Types of Execution Context

### 1️⃣ Global Execution Context (GEC)

```javascript
// Everything here runs in the Global Execution Context
const name = "JavaScript";
let version = "ES2024";
var author = "Brendan Eich";

function greet() {
    console.log(`Hello from ${name}!`);
}

// Top-level code: executed immediately in GEC
console.log("I'm top-level code running in Global EC");
greet(); // Function call creates new EC
```

**Key Points:**
- ✅ Created when JavaScript file first loads
- ✅ There's only ONE Global EC per program
- ✅ Contains global variables and functions
- ✅ In browsers: `window` object is the global object
- ✅ In Node.js: `global` object is the global object

### 2️⃣ Function Execution Context (FEC)

```javascript
function calculateSum(a, b) {
    // New Execution Context created for this function
    const result = a + b;
    return result;
}

calculateSum(5, 3); // Creates Function EC
calculateSum(10, 20); // Creates ANOTHER Function EC
```

**Key Points:**
- ✅ Created EVERY TIME a function is called
- ✅ Each function call gets its OWN execution context
- ✅ Contains function's local variables, arguments, etc.

### 3️⃣ Eval Execution Context (Rarely Used)

```javascript
// Code inside eval() runs in its own EC
eval("console.log('Eval EC')"); // ⚠️ Avoid using eval!
```

---

## How JavaScript Code is Executed

### 🎬 The Three-Act Play of JavaScript Execution

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JAVASCRIPT CODE EXECUTION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ACT 1: Creation of Global Execution Context                        │
│         └── For top-level code (not inside any function)            │
│                                                                      │
│  ACT 2: Execution of Top-Level Code                                 │
│         └── Inside the Global Execution Context                     │
│                                                                      │
│  ACT 3: Execution of Functions                                      │
│         └── Each function call = New Execution Context              │
│         └── Waiting for Callbacks (Event Loop)                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Creation Phase (Memory Allocation)

```javascript
// ===== CREATION PHASE EXAMPLE =====

// What JS sees:
console.log(myVar);     // undefined (hoisted)
console.log(myLet);     // ReferenceError: Cannot access before initialization
console.log(myFunc);    // [Function: myFunc] (fully hoisted)

var myVar = "I'm var";
let myLet = "I'm let";

function myFunc() {
    return "I'm a function";
}
```

**What happens in Creation Phase:**

```
┌─────────────────────────────────────────────────────────────────┐
│              GLOBAL EXECUTION CONTEXT - CREATION PHASE           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Variable Environment:                                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  myVar:  undefined          ← var is hoisted with undefined ││
│  │  myLet:  <uninitialized>    ← let is in TDZ                 ││
│  │  myFunc: function() {...}   ← functions fully hoisted       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Scope Chain: [Global Scope]                                     │
│                                                                  │
│  this: window (browser) / global (Node.js)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Execution Phase (Running Code Line by Line)

```javascript
// ===== EXECUTION PHASE EXAMPLE =====

// This code will execute line by line:

const firstName = "Jonas";        // Line 1: Assign "Jonas" to firstName
const lastName = "Schmedtmann";   // Line 2: Assign "Schmedtmann" to lastName

// Line 3-5: Define function (already hoisted in creation phase)
function getFullName() {
    return `${firstName} ${lastName}`;
}

// Line 6: Execute function - Creates NEW Function EC
const fullName = getFullName();   

// Line 7: Log result
console.log(fullName);            // Output: "Jonas Schmedtmann"
```

### Complete Example with Call Stack Visualization

```javascript
// ===== COMPLETE EXECUTION FLOW EXAMPLE =====

const name = "Alice";

function first() {
    const a = "Inside first";
    second();   // Call second function
    console.log(a);
}

function second() {
    const b = "Inside second";
    third();    // Call third function
    console.log(b);
}

function third() {
    const c = "Inside third";
    console.log(c);
}

first();  // This triggers everything!
console.log("Done!");
```

**Call Stack Visualization:**

```
Step by Step Call Stack:

1. Script starts:           2. first() called:        3. second() called:
   ┌───────────────┐           ┌───────────────┐        ┌───────────────┐
   │               │           │               │        │   third()     │
   │               │           │               │        ├───────────────┤
   │               │           │   first()     │        │   second()    │
   ├───────────────┤           ├───────────────┤        ├───────────────┤
   │    Global     │           │    Global     │        │   first()     │
   └───────────────┘           └───────────────┘        ├───────────────┤
                                                        │    Global     │
                                                        └───────────────┘

4. third() executes & pops:  5. second() executes:     6. Back to Global:
   ┌───────────────┐           ┌───────────────┐        ┌───────────────┐
   │   second()    │           │   first()     │        │               │
   ├───────────────┤           ├───────────────┤        │               │
   │   first()     │           │    Global     │        │               │
   ├───────────────┤           └───────────────┘        │    Global     │
   │    Global     │                                    └───────────────┘
   └───────────────┘           Prints: "Inside second"  Prints: "Done!"
   Prints: "Inside third"
```

---

## What's Inside an Execution Context?

Every Execution Context contains THREE main components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EXECUTION CONTEXT                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ VARIABLE ENVIRONMENT                                            │
│     ├── let, const, var declarations                                │
│     ├── Functions declarations                                       │
│     └── arguments object (functions only)                           │
│                                                                      │
│  2️⃣ SCOPE CHAIN                                                     │
│     └── References to outer/parent scopes                           │
│                                                                      │
│  3️⃣ THIS KEYWORD                                                    │
│     └── Depends on HOW function is called                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1️⃣ Variable Environment

The Variable Environment is like a **storage unit** that holds all the variables and functions declared in that execution context.

```javascript
// ===== VARIABLE ENVIRONMENT EXAMPLE =====

function greetPerson(name, age) {
    // Variable Environment for this function contains:
    const greeting = "Hello";
    let message;
    var isAdult = age >= 18;
    
    function formatGreeting() {
        return `${greeting}, ${name}!`;
    }
    
    message = formatGreeting();
    console.log(message, isAdult);
}

greetPerson("John", 25);
```

**Variable Environment Breakdown:**

```
┌────────────────────────────────────────────────────────────┐
│     VARIABLE ENVIRONMENT for greetPerson("John", 25)       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  arguments: { 0: "John", 1: 25, length: 2 }               │
│                                                            │
│  name: "John"           ← function parameter               │
│  age: 25                ← function parameter               │
│  greeting: "Hello"      ← const declaration                │
│  message: undefined → "Hello, John!"  ← let declaration   │
│  isAdult: true          ← var declaration                  │
│  formatGreeting: ƒ      ← function declaration             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 2️⃣ Scope Chain

The Scope Chain is like a **ladder** that allows inner functions to access variables from outer scopes.

```javascript
// ===== SCOPE CHAIN EXAMPLE =====

const globalVar = "I'm global";

function outer() {
    const outerVar = "I'm from outer";
    
    function inner() {
        const innerVar = "I'm from inner";
        
        // Scope Chain in action:
        console.log(innerVar);   // ✅ Found in inner's scope
        console.log(outerVar);   // ✅ Found in outer's scope (via scope chain)
        console.log(globalVar);  // ✅ Found in global scope (via scope chain)
    }
    
    inner();
    // console.log(innerVar);  // ❌ Error! Can't go DOWN the chain
}

outer();
```

**Scope Chain Visualization:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         SCOPE CHAIN                              │
│                                                                  │
│  inner() EC looks for variable:                                  │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │   inner scope    │ ← Check here first                        │
│  │   innerVar: ✓    │                                            │
│  └────────┬─────────┘                                            │
│           │ Not found? Look up ⬆️                                │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │   outer scope    │ ← Then check parent scope                 │
│  │   outerVar: ✓    │                                            │
│  └────────┬─────────┘                                            │
│           │ Not found? Look up ⬆️                                │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │   global scope   │ ← Finally check global scope              │
│  │   globalVar: ✓   │                                            │
│  └─────────────────┘                                             │
│                                                                  │
│  🔑 Key: Can only look UP, never DOWN!                          │
└─────────────────────────────────────────────────────────────────┘
```

### 3️⃣ The `this` Keyword

The `this` keyword is like a **dynamic pointer** - its value depends on HOW the function is called, not WHERE it's defined.

```javascript
// ===== THIS KEYWORD EXAMPLES =====

// 1. Global Context
console.log(this); // window (browser) or global (Node.js)

// 2. Regular Function Call
function showThis() {
    console.log(this);
}
showThis(); // window (non-strict) or undefined (strict mode)

// 3. Method Call (Object's function)
const person = {
    name: "Alice",
    greet() {
        console.log(this);        // person object
        console.log(this.name);   // "Alice"
    }
};
person.greet();

// 4. Arrow Functions - Inherit 'this' from parent
const team = {
    name: "Developers",
    members: ["Alice", "Bob"],
    showMembers() {
        // Arrow function inherits 'this' from showMembers
        this.members.forEach(member => {
            console.log(`${member} is in ${this.name}`);
        });
    }
};
team.showMembers();
// Output: "Alice is in Developers", "Bob is in Developers"

// 5. Event Listeners
document.querySelector('button').addEventListener('click', function() {
    console.log(this); // The button element that was clicked
});

// 6. new Keyword
function Person(name) {
    this.name = name;
    console.log(this); // The new object being created
}
const john = new Person("John"); // this = { name: "John" }

// 7. call, apply, bind
const user = { name: "Jane" };
function greet() {
    console.log(`Hello, ${this.name}`);
}
greet.call(user);   // "Hello, Jane" - this = user
greet.apply(user);  // "Hello, Jane" - this = user
const boundGreet = greet.bind(user);
boundGreet();       // "Hello, Jane" - this = user
```

**`this` Keyword Quick Reference:**

```
┌───────────────────────────────────────────────────────────────────┐
│                    'this' KEYWORD CHEAT SHEET                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Context                        │ 'this' Value                    │
│  ──────────────────────────────│────────────────────────────────  │
│  Global Scope                   │ window / global                 │
│  Regular Function (non-strict)  │ window / global                 │
│  Regular Function (strict)      │ undefined                       │
│  Object Method                  │ The object calling the method   │
│  Arrow Function                 │ Inherited from parent scope     │
│  Event Listener                 │ The DOM element                 │
│  new Constructor                │ The new empty object            │
│  call/apply/bind                │ Explicitly set value            │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## The Call Stack

### 🎯 Definition

> **Call Stack** is a data structure (LIFO - Last In First Out) that keeps track of execution contexts. It tells JavaScript which function is currently running and what to return to after it finishes.

### 🍽️ Analogy: The Plate Stack

Think of the call stack like a stack of plates at a buffet:

- 🍽️ When a new function is called → **Push** a new plate on top
- 🍽️ When a function returns → **Pop** the top plate off
- 🍽️ You can only add/remove from the **top**
- 🍽️ The bottom plate (Global EC) is always there

### Complete Call Stack Example

```javascript
// ===== CALL STACK DEMONSTRATION =====

function multiply(x, y) {
    return x * y;
}

function square(n) {
    return multiply(n, n);
}

function printSquare(num) {
    const result = square(num);
    console.log(result);
}

printSquare(5); // Let's trace this!
```

**Step-by-Step Call Stack Trace:**

```
Step 1: Script starts
┌─────────────────────────┐
│                         │
│      Global EC          │
│    (printSquare: ƒ)     │
│    (square: ƒ)          │
│    (multiply: ƒ)        │
└─────────────────────────┘
↳ All functions hoisted in memory

Step 2: printSquare(5) called
┌─────────────────────────┐
│     printSquare EC      │
│      num = 5            │
├─────────────────────────┤
│      Global EC          │
└─────────────────────────┘
↳ printSquare pushed onto stack

Step 3: square(5) called
┌─────────────────────────┐
│       square EC         │
│        n = 5            │
├─────────────────────────┤
│     printSquare EC      │
├─────────────────────────┤
│      Global EC          │
└─────────────────────────┘
↳ square pushed onto stack

Step 4: multiply(5, 5) called
┌─────────────────────────┐
│      multiply EC        │
│    x = 5, y = 5         │
├─────────────────────────┤
│       square EC         │
├─────────────────────────┤
│     printSquare EC      │
├─────────────────────────┤
│      Global EC          │
└─────────────────────────┘
↳ multiply pushed onto stack

Step 5: multiply returns 25
┌─────────────────────────┐
│       square EC         │
│     return 25           │
├─────────────────────────┤
│     printSquare EC      │
├─────────────────────────┤
│      Global EC          │
└─────────────────────────┘
↳ multiply popped, returned 25

Step 6: square returns 25
┌─────────────────────────┐
│     printSquare EC      │
│     result = 25         │
├─────────────────────────┤
│      Global EC          │
└─────────────────────────┘
↳ square popped, returned 25

Step 7: console.log(25)
┌─────────────────────────┐
│      Global EC          │
└─────────────────────────┘
↳ printSquare popped after logging 25

Step 8: Script ends
┌─────────────────────────┐
│                         │
│    (Stack empty - or    │
│     Global EC exits)    │
│                         │
└─────────────────────────┘
```

---

## Arrow Functions - The Special Case

Arrow functions are **different** from regular functions in TWO key ways regarding execution context:

### ❌ 1. No Own `arguments` Object

```javascript
// ===== ARGUMENTS OBJECT COMPARISON =====

// Regular Function - HAS arguments
function regularFunc(a, b, c) {
    console.log(arguments);        // [1, 2, 3] - Arguments object
    console.log(arguments[0]);     // 1
    console.log(arguments.length); // 3
}
regularFunc(1, 2, 3);

// Arrow Function - NO arguments (inherits from parent)
const arrowFunc = (a, b, c) => {
    // console.log(arguments); // ❌ ReferenceError: arguments is not defined
    // (unless there's a parent function with arguments)
};

// Arrow in Regular Function - Gets PARENT's arguments
function outerFunc() {
    const inner = () => {
        console.log(arguments); // Gets outerFunc's arguments: [10, 20]
    };
    inner();
}
outerFunc(10, 20);

// Solution: Use REST parameters instead
const modernArrow = (...args) => {
    console.log(args);        // [1, 2, 3] - Real array!
    console.log(args[0]);     // 1
    console.log(args.length); // 3
};
modernArrow(1, 2, 3);
```

### ❌ 2. No Own `this` Keyword (Lexical `this`)

```javascript
// ===== THIS KEYWORD IN ARROW VS REGULAR FUNCTIONS =====

const restaurant = {
    name: "Italian Bistro",
    
    // Regular function - has own 'this'
    getNameRegular: function() {
        console.log(this);       // restaurant object ✅
        console.log(this.name);  // "Italian Bistro" ✅
    },
    
    // Arrow function - NO own 'this' (inherits from parent = global)
    getNameArrow: () => {
        console.log(this);       // window object ❌ (not restaurant!)
        console.log(this.name);  // undefined ❌
    }
};

restaurant.getNameRegular(); // Works!
restaurant.getNameArrow();   // Doesn't work as expected!

// ===== THE CALLBACK PROBLEM & SOLUTION =====

const bookClub = {
    name: "Readers United",
    members: ["Alice", "Bob", "Charlie"],
    
    // ❌ PROBLEM: Regular function callback loses 'this'
    listMembersBad: function() {
        this.members.forEach(function(member) {
            // 'this' here is undefined (strict) or window (non-strict)
            // console.log(`${member} - ${this.name}`); // ❌ Error!
        });
    },
    
    // ✅ SOLUTION 1: Arrow function (inherits 'this')
    listMembersArrow: function() {
        this.members.forEach(member => {
            console.log(`${member} - ${this.name}`); // ✅ Works!
        });
    },
    
    // ✅ SOLUTION 2: Save 'this' reference
    listMembersSelf: function() {
        const self = this;
        this.members.forEach(function(member) {
            console.log(`${member} - ${self.name}`); // ✅ Works!
        });
    },
    
    // ✅ SOLUTION 3: bind()
    listMembersBind: function() {
        this.members.forEach(function(member) {
            console.log(`${member} - ${this.name}`);
        }.bind(this)); // ✅ Works!
    }
};

bookClub.listMembersArrow();
```

### Summary: Arrow Functions vs Regular Functions

```
┌────────────────────────────────────────────────────────────────────┐
│          ARROW FUNCTIONS vs REGULAR FUNCTIONS                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Feature              │  Regular Function    │  Arrow Function     │
│  ─────────────────────│─────────────────────│────────────────────  │
│  'this' keyword       │  Own 'this'          │  ❌ Lexical 'this'  │
│  'arguments' object   │  Own 'arguments'     │  ❌ No 'arguments'  │
│  Use as method        │  ✅ Yes              │  ⚠️ Avoid           │
│  Use as callback      │  ⚠️ 'this' issues    │  ✅ Great choice    │
│  Use as constructor   │  ✅ new Person()     │  ❌ Error           │
│  Hoisted              │  ✅ (declarations)   │  ❌ No              │
│                                                                     │
│  🎯 Rule of Thumb:                                                  │
│  - Methods → Use Regular Functions                                  │
│  - Callbacks → Use Arrow Functions                                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Callbacks and the Event Loop (Waiting for Callbacks)

When JavaScript encounters asynchronous code, the callbacks don't get their own EC until they're ready to execute.

```javascript
// ===== CALLBACK EXECUTION ORDER =====

console.log("1. Start"); // Synchronous - runs immediately

setTimeout(function callback1() {
    console.log("2. Timeout callback"); // Async - waits for timer + call stack to be empty
}, 0);

Promise.resolve().then(function callback2() {
    console.log("3. Promise callback"); // Microtask - runs before timeout
});

console.log("4. End"); // Synchronous - runs immediately

// Output Order:
// 1. Start
// 4. End
// 3. Promise callback  (microtask queue - higher priority)
// 2. Timeout callback  (callback queue - lower priority)
```

**Visualization:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ASYNC EXECUTION FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CALL STACK              WEB APIs           QUEUES                   │
│  ──────────              ───────            ──────                   │
│  │ console.log │                                                     │
│  │   "Start"   │                                                     │
│  └─────────────┘                                                     │
│                                                                      │
│  │ setTimeout  │  ─────▶  │ Timer: 0ms │                            │
│  └─────────────┘          └────────────┘                             │
│                                   │                                  │
│                                   ▼                                  │
│                           ┌──────────────────┐                       │
│                           │ Callback Queue   │                       │
│                           │ [callback1]      │                       │
│                           └──────────────────┘                       │
│                                                                      │
│  │ Promise.then│  ─────────────────────▶  ┌──────────────────┐      │
│  └─────────────┘                          │ Microtask Queue  │      │
│                                           │ [callback2]      │      │
│                                           └──────────────────┘      │
│                                                                      │
│  │ console.log │                                                     │
│  │    "End"    │                                                     │
│  └─────────────┘                                                     │
│                                                                      │
│  ────── CALL STACK EMPTY ──────                                     │
│                                                                      │
│  Event Loop checks:                                                  │
│  1. Microtask Queue → callback2 executes ("Promise callback")       │
│  2. Callback Queue  → callback1 executes ("Timeout callback")       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Interview Questions & Answers

### Q1: What is an Execution Context in JavaScript?

**Answer:**
> An Execution Context is the environment in which JavaScript code is evaluated and executed. It contains three key components:
> 1. **Variable Environment** - stores variables, function declarations, and arguments
> 2. **Scope Chain** - references to outer scopes for variable lookup
> 3. **this keyword** - reference determined by how the function is called
>
> There are two main types: Global EC (created when script loads) and Function EC (created every time a function is called).

### Q2: What's the difference between Global and Function Execution Context?

**Answer:**
```javascript
// Global EC - Created once, for top-level code
const globalVar = "I'm global"; // Lives in Global EC

// Function EC - Created every time function is called
function myFunc() {
    const localVar = "I'm local"; // Lives in Function EC
}

myFunc(); // Creates EC #1
myFunc(); // Creates EC #2 (NEW one, not the same)
```

### Q3: What is the Call Stack and why is it important?

**Answer:**
> The Call Stack is a LIFO (Last In, First Out) data structure that tracks which execution context is currently running. It's important because:
> - JavaScript is **single-threaded** - can only do one thing at a time
> - It maintains the order of execution
> - Helps JavaScript know where to return after a function completes

### Q4: Why don't arrow functions have their own `this` and `arguments`?

**Answer:**
> Arrow functions were designed to solve the "this" problem in callbacks. They use **lexical scoping** - meaning they inherit `this` and `arguments` from their **enclosing scope** at the time of definition, not execution. This makes them perfect for callbacks but unsuitable as object methods.

```javascript
const obj = {
    value: 42,
    // Bad - arrow function as method
    getValueArrow: () => this.value, // undefined!
    
    // Good - arrow function as callback
    delayedLog() {
        setTimeout(() => {
            console.log(this.value); // 42 ✅
        }, 1000);
    }
};
```

### Q5: Explain hoisting in the context of Execution Context.

**Answer:**
> Hoisting occurs during the **Creation Phase** of the Execution Context. JavaScript scans for declarations and:
> - `var` variables → Hoisted with value `undefined`
> - `let`/`const` → Hoisted but in **Temporal Dead Zone** (can't access)
> - Function declarations → **Fully hoisted** (can use before declaration)
> - Function expressions/arrows → Treated like variable declarations

```javascript
console.log(hoistedVar);  // undefined
console.log(hoistedLet);  // ReferenceError: TDZ
hoistedFunc();            // "I work!" ✅

var hoistedVar = "value";
let hoistedLet = "value";
function hoistedFunc() { console.log("I work!"); }
```

### Q6: What happens in the Creation Phase vs Execution Phase?

**Answer:**

| Creation Phase | Execution Phase |
|---------------|-----------------|
| Memory allocated for variables | Variables assigned actual values |
| `var` → undefined | Code runs line by line |
| `let`/`const` → TDZ | Functions are called |
| Functions → Full definition | Expressions evaluated |
| Scope chain established | Values returned |

### Q7: Code Output Question - Predict the Output

```javascript
var a = 1;
function outer() {
    var a = 2;
    function inner() {
        var a = 3;
        console.log(a); // ?
    }
    inner();
    console.log(a); // ?
}
outer();
console.log(a); // ?
```

**Answer:**
```
3  // inner's local 'a'
2  // outer's local 'a' 
1  // global 'a'
```
Each function has its own Variable Environment with its own `a`.

### Q8: Code Output Question - `this` in Different Contexts

```javascript
const obj = {
    name: "Object",
    regularMethod: function() {
        console.log(this.name);
    },
    arrowMethod: () => {
        console.log(this.name);
    }
};

obj.regularMethod(); // ?
obj.arrowMethod();   // ?

const detached = obj.regularMethod;
detached(); // ?
```

**Answer:**
```
"Object"       // 'this' = obj
undefined      // 'this' = window (global), no 'name' property
undefined      // 'this' = window (function called without object)
```

---

## 🎯 Key Takeaways for Interviews

1. **Execution Context = Environment for running code** with Variable Environment + Scope Chain + `this`

2. **Three Phases**: 
   - Create GEC → Execute top-level code → Create FEC for each function call

3. **Call Stack** = LIFO structure tracking ECs (single-threaded execution)

4. **Arrow Functions**:
   - ❌ No own `this` (lexical)
   - ❌ No own `arguments`
   - ✅ Perfect for callbacks
   - ❌ Bad for methods

5. **Hoisting** = Space allocated in Creation Phase, used in Execution Phase

6. **Scope Chain** = Looking UP for variables (child → parent → global)

7. **`this` depends on HOW function is called**, not where defined (except arrow functions)

---

## 📚 Memory Tricks

### "VEST" for Execution Context Components
- **V**ariable Environment
- **E**... (Execution happens here)
- **S**cope Chain
- **T**his keyword

### "CAP" for EC Phases
- **C**reation (Memory allocation, hoisting happens)
- **A**nd then
- **P**rogramming runs (Execution phase)

### Arrow Functions Memory: "No THIS, No ARGUMENTS"
Arrow functions say "NO" to having their own this and arguments - they borrow from parents!

---

*Last Updated: February 2026*
*Course: Jonas Schmedtmann - The Complete JavaScript Course 2025*
