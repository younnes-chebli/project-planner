const taskForm = document.getElementById("task-form");
const tasksDisplay = document.getElementById("tasks");
let taskList = [];
const max = Number.MAX_VALUE;
const lsTasks = localStorage.getItem("tasks");
let parsedLsTasks;
let nextID;
if(lsTasks != null) {
    parsedLsTasks = JSON.parse(lsTasks);
    for(const parsedLsTask of parsedLsTasks) {
        taskList.push(parsedLsTask);
    }
    nextID = parsedLsTasks[parsedLsTasks.length - 1].ID + 1;
} else {
    nextID = 1;
}

const save = () => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
};

const emptyLS = () => {
    localStorage.removeItem("tasks");
};

const noCards = () => {
    return document.querySelectorAll(".card").length == 0;
};

const msToDays = (ms) => {
    return Math.floor(ms / (24*60*60*1000));
};

const isBefore = (ms) => {
    return ms < Date.now();
};

const displayRemaining = (e) => {
    const remaining = e.path[2].querySelector("p");
    remaining.innerHTML = "";
    const dateStringIn = e.target.value;
    const dateInMs = Date.parse(dateStringIn);

    if(!isBefore(dateInMs)) {
        const daysRemaining = msToDays(dateInMs) - msToDays(Date.now());
        remaining.innerHTML = `in ${daysRemaining} days!`;
        remaining.setAttribute("days-left", `${daysRemaining}`);
    }

    //refresh();
};

const generateTask = (task) => {
    const card = document.createElement("div");
    card.setAttribute("ID", task.ID);
    card.classList.add("card");
    //resetFilter();

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("name");
    nameInput.placeholder = "task name";
    nameInput.value = task.name;
    nameInput.addEventListener("input", (e) => {
        taskToUpdate = taskList.filter(el => el.ID === task.ID);
        const i =  taskList.indexOf(taskToUpdate[0]);
        taskList[i].name = e.target.value;
        save();
    });

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("status-select");
    const todoOption = document.createElement("option");
    todoOption.value = "todo";
    todoOption.innerHTML = "TO DO";
    const doingOption = document.createElement("option");
    doingOption.value = "doing";
    doingOption.innerHTML = "DOING";
    const doneOption = document.createElement("option");
    doneOption.value = "done";
    doneOption.innerHTML = "DONE";
    statusSelect.append(todoOption, doingOption, doneOption);
    statusSelect.value = task.status;
    statusSelect.addEventListener("change", (e) => {
        taskToUpdate = taskList.filter(el => el.ID === task.ID);
        console.log(e.target.value)
        const i =  taskList.indexOf(taskToUpdate[0]);
        taskList[i].status = e.target.value;
        save();
    });

    const description = document.createElement("textarea");
    description.classList.add("description");
    description.cols = "25";
    description.rows = "5";
    description.placeholder = "description";
    description.innerHTML = task.description;
    description.addEventListener("input", (e) => {
        taskToUpdate = taskList.filter(el => el.ID === task.ID);
        const i =  taskList.indexOf(taskToUpdate[0]);
        taskList[i].description = e.target.value;
        save();
    });

    const dueDateC = document.createElement("div");
    dueDateC.classList.add("due-date");
    const dueDateLabel = document.createElement("label");
    dueDateLabel.innerHTML = "Due date";
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.value = task.dueDate;
    dueDateC.append(dueDateLabel, dueDateInput);
    dueDateInput.addEventListener("change", displayRemaining);
    dueDateInput.addEventListener("change", (e) => {
        taskToUpdate = taskList.filter(el => el.ID === task.ID);
        const i =  taskList.indexOf(taskToUpdate[0]);
        taskList[i].dueDate = e.target.value;
        save();
    });

    const remaining = document.createElement("p");
    remaining.classList.add("remaining");
    remaining.setAttribute("days-left", `${max}`);
    if(!isBefore(Date.parse(task.dueDate)) && task.dueDate != "") {
        const daysRemaining = msToDays(Date.parse(task.dueDate)) - msToDays(Date.now());
        remaining.innerHTML = `in ${daysRemaining} days!`;
        remaining.setAttribute("days-left", `${daysRemaining}`);
    }

    const trashC = document.createElement("div");
    trashC.classList.add("trash-c");
    const trashB = document.createElement("button");
    const trashFont = document.createElement("i");
    trashFont.classList.add("fa-solid", "fa-trash", "trash");
    trashB.append(trashFont);
    trashC.append(trashB);
    trashB.addEventListener("click", (e) => {
        taskToUpdate = taskList.filter(el => el.ID === task.ID);
        const i =  taskList.indexOf(taskToUpdate[0]);
        card.remove();
        if(noCards()) {
            taskList = [];
            emptyLS();
        } else {
            taskList.splice(i, 1);
            save();    
        }
    });

    card.append(nameInput, statusSelect, description, dueDateC, remaining, trashC);

    tasksDisplay.append(card);

    //refresh();
    //checkFilters();
};

const generateTasks = (taskList) => {
    tasksDisplay.innerHTML = "";
    for(const task of taskList) {
        generateTask(task);
    }
} ;

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(taskForm));
    formData.ID = nextID;
    formData.status = "todo";
    nextID++;
    taskList.push(formData);
    save();
    generateTasks(taskList);
});

if(lsTasks != null) {
    generateTasks(parsedLsTasks);   
}