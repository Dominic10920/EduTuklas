let currentQuestionIndex = 0;
let lives = 3;
let score = 0;
let questions = [];
let mistakes = [];  // Track the user's mistakes

const homeScreen = document.querySelector('.home-screen');
const quizScreen = document.querySelector('.quiz-screen');
const gameOverScreen = document.querySelector('.game-over');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const livesEl = document.getElementById('lives');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const restartButton = document.getElementById('restart');
const nextQuestionButton = document.getElementById('next-question');
const mistakesList = document.getElementById('mistakes');

// Define questions for each difficulty level
const easyQuestions = [
    { question: "What is the basic unit of life?", answers: ["Cell", "Atom", "Organ", "Tissue"], correct: 0 },
    { question: "What organelle is responsible for protein synthesis?", answers: ["Ribosome", "Mitochondria", "Nucleus", "Golgi Apparatus"], correct: 0 },
    { question: "Which part of the cell contains genetic material?", answers: ["Nucleus", "Mitochondria", "Cytoplasm", "Ribosome"], correct: 0 },
];

const mediumQuestions = [
    { question: "What structure controls the movement of substances into and out of the cell?", answers: ["Cell membrane", "Nucleus", "Endoplasmic Reticulum", "Golgi Apparatus"], correct: 0 },
    { question: "What organelle produces ATP, the energy currency of the cell?", answers: ["Mitochondria", "Chloroplast", "Nucleus", "Golgi Apparatus"], correct: 0 },
    { question: "Which part of the cell is involved in sorting and packaging proteins?", answers: ["Golgi Apparatus", "Nucleus", "Endoplasmic Reticulum", "Ribosome"], correct: 0 },
];

const hardQuestions = [
    { question: "What type of cell division produces gametes?", answers: ["Meiosis", "Mitosis", "Binary Fission", "Cytokinesis"], correct: 0 },
    { question: "What structure in plant cells captures light energy for photosynthesis?", answers: ["Chloroplast", "Mitochondria", "Cell Membrane", "Nucleus"], correct: 0 },
    { question: "What is the main function of the rough endoplasmic reticulum?", answers: ["Protein synthesis", "Lipid synthesis", "Detoxification", "Energy production"], correct: 0 },
];

const difficultyButtons = document.querySelectorAll('.difficulty-btn');
difficultyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const difficulty = e.target.id;
        startGame(difficulty);
    });
});

function startGame(difficulty) {
    homeScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    gameOverScreen.style.display = 'none';
    
    loadQuestions(difficulty);
    shuffleQuestions();
    currentQuestionIndex = 0;
    lives = 3;
    score = 0;
    livesEl.textContent = `Lives: ${lives}`;
    mistakes = [];  // Reset mistakes when restarting the game
    nextQuestionButton.style.display = 'none';
    loadQuestion();
}

function loadQuestions(difficulty) {
    if (difficulty === 'easy') {
        questions = easyQuestions;
    } else if (difficulty === 'medium') {
        questions = mediumQuestions;
    } else if (difficulty === 'hard') {
        questions = hardQuestions;
    }
}

function shuffleQuestions() {
    questions = questions.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    if (currentQuestionIndex < questions.length && lives > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        resultEl.textContent = '';

        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.disabled = false;
            button.style.backgroundColor = '';
            button.onclick = () => checkAnswer(index, button);
        });
        
        nextQuestionButton.style.display = 'none'; // Hide the next button initially
    } else {
        endGame();
    }
}

function checkAnswer(selectedIndex, selectedButton) {
    const currentQuestion = questions[currentQuestionIndex];
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    if (selectedIndex === currentQuestion.correct) {
        score++;
        selectedButton.style.backgroundColor = '#4CAF50'; // Correct color
        resultEl.textContent = 'Correct!';
    } else {
        lives--;
        livesEl.textContent = `Lives: ${lives}`;
        selectedButton.style.backgroundColor = '#ff4d4d'; // Incorrect color
        resultEl.textContent = 'Incorrect!';
        
        // Save the mistake to show at the end
        mistakes.push({
            question: currentQuestion.question,
            userAnswer: currentQuestion.answers[selectedIndex],
            correctAnswer: currentQuestion.answers[currentQuestion.correct],
        });
        
        answerButtons[currentQuestion.correct].style.backgroundColor = '#4CAF50'; // Highlight correct answer
    }

    answerButtons.forEach(button => button.disabled = true); // Disable all buttons after selection
    nextQuestionButton.style.display = 'block'; // Show the next button
}

nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

function endGame() {
    quizScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
    scoreEl.textContent = score;
    document.body.style.backgroundColor = '#ffdddd'; // Red background for game over

    // Display the mistakes list
    const mistakesUl = document.getElementById('mistakes');
    mistakesUl.innerHTML = ''; // Clear previous mistakes
    mistakes.forEach(mistake => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Question:</strong> ${mistake.question} <br>
            <strong>Your Answer:</strong> ${mistake.userAnswer} <br>
            <strong>Correct Answer:</strong> ${mistake.correctAnswer}
        `;
        mistakesUl.appendChild(li);
    });
}

restartButton.addEventListener('click', () => {
    homeScreen.style.display = 'block';
    quizScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    document.body.style.backgroundColor = '#e8f8f5'; // Reset background
});