// Получаем элементы
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dueDate = document.getElementById('due-date');
const taskList = document.getElementById('task-list');

// Загружаем задачи из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);

// Обработчик отправки формы
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const task = taskInput.value;
    const date = dueDate.value;

    if (task && date) {
        addTask(task, date);
        taskInput.value = '';
        dueDate.value = '';
    }
});

// Функция добавления задачи
function addTask(task, date, completed = false) {
    const li = document.createElement('li');
    li.classList.add('task');

    const taskText = document.createElement('span');
    taskText.textContent = `${task} (Due: ${new Date(date).toLocaleDateString()})`;
    if (completed) {
        taskText.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
        taskText.classList.toggle('completed');
        saveTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" 
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" 
        stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>`;
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    saveTasks();
}

// Сохраняем задачи в localStorage
function saveTasks() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll('li');

    taskItems.forEach(taskItem => {
        const taskContent = taskItem.querySelector('span').textContent;
        const match = taskContent.match(/\(Due: (.+)\)$/);
        const content = taskContent.replace(/\(Due: .+\)$/, '').trim();
        const dueDate = match ? match[1] : '';
        const taskCompleted = taskItem.querySelector('input').checked;

        tasks.push({ content, dueDate, completed: taskCompleted });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загружаем задачи из localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTask(task.content, task.dueDate, task.completed);
    });
}
