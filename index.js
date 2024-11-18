const express = require('express');
const { resolve } = require('path');

const app = express();
let cors = require('cors');
app.use(cors());
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.get('/tasks', (req, res) => {
  res.json({ tasks });
});

function addTask(tasks, taskId, text, priority) {
  tasks.push({ taskId, text, priority });
}

app.get('/tasks/add', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const text = req.query.text;
  const priority = parseInt(req.query.priority);
  addTask(tasks, taskId, text, priority);
  res.json({ tasks });
});

function sortPriorityAscending(task1, task2) {
  return task1.priority - task2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  tasks.sort(sortPriorityAscending);
  res.json({ tasks });
});

function editPriority(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
    }
  }
}

app.get('/tasks/edit-priority', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const priority = parseInt(req.query.priority);
  editPriority(tasks, taskId, priority);
  res.json({ tasks });
});

function editText(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
    }
  }
}

app.get('/tasks/edit-text', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const text = req.query.text;
  editText(tasks, taskId, text);
  res.json({ tasks });
});

function deleteTaskById(task, taskId) {
  return task.taskId !== taskId;
}

app.get('/tasks/delete', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const result = tasks.filter((task) => deleteTaskById(task, taskId));
  tasks = result;
  res.json({ tasks });
});

app.get('/tasks/filter-by-priority', (req, res) => {
  const priority = parseInt(req.query.priority);
  const result = tasks.filter((task) => task.priority === priority);
  res.json({ tasks: result });
});
