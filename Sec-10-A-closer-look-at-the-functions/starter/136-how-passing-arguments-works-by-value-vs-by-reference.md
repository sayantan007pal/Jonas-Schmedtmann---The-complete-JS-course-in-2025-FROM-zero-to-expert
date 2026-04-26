# 136 — How Passing Arguments Works: Value vs. Reference

> **Target:** Final-year CSE student | Interview-ready depth | Section 10 — A Closer Look at Functions

---

## 🧠 Quick Mental Model (TL;DR)

| Argument Type | What Gets Copied | Can Mutate Original? | Can Reassign Original? |
|---|---|---|---|
| **Primitive** (number, string, boolean, null, undefined, Symbol, BigInt) | The actual value | ❌ No | ❌ No |
| **Object / Array** | The memory address (reference) | ✅ Yes | ❌ No |
| **Function** | The memory address (reference) | ✅ Yes (add properties) | ❌ No |

> **One-liner for interviews:** JavaScript is **always pass-by-value**. But when the value is an object, the value being passed is a *reference* (a memory address). This is also called **"call by sharing"** or **"pass by value of the reference"**.

---

## 📦 Memory Layout: Stack vs. Heap

Understanding *where* values live explains *why* passing behaves differently.

```
CALL STACK (fast, fixed-size, LIFO)          HEAP (slow, dynamic, large)
┌──────────────────────────────┐             ┌──────────────────────────────────┐
│  Variable   │  Value          │             │  Address    │  Object Data        │
├─────────────┼─────────────────┤             ├─────────────┼────────────────────┤
│  age        │  25             │             │  0xF4A1     │  { brand: "Toyota",│
│  name       │  "Alice"        │             │             │    model: "Camry" } │
│  myCar      │  → 0xF4A1       │─────────────▶             │                    │
│  scores     │  → 0xB3C2       │─────────────▶  0xB3C2     │  [90, 85, 92]      │
└──────────────────────────────┘             └──────────────────────────────────┘
```

**Key rules:**
- **Primitives** live *directly* on the stack. The stack slot holds the actual value.
- **Objects, Arrays, Functions** live on the *heap*. The stack slot holds only the heap address (a reference/pointer).

When you call a function and pass an argument, JavaScript **copies the stack slot value** into the function's parameter. That's it. Always. No exceptions.

- For a primitive → copies the value itself → independent copy.
- For an object → copies the heap address → both variables now point to the same heap object.

---

## 1. Passing Primitives — Pass by Value

### Analogy: The Photocopy Machine 🖨️

> Imagine your bank account number is written on a document.
> You photocopy it and hand the copy to a friend.
> Your friend scribbles "9999999" on their copy.
> → Your **original document is untouched** — they only changed their photocopy.

This is exactly what happens when you pass a primitive to a function. The function receives a **fresh copy**; changing it has **zero effect** on the original variable.

### Code Example

```js
function tryToChangeAge(age) {
  age = 99; // modifying the local copy
  console.log("Inside function:", age); // 99
}

let myAge = 25;
tryToChangeAge(myAge);
console.log("Outside function:", myAge); // 25 — completely unchanged!
```

```js
function appendTitle(name) {
  name = "Dr. " + name; // new string → new stack value
  return name;
}

let personName = "Alice";
appendTitle(personName);
console.log(personName); // "Alice" — strings are immutable primitives
```

### What Happens in Memory (Step by Step)

```
Before call:
  Stack: myAge → 25

During call:  tryToChangeAge(myAge)
  Stack: myAge → 25
         age (parameter) → 25   ← a completely separate copy

age = 99;
  Stack: myAge → 25            ← untouched
         age (parameter) → 99  ← only local copy changed

After call returns:
  Stack: myAge → 25            ← still 25
```

> **The parameter `age` is a brand-new stack slot initialized with a copy of `myAge`'s value.**

---

## 2. Passing Objects — Pass by Value of the Reference

### Analogy: The House Address 🏠

> You own a house (the object lives in the heap).
> You write your house address on a sticky note (your variable holds the reference).
> You **photocopy the sticky note** and give it to a friend (pass to function).
>
> Now the friend can:
> - **Go to your house and rearrange the furniture** → ✅ this changes the actual house (mutation of properties works)
> - **Scribble a different address on their sticky note** → ❌ this does NOT move your house; your sticky note still shows the original address (reassignment is local only)

