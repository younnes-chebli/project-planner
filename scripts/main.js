////// create

const createButton = document.getElementById("create");
const cards = document.getElementById("cards");

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
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateC.append(dueDateLabel, dueDateInput);

    const remaining = document.createElement("p");
    remaining.classList.add("remaining");

    const trashC = document.createElement("div");
    trashC.classList.add("trash-c");
    const trashB = document.createElement("button");
    const trashFont = document.createElement("i");
    trashFont.classList.add("fa-solid", "fa-trash", "trash");
    trashB.append(trashFont);
    trashC.append(trashB);

    card.append(nameInput, statusSelect, description, dueDateC, remaining, trashC);

    cards.append(card);
};

createButton.addEventListener("click", createTask);