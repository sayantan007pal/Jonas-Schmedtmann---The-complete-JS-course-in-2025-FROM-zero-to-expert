# Asynchronous JavaScript, AJAX, and APIs - Comprehensive Interview Notes

> **Target Audience:** Final Year CSE Students preparing for Technical Interviews
> **Goal:** Deep understanding with real-world analogies and production-ready code examples

---

## Table of Contents
1. [Synchronous Code](#1-synchronous-code)
2. [Asynchronous Code](#2-asynchronous-code)
3. [Callbacks Don't Automatically Make Code Asynchronous](#3-callbacks-dont-automatically-make-code-asynchronous)
4. [AJAX - Asynchronous JavaScript And XML](#4-ajax---asynchronous-javascript-and-xml)
5. [AJAX with JSON Data Format](#5-ajax-with-json-data-format)
6. [Interview Questions & Answers](#6-interview-questions--answers)

---

## 1. Synchronous Code

### What is Synchronous Code?

**Synchronous code** executes **line by line, one statement at a time, in the exact order it's written**. Each line waits for the previous line to complete before it starts executing.

### 🍳 Real-World Analogy: The Single Chef in a Kitchen

Imagine you're a **single chef** cooking breakfast:
1. First, you **boil water** for tea → Wait until water boils (3 mins)
2. Then, you **make toast** → Wait until toast is ready (2 mins)
3. Finally, you **fry eggs** → Wait until eggs are done (4 mins)

**Total time: 9 minutes** because you do everything sequentially, waiting for each task to complete.

### Code Example

```javascript
// ============================================
// SYNCHRONOUS CODE - Executes Line by Line
// ============================================

const name = "Sayantan";
const greeting = `Hello, my name is ${name}!`;
console.log(greeting);
// Output: "Hello, my name is Sayantan!"

// JavaScript engine processes this as:
// Step 1: Declare variable 'name' with value "Sayantan" ✓
// Step 2: Declare variable 'greeting' using 'name' ✓
// Step 3: Log 'greeting' to console ✓
```

### Synchronous Function Example

```javascript
function makeGreeting(name) {
    return `Hello, my name is ${name}!`;
}

const name = "Miriam";
const greeting = makeGreeting(name);  // Caller WAITS for this to complete
console.log(greeting);
// Output: "Hello, my name is Miriam!"
```

**Key Point:** The caller **WAITS** for `makeGreeting()` to finish its work and return a value before continuing.

### ⚠️ The Problem: Blocking the Main Thread

```javascript
// ============================================
// LONG-RUNNING SYNCHRONOUS FUNCTION
// This BLOCKS everything else!
// ============================================

function generatePrimes(quota) {
    const primes = [];
    const MAX_PRIME = 1000000;
    
    function isPrime(n) {
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return n > 1;
    }
    
    while (primes.length < quota) {
        const candidate = Math.floor(Math.random() * MAX_PRIME);
        if (isPrime(candidate)) {
            primes.push(candidate);
        }
    }
    return primes;
}

// When this runs, NOTHING ELSE can happen!
console.log("Starting...");
const primes = generatePrimes(100000);  // ⚠️ UI freezes here!
console.log("Done!");

// During prime generation:
// ❌ User can't click buttons
// ❌ User can't type in input fields
// ❌ Animations freeze
// ❌ Page becomes unresponsive
```

### 📊 Visual Representation of Synchronous Execution

```
Timeline → [Task A] → [Task B] → [Task C] → [Task D]
                ↑
           Each task MUST complete before the next starts
           
Main Thread:
|----Task A----|----Task B----|----Task C----|----Task D----|
0ms           100ms          200ms          300ms          400ms
```

### Summary: Synchronous Code Characteristics

| Characteristic | Description |
|---------------|-------------|
| **Execution Order** | Line by line, top to bottom |
| **Blocking** | Each operation blocks the next |
| **Thread Usage** | Runs on single main thread |
| **Predictability** | Easy to understand and debug |
| **Problem** | Long operations freeze the UI |

---

## 2. Asynchronous Code

### What is Asynchronous Code?

**Asynchronous code** allows your program to **start a potentially long-running task and still remain responsive** to other events while that task runs in the background.

### 🍳 Real-World Analogy: The Smart Chef with Helpers

Now imagine you're a **smart chef with kitchen helpers**:
1. You tell Helper 1: "Start boiling water" → Helper starts, you move on
2. You tell Helper 2: "Make toast" → Helper starts, you move on  
3. You start frying eggs yourself
4. When water boils, Helper 1 says "Water ready!" → You make tea
5. When toast is done, Helper 2 says "Toast ready!" → You butter it

**Total time: ~4-5 minutes** because tasks run in parallel!

### Why Do We Need Asynchronous Programming?

**JavaScript is SINGLE-THREADED** - it can only do one thing at a time. Without async:
- Making an API call would freeze the browser for seconds
- Loading images would block user interactions
- File operations would make the page unresponsive

### Common Asynchronous Operations in JavaScript

```javascript
// ============================================
// EXAMPLES OF ASYNC OPERATIONS
// ============================================

// 1. Network Requests (most common!)
fetch('https://api.github.com/users/octocat')
    .then(response => response.json())
    .then(data => console.log(data));

// 2. Timers
setTimeout(() => {
    console.log("This runs after 2 seconds");
}, 2000);

// 3. File System Operations (Node.js)
fs.readFile('data.txt', 'utf8', (err, data) => {
    console.log(data);
});

// 4. User Media Access
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => console.log("Camera access granted!"));

// 5. Geolocation
navigator.geolocation.getCurrentPosition(
    position => console.log(position.coords),
    error => console.error(error)
);
```

### 📊 Visual Representation of Asynchronous Execution

```
Main Thread:
|--Start Fetch--|--Other Code--|--Handle Response--|
       ↓
       └──→ [Network Request happening in background] ──→ Response Ready!
       
Timeline:
0ms: fetch() called, request starts in background
1ms: JavaScript continues executing next lines  ← Non-blocking!
...
500ms: Response arrives
501ms: .then() callback executes with response data
```

### The Event Loop: How Async Actually Works

```javascript
// ============================================
// UNDERSTANDING THE EVENT LOOP
// ============================================

console.log("1. Start");

setTimeout(() => {
    console.log("2. Timeout callback");
}, 0);  // Even with 0ms delay!

Promise.resolve().then(() => {
    console.log("3. Promise callback");
});

console.log("4. End");

// Output Order:
// 1. Start
// 4. End
// 3. Promise callback  (Microtask queue - higher priority)
// 2. Timeout callback  (Macrotask queue - lower priority)
```

### 🎯 Key Components of JavaScript Runtime

```
┌─────────────────────────────────────────────────────────┐
│                    JavaScript Runtime                    │
├───────────────────┬─────────────────────────────────────┤
│   CALL STACK      │         WEB APIs (Browser)          │
│   ┌─────────┐     │   ┌──────────────────────────────┐  │
│   │ func()  │     │   │ • setTimeout()               │  │
│   │ main()  │ ──→ │   │ • fetch()                    │  │
│   └─────────┘     │   │ • DOM Events                 │  │
│                   │   │ • XMLHttpRequest             │  │
│                   │   └──────────────────────────────┘  │
├───────────────────┴─────────────────────────────────────┤
│                     CALLBACK QUEUE                       │
│   ┌─────────────────────────────────────────────────┐   │
│   │  Microtask Queue: Promise callbacks (higher)    │   │
│   │  Macrotask Queue: setTimeout, events (lower)    │   │
│   └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│   EVENT LOOP: Constantly checks if Call Stack is empty  │
│             If empty → moves callbacks to Call Stack    │
└─────────────────────────────────────────────────────────┘
```

### Summary: Asynchronous Code Characteristics

| Characteristic | Description |
|---------------|-------------|
| **Execution** | Non-blocking, runs in background |
| **Response** | Uses callbacks/promises when complete |
| **Thread** | Main thread stays free |
| **Use Cases** | Network requests, timers, file I/O |
| **Benefit** | Responsive UI, better user experience |

---

## 3. Callbacks Don't Automatically Make Code Asynchronous

### 🚨 CRITICAL INTERVIEW CONCEPT 🚨

> **Just because you use a callback function doesn't mean your code is asynchronous!**

This is one of the **most misunderstood concepts** in JavaScript. Let's break it down:

### What Makes Code Asynchronous?

Code becomes asynchronous only when it involves:
1. **Web APIs** (setTimeout, fetch, XMLHttpRequest, DOM events)
2. **Node.js async APIs** (fs.readFile, http requests)
3. **Promises** (which internally use async mechanisms)

**A callback is just a function passed to another function** - nothing more!

### 🔴 Example: SYNCHRONOUS Callbacks

```javascript
// ============================================
// SYNCHRONOUS CALLBACKS - NOT ASYNC!
// ============================================

// Example 1: Array methods with callbacks - SYNCHRONOUS!
const numbers = [1, 2, 3, 4, 5];

console.log("Before forEach");

numbers.forEach((num) => {
    console.log(num);  // This callback runs SYNCHRONOUSLY
});

console.log("After forEach");

// Output (IN ORDER - proves it's synchronous):
// Before forEach
// 1
// 2
// 3
// 4
// 5
// After forEach


// Example 2: Custom function with callback - STILL SYNCHRONOUS!
function processData(data, callback) {
    // This is just regular function execution
    const processed = data.toUpperCase();
    callback(processed);  // Called immediately, synchronously
}

console.log("Start");
processData("hello", (result) => {
    console.log("Processed:", result);
});
console.log("End");

// Output (IN ORDER - proves it's synchronous):
// Start
// Processed: HELLO
// End
```

### 🟢 Example: ASYNCHRONOUS Callbacks

```javascript
// ============================================
// ASYNCHRONOUS CALLBACKS - TRUE ASYNC!
// ============================================

// Example 1: setTimeout - Asynchronous because of Web API
console.log("Start");

setTimeout(() => {
    console.log("Timeout callback");  // Runs LATER
}, 0);

console.log("End");

// Output (OUT OF ORDER - proves it's async):
// Start
// End
// Timeout callback


// Example 2: Event Listener - Asynchronous
console.log("Start");

document.addEventListener('click', () => {
    console.log("Click happened!");  // Runs LATER when event occurs
});

console.log("End");

// Output immediately:
// Start
// End
// (Click happened! - only when user clicks)


// Example 3: XMLHttpRequest - Asynchronous
console.log("Start");

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', () => {
    console.log("Data loaded!");  // Runs LATER when request completes
});
xhr.open('GET', 'https://api.github.com/users');
xhr.send();

console.log("End");

// Output:
// Start
// End
// Data loaded!  (later, when network request completes)
```

### 🎯 The Deciding Factor

```javascript
// ============================================
// WHAT MAKES THE DIFFERENCE?
// ============================================

// ❌ NOT ASYNC - Just a callback
function calculate(a, b, callback) {
    const result = a + b;
    callback(result);  // Called immediately in the same tick
}

// ✅ ASYNC - Uses Web API (setTimeout)
function calculateAsync(a, b, callback) {
    setTimeout(() => {
        const result = a + b;
        callback(result);  // Called in a future tick via event loop
    }, 0);
}

// Test
console.log("1. Before");

calculate(5, 3, (result) => {
    console.log("2. Sync result:", result);
});

console.log("3. After sync");

calculateAsync(5, 3, (result) => {
    console.log("5. Async result:", result);
});

console.log("4. After async");

// Output:
// 1. Before
// 2. Sync result: 8       ← Called immediately (sync)
// 3. After sync
// 4. After async
// 5. Async result: 8      ← Called later (async)
```

### 📋 Quick Reference: Sync vs Async Callbacks

| Callback Type | Example | Is Async? | Why? |
|--------------|---------|-----------|------|
| `array.forEach(cb)` | forEach, map, filter | ❌ No | No Web API involved |
| `array.sort(cb)` | Comparison function | ❌ No | No Web API involved |
| `customFn(cb)` | Your own function | ❌ No | Unless you add async mechanism |
| `setTimeout(cb, ms)` | Timer callback | ✅ Yes | Uses Timer Web API |
| `element.addEventListener(cb)` | Event handler | ✅ Yes | Uses DOM Events API |
| `xhr.onload = cb` | XHR callback | ✅ Yes | Uses XMLHttpRequest API |
| `fetch().then(cb)` | Promise callback | ✅ Yes | Uses Fetch API |
| `fs.readFile(path, cb)` | Node.js file read | ✅ Yes | Uses Node.js async I/O |

### 💡 Interview Answer Template

> **"A callback is just a function passed to another function. It becomes asynchronous only when the parent function uses Web APIs like setTimeout, fetch, XMLHttpRequest, or Node.js async APIs. Array methods like forEach, map, and filter use callbacks but execute them synchronously, blocking the main thread until completion."**

---

## 4. AJAX - Asynchronous JavaScript And XML

### What is AJAX?

**AJAX** = **A**synchronous **J**avaScript **A**nd **X**ML

AJAX is a technique that allows web pages to **communicate with servers asynchronously** — meaning you can **update parts of a webpage without reloading the entire page**.

### 🌐 Real-World Analogy: The Efficient Waiter

**Without AJAX (Traditional Web):**
Imagine a restaurant where every time you want more water, the waiter has to:
1. Clear your entire table
2. Take you outside the restaurant
3. Bring you back in and set up everything again
4. Finally give you water

**With AJAX (Modern Web):**
The waiter simply walks over and refills your water glass. Everything else on your table stays exactly as it was!

### The Problem AJAX Solves

```
TRADITIONAL PAGE LOAD:
┌─────────────────┐     Request      ┌──────────────────┐
│   Browser       │ ──────────────→  │    Server        │
│   (Old Page)    │                  │                  │
│                 │ ←──────────────  │                  │
│   (New Page)    │     Full HTML    │                  │
└─────────────────┘     Response     └──────────────────┘
   ↑ Entire page reloads - slow and wasteful!


WITH AJAX:
┌─────────────────┐     Request      ┌──────────────────┐
│   Browser       │ ──────────────→  │    Server        │
│   (Same Page)   │    (just data)   │                  │
│                 │ ←──────────────  │                  │
│ (Updated part)  │   Only needed    │                  │
└─────────────────┘      data        └──────────────────┘
   ↑ Only the changed section updates - fast and efficient!
```

### Benefits of AJAX

| Benefit | Description |
|---------|-------------|
| **Speed** | Only transfer needed data, not entire page |
| **User Experience** | No page flicker, seamless updates |
| **Bandwidth** | Less data transferred |
| **Interactivity** | Real-time updates possible |

### XMLHttpRequest (XHR) - The Original AJAX

```javascript
// ============================================
// CLASSIC XMLHttpRequest IMPLEMENTATION
// ============================================

// Step 1: Create XHR object
const xhr = new XMLHttpRequest();

// Step 2: Set up callback for when request completes
xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
        console.log("Success!", xhr.responseText);
    } else {
        console.log("Error:", xhr.status);
    }
});

// Step 3: Set up error handler
xhr.addEventListener('error', function() {
    console.log("Request failed!");
});

// Step 4: Configure the request (method, URL, async)
xhr.open('GET', 'https://api.github.com/users/octocat', true);

// Step 5: Send the request
xhr.send();

console.log("Request sent, but this runs immediately!");
// This proves it's asynchronous - doesn't wait for response
```

### XHR with Different HTTP Methods

```javascript
// ============================================
// XHR WITH POST REQUEST
// ============================================

const xhr = new XMLHttpRequest();

xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', true);

// Set request headers for JSON data
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
    if (xhr.status === 201) {  // 201 = Created
        console.log("Post created:", JSON.parse(xhr.responseText));
    }
};

// Send JSON data
const postData = JSON.stringify({
    title: 'My New Post',
    body: 'This is the content',
    userId: 1
});

xhr.send(postData);
```

### XHR Ready States

```javascript
// ============================================
// UNDERSTANDING XHR READY STATES
// ============================================

const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    console.log("Ready State:", xhr.readyState);
    
    /*
    readyState values:
    0 - UNSENT: XHR object created, open() not called
    1 - OPENED: open() has been called
    2 - HEADERS_RECEIVED: send() called, headers received
    3 - LOADING: Downloading response, responseText has partial data
    4 - DONE: Operation complete
    */
    
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Request complete and successful!");
        console.log(xhr.responseText);
    }
};

xhr.open('GET', 'https://api.github.com/users/octocat');
xhr.send();

// Output:
// Ready State: 1 (OPENED)
// Ready State: 2 (HEADERS_RECEIVED)
// Ready State: 3 (LOADING)
// Ready State: 4 (DONE)
// Request complete and successful!
```

### Modern Alternative: Fetch API

```javascript
// ============================================
// MODERN FETCH API (Recommended)
// ============================================

// Basic GET request
fetch('https://api.github.com/users/octocat')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("User data:", data);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

// Using async/await (even cleaner!)
async function getUser() {
    try {
        const response = await fetch('https://api.github.com/users/octocat');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("User data:", data);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

getUser();
```

### XHR vs Fetch Comparison

| Feature | XMLHttpRequest | Fetch API |
|---------|----------------|-----------|
| **Syntax** | Complex, verbose | Simple, clean |
| **Promises** | Uses callbacks | Returns Promise |
| **Error Handling** | Manual status checks | Manual (non-2xx doesn't throw) |
| **Request Abortion** | xhr.abort() | AbortController |
| **Progress Events** | Yes (onprogress) | No native support |
| **Browser Support** | All browsers | Modern browsers |

---

## 5. AJAX with JSON Data Format

### What is JSON?

**JSON** = **J**ava**S**cript **O**bject **N**otation

JSON is a **lightweight data-interchange format** that's:
- Easy for humans to read and write
- Easy for machines to parse and generate
- Language-independent (works with any programming language)

### 📦 Analogy: JSON as a Universal Shipping Box

Think of JSON as a **standardized shipping box** that everyone uses:
- No matter what's inside (clothes, books, electronics)
- The box format is always the same
- Any shipping company can handle it
- Anyone can open it and understand the contents

### JSON Syntax Rules

```javascript
// ============================================
// JSON SYNTAX - WHAT'S VALID
// ============================================

// ✅ VALID JSON
{
    "name": "Sayantan",           // Strings MUST use double quotes
    "age": 22,                     // Numbers (no quotes)
    "isStudent": true,             // Boolean (true/false, no quotes)
    "skills": ["JavaScript", "React", "Node.js"],  // Arrays
    "address": {                   // Nested objects
        "city": "Kolkata",
        "country": "India"
    },
    "mentor": null                 // null value
}

// ❌ INVALID JSON
{
    name: "Sayantan",              // ❌ Keys MUST have double quotes
    'age': 22,                     // ❌ Single quotes not allowed
    "comment": 'Great!',           // ❌ Single quotes for values not allowed
    "date": new Date(),            // ❌ Functions/constructors not allowed
    "method": function() {},       // ❌ Functions not allowed
    "value": undefined,            // ❌ undefined not allowed
}
```

### Converting Between JavaScript Objects and JSON

```javascript
// ============================================
// JSON.stringify() - Object to JSON string
// ============================================

const user = {
    name: "Sayantan",
    age: 22,
    skills: ["JavaScript", "React"],
    isEmployed: true
};

const jsonString = JSON.stringify(user);
console.log(jsonString);
// Output: '{"name":"Sayantan","age":22,"skills":["JavaScript","React"],"isEmployed":true}'

// Pretty print with indentation
const prettyJson = JSON.stringify(user, null, 2);
console.log(prettyJson);
/*
{
  "name": "Sayantan",
  "age": 22,
  "skills": [
    "JavaScript",
    "React"
  ],
  "isEmployed": true
}
*/


// ============================================
// JSON.parse() - JSON string to Object
// ============================================

const jsonData = '{"name":"Sayantan","age":22,"city":"Kolkata"}';
const userObject = JSON.parse(jsonData);

console.log(userObject.name);  // "Sayantan"
console.log(userObject.age);   // 22
console.log(userObject.city);  // "Kolkata"


// ⚠️ Error Handling with JSON.parse()
try {
    const badJson = "{ name: 'test' }";  // Invalid JSON
    const result = JSON.parse(badJson);
} catch (error) {
    console.error("Invalid JSON:", error.message);
    // Output: Invalid JSON: Unexpected token n in JSON at position 2
}
```

### AJAX Request with JSON Response (XHR)

```javascript
// ============================================
// XHR WITH JSON RESPONSE
// ============================================

function fetchUserData(userId) {
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', `https://jsonplaceholder.typicode.com/users/${userId}`, true);
    
    // Tell server we expect JSON
    xhr.setRequestHeader('Accept', 'application/json');
    
    // Automatically parse JSON response
    xhr.responseType = 'json';
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            // xhr.response is already a JavaScript object!
            const user = xhr.response;
            console.log("User Name:", user.name);
            console.log("Email:", user.email);
            console.log("Company:", user.company.name);
        }
    };
    
    xhr.onerror = function() {
        console.error("Network error occurred");
    };
    
    xhr.send();
}

fetchUserData(1);
```

### AJAX Request with JSON Response (Fetch API)

```javascript
// ============================================
// FETCH API WITH JSON - THE MODERN WAY
// ============================================

// Method 1: Using .then() chains
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        // Check if response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse JSON body (returns another Promise)
        return response.json();
    })
    .then(users => {
        // Now 'users' is a JavaScript array
        users.forEach(user => {
            console.log(`${user.name} - ${user.email}`);
        });
    })
    .catch(error => {
        console.error("Error fetching users:", error);
    });


// Method 2: Using async/await (Recommended for readability)
async function fetchAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const users = await response.json();
        
        console.log("Total users:", users.length);
        return users;
        
    } catch (error) {
        console.error("Error:", error.message);
        throw error;  // Re-throw for caller to handle
    }
}