### Code Example A — Mutation (The Trap ⚠️)

```js
const myCar = { brand: "Toyota", model: "Camry" };

function updateCar(car) {
  car.model = "Tesla"; // navigates to the heap address and mutates the object
}

updateCar(myCar);
console.log(myCar.model); // "Tesla" ← THE ORIGINAL OBJECT WAS CHANGED!
```

**Why?** Both `myCar` (outside) and `car` (parameter) hold the *same heap address*. When the function uses `.model = "Tesla"`, it follows that address to the heap and modifies the one shared object.

```
Stack:  myCar  → 0xF4A1    (original variable)
        car    → 0xF4A1    (parameter — a copy of the address)
                    │
                    ▼
Heap:  0xF4A1  → { brand: "Toyota", model: "Tesla" }  ← mutated in-place
```

### Code Example B — Reassignment (The Gotcha 🎭)

```js
const myCar = { brand: "Toyota", model: "Camry" };

function replaceCar(car) {
  car = { brand: "BMW", model: "M3" }; // creates a NEW heap object and points local `car` to it
}

replaceCar(myCar);
console.log(myCar.brand); // "Toyota" ← UNCHANGED! reassignment is local
```

**Why?** `car = { ... }` creates a new heap object and makes the *local parameter variable* `car` point to it. The original variable `myCar` on the caller's stack is never touched.

```
Stack:  myCar  → 0xF4A1    ← still points here (untouched)
        car    → 0xB9D3    ← reassigned locally to a new heap object

Heap:  0xF4A1  → { brand: "Toyota", model: "Camry" }   ← original, untouched
       0xB9D3  → { brand: "BMW", model: "M3" }          ← new, orphaned after return
```

### Code Example C — Arrays Work the Same Way

```js
function processScores(scores) {
  scores.push(100);       // ✅ mutates the original array
  scores = [0, 0, 0];    // ❌ only local reassignment
}

const myScores = [85, 90, 78];
processScores(myScores);
console.log(myScores); // [85, 90, 78, 100] ← push mutated, reassignment didn't
```

### Real-World Example (From the Course) ✈️

```js
const flight = "LH234";                                // primitive (string)
const jonas = { name: "Jonas Schmedtmann", passport: 24739479284 }; // object

function checkIn(flightNum, passenger) {
  flightNum = "LH999";           // local copy of string — NO effect outside
  passenger.name = "Mr. " + passenger.name; // mutates original object — REAL EFFECT!

  if (passenger.passport === 24739479284) {
    alert("Check in ✅");
  } else {
    alert("Wrong passport ❌");
  }
}

checkIn(flight, jonas);

console.log(flight);       // "LH234" ← unchanged (primitive)
console.log(jonas.name);   // "Mr. Jonas Schmedtmann" ← changed (object mutation)
```

> **Interview insight:** This is why functions that accept objects can be "dangerous" — they can silently mutate your data. Production code uses defensive copying to prevent this.

---

## 3. Passing Functions — Also Pass by Value of Reference

Functions in JavaScript are **first-class objects** stored on the heap. Passing them as arguments follows the exact same rules as passing objects.

### Analogy: The Remote Control 📺

> You have a remote control (a function).
> You hand a friend a **copy of the remote** (pass to another function).
> - The friend can **press buttons** (call/invoke the function) → ✅ works
> - If the friend **buys a new remote**, your original remote is unaffected → ❌ reassignment is local

### Code Example A — Callback (Standard Usage)

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

function callTwice(fn) {
  fn("Alice");  // using the function reference to invoke it
  fn("Bob");
}

callTwice(greet);
// Hello, Alice!
// Hello, Bob!

// greet itself is still the original function — nothing changed
console.log(greet.name); // "greet"
```

### Code Example B — Reassignment of the Function Parameter Is Local

```js
function greet() { console.log("Hello!"); }

function tryToReplaceFunction(fn) {
  fn();                                      // calls greet → "Hello!"
  fn = function() { console.log("Hacked!"); }; // only local reassignment
  fn();                                      // calls the new local fn → "Hacked!"
}

