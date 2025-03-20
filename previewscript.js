document.addEventListener("DOMContentLoaded", () => {
    const formData = JSON.parse(sessionStorage.getItem("formData"));
    const formPreview = document.getElementById("form-preview");

    if (formData) {
        formData.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `${index + 1}. ${question.questionText}`;
            questionDiv.appendChild(questionTitle);

            if (question.options.length > 0) {
                const optionsList = document.createElement("ul");
                optionsList.className = "options";

                question.options.forEach(option => {
                    const optionItem = document.createElement("li");
                    optionItem.textContent = option;
                    optionsList.appendChild(optionItem);
                });

                questionDiv.appendChild(optionsList);
            }

            formPreview.appendChild(questionDiv);
        });
    } else {
        formPreview.textContent = "No form data available.";
    }
});