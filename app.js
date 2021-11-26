const taskStorage = {
	getAllTasks: function () {
		const tasksString = localStorage.getItem("tasks");
		const tasks = JSON.parse(tasksString);

		tasks === null && localStorage.setItem("tasks", "[]");

		return tasks ? tasks : [];
	},
	saveTask: function (taskId, taskContent) {
		const tasks = this.getAllTasks();

		tasks.push({ 
			id: taskId, 
			content: taskContent 
		});

		tasksString = JSON.stringify(tasks);

		localStorage.setItem("tasks", tasksString);
	},
	deleteTask: function (taskId) {
		const tasks = this.getAllTasks();

		const updatedTasks = tasks.filter((task) => {
			return task.id !== taskId;
		});

		updatedTasksString = JSON.stringify(updatedTasks);

		localStorage.setItem("tasks", updatedTasksString);
	},
	getTaskById: function (taskId) {
		const tasks = this.getAllTasks();

		const foundTask = tasks.filter((task) => {
			return task.id == taskId; 
		});

		return foundTask;
	}
};

function generateUniqueTaskId() {
	return Math.random().toString(36).substr(2, 9);
}

function editTask(taskId) {
	console.log("edit => ", taskId);
}

function deleteTaskElement(taskId) {
	const taskElement = document.querySelector(`.task[data-task-id='${taskId}']`);

	taskElement.remove();	
}

function deleteTask(taskId) {
	taskStorage.deleteTask(taskId);

	deleteTaskElement(taskId);
}

function createTaskActionButtonElement(taskId, actionType) {
	const buttonElement = document.createElement("button");

	buttonElement.dataset.taskId = taskId;
	buttonElement.classList.add("taskActions__btn");

	switch (actionType) {
		case "edit":
			buttonElement.innerHTML = "Edit";
			buttonElement.classList.add("taskActions__btn-edit");
			buttonElement.addEventListener("click", () => editTask(taskId));

			break;

		case "delete":
			buttonElement.innerHTML = "Delete";
			buttonElement.classList.add("taskActions__btn-delete");
			buttonElement.addEventListener("click", () => deleteTask(taskId));

			break;
	}

	return buttonElement;
}

function createTaskContentElement(taskContent) {
	const taskContentElement = document.createElement("p");

	taskContentElement.innerHTML = taskContent;

	taskContentElement.classList.add("task__content");

	return taskContentElement;
}

function createTaskActionsElement(taskId) {
	const taskActionsElement = document.createElement("div");

	taskActionsElement.classList.add("taskActions");

	const taskEditButtonElement = createTaskActionButtonElement(taskId, "edit");
	const taskDeleteButtonElement = createTaskActionButtonElement(taskId, "delete");

	taskActionsElement.appendChild(taskEditButtonElement);
	taskActionsElement.appendChild(taskDeleteButtonElement);

	return taskActionsElement;
}

function createTaskElement(taskId, taskContent) {
	const taskElement = document.createElement("li");

	taskElement.classList.add("task");
	taskElement.dataset.taskId = taskId;

	const taskActionsElement = createTaskActionsElement(taskId);
	const taskContentElement = createTaskContentElement(taskContent);

	taskElement.appendChild(taskContentElement);
	taskElement.appendChild(taskActionsElement);

	return taskElement;
}

function renderTask(taskElement) {
	const taskListElement = document.getElementById("taskList");

	taskListElement.appendChild(taskElement);
}

function addTask(e) {
	e.preventDefault();

	const currentFormElement = e.target;
	
	const formData = new FormData(currentFormElement);

	const newTaskId = generateUniqueTaskId();
	const newTaskContent = formData.get("content");
	const newTaskElement = createTaskElement(newTaskId, newTaskContent);

	renderTask(newTaskElement);

	taskStorage.saveTask(newTaskId, newTaskContent);
}

function renderStoredTasks() {
	const tasks = taskStorage.getAllTasks();

	for (let task of tasks) {
		const taskId = task.id;
		const taskContent = task.content;

		const taskElement = createTaskElement(taskId, taskContent);

		renderTask(taskElement);
	}
}

window.onload = renderStoredTasks;

const taskFormElement = document.getElementById("taskForm");

taskFormElement.addEventListener("submit", addTask);