tryToReplaceFunction(greet);
greet(); // "Hello!" ← the original `greet` is untouched
```

### Code Example C — Adding Properties to a Function (Mutation Works)

```js
function myFn() {}

function decorateFn(fn) {
  fn.version = "1.0"; // adds a property to the function object — mutation!
}

decorateFn(myFn);
console.log(myFn.version); // "1.0" ← original function object was mutated
```

> Functions are objects, so their properties can be mutated from inside a receiving function — just like regular objects.

---

## 3.5 The Autoboxing Trap — Why Primitives Appear to Have Methods

From MDN: *"Primitives have no methods but still behave as if they do. When properties are accessed on primitives, JavaScript **auto-boxes** the value into a wrapper object and accesses the property on that object instead."*

### What Is Autoboxing?

When you write `"hello".toUpperCase()`, the string primitive `"hello"` has no methods. JavaScript silently:
1. Wraps it in a temporary `String` wrapper object
2. Calls `.toUpperCase()` on that wrapper
3. Discards the wrapper — your original primitive is unchanged

```js
let str = "hello";
console.log(str.toUpperCase()); // "HELLO" ← autoboxed to String object
console.log(str);               // "hello" ← still the original primitive

// Demonstrating the wrapper is ephemeral (discarded immediately)
str.customProp = "test";        // autoboxes, adds prop to TEMP wrapper
console.log(str.customProp);    // undefined ← wrapper was thrown away!
```

### The Primitive Wrapper Types Table (MDN)

| Primitive Type | `typeof` result | Wrapper Object |
|---|---|---|
| `null` | `"object"` ⚠️ | N/A |
| `undefined` | `"undefined"` | N/A |
| `boolean` | `"boolean"` | `Boolean` |
| `number` | `"number"` | `Number` |
| `bigint` | `"bigint"` | `BigInt` |
| `string` | `"string"` | `String` |
| `symbol` | `"symbol"` | `Symbol` |

> **Why this matters for passing arguments:** When you pass a string to a function and call `.toUpperCase()` inside, you are calling it on a temporary wrapper object. The original string variable is STILL immutable — no mutation is happening, even though it looks like method calls are modifying it.

```js
function shout(msg) {
  msg = msg.toUpperCase(); // creates a NEW string, reassigns local copy
  console.log(msg);        // "HELLO"
}

let greeting = "hello";
shout(greeting);
console.log(greeting); // "hello" — primitives are immutable, new string was created
```

> **Interview gotcha:** `typeof null === 'object'` is a historical bug in JS (from the original 1995 implementation). `null` is a primitive, not an object — but it passes the object identity check. Always use `=== null` to test for null.

---

## 4. The Deep Truth: JS Is ALWAYS "Pass by Value"

This is the **#1 misconception** about JavaScript. Let's be precise:

### What True "Pass by Reference" Would Mean (e.g., C++)

In a language with true pass-by-reference, the called function receives the actual *memory location of the caller's variable itself*. Reassigning the parameter would change the caller's variable.

```cpp
// C++ — true pass by reference
void changeAge(int &age) {
    age = 99;  // modifies the ORIGINAL variable in the caller
}
int myAge = 25;
changeAge(myAge);
// myAge is now 99
```

### What JavaScript Actually Does

JavaScript **never** does this. The function **always** gets a copy of the stack-slot value. For objects, that stack-slot value happens to be a heap address.

```
"Pass by Value of the Reference" — also called "Call by Sharing"

Primitive:   function gets copy of  [ actual data ]
Object:      function gets copy of  [ heap address → actual data ]
```

The term **"call by sharing"** (coined by Barbara Liskov, 1974) describes this precisely: the caller and callee share the same object, but the callee cannot make the caller's variable point to a different object.

```js
// Proof that JS is NOT true pass-by-reference
let a = 1;
let obj = { x: 1 };

function test(primitive, object) {
  primitive = 999;       // if JS were pass-by-reference, a would be 999
  object = { x: 999 };  // if JS were pass-by-reference, obj would be { x: 999 }
}

