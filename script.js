const clickSound = document.getElementById('clickSound');

// Utility to show popup
function showPopup(message, duration = 2000) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => popup.style.display = 'none', duration);
}

// Index Page
if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    const cards = document.querySelectorAll('.level-card');
    const modal = document.getElementById('codeModal');
    const levelName = document.getElementById('levelName');
    const levelPrice = document.getElementById('levelPrice');
    const codeInput = document.getElementById('codeInput');
    const submitCode = document.getElementById('submitCode');
    const closeModal = document.getElementById('closeModal');
    const prices = { see: 80, basic: 100, ktm: 150 };

    cards.forEach(card => {
        if (localStorage.getItem(`code_${card.dataset.level}`)) {
            card.classList.add('unlocked');
        }
        card.addEventListener('click', () => {
            if (!localStorage.getItem(`code_${card.dataset.level}`)) {
                levelName.textContent = card.textContent;
                levelPrice.textContent = prices[card.dataset.level];
                modal.style.display = 'block';
                codeInput.dataset.level = card.dataset.level;
                clickSound.play();
            } else {
                window.location.href = `/selection.html?level=${card.dataset.level}`;
            }
        });
    });

    submitCode.addEventListener('click', async () => {
        const level = codeInput.dataset.level;
        const code = codeInput.value.trim();
        const response = await fetch('/api/validate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, code })
        });
        const result = await response.json();
        if (result.status === 'accepted') {
            localStorage.setItem(`code_${level}`, 'true');
            showPopup('Token Accepted!');
            modal.style.display = 'none';
            document.querySelector(`[data-level="${level}"]`).classList.add('unlocked');
        } else {
            showPopup('Invalid Code');
        }
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');
}

// Selection Page
if (window.location.pathname === '/selection.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const questionCount = document.getElementById('questionCount');
    const questionCountValue = document.getElementById('questionCountValue');
    const timeLimit = document.getElementById('timeLimit');
    const timeLimitValue = document.getElementById('timeLimitValue');
    const subjectSelection = document.getElementById('subjectSelection');
    const startTest = document.getElementById('startTest');
    const quantityError = document.getElementById('quantityError');
    const priceNote = document.getElementById('priceNote');
    const prices = { see: 80, basic: 100, ktm: 150 };

    priceNote.textContent = `This level requires a code. Price: ${prices[level]}`;
    if (level !== 'see') subjectSelection.style.display = 'none';

    questionCount.addEventListener('input', () => {
        questionCountValue.textContent = questionCount.value;
        validateQuantity();
    });
    timeLimit.addEventListener('input', () => timeLimitValue.textContent = timeLimit.value);

    function validateQuantity() {
        if (questionCount.value < 1 || questionCount.value > 100) {
            quantityError.textContent = 'Please select between 1 and 100 questions';
            return false;
        }
        quantityError.textContent = '';
        return true;
    }

    startTest.addEventListener('click', () => {
        const subjects = level === 'see' ? Array.from(document.querySelectorAll('input[name="subject"]:checked')).map(cb => cb.value) : [];
        if (level === 'see' && subjects.length === 0) {
            showPopup('Please select at least one subject');
            return;
        }
        if (!validateQuantity()) {
            showPopup('Questions must be between 1 and 100');
            return;
        }
        if (timeLimit.value < 1 || timeLimit.value > 180) {
            showPopup('Time must be between 1 and 180 minutes');
            return;
        }
        const config = { level, questions: questionCount.value, time: timeLimit.value, subjects };
        localStorage.setItem('testConfig', JSON.stringify(config));
        window.location.href = `/mcq.html?level=${level}`;
    });
}