// Usage
fetchAllUsers().then(users => {
    console.log("First user:", users[0].name);
});
```

### Sending JSON Data in POST Request

```javascript
// ============================================
// POST REQUEST WITH JSON BODY
// ============================================

async function createPost(postData) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Tell server we're sending JSON
                'Accept': 'application/json'          // Tell server we want JSON back
            },
            body: JSON.stringify(postData)  // Convert object to JSON string
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const createdPost = await response.json();
        console.log("Created post:", createdPost);
        return createdPost;
        
    } catch (error) {
        console.error("Error creating post:", error.message);
    }
}

// Usage
const newPost = {
    title: "Learning AJAX",
    body: "AJAX with JSON is powerful!",
    userId: 1
};

createPost(newPost);
// Output: Created post: { id: 101, title: "Learning AJAX", ... }
```

### Real-World Example: Building a User Card

```javascript
// ============================================
// PRACTICAL EXAMPLE: DYNAMIC USER CARDS
// ============================================

async function displayUserCard(userId) {
    const container = document.getElementById('user-container');
    
    try {
        // Show loading state
        container.innerHTML = '<p>Loading user data...</p>';
        
        // Fetch user data
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        
        if (!response.ok) {
            throw new Error("User not found");
        }
        
        const user = await response.json();
        
        // Build and display user card
        container.innerHTML = `
            <div class="user-card">
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Company:</strong> ${user.company.name}</p>
                <p><strong>Website:</strong> 
                    <a href="https://${user.website}">${user.website}</a>
                </p>
                <p><strong>Address:</strong> 
                    ${user.address.street}, ${user.address.city}
                </p>
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = `
            <div class="error">
                <p>Error: ${error.message}</p>
                <button onclick="displayUserCard(${userId})">Retry</button>
            </div>
        `;
    }
}

// Load user card when page loads
displayUserCard(1);
```

### Working with API that Returns Multiple Resources

```javascript
// ============================================
// FETCHING MULTIPLE RESOURCES IN PARALLEL
// ============================================

async function fetchDashboardData() {
    try {
        // Start all requests simultaneously
        const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users'),
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/comments')
        ]);
        
        // Check all responses
        if (!usersResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
            throw new Error("One or more requests failed");
        }
        
        // Parse all JSON responses
        const [users, posts, comments] = await Promise.all([
            usersResponse.json(),
            postsResponse.json(),
            commentsResponse.json()
        ]);
        
        // Return combined data
        return {
            users,
            posts,
            comments,
            stats: {
                totalUsers: users.length,
                totalPosts: posts.length,
                totalComments: comments.length
            }
        };
        
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        throw error;
    }
}

// Usage
fetchDashboardData().then(data => {
    console.log("Dashboard Stats:", data.stats);
    // { totalUsers: 10, totalPosts: 100, totalComments: 500 }
});
```

---

## 6. Interview Questions & Answers

### Q1: What is the difference between synchronous and asynchronous code?

**Answer:**
> "Synchronous code executes line by line, blocking execution until each operation completes. Asynchronous code allows operations to run in the background while the main thread continues execution, notifying completion through callbacks, promises, or events. For example, `forEach` is synchronous - it blocks until all iterations complete. `fetch` is asynchronous - the code continues while the network request happens in the background."

### Q2: Does using a callback make code asynchronous?

**Answer:**
> "No! A callback is just a function passed to another function. Code becomes asynchronous only when it uses Web APIs like setTimeout, fetch, XMLHttpRequest, or Node.js async APIs. Array methods like `map`, `filter`, and `forEach` use callbacks but execute synchronously, blocking the main thread."

### Q3: What is AJAX and why is it important?

**Answer:**
> "AJAX stands for Asynchronous JavaScript And XML. It's a technique that allows web pages to request data from servers without reloading the entire page. This creates faster, more responsive user experiences. Despite the name, modern AJAX typically uses JSON instead of XML for data interchange."

### Q4: Explain the difference between XMLHttpRequest and Fetch API.

**Answer:**
> "XMLHttpRequest is the older API using callbacks and events for handling async requests. Fetch is the modern replacement that returns Promises, making it cleaner with `async/await`. Fetch has simpler syntax but doesn't reject on HTTP error status codes - you must check `response.ok`. XHR has better support for progress events and upload tracking."

### Q5: What is JSON and how do you convert between JSON and JavaScript objects?

**Answer:**
> "JSON (JavaScript Object Notation) is a text-based data interchange format. To convert a JavaScript object to JSON string, use `JSON.stringify(object)`. To convert a JSON string back to an object, use `JSON.parse(jsonString)`. Always wrap `JSON.parse` in try-catch as it throws an error for invalid JSON."

### Q6: How does the Event Loop handle asynchronous operations?

**Answer:**
> "JavaScript has a single call stack for synchronous code. When an async operation starts, it's handed to the browser's Web APIs. When complete, the callback goes to the task queue. The Event Loop continuously checks if the call stack is empty - if so, it moves callbacks from the queue to the stack. Microtasks (Promises) have higher priority than macrotasks (setTimeout)."

---

## 🎯 Quick Revision Checklist

- [ ] Synchronous code blocks, executes line-by-line
- [ ] Asynchronous code is non-blocking, uses callbacks/promises
- [ ] Callbacks ≠ Asynchronous (need Web APIs for true async)
- [ ] AJAX = Async communication with servers without page reload
- [ ] JSON is the standard format for data exchange
- [ ] `JSON.stringify()` - Object → JSON string
- [ ] `JSON.parse()` - JSON string → Object
- [ ] Fetch API returns Promises, cleaner than XHR
- [ ] Always handle errors in async operations
- [ ] Event Loop manages async callback execution

---

**Last Updated:** March 2026  
**References:**
- [MDN - Introducing Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)
- [MDN - Making Network Requests](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)
- [JavaScript.info - Callbacks](https://javascript.info/callbacks)