test(a, obj);
console.log(a);     // 1         ← not 999, so NOT pass-by-ref for primitives
console.log(obj.x); // 1         ← not 999, so NOT true pass-by-ref for objects either
```

---

## 4.5 The `arguments` Object — The Silent Sync Trap

Every non-arrow function has a built-in `arguments` array-like object. It creates a subtle interaction with pass-by-value that trips up many developers in interviews.

### `arguments` Is Synchronized With Parameters (Non-Strict Mode Only!)

MDN confirmed: in **non-strict** functions with **simple parameters** (no rest/default/destructuring), modifying `arguments[i]` **also updates the named parameter**, and vice versa.

```js
// NON-STRICT + SIMPLE PARAMS → bidirectional sync (the surprise!)
function sneakySync(a, b) {
  arguments[0] = 999;     // ← updates `a` too!
  console.log(a);         // 999 ← NOT 10! arguments synced!
  
  a = 777;                // ← also updates arguments[0]
  console.log(arguments[0]); // 777
}
sneakySync(10, 20);
```

```js
// NON-STRICT + DEFAULT PARAMS → sync is BROKEN
function noSync(a = 55) {
  arguments[0] = 999;     // does NOT update `a`
  console.log(a);         // 10 ← original value preserved
}
noSync(10);
```

```js
// STRICT MODE → arguments never syncs (always safe)
function strictMode(a) {
  "use strict";
  arguments[0] = 999;     // does NOT update `a`
  console.log(a);         // 10 ← safe
}
strictMode(10);
```

> **The fix:** Always use `"use strict"` OR use **rest parameters** (`...args`) instead of `arguments`. Rest parameters are a real `Array` (not array-like) and are never synchronized.

### `arguments` vs Rest Parameters

| Feature | `arguments` object | Rest parameters (`...args`) |
|---|---|---|
| Type | Array-like object | Real `Array` instance |
| Array methods | ❌ Must convert first | ✅ `.map()`, `.sort()`, `.filter()` etc. |
| Syncs with params | ⚠️ Yes (non-strict, simple) | ❌ No |
| Arrow functions | ❌ Not available | ✅ Available |
| Modern preference | ❌ Deprecated for new code | ✅ Recommended |
| `callee` property | ✅ (deprecated) | ❌ Not applicable |

```js
// arguments — old pattern (avoid in new code)
function oldSum() {
  const args = Array.prototype.slice.call(arguments); // need to convert!
  return args.reduce((a, b) => a + b, 0);
}

// rest parameters — modern pattern
function newSum(...nums) {
  return nums.reduce((a, b) => a + b, 0); // it's already a real Array!
}

newSum(1, 2, 3, 4); // 10
```

---

## 5. Practical Defense Patterns

When you want to prevent a function from mutating the original object, create a **copy** before passing or before modifying.

### Shallow Copy (sufficient for flat objects)

```js
// Option 1: Spread operator (ES2018)
function safeUpdate(person) {
  const copy = { ...person };  // shallow clone
  copy.name = "Modified";
  return copy;
}

// Option 2: Object.assign
function safeUpdate2(person) {
  const copy = Object.assign({}, person);
  copy.name = "Modified";
  return copy;
}

const alice = { name: "Alice", age: 25 };
const updated = safeUpdate(alice);
console.log(alice.name);   // "Alice"   ← untouched
console.log(updated.name); // "Modified"
```

> ⚠️ **Shallow copy limitation:** Nested objects are still shared! Both the copy and original point to the same nested object on the heap.

```js
const user = { name: "Alice", address: { city: "NYC" } };
const shallowCopy = { ...user };

shallowCopy.address.city = "LA"; // mutates the NESTED object — affects original too!
console.log(user.address.city);  // "LA" ← still affected!
```

### Deep Copy (for nested objects)

```js
// Option 1: structuredClone (modern, recommended — ES2022)
const deepCopy = structuredClone(user);
deepCopy.address.city = "Chicago";
console.log(user.address.city);     // "NYC" ← fully protected

// Option 2: JSON round-trip (quick but loses functions, Dates become strings, etc.)
const jsonCopy = JSON.parse(JSON.stringify(user));

