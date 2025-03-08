document.addEventListener('DOMContentLoaded', () => {
    const goalsContainer = document.getElementById('goals-container');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const goalForm = document.getElementById('goal-form');
    const goalTextInput = document.getElementById('goal-text');
    const goalImageFileInput = document.getElementById('goal-image-file');
    const goalYearInput = document.getElementById('goal-year');

    // Функція для створення елемента цілі
    function createGoalElement(goal, index) {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal';

        if (goal.image) {
            const img = document.createElement('img');
            img.src = goal.image;
            img.alt = 'Зображення цілі';
            goalElement.appendChild(img);
        }

        const text = document.createElement('p');
        text.textContent = goal.text;
        goalElement.appendChild(text);

        if (goal.year) {
            const year = document.createElement('p');
            year.textContent = `Ціль на ${goal.year}`;
            goalElement.appendChild(year);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => deleteGoal(index));

        goalElement.appendChild(deleteButton);

        return goalElement;
    }

    // Функція для відображення всіх цілей
    function displayGoals() {
        goalsContainer.innerHTML = '';
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        if (goals.length === 0) {
            goalsContainer.innerHTML = '<p>Тут поки немає цілей, потрібно додати.</p>';
        } else {
            goals.forEach((goal, index) => {
                const goalElement = createGoalElement(goal, index);
                goalsContainer.appendChild(goalElement);
            });
        }
    }

    // Відображення цілей при завантаженні сторінки
    displayGoals();

    // Відкриття модального вікна
    addGoalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Закриття модального вікна
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Обробка відправки форми
    goalForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const goalText = goalTextInput.value.trim();
        const goalImageFile = goalImageFileInput.files[0];
        const goalYear = goalYearInput.value.trim();

        if (goalText) {
            let goalImage = '';

            if (goalImageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    goalImage = e.target.result;
                    const newGoal = { text: goalText, image: goalImage, year: goalYear || null };
                    saveGoal(newGoal);
                    displayGoals();
                    goalForm.reset();
                    modal.style.display = 'none';
                };
                reader.readAsDataURL(goalImageFile);
            } else {
                const newGoal = { text: goalText, image: goalImage, year: goalYear || null };
                saveGoal(newGoal);
                displayGoals();
                goalForm.reset();
                modal.style.display = 'none';
            }
        } else {
            alert('Заоповни опис цілі.');
        }
    });

    // Функція для збереження цілі в локальному сховищі
    function saveGoal(goal) {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    // Функція для видалення цілі з локального сховища
    function deleteGoal(index) {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        displayGoals();
    }
});