// MCQ Page
if (window.location.pathname === '/mcq.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const config = JSON.parse(localStorage.getItem('testConfig'));
    const questionsContainer = document.getElementById('questionsContainer');
    const timer = document.getElementById('timer');
    const submitTest = document.getElementById('submitTest');

    fetch(`/${level}_questions.json`)
        .then(res => res.json())
        .then(data => {
            const questions = generateQuestions(data, config);
            renderQuestions(questions);
            startTimer(config.time * 60);
        });

    function generateQuestions(data, config) {
        const subjects = config.level === 'see' ? config.subjects : ['math', 'physics', 'chemistry', 'biology', 'english'];
        const perSubject = Math.floor(config.questions / subjects.length);
        const remainder = config.questions % subjects.length;
        let selected = [];
        
        subjects.forEach(subject => {
            const subjectQuestions = data.filter(q => q.subject === subject);
            const count = perSubject + (remainder && subjects.indexOf(subject) === 0 ? remainder : 0);
            selected = selected.concat(shuffle(subjectQuestions).slice(0, count));
        });
        
        return shuffle(selected.slice(0, config.questions));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderQuestions(questions) {
        let currentSubject = '';
        questions.forEach((q, i) => {
            if (q.subject !== currentSubject) {
                currentSubject = q.subject;
                const subheader = document.createElement('div');
                subheader.className = 'subheader';
                subheader.textContent = `${currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Questions`;
                questionsContainer.appendChild(subheader);
            }
            const div = document.createElement('div');
            div.className = 'question';
            div.innerHTML = `
                <p>${i + 1}. ${q.question}</p>
                <label><input type="radio" name="q${i}" value="a"> ${q.options.a}</label><br>
                <label><input type="radio" name="q${i}" value="b"> ${q.options.b}</label><br>
                <label><input type="radio" name="q${i}" value="c"> ${q.options.c}</label><br>
                <label><input type="radio" name="q${i}" value="d"> ${q.options.d}</label>
            `;
            div.querySelectorAll('input').forEach(input => input.addEventListener('click', () => clickSound.play()));
            questionsContainer.appendChild(div);
        });
    }

    function startTimer(seconds) {
        let timeLeft = seconds;
        const interval = setInterval(() => {
            timeLeft--;
            timer.textContent = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                submitQuiz(true);
            }
        }, 1000);

        submitTest.addEventListener('click', () => {
            clearInterval(interval);
            submitQuiz(false);
        });
    }

    function submitQuiz(timedOut) {
        const answers = [];
        document.querySelectorAll('.question').forEach((q, i) => {
            const selected = q.querySelector(`input[name="q${i}"]:checked`);
            answers.push({ question: i, answer: selected ? selected.value : null });
        });
        localStorage.setItem('answers', JSON.stringify(answers));
        localStorage.setItem('timeTaken', timedOut ? 'Time Out' : `${config.time * 60 - document.querySelectorAll('.question').length} seconds`);
        window.location.href = `/result.html?result=${level}`;
    }
}

// Result Page
if (window.location.pathname === '/result.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('result');
    const config = JSON.parse(localStorage.getItem('testConfig'));
    const answers = JSON.parse(localStorage.getItem('answers'));
    const timeTaken = localStorage.getItem('timeTaken');
    const scoreEl = document.getElementById('score');
    const timeTakenEl = document.getElementById('timeTaken');
    const feedbackEl = document.getElementById('feedback');
    const showDetails = document.getElementById('showDetails');
    const detailsContainer = document.getElementById('detailsContainer');

    fetch(`/${level}_questions.json`)
        .then(res => res.json())
        .then(data => {
            const questions = generateQuestions(data, config);
            let score = 0;
            answers.forEach((a, i) => {
                if (a.answer === questions[i].correct) score++;
            });
            const total = answers.length;
            scoreEl.textContent = `${score}/${total}`;
            timeTakenEl.textContent = timeTaken;
            timeTakenEl.style.color = timeTaken === 'Time Out' ? 'red' : 'inherit';
            const percentage = (score / total) * 100;
            feedbackEl.textContent = percentage === 100 ? 'Perfect! You nailed it!' :
                percentage >= 80 ? 'Appreciable!' :
                percentage >= 50 ? 'Little more effort!' :
                percentage >= 25 ? 'Needs more practice!' : 'Try harder!';
            feedbackEl.style.backgroundColor = percentage === 100 ? '#28a745' : '#007bff';
            feedbackEl.style.color = '#fff';
            feedbackEl.style.padding = '10px';

            showDetails.addEventListener('click', () => {
                detailsContainer.classList.toggle('details-hidden');
                detailsContainer.classList.toggle('details-visible');
                if (detailsContainer.innerHTML) return;
                questions.forEach((q, i) => {
                    const div = document.createElement('div');
                    div.className = 'question';
                    const selected = answers[i].answer;
                    const correct = q.correct;
                    div.innerHTML = `
                        <p>${i + 1}. ${q.question}</p>
                        <p>a) ${q.options.a} ${correct === 'a' ? '✓' : selected === 'a' && selected !== correct ? '✗' : ''}</p>
                        <p>b) ${q.options.b} ${correct === 'b' ? '✓' : selected === 'b' && selected !== correct ? '✗' : ''}</p>
                        <p>c) ${q.options.c} ${correct === 'c' ? '✓' : selected === 'c' && selected !== correct ? '✗' : ''}</p>
                        <p>d) ${q.options.d} ${correct === 'd' ? '✓' : selected === 'd' && selected !== correct ? '✗' : ''}</p>
                    `;
                    div.className += selected === correct ? ' correct' : selected ? ' wrong' : ' skipped';
                    detailsContainer.appendChild(div);
                });
            });
        });
}