// Option 3: Lodash _.cloneDeep (safest for complex objects)
// const lodashCopy = _.cloneDeep(user);
```

| Method | Nested Objects | Functions | Date Objects | Performance |
|---|---|---|---|---|
| `{ ...obj }` | ❌ shallow | ✅ kept | ✅ kept | ⚡ fastest |
| `Object.assign({}, obj)` | ❌ shallow | ✅ kept | ✅ kept | ⚡ fast |
| `structuredClone(obj)` | ✅ deep | ❌ stripped | ✅ proper Date | 🔶 moderate |
| `JSON.parse(JSON.stringify(obj))` | ✅ deep | ❌ stripped | ❌ becomes string | 🔶 moderate |
| `_.cloneDeep(obj)` | ✅ deep | ✅ kept | ✅ proper Date | 🔴 slowest |

### `structuredClone` Supports Circular References (ES2022+)

Unlike JSON round-trip, `structuredClone` handles objects that reference themselves:

```js
const original = { name: "MDN" };
original.itself = original; // circular reference

// JSON would throw: "Converting circular structure to JSON"
// structuredClone handles it:
const clone = structuredClone(original);

console.assert(clone !== original);        // different objects ✅
console.assert(clone.name === "MDN");      // same values ✅
console.assert(clone.itself === clone);    // circular ref preserved ✅
```

**Browser support:** Chrome 98+, Firefox 94+, Safari 15.4+, Node.js 17+ (ES2022).

---

### Object Integrity Levels — Beyond Cloning

When you want to make objects safe to pass without copying, use JS's built-in integrity levels. MDN describes these as "the highest integrity levels JavaScript provides".

```
Object Integrity Levels (from weakest to strongest):
┌──────────────────────────────────────────────────────────────────┐
│  Level                │ Add props? │ Delete props? │ Edit values? │
├───────────────────────┼────────────┼───────────────┼──────────────┤
│  Normal object        │ ✅         │ ✅            │ ✅           │
│  preventExtensions()  │ ❌         │ ✅            │ ✅           │
│  seal()               │ ❌         │ ❌            │ ✅           │
│  freeze()             │ ❌         │ ❌            │ ❌  (shallow) │
└──────────────────────────────────────────────────────────────────┘
```

```js
// Object.seal() — can edit existing props, cannot add/delete
const config = Object.seal({ timeout: 3000, retries: 3 });
config.timeout = 5000;    // ✅ editing allowed
config.newProp = "hi";    // ❌ silently ignored (throws in strict mode)
delete config.retries;    // ❌ silently ignored (throws in strict mode)
console.log(config);      // { timeout: 5000, retries: 3 }

// Object.freeze() — NOTHING can change (highest integrity)
const settings = Object.freeze({ debug: false, version: "1.0" });
settings.debug = true;    // ❌ silently ignored in non-strict mode
                          // ❌ throws TypeError in strict mode
console.log(settings.debug); // false ← unchanged
```

> **Critical gotcha: `Object.freeze()` is SHALLOW!** Nested objects are NOT frozen.

```js
const employee = Object.freeze({
  name: "Alice",
  address: { city: "NYC" }, // nested object is NOT frozen!
});

employee.name = "Bob";           // ❌ blocked by freeze
employee.address.city = "LA";   // ✅ succeeds! address is a separate heap object

console.log(employee.name);          // "Alice" ← protected
console.log(employee.address.city);  // "LA"    ← NOT protected!
```

### Deep Freeze Pattern (from MDN)

```js
function deepFreeze(object) {
  // Freeze all nested properties first
  for (const name of Reflect.ownKeys(object)) {
    const value = object[name];
    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value); // recurse
    }
  }
  return Object.freeze(object);
}

const config = deepFreeze({
  server: { host: "localhost", port: 3000 },
  debug: false,
});

config.server.port = 9999; // ❌ throws TypeError in strict mode
config.debug = true;        // ❌ throws TypeError in strict mode
```

> ⚠️ **Warning (from MDN):** Regular `function` declarations have a circular reference via `.prototype.constructor`, so `deepFreeze` can hit infinite recursion on them. Arrow functions are safe to deep freeze.

---

### Garbage Collection — What Happens to the Orphaned Object?

When a function reassigns an object parameter, it creates a "orphaned" heap object. The **mark-and-sweep** garbage collector (used by all modern JS engines) will eventually reclaim it.

```js
const myCar = { brand: "Toyota" }; // myCar → 0xF4A1 on heap

