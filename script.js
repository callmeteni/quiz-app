document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');

    let quizQuestions = [];
    let currentQuestionIndex = 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                quizQuestions = shuffleArray(data.questions).slice(0, 10); // Select the first 10 shuffled questions
                buildQuiz();
            })
            .catch(error => {
                console.error('Error loading questions:', error);
            });
    }

    function buildQuiz() {
        const output = quizQuestions.map((currentQuestion, questionNumber) => {
            const answers = currentQuestion.content.map((answer, index) => 
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${index}">
                    ${answer}
                </label>`
            ).join('');

            return `
                <div class="question">
                    <h2>${currentQuestion.question}</h2>
                    <div class="options">${answers}</div>
                </div>
            `;
        }).join('');

        quizContainer.innerHTML = output;
        showQuestion(currentQuestionIndex);
    }

    function showQuestion(index) {
        const questions = quizContainer.querySelectorAll('.question');
        questions.forEach((question, i) => {
            question.style.display = i === index ? 'block' : 'none';
        });

        prevButton.style.display = index === 0 ? 'none' : 'inline-block';
        nextButton.style.display = index === questions.length - 1 ? 'none' : 'inline-block';
        submitButton.style.display = index === questions.length - 1 ? 'inline-block' : 'none';
    }

    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.options');
        let numCorrect = 0;

        quizQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            if (userAnswer == currentQuestion.correct) {
                numCorrect++;
                answerContainers[questionNumber].style.color = 'green';
            } else {
                answerContainers[questionNumber].style.color = 'red';
            }
        });

        resultsContainer.innerHTML = `
            <h2>Quiz Complete</h2>
            <p>You scored ${numCorrect} out of ${quizQuestions.length}.</p>
        `;
        resultsContainer.style.display = 'block';
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    });

    prevButton.addEventListener('click', () => {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    });

    submitButton.addEventListener('click', showResults);

    loadQuestions();
});
