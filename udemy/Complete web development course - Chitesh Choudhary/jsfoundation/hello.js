function Animal() {}

Animal.prototype.makeSound = function () {
    return "Animal sound";
};

function Dog() {}

// Inherit from Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
    return "Woof!";
};

// Task 2
function Shape(color) {
    this.color = color;
}

Shape.prototype.getColor = function () {
    return this.color;
};

function Rectangle(width, height, color) {
    Shape.call(this, color);
    this.width = width;
    this.height = height;
}

// Inherit from Shape
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function () {
    return this.width * this.height;
};

function createCounter() {
    let counter = 0;

    return function () {
        counter += 1;
        return counter;
    };
}

function rateLimiter(fn, limit) {
    let available = true;

    return function (...args) {
        if (available) {
            available = false;
            setTimeout(() => {
                available = true;
            }, limit);
            return fn(...args);
        } else {
            return "Rate limit exceeded";
        }
    };
}

function memoize(fn) {
    const memory = {};

    return function (...args) {
        if (!(JSON.stringify(args) in memory)) {
            memory[JSON.stringify(args)] = fn(...args);
        }
        return memory[JSON.stringify(args)];
    };
}

function simulateAsyncTask() {
    console.log("Task started");
    setTimeout(function () {
        console.log("Task finished");
    }, 2);
}

function simulateMultipleTasks() {
    function time(t) {
        setTimeout(function () {
            console.log(`Task ${t} finished`);
        }, t * 1000);
    }

    for (var i = 1; i <= 3; i++) {
        time(i);
    }
}

async function fetchDataWithCallback(callback) {
    let prom = new Promise((resolve) => {
        setTimeout(function () {
            return resolve(callback("Fetched data"));
        }, 2000);
    });

    try {
        let result = await prom;
        return prom;
    } catch (e) {
        console.log(e);
    }
}

// Task 1
function fetchUser() {
    return new Promise((resolve) =>
        setTimeout(() => resolve("User data"), 1000)
    );
}

function fetchPosts() {
    return new Promise((resolve) =>
        setTimeout(() => resolve("Posts data"), 1000)
    );
}

async function fetchAllData() {
    const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
    console.log(user);
    console.log(posts);
}

// Task 2
function fetchSuccess() {
    return new Promise((resolve) => {
        setTimeout(function () {
            return resolve("Success");
        }, 1000);
    });
}

function fetchFailure() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            return reject("Error occurred");
        }, 1000);
    });
}

async function handlePromises() {
    try {
        const [success, failure] = await Promise.all([
            fetchSuccess(),
            fetchFailure(),
        ]);
        console.log(success);
    } catch (error) {
        console.log(error);
    }
}

// Task 3
function fetchWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(function () {
            reject("Timeout exceeded");
        }, timeout);
    });
    return Promise.race([promise, timeoutPromise]);
}

function fetchData() {
    return new Promise((resolve) =>
        setTimeout(() => resolve("Data fetched"), 3000)
    );
}