function replaceCar(car) {
  car = { brand: "BMW" }; // creates 0xB9D3 on heap
  // After function returns: 0xB9D3 has no references pointing to it
  // → Mark-and-sweep will collect it on next GC cycle
}

replaceCar(myCar);
// 0xB9D3 ({ brand: "BMW" }) is now unreachable — eligible for GC
// 0xF4A1 ({ brand: "Toyota" }) is still referenced by myCar → safe
```

The GC starts from **roots** (global object, active call stack) and marks everything reachable. Objects with zero reachable references are swept. This is why silent reassignment inside functions doesn't cause memory leaks — the orphaned object is naturally reclaimed.

---

## 🎯 Interview Questions & Model Answers

### Q1: "Is JavaScript pass by value or pass by reference?"

> **Model Answer:** JavaScript is **always pass by value**. However, when passing objects (including arrays and functions), the value being passed is a *reference* — a memory address pointing to the heap. This means the function can mutate the object's properties, but cannot make the caller's variable point to a different object. This is formally called **"call by sharing"**.

---

### Q2: "Can a function modify an object passed as an argument?"

> **Model Answer:** Yes — a function can **mutate** the properties of an object argument, because both the caller and the function share the same heap address. For example, `obj.name = "new"` inside a function will affect the original object. However, **reassigning** the parameter (`obj = newObj`) only affects the local parameter variable and does NOT change what the caller's variable points to.

---

### Q3: "What is the difference between mutation and reassignment in the context of function parameters?"

> **Model Answer:**
> - **Mutation** means changing a property of the object the parameter points to (e.g., `param.key = value`). Since both caller and function share the same heap object, this affects the original.
> - **Reassignment** means making the parameter variable point to a completely new object (e.g., `param = {}`). This only changes the local parameter (a new stack-slot copy), leaving the caller's variable untouched.

---

### Q4: "How would you prevent a function from modifying the original object?"

> **Model Answer:** Pass a copy of the object instead. For flat objects, use the spread operator (`{ ...obj }`) or `Object.assign({}, obj)`. For deeply nested objects, use `structuredClone(obj)` (ES2022) or `JSON.parse(JSON.stringify(obj))`. The choice depends on whether the object has nested structures and whether you need to preserve special types like `Date` or functions.

---

### Q5: "What happens when you pass a `const` object to a function?"

> **Model Answer:** `const` prevents *rebinding* of the variable — you cannot reassign it to a new object. But it does NOT make the object's properties immutable. So passing a `const` object to a function still allows the function to mutate its properties. If you truly need deep immutability, use `Object.freeze()` (shallow) or a library like Immer.

```js
const config = Object.freeze({ debug: false, timeout: 3000 });

function hackConfig(cfg) {
  cfg.debug = true;  // silently fails in strict mode, throws in strict mode
}

hackConfig(config);
console.log(config.debug); // false — freeze worked (shallow)
```

---

### Q6 (Tricky): "What does this output and why?"

```js
function process(a, b) {
  a = a + 10;
  b.value = b.value + 10;
  b = { value: 999 };
}

let num = 5;
let obj = { value: 5 };

process(num, obj);
console.log(num);       // ?
console.log(obj.value); // ?
```

> **Answer:**
> - `num` → `5` — primitive, `a = a + 10` is a local copy change only.
> - `obj.value` → `15` — `b.value = b.value + 10` mutates the shared heap object.
> - `b = { value: 999 }` does NOT affect `obj` — local reassignment only.

---

### Q7 (The Sync Trap): "What does this output?"

```js
function tricky(a) {
  arguments[0] = 999;
  console.log(a);
}
tricky(10); // ?
```

> **Answer:** `999` — In **non-strict mode** with **simple parameters**, `arguments[i]` is **bidirectionally synchronized** with the named parameter. Modifying `arguments[0]` ALSO changes `a`. This does NOT happen with default/rest/destructured params, or in strict mode. Modern code should use `"use strict"` or rest params to avoid this.

---

### Q8 (Freeze Gotcha): "Is the nested city protected?"

```js
const company = Object.freeze({
  name: "Acme",
  address: { city: "New York" },
});

function relocate(org) {
  org.name = "New Acme";           // attempt 1
  org.address.city = "London";    // attempt 2
}

