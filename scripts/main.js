const createButton = document.getElementById("create");
const cards = document.getElementById("cards");
const max = Number.MAX_VALUE;
//0: none, 1: urgence, 2: name
var sortType = 0;
//0: none, 1: todo, 2: doing, 3: done
var filterType = 0;
const urgenceSort = document.getElementById("urgence-sort");
const all = document.getElementById("all");
const nameSort = document.getElementById("name-sort");
const todoFilter = document.getElementById("todo");
const doingFilter = document.getElementById("doing");
const doneFilter = document.getElementById("done");
var actualTasks = document.querySelectorAll(".card");

const disableFilters = () => {
    todoFilter.disabled = true;
    doingFilter.disabled = true;
    doneFilter.disabled = true;
    all.disabled = true;
};

const activateFilters = () => {
    todoFilter.disabled = false;
    doingFilter.disabled = false;
    doneFilter.disabled = false;
    all.disabled = false;
};

const checkFilters = () => {
    if(actualTasks.length == 0) {
        disableFilters();
    } else {
        activateFilters();
    }
};

const resetDisplay = () => {
    for(const task of actualTasks) {
        task.style.display = "block";
    }
};

const filterByTodo = () => {
    resetDisplay();
    for(const task of actualTasks) {
        if(task.querySelector("select :nth-child(2)").selected == true) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    }
};

const filterByDoing = () => {
    resetDisplay();
    for(const task of actualTasks) {
        if(task.querySelector("select :nth-child(3)").selected == true) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    }
};

const filterByDone = () => {
    resetDisplay();
    for(const task of actualTasks) {
        if(task.querySelector("select :nth-child(4)").selected == true) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
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

const sortByName = (tasks) => {
    const tasksArray = Array.from(tasks);
    cards.innerHTML = "";
    
    tasksArray.sort((a, b) => {
        if(a.querySelector("input").value < b.querySelector("input").value) {
            return -1;
        } else if (a.querySelector("input").value > b.querySelector("input").value) {
            return 1;
        } else {
            return 0;
        }
    });
    
    for(const task of tasksArray) {
        cards.append(task);
    }
};

const sortByUrgence = (tasks) => {
    const tasksArray = Array.from(tasks);
    cards.innerHTML = "";

    tasksArray.sort((a, b) => {
        return Number(a.querySelector("p").getAttribute("days-left")) - Number(b.querySelector("p").getAttribute("days-left"));
    });

    for(const task of tasksArray) {
        cards.append(task);
    }
} ;

const sort = () => {
    switch(sortType) {
        case 1: sortByUrgence(actualTasks);
        break;
        case 2: sortByName(actualTasks);
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
    let daysRemaining;

    if(!isBefore(dateInMs)) {
        daysRemaining = msToDays(dateInMs) - msToDays(Date.now());
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

const createTask = () => {
    const card = document.createElement("div");
    card.classList.add("card");
    resetFilter();

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("name");
    nameInput.placeholder = "task name";

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("status-select");
    const status = document.createElement("option");
    status.value = "";
    status.innerHTML = "STATUS";
    status.selected= true;
    status.disabled = true;
    const todoOption = document.createElement("option");
    todoOption.value = "todo";
    todoOption.innerHTML = "TO DO";
    const doingOption = document.createElement("option");
    doingOption.value = "doing";
    doingOption.innerHTML = "DOING";
    const doneOption = document.createElement("option");
    doneOption.value = "done";
    doneOption.innerHTML = "DONE";
    statusSelect.append(status, todoOption, doingOption, doneOption);

    const description = document.createElement("textarea");
    description.classList.add("description");
    description.cols = "25";
    description.rows = "5";
    description.placeholder = "description";

    const dueDateC = document.createElement("div");
    dueDateC.classList.add("due-date");
    const dueDateLabel = document.createElement("label");
    dueDateLabel.innerHTML = "Due date";
    const dueDateInput = document.createElement("input");
    dueDateInput.addEventListener("change", displayRemaining);
    dueDateInput.type = "date";
    dueDateC.append(dueDateLabel, dueDateInput);

    const remaining = document.createElement("p");
    remaining.classList.add("remaining");
    remaining.setAttribute("days-left", `${max}`);

    const trashC = document.createElement("div");
    trashC.classList.add("trash-c");
    const trashB = document.createElement("button");
    const trashFont = document.createElement("i");
    trashFont.classList.add("fa-solid", "fa-trash", "trash");
    trashB.append(trashFont);
    trashC.append(trashB);

    card.append(nameInput, statusSelect, description, dueDateC, remaining, trashC);

    cards.append(card);

    actualTasks = document.querySelectorAll(".card");
    refresh();
    checkFilters();
};

createButton.addEventListener("click", createTask);

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

checkFilters();