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
        newOption.className = "option-item";

        if (type === "multiple-choice") {
            newOption.innerHTML = `
                <div class="option-content">
                    <span><input type="radio" name="mc-${questionId}"> ${newOptionText}</span>
                    <button class="delete-option" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>`;
        }
        else if (type === "checkbox") {
            newOption.innerHTML = `
                <div class="option-content">
                    <span><input type="checkbox"> ${newOptionText}</span>
                    <button class="delete-option" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>`;
        }
        else if (type === "dropdown") {
            let selectElement = document.querySelector(`#question-options-${questionId} select`);
            if (!selectElement) {
                let newSelect = document.createElement("select");
                newSelect.innerHTML = `
                    <option value="" disabled selected>Select an option</option>
                    <option>${newOptionText}</option>`;
                optionsList.appendChild(newSelect);
            } else {
                let newDropdownOption = document.createElement("option");
                newDropdownOption.textContent = newOptionText;
                selectElement.appendChild(newDropdownOption);
            }
            newOption.innerHTML = `
                <div class="option-content">
                    <span>${newOptionText}</span>
                    <button class="delete-option" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>`;
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
    const formData = [];
    const questionContainers = document.querySelectorAll('.question-container');

    questionContainers.forEach(container => {
        const questionText = container.querySelector('.question-input').value;
        const questionType = container.querySelector('#questionType').value;
        const options = [];

        const optionsList = document.getElementById(`options-list-${container.id.split('-')[1]}`);
        if (optionsList) {
            const optionElements = optionsList.querySelectorAll('.option-content span');
            optionElements.forEach(option => {
                // Extract only the text content, removing the radio/checkbox HTML
                const optionText = option.textContent.trim();
                if (optionText) options.push(optionText);
            });
        }

        formData.push({
            questionText: questionText,
            questionType: questionType,
            options: options
        });
    });

    sessionStorage.setItem("formData", JSON.stringify(formData));
    alert("Form saved successfully!");
}

// Remove auto-save event listener
// Function to Load Form Data
function loadFormData() {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
        const formData = JSON.parse(savedData);
        formData.forEach((question, index) => {
            addQuestion();
            const container = document.getElementById(`question-${questionCount}`);
            container.querySelector('.question-input').value = question.questionText;
            container.querySelector('#questionType').value = question.questionType;
            
            changeQuestionType(container.querySelector('#questionType'), questionCount);
            
            if (question.options.length > 0) {
                const newOptionInput = document.getElementById(`new-option-${questionCount}`);
                question.options.forEach(option => {
                    newOptionInput.value = option;
                    addOption(questionCount, question.questionType);
                });
            }
        });
    }
}

// Event listener for the Save button
document.getElementById('saveButton').addEventListener('click', function() {
    saveFormData();
});

// Call loadFormData on page load
window.onload = loadFormData;


function previewbtn() {
    const formData = [];
    const questionContainers = document.querySelectorAll('.question-container');

    questionContainers.forEach(container => {
        const questionText = container.querySelector('.question-input').value;
        const questionType = container.querySelector('#questionType').value;
        const options = [];

        const optionsList = document.getElementById(`options-list-${container.id.split('-')[1]}`);
        if (optionsList) {
            // Update to only get the text content from span elements
            const optionElements = optionsList.querySelectorAll('.option-content span');
            optionElements.forEach(option => {
                // Remove the input element text content
                const optionText = option.textContent.replace(/^(radio|checkbox)\s*/, '').trim();
                if (optionText) options.push(optionText);
            });
        }

        formData.push({
            questionText: questionText,
            questionType: questionType,
            options: options
        });
    });

    sessionStorage.setItem("previewData", JSON.stringify(formData));
    window.location.href = "previewpage.html";
}