relocate(company);
console.log(company.name);          // ?
console.log(company.address.city);  // ?
```

> **Answer:**
> - `company.name` → `"Acme"` — `Object.freeze()` blocked the top-level mutation.
> - `company.address.city` → `"London"` — **`freeze()` is shallow!** The `address` object is a separate heap object and was NOT frozen. Mutation of nested objects succeeds.
> - **Fix:** Use `deepFreeze()` or `structuredClone()` + `Object.freeze()` on the result.

---

### Q9 (autoboxing): "Why does this silently fail?"

```js
let str = "hello";
str.myProp = "world"; // no error?!
console.log(str.myProp); // ?
```

> **Answer:** `undefined` — When you do `str.myProp = "world"`, JS autoboxes `str` to a **temporary** `String` wrapper object, sets `.myProp` on that wrapper, then immediately discards it. The original `str` primitive is unchanged and immutable. Next access to `str.myProp` creates a NEW temporary wrapper (which has no `.myProp`), so you get `undefined`.

---

## 🔑 Key Takeaways Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│             JAVASCRIPT ARGUMENT PASSING — QUICK REFERENCE       │
├──────────────┬──────────────────────────────────────────────────┤
│ PRIMITIVE    │ Copy of value.                                    │
│              │ Changes inside function = local only.            │
│              │ Original NEVER affected.                         │
├──────────────┼──────────────────────────────────────────────────┤
│ OBJECT/ARRAY │ Copy of the reference (heap address).            │
│              │ Property mutation  → affects original ✅         │
│              │ Reassignment (=)   → local only ❌               │
├──────────────┼──────────────────────────────────────────────────┤
│ FUNCTION     │ Same as object (functions are objects).          │
│              │ Can be called/invoked ✅                          │
│              │ Adding properties mutates original ✅             │
│              │ Reassignment (=)   → local only ❌               │
├──────────────┼──────────────────────────────────────────────────┤
│ THE TRUTH    │ JS is ALWAYS pass-by-value.                      │
│              │ For objects, the "value" is a reference.         │
│              │ Technical term: "Call by Sharing"                │
└──────────────┴──────────────────────────────────────────────────┘
```

### Three Questions to Ask When Debugging "Did My Object Change?"

1. Did the function **mutate a property** (`obj.x = ...`)? → Original changed.
2. Did the function **reassign the parameter** (`obj = ...`)? → Original unchanged.
3. Did the function use a **spread/clone**? → Safe, original protected.

---

## 6. Bonus: TypeScript `readonly` and Immutable Parameter Types

TypeScript gives you compile-time enforcement of the patterns above. Understanding `readonly` is a major plus in interviews at companies using TypeScript.

```typescript
// readonly prevents property mutation at compile time
interface Car {
  readonly brand: string;
  model: string;
}

function updateCar(car: Car) {
  car.model = "Tesla";    // ✅ model is mutable
  car.brand = "BMW";      // ❌ TypeScript error: Cannot assign to 'brand'
                          //    because it is a read-only property
}

// Readonly<T> utility type — makes ALL properties readonly
function displayUser(user: Readonly<{ name: string; age: number }>) {
  user.name = "Bob"; // ❌ TypeScript error at compile time!
}
```

```typescript
// ReadonlyArray<T> prevents array mutation
function processItems(items: ReadonlyArray<string>) {
  items.push("new item"); // ❌ TypeScript error
  items[0] = "changed";  // ❌ TypeScript error
  console.log(items[0]); // ✅ reading is fine
}
```

> **Note:** `readonly` and `Readonly<T>` are **compile-time only** — they compile away to plain JS. At runtime, the object is still mutable unless you also use `Object.freeze()`. Use both together for bulletproof immutability.

---

## 📚 Further Reading

- MDN: [Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- MDN: [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- MDN: [`Object.freeze()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- MDN: [`Object.seal()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
- MDN: [The `arguments` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
- MDN: [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- MDN: [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- MDN: [Memory management (Mark-and-sweep GC)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- ECMAScript Spec: [Pass by value (12.3.4 Argument Lists)](https://tc39.es/ecma262/#sec-argument-lists)
- Barbara Liskov, "Call by sharing" — CLU language design, 1974

---

*Notes from: Jonas Schmedtmann — The Complete JavaScript Course 2025 | Section 10, Lecture 136*
