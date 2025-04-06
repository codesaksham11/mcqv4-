// File: see_mcq.js
import { questionBank } from './see_questions.js'; // Import the questions

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const quizForm = document.getElementById('quiz-form');
    const questionsArea = document.getElementById('questions-area');
    const timerDisplaySpan = document.querySelector('#timer span');
    const loadingState = document.getElementById('loading-state');
    const submitButton = document.getElementById('submit-quiz-button');
    const backButton = document.getElementById('back-button');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmBackButton = document.getElementById('confirm-back-button');
    const cancelBackButton = document.getElementById('cancel-back-button');

    // --- State Variables ---
    let quizConfig = null;
    let questionsToDisplay = []; // Array of actual question objects to show
    let timerInterval = null;
    let timeLeft = 0; // in seconds
    let startTime = null; // To calculate time taken
    let userAnswers = {}; // Store as { questionId: selectedOptionId }
    const SUBJECT_PRIORITY = ["Science", "Social", "Math", "Opt Math", "English"]; // Priority for remainder distribution

    // --- Initialization ---
    function initQuiz() {
        startTime = Date.now(); // Record start time
        // 1. Load Config from localStorage
        const configString = localStorage.getItem('seeQuizConfig');
        if (!configString) {
            handleError("Quiz configuration not found. Please set up the quiz first.");
            return;
        }
        quizConfig = JSON.parse(configString);

        // 2. Validate Config (basic check)
        if (!quizConfig.numQuestions || !quizConfig.timeLimit || !quizConfig.selectedSubjects || quizConfig.selectedSubjects.length === 0) {
            handleError("Invalid quiz configuration.");
            return;
        }

        // 3. Prepare Questions
        questionsToDisplay = selectQuestions();
        if (!questionsToDisplay || questionsToDisplay.length === 0) {
             handleError("Could not load questions based on your selection. Try different settings.");
             return;
        }

        // 4. Render Questions
        renderQuestions();

        // 5. Start Timer
        timeLeft = quizConfig.timeLimit * 60; // Convert minutes to seconds
        startTimer();

        // 6. Show Form, Hide Loading
        loadingState.classList.add('hidden');
        quizForm.classList.remove('hidden');
    }

    // --- Question Selection & Distribution ---
    function selectQuestions() {
        const { numQuestions, selectedSubjects } = quizConfig;
        let availableQuestions = {};
        let totalAvailableCount = 0;

        // Filter available questions by selected subjects
        selectedSubjects.forEach(subject => {
            if (questionBank[subject]) {
                availableQuestions[subject] = [...questionBank[subject]]; // Create a copy to avoid modifying original bank
                totalAvailableCount += availableQuestions[subject].length;
            }
        });

        if (totalAvailableCount < numQuestions) {
            console.warn(`Warning: Not enough questions available (${totalAvailableCount}) for the selected subjects to meet the requested number (${numQuestions}). Using all available.`);
             // Adjust numQuestions if not enough available - this might alter distribution slightly
             quizConfig.numQuestions = totalAvailableCount;
             // Proceed with all available questions
        } else if (selectedSubjects.length === 0) {
            return []; // No subjects selected
        }

        let finalQuestions = [];
        let questionsPerSubject = Math.floor(quizConfig.numQuestions / selectedSubjects.length);
        let remainder = quizConfig.numQuestions % selectedSubjects.length;

        // Sort selected subjects based on priority defined in SUBJECT_PRIORITY
        const sortedSelectedSubjects = selectedSubjects.sort((a, b) => {
            return SUBJECT_PRIORITY.indexOf(a) - SUBJECT_PRIORITY.indexOf(b);
        });

        // Distribute questions
        sortedSelectedSubjects.forEach(subject => {
            let countForThisSubject = questionsPerSubject;
            if (remainder > 0) {
                countForThisSubject++;
                remainder--;
            }

            // Shuffle and pick questions for this subject
            const subjectPool = availableQuestions[subject];
            shuffleArray(subjectPool);
            const pickedQuestions = subjectPool.slice(0, countForThisSubject);

            // Add subject property for grouping later
            pickedQuestions.forEach(q => q.subject = subject);
            finalQuestions.push(...pickedQuestions);

             // Initialize userAnswers object
             pickedQuestions.forEach(q => {
                userAnswers[q.id] = null; // Initialize answer as null
             });
        });


        // Re-sort the final list by subject priority for display order
        finalQuestions.sort((a, b) => {
             return SUBJECT_PRIORITY.indexOf(a.subject) - SUBJECT_PRIORITY.indexOf(b.subject);
        });

        return finalQuestions;
    }

    // Fisher-Yates Shuffle Algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }


    // --- Rendering Questions ---
    function renderQuestions() {
        questionsArea.innerHTML = ''; // Clear previous questions
        let currentSubject = null;
        let subjectGroupDiv = null;
        let questionCounter = 0; // Overall question number

        questionsToDisplay.forEach(q => {
            questionCounter++;
            // Create new subject group header if subject changes
            if (q.subject !== currentSubject) {
                currentSubject = q.subject;
                subjectGroupDiv = document.createElement('div');
                subjectGroupDiv.className = 'subject-group';
                subjectGroupDiv.innerHTML = `<h2>${currentSubject}</h2>`;
                questionsArea.appendChild(subjectGroupDiv);
            }

            // Create question card
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            questionCard.id = `q-${q.id}`; // ID for potential scrolling/linking

            const questionTextP = document.createElement('p');
            questionTextP.className = 'question-text';
            questionTextP.innerHTML = `<strong>${questionCounter}.</strong> ${q.questionText}`; // Add question number
            questionCard.appendChild(questionTextP);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options-group';
            optionsDiv.dataset.questionId = q.id; // Store question ID for answer tracking

            // Create options (radio buttons)
            q.options.forEach(opt => {
                const label = document.createElement('label');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = q.id; // Group radios by question ID
                radioInput.value = opt.id; // The value is the option ID (a, b, c, d)

                // Add event listener to update answer state
                radioInput.addEventListener('change', handleAnswerChange);

                const span = document.createElement('span');
                span.textContent = ` ${opt.text}`; // Add space before option text

                label.appendChild(radioInput);
                label.appendChild(span);
                optionsDiv.appendChild(label);
            });

            questionCard.appendChild(optionsDiv);
            subjectGroupDiv.appendChild(questionCard); // Add card to the current subject group
        });
    }

    // --- Timer Logic ---
    function startTimer() {
        updateTimerDisplay(); // Initial display
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                submitQuiz(true); // Force submit when time is up
            }
             // Add warning class when time is low (e.g., last minute)
             if(timeLeft <= 60 && !timerDisplaySpan.parentElement.classList.contains('warning')) {
                 timerDisplaySpan.parentElement.classList.add('warning');
             }

        }, 1000); // Update every second
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplaySpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // --- Answer Handling ---
    function handleAnswerChange(event) {
        const selectedOptionId = event.target.value;
        const questionId = event.target.name;
        userAnswers[questionId] = selectedOptionId;
        // console.log("User Answers:", userAnswers); // For debugging
    }

    // --- Back Button Logic ---
    backButton.addEventListener('click', () => {
        confirmationModal.style.display = 'flex'; // Show confirmation
    });

    confirmBackButton.addEventListener('click', () => {
        stopTimer(); // Stop timer if leaving
        clearLocalStorage(); // Clear config/progress
        window.location.href = 'see_setup.html'; // Go back to setup
    });

    cancelBackButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none'; // Hide modal
    });

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    // --- Submit Logic ---
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        submitQuiz(false); // Submit manually
    });

    function submitQuiz(isTimeOut = false) {
        stopTimer();
        submitButton.disabled = true; // Prevent double submission
        submitButton.textContent = 'Submitting...';

        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000); // Time in seconds

        // Prepare results data
        const quizResults = {
            questionsPresented: questionsToDisplay.map(q => ({ // Store only necessary info
                id: q.id,
                questionText: q.questionText,
                options: q.options,
                correctOptionId: q.correctOptionId,
                subject: q.subject
            })),
            userAnswers: userAnswers, // Already collected
            timeTaken: timeTaken,
            totalTimeAllowed: quizConfig.timeLimit * 60, // Store original limit
            wasTimeOut: isTimeOut,
            totalQuestions: quizConfig.numQuestions,
            subjectsSelected: quizConfig.selectedSubjects
        };

        // Store results in localStorage
        localStorage.setItem('seeQuizResults', JSON.stringify(quizResults));

        // Optionally clear the config so the same quiz isn't reloaded on back button
        // localStorage.removeItem('seeQuizConfig');

        // Redirect to results page
        window.location.href = 'see_result.html';
    }

    // --- Utility Functions ---
    function handleError(message) {
        console.error(message);
        // Display a user-friendly error message on the page
        questionsArea.innerHTML = `<p class="error-message">${message} Please <a href="see_setup.html">go back and try again</a>.</p>`;
        loadingState.classList.add('hidden'); // Hide loading indicator
        quizForm.classList.add('hidden'); // Hide form elements
        stopTimer(); // Ensure timer isn't running
    }

    function clearLocalStorage() {
         localStorage.removeItem('seeQuizConfig');
         // Don't clear results here, needed on the next page
    }


    // --- Start the Quiz ---
    initQuiz();
});
