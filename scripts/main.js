////// create

const createButton = document.getElementById("create");

const addNewCard = () => {
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
    todoOption.innerHTML = "TO DO";
    const doingOption = document.createElement("option");
    todoOption.value = "doint";
    todoOption.innerHTML = "DOING";
    const doneOption = document.createElement("option");
    todoOption.value = "done";
    todoOption.innerHTML = "DONE";
    statusSelect.append(todoOption, doingOption, doneOption);
};

createButton.addEventListener("click", addNewCard);