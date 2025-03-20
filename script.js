let questionCount = 0;

// Function to Add a New Question
function addQuestion() {
    questionCount++;

    let formQuestions = document.getElementById("form-questions");

    let questionContainer = document.createElement("div");
    questionContainer.className = "question-container";
    questionContainer.id = `question-${questionCount}`;

    questionContainer.innerHTML = `
        <input type="text" placeholder="Enter your question" class="question-input" id="question">
        <select  id="questionType" onchange="changeQuestionType(this, ${questionCount})">
            <option value="short-answer">Short Answer</option>
            <option value="paragraph">Paragraph</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
            <option value="date">Date</option>
        </select>
 
        <div id="question-options-${questionCount}"></div>
 
        <button class="delete-btn" onclick="deleteQuestion(${questionCount})">Delete</button>`;


    formQuestions.appendChild(questionContainer);
}

// Function to Change Question Type
function changeQuestionType(selectElement, questionId) {
    let selectedType = selectElement.value;
    let optionsContainer = document.getElementById(`question-options-${questionId}`);
    optionsContainer.innerHTML = "";

    if (selectedType === "short-answer") {
        optionsContainer.innerHTML = `<textarea placeholder="Short answer having a maximum length of 25" maxlength=25>`;
    }
    else if (selectedType === "paragraph") {
        optionsContainer.innerHTML = `<textarea placeholder="Paragraph"></textarea>`;
    }
    else if (selectedType === "multiple-choice" || selectedType === "checkbox" || selectedType === "dropdown") {
        optionsContainer.innerHTML = `
            <div id="options-list-${questionId}">
            </div>
            <input type="text" id="new-option-${questionId}" placeholder="Add option">
            <button class="add-option-btn" onclick="addOption(${questionId}, '${selectedType}')">+ Add Option</button>
        `;
    }
    else if (selectedType === "date") {
        optionsContainer.innerHTML = `<input type="date" class="answer-input">`;
    }
}

// Function to Add Option to Multiple Choice, Checkbox, or Dropdown
function addOption(questionId, type) {
    let newOptionText = document.getElementById(`new-option-${questionId}`).value.trim();
    if (newOptionText !== "") {
        let optionsList = document.getElementById(`options-list-${questionId}`);
        let newOption = document.createElement("div");

        if (type === "multiple-choice") {
            newOption.innerHTML = `<input type="radio" name="mc-${questionId}"> ${newOptionText}`;
        }
        else if (type === "checkbox") {
            newOption.innerHTML = `<input type="checkbox"> ${newOptionText}`;
        }
        else if (type === "dropdown") {
            let selectElement = document.querySelector(`#question-options-${questionId} select`);
            if (!selectElement) {
                let newSelect = document.createElement("select");
                newSelect.innerHTML = `<option>${newOptionText}</option>`;
                optionsList.appendChild(newSelect);
            } else {
                let newDropdownOption = document.createElement("option");
                newDropdownOption.textContent = newOptionText;
                selectElement.appendChild(newDropdownOption);
            }
        }

        optionsList.appendChild(newOption);
        document.getElementById(`new-option-${questionId}`).value = "";
        
    }
}

// Function to Delete a Question
function deleteQuestion(questionId) {
    document.getElementById(`question-${questionId}`).remove();
}

function saveFormData() {
    const formData = {};
    const questionContainers = document.querySelectorAll('.question-container');

    questionContainers.forEach(container => {
        const questionText = container.querySelector('.question-input'). value;
        const questionType = container.querySelector('#questionType').value;
        formData[container.id] = {
            questionText: questionText,
            questionType: questionType,
            options: []
        };

        const optionsList = document.getElementById(`options-list-${container.id.split('-')[1]}`);
        if (optionsList) {
            const options = optionsList.querySelectorAll('div');
            options.forEach(option => {
                formData[container.id].options.push(option.textContent.trim());
            });
        }
    });

    localStorage.setItem("formData", JSON.stringify(formData)); // Store data in localStorage
}

// Function to Load Form Data
function loadFormData() {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
        const formData = JSON.parse(savedData);
        for (const id in formData) {
            const container = document.getElementById(id);
            if (container) {
                container.querySelector('.question-input').value = formData[id].questionText;
                container.querySelector('#questionType').value = formData[id].questionType;
                changeQuestionType(container.querySelector('#questionType'), id.split('-')[1]);
                formData[id].options.forEach(option => {
                    const newOptionInput = document.getElementById(`new-option-${id.split('-')[1]}`);
                    newOptionInput.value = option; // Set the option text
                    addOption(id.split('-')[1], formData[id].questionType); // Add the option to the list
                });
            }
        }
    }
}

// Event listener for the Save button
document.getElementById('saveButton').addEventListener('click', function() {
    saveFormData();
});

// Call loadFormData on page load
window.onload = loadFormData;


function previewbtn() {
    saveFormData();
    const formData = [];
    const questionContainers = document.querySelectorAll('.question-container');

    questionContainers.forEach(container => {
        const questionText = container.querySelector('.question-input').value;
        const questionType = container.querySelector('#questionType').value;
        const options = [];

        const optionsContainer = container.querySelector(`#question-options-${container.id.split('-')[1]}`);
        if (questionType === "multiple-choice" || questionType === "checkbox" || questionType === "dropdown") {
            const optionElements = optionsContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            optionElements.forEach(option => {
                if (option.nextSibling.textContent.trim() !== "") {
                    options.push(option.nextSibling.textContent.trim());
                }
            });
        }

        formData.push({
            questionText: questionText,
            questionType: questionType,
            options: options
        });
    });

    sessionStorage.setItem("formData", JSON.stringify(formData));
    window.location.href = "previewpage.html"; // Redirect to the preview page
}