const fs = require("node:fs");
const filePath = "./tasks.json";

function loadTasks() {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
}

function saveTasks(newTasks) {
    const dataJSON = JSON.stringify(newTasks, null, 2);
    fs.writeFileSync(filePath, dataJSON);
}

function addTask(task) {
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task "${task}" added!`);
}

function listTasks() {
    tasks.forEach((task, index) => {
        console.log(`Task ${index + 1}: ${task}`);
    });
}

function removeTask(index) {
    index -= 1;
    if (index < 0 || index >= tasks.length) {
        console.log("Invalid task number!");
        return;
    }
    const removedTask = tasks.splice(index, 1);
    saveTasks(tasks);
    console.log(`Task "${removedTask}" removed!`);
}

const command = process.argv[2];
const argument = process.argv[3];
const tasks = loadTasks();

if (command === "add") {
    addTask(argument);
} else if (command === "list") {
    listTasks();
} else if (command === "remove") {
    removeTask(parseInt(argument));
} else {
    console.log("Command not found!");
}
