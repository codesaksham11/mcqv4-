// File: ktm_mcq.js
import { questionBank } from './ktm_questions.js';

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
    let questionsToDisplay = [];
    let timerInterval = null;
    let timeLeft = 0;
    let startTime = null;
    let userAnswers = {};

    // ** KTM Specific **
    // Base weights for proportional distribution
    const TOPIC_WEIGHTS = { English: 30, Science: 30, Math: 30, GK: 10 };
    const SCIENCE_SUB_TOPICS = ["Physics", "Chemistry", "Biology"];
    // Priority for distributing Science remainder
    const SCIENCE_REMAINDER_PRIORITY = ["Physics", "Chemistry", "Biology"];
    // Desired display order
    const DISPLAY_ORDER = ["English", "Physics", "Chemistry", "Biology", "Math", "GK"];
    const LOCAL_STORAGE_KEY_CONFIG = 'ktmQuizConfig';
    const LOCAL_STORAGE_KEY_RESULTS = 'ktmQuizResults';
    const SETUP_PAGE_URL = 'ktm_setup.html';
    const RESULT_PAGE_URL = 'ktm_result.html';

    // --- Initialization ---
    function initQuiz() {
        startTime = Date.now();
        const configString = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
        if (!configString) {
            handleError(`Quiz configuration not found. Please <a href="${SETUP_PAGE_URL}">set up the quiz</a> first.`);
            return;
        }
        quizConfig = JSON.parse(configString);

        if (!quizConfig.numQuestions || !quizConfig.timeLimit || !quizConfig.selectedTopics || quizConfig.selectedTopics.length === 0) {
            handleError(`Invalid quiz configuration. Please <a href="${SETUP_PAGE_URL}">set up the quiz</a> again.`);
            return;
        }

        questionsToDisplay = selectQuestionsProportionally();
        if (!questionsToDisplay || questionsToDisplay.length === 0) {
             handleError(`Could not load questions based on your settings. Please <a href="${SETUP_PAGE_URL}">try again</a>.`);
             return;
        }
        // Update config count if it changed during selection
        quizConfig.numQuestions = questionsToDisplay.length;

        renderQuestions();
        timeLeft = quizConfig.timeLimit * 60;
        startTimer();

        loadingState.classList.add('hidden');
        quizForm.classList.remove('hidden');
    }

    // --- Proportional Question Selection ---
    function selectQuestionsProportionally() {
        const { numQuestions, selectedTopics } = quizConfig;
        let finalQuestions = [];
        let topicCounts = {}; // Stores how many questions per final topic (incl. sub-topics)

        // 1. Calculate total weight of SELECTED topics
        let totalSelectedWeight = 0;
        selectedTopics.forEach(topic => {
            totalSelectedWeight += TOPIC_WEIGHTS[topic] || 0;
        });

        if (totalSelectedWeight === 0) {
            console.error("Error: No valid selected topics found or weights missing.");
            return [];
        }

        // 2. Calculate initial counts per selected TOPIC (handling rounding)
        let calculatedTotal = 0;
        selectedTopics.forEach(topic => {
            const proportion = (TOPIC_WEIGHTS[topic] || 0) / totalSelectedWeight;
            topicCounts[topic] = Math.round(proportion * numQuestions);
            calculatedTotal += topicCounts[topic];
        });

        // 3. Adjust for rounding errors
        let difference = numQuestions - calculatedTotal;
        if (difference !== 0) {
            // Add/subtract difference from the topic with the highest weight among selected
             const sortedSelectedByWeight = [...selectedTopics].sort((a, b) => (TOPIC_WEIGHTS[b] || 0) - (TOPIC_WEIGHTS[a] || 0));
             topicCounts[sortedSelectedByWeight[0]] += difference;
        }

        // 4. Handle Science Sub-distribution
        if (selectedTopics.includes("Science") && topicCounts["Science"] > 0) {
            const scienceCount = topicCounts["Science"];
            const baseSubCount = Math.floor(scienceCount / SCIENCE_SUB_TOPICS.length);
            let scienceRemainder = scienceCount % SCIENCE_SUB_TOPICS.length;

            // Distribute base count and remainder
            SCIENCE_SUB_TOPICS.forEach(subTopic => {
                 let countForSub = baseSubCount;
                 // Give remainder based on priority
                 if (scienceRemainder > 0 && SCIENCE_REMAINDER_PRIORITY.includes(subTopic)) {
                     // Check if sub-topic is prioritized for remainder
                     const priorityIndex = SCIENCE_REMAINDER_PRIORITY.indexOf(subTopic);
                      if(priorityIndex < scienceRemainder) { // Distribute until remainder runs out
                         countForSub++;
                         // This logic isn't quite right. Simpler: give to first N priority topics
                     }
                 }
                 topicCounts[subTopic] = countForSub; // Store sub-topic count
            });

             // Corrected Remainder Distribution for Science:
             let assignedRemainder = 0;
             SCIENCE_REMAINDER_PRIORITY.forEach(subTopic => {
                 if (assignedRemainder < scienceRemainder) {
                     topicCounts[subTopic]++;
                     assignedRemainder++;
                 }
             });

            delete topicCounts["Science"]; // Remove the general Science count
        }

        // 5. Fetch Questions for each final topic/sub-topic
        const allTopicsToFetch = Object.keys(topicCounts);
        allTopicsToFetch.forEach(topic => {
            const count = topicCounts[topic];
            if (count > 0 && questionBank[topic]) {
                const pool = [...questionBank[topic]]; // Copy pool
                shuffleArray(pool);
                const picked = pool.slice(0, Math.min(count, pool.length)); // Don't exceed available

                // Add the actual subject name (Physics, Chem, Bio, Math etc.)
                picked.forEach(q => {
                    q.subject = topic;
                    userAnswers[q.id] = null; // Initialize answer
                });
                finalQuestions.push(...picked);

                if(picked.length < count){
                     console.warn(`Warning: Not enough questions available for ${topic}. Picked ${picked.length} out of ${count} requested.`);
                }
            } else if(count > 0) {
                 console.warn(`Warning: Topic "${topic}" requested but no questions found in ktm_questions.js`);
            }
        });

         // 6. Sort the final array based on DISPLAY_ORDER
         finalQuestions.sort((a, b) => {
             return DISPLAY_ORDER.indexOf(a.subject) - DISPLAY_ORDER.indexOf(b.subject);
         });

        return finalQuestions;
    }


    // Fisher-Yates Shuffle (same as before)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Rendering Questions (Add Icons) ---
    function renderQuestions() {
        questionsArea.innerHTML = '';
        let currentSubject = null;
        let subjectGroupDiv = null;
        let questionCounter = 0;

        // Icons mapping (customize as needed)
        const subjectIcons = {
             English: "fas fa-language",
             Physics: "fas fa-atom",
             Chemistry: "fas fa-flask",
             Biology: "fas fa-dna",
             Math: "fas fa-calculator",
             GK: "fas fa-globe-asia"
        };

        questionsToDisplay.forEach(q => {
            questionCounter++;
            if (q.subject !== currentSubject) {
                currentSubject = q.subject;
                subjectGroupDiv = document.createElement('div');
                subjectGroupDiv.className = 'subject-group';
                const iconClass = subjectIcons[currentSubject] || "fas fa-question-circle"; // Default icon
                subjectGroupDiv.innerHTML = `<h2><i class="${iconClass}"></i> ${currentSubject}</h2>`;
                questionsArea.appendChild(subjectGroupDiv);
            }

            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            questionCard.id = `q-${q.id}`;

            const questionTextP = document.createElement('p');
            questionTextP.className = 'question-text';
            questionTextP.innerHTML = `<strong>${questionCounter}.</strong> ${q.questionText}`;
            questionCard.appendChild(questionTextP);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options-group';
            optionsDiv.dataset.questionId = q.id;

            q.options.forEach(opt => {
                const label = document.createElement('label');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = q.id;
                radioInput.value = opt.id;
                radioInput.addEventListener('change', handleAnswerChange);

                const span = document.createElement('span');
                span.textContent = ` ${opt.text}`;

                label.appendChild(radioInput);
                label.appendChild(span);
                optionsDiv.appendChild(label);
            });

            questionCard.appendChild(optionsDiv);
            if (subjectGroupDiv) {
                subjectGroupDiv.appendChild(questionCard);
            } else {
                 console.error("Error: Could not find subject group div for question:", q);
                 questionsArea.appendChild(questionCard); // Fallback append
            }
        });
    }

    // --- Timer Logic (same) ---
    function startTimer() { /* ... same as basic_mcq.js ... */ updateTimerDisplay(); timerInterval = setInterval(() => { timeLeft--; updateTimerDisplay(); if (timeLeft <= 0) { submitQuiz(true); } if(timeLeft <= 60 && !timerDisplaySpan.parentElement.classList.contains('warning')) { timerDisplaySpan.parentElement.classList.add('warning'); } }, 1000); }
    function updateTimerDisplay() { /* ... same as basic_mcq.js ... */ const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60; timerDisplaySpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; }
    function stopTimer() { /* ... same as basic_mcq.js ... */ clearInterval(timerInterval); timerInterval = null; }

    // --- Answer Handling (same) ---
    function handleAnswerChange(event) { userAnswers[event.target.name] = event.target.value; }

    // --- Back Button Logic ---
    backButton.addEventListener('click', () => confirmationModal.style.display = 'flex');
    confirmBackButton.addEventListener('click', () => { stopTimer(); clearLocalStorage(); window.location.href = SETUP_PAGE_URL; });
    cancelBackButton.addEventListener('click', () => confirmationModal.style.display = 'none');
    window.addEventListener('click', (event) => { if (event.target == confirmationModal) confirmationModal.style.display = 'none'; });

    // --- Submit Logic ---
    quizForm.addEventListener('submit', (event) => { event.preventDefault(); submitQuiz(false); });

    function submitQuiz(isTimeOut = false) {
        stopTimer();
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'; // Loading state

        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);

        const quizResults = {
            questionsPresented: questionsToDisplay.map(q => ({ id: q.id, questionText: q.questionText, options: q.options, correctOptionId: q.correctOptionId, subject: q.subject })),
            userAnswers: userAnswers,
            timeTaken: timeTaken,
            totalTimeAllowed: quizConfig.timeLimit * 60,
            wasTimeOut: isTimeOut,
            totalQuestions: quizConfig.numQuestions, // Use final count
            // Store the originally selected topics (e.g., "Science", "Math")
            topicsSelectedOriginal: quizConfig.selectedTopics
        };

        localStorage.setItem(LOCAL_STORAGE_KEY_RESULTS, JSON.stringify(quizResults));
        window.location.href = RESULT_PAGE_URL;
    }

    // --- Utility Functions ---
    function handleError(messageHtml) { /* ... same as basic_mcq.js ... */ console.error(messageHtml.replace(/<[^>]*>/g, '')); questionsArea.innerHTML = `<p class="error-message" style="color: #e74c3c; background: rgba(44,62,80,0.8); padding: 15px; border-radius: 5px;">${messageHtml}</p>`; loadingState.classList.add('hidden'); quizForm.classList.add('hidden'); stopTimer(); }
    function clearLocalStorage() { localStorage.removeItem(LOCAL_STORAGE_KEY_CONFIG); }

    // --- Start ---
    initQuiz();
});
