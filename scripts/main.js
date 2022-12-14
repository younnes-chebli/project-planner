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
//0: none, 1: urgence, 2: name
var sortType = 0;
//0: none, 1: todo, 2: doing, 3: done
var filterType = 0;
const urgenceSort = document.getElementById("urgence-sort");
const nameSort = document.getElementById("name-sort");
const all = document.getElementById("all");
const todoFilter = document.getElementById("todo");
const doingFilter = document.getElementById("doing");
const doneFilter = document.getElementById("done");

const save = () => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
};

const emptyLS = () => {
    localStorage.removeItem("tasks");
};

const noCards = () => {
    return document.querySelectorAll(".card").length == 0;
};

const getDisplayedCards = () => {
    return document.querySelectorAll(".card");
};

const resetDisplay = () => {
    const cards = getDisplayedCards();
    for(const card of cards) {
        card.style.display = "block";
    }
};

const filterByTodo = () => {
    resetDisplay();
    const cards = getDisplayedCards();
    for(const card of cards) {
        if(card.querySelector("select :nth-child(1)").selected == true) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
};

const filterByDoing = () => {
    resetDisplay();
    const cards = getDisplayedCards();
    for(const card of cards) {
        if(card.querySelector("select :nth-child(2)").selected == true) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
};

const filterByDone = () => {
    resetDisplay();
    const cards = getDisplayedCards();
    for(const card of cards) {
        if(card.querySelector("select :nth-child(3)").selected == true) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
};

const filter = () => {
    switch(filterType) {
        case 1: filterByTodo();
        break;
        case 2: filterByDoing();
        break;
        case 3: filterByDone();
        break;
    }
};

const sortByName = (cards) => {
    const cardsArray = Array.from(cards);
    tasksDisplay.innerHTML = "";
    
    cardsArray.sort((a, b) => {
        if(a.querySelector("input").value < b.querySelector("input").value) {
            return -1;
        } else if (a.querySelector("input").value > b.querySelector("input").value) {
            return 1;
        } else {
            return 0;
        }
    });
    
    for(const card of cardsArray) {
        tasksDisplay.append(card);
    }
}

const sortByUrgence = (cards) => {
    const cardsArray = Array.from(cards);
    tasksDisplay.innerHTML = "";

    cardsArray.sort((a, b) => {
        return Number(a.querySelector("p").getAttribute("days-left")) - Number(b.querySelector("p").getAttribute("days-left"));
    });

    for(const card of cardsArray) {
        tasksDisplay.append(card);
    }
} ;

const sort = () => {
    const cards = getDisplayedCards();
    switch(sortType) {
        case 1: sortByUrgence(cards);
        break;
        case 2: sortByName(cards);
        break;
    }
};

const refresh = () => {
    sort();
    filter();
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

    refresh();
};

const resetFilter = () =>{
    resetDisplay();
    filterType = 0;
    todoFilter.checked = false;
    doingFilter.checked = false;
    doneFilter.checked = false;
    all.checked = true;
    refresh();
};

const generateTask = (task) => {
    const card = document.createElement("div");
    card.setAttribute("ID", task.ID);
    card.classList.add("card");
    resetFilter();

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

    refresh();
};

const resetForm = () => {
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
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
    resetForm();
});

if(lsTasks != null) {
    generateTasks(parsedLsTasks);   
}

const enableSortByName = () => {
    sortType = 2;
    refresh();
};

const enableSortByUrgence = () => {
    sortType = 1;
    refresh();
};

urgenceSort.addEventListener("click", enableSortByUrgence);
nameSort.addEventListener("click", enableSortByName);

const enableTodoFilter = () => {
    filterType = 1;
    todoFilter.checked = true;
    all.checked = false;
    refresh();
};

const enableDoingfilter = () => {
    filterType = 2;
    doingFilter.checked = true;
    all.checked = false;
    refresh()
};

const enableDoneFilter = () => {
    filterType = 3;
    doneFilter.checked = true;
    all.checked = false;
    refresh();
};

all.addEventListener("click", resetFilter);
todoFilter.addEventListener("click", enableTodoFilter);
doingFilter.addEventListener("click", enableDoingfilter);
doneFilter.addEventListener("click", enableDoneFilter);