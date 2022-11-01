const createButton = document.getElementById("create");
const cards = document.getElementById("cards");
const max = Number.MAX_VALUE;
//0: none, 1: urgence, 2: name
var sortType = 0;
//0: none, 1: todo, 2: doing, 3: done
var filterType = 0;

const sortByName = () => {
    const tasks = document.querySelectorAll(".card");
    const tasksArray = Array.from(tasks);
    cards.innerHTML = "";
    
    tasksArray.sort((a, b) => {
        // return b.querySelector("input").value - a.querySelector("input").value;
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

const sortByUrgence = () => {
    const tasks = document.querySelectorAll(".card");
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
    const tasks = document.querySelectorAll(".card");
    switch(sortType) {
        case 1: sortByUrgence();
        break;
        case 2: sortByName();
        break;
    }
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

    sort();
};

const createTask = () => {
    const card = document.createElement("div");
    card.classList.add("card");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("name");
    nameInput.placeholder = "task name";

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("status-select");
    const todoOption = document.createElement("option");
    todoOption.value = "todo";
    todoOption.selected = true;
    todoOption.innerHTML = "TO DO";
    const doingOption = document.createElement("option");
    doingOption.value = "doint";
    doingOption.innerHTML = "DOING";
    const doneOption = document.createElement("option");
    doneOption.value = "done";
    doneOption.innerHTML = "DONE";
    statusSelect.append(todoOption, doingOption, doneOption);

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

    sort();
};

createButton.addEventListener("click", createTask);

const urgenceSort = document.getElementById("urgence-sort");
const nameSort = document.getElementById("name-sort");

const enableSortByName = () => {
    sortType = 2;
    sort();
};

const enableSortByUrgence = () => {
    sortType = 1;
    sort();
};

urgenceSort.addEventListener("click", enableSortByUrgence);
nameSort.addEventListener("click", enableSortByName);