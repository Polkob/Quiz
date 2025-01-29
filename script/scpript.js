document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector("[data-preload]");
    const beginBtn = document.querySelector(".begin");
    const instructionsDialog = document.querySelector('.instructions');
    const exitBtn = document.querySelector(".exit");
    const continueBtn = document.querySelector(".continue");
    const startScreen = document.querySelector(".start-screen");
    const quiz = document.querySelector(".quiz");
    const container = document.querySelector(".container");
    const containerSettings = document.querySelector(".container-settings");
  
  continueBtn.addEventListener("click", () => {
    container.classList.remove("hide");
  });
  
    beginBtn.addEventListener("click", showInstructions);
  
    function showInstructions() {
      instructionsDialog.showModal();
    }
  
    function closeInstructions() {
      instructionsDialog.close();
    }
  
    exitBtn.addEventListener('click', closeInstructions);
  
    continueBtn.addEventListener("click", () => {
      container.classList.remove("hide");
      containerSettings.classList.add("hide");
      closeInstructions(); 
    });
    
    window.addEventListener("load", function () {
      preloader.classList.add("loaded");
      document.body.classList.add("loaded");
    });
  
    const showConfetti = () => {
      let W = window.innerWidth;
      let H = window.innerHeight;
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      const particles = [];
      const particleCount = 150;
  
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H - H,
          r: Math.random() * 10 + 5,
          d: Math.random() * particleCount,
          color: randomColor(),
        });
      }
  
      function randomColor() {
        const colors = [
          "DodgerBlue",
          "OliveDrab",
          "Gold",
          "Pink",
          "SlateBlue",
          "LightBlue",
          "Gold",
          "Violet",
          "PaleGreen",
          "SteelBlue",
          "SandyBrown",
          "Chocolate",
          "Crimson"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
  
      function draw() {
        context.clearRect(0, 0, W, H);
  
        particles.forEach((particle) => {
          context.beginPath();
          context.fillStyle = particle.color;
          context.moveTo(particle.x, particle.y);
          context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2, true);
          context.fill();
  
          particle.y += 3;
  
          if (particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -10;
          }
        });
  
        requestAnimationFrame(draw);
      }
  
      canvas.width = W;
      canvas.height = H;
      draw();
    };
  
    const progressBar = document.querySelector(".progress-bar"),
      progressText = document.querySelector(".progress-text");
  
    const progress = (value) => {
      const percentage = (value / time) * 100;
      progressBar.style.width = `${percentage}%`;
      progressText.innerHTML = `${value}`;
    };
  
    const startBtn = document.querySelector(".start"),
      numQuestions = document.querySelector("#num-questions"),
      category = document.querySelector("#category"),
      difficulty = document.querySelector("#difficulty"),
      timePerQuestion = document.querySelector("#time");
  
    let questions = [],
      time = 30,
      score = 0,
      currentQuestion,
      timer;
  
      const startQuiz = () => {
        const num = numQuestions.value;
        loadingAnimation();
        
        const url = 'question.json';
        
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };
    
            shuffleArray(data);
            questions = data.slice(0, num);
            setTimeout(() => {
                startScreen.classList.add("hide");
                quiz.classList.remove("hide");
                currentQuestion = 1;
                showQuestion(questions[0]);
            }, 1000);
          });
    };
  
    startBtn.addEventListener("click", startQuiz);
  
    const showQuestion = (question) => {
      const questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper");
      questionNumber = document.querySelector(".number");
  
      questionText.innerHTML = question.question;
  
      const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
      ];
      answersWrapper.innerHTML = "";
      answers.sort(() => Math.random() - 0.5);
      answers.forEach((answer) => {
        answersWrapper.innerHTML += `
            <div class="answer ">
              <span class="text">${answer}</span>
              <span class="checkbox">
                <i class="fas fa-check"></i>
              </span>
            </div>
          `;
      });
  
      questionNumber.innerHTML = ` Вопрос <span class="current">${
        questions.indexOf(question) + 1
      }</span>
              <span class="total">/${questions.length}</span>`;
  
      const answersDiv = document.querySelectorAll(".answer");
      answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
          if (!answer.classList.contains("checked")) {
            answersDiv.forEach((answer) => {
              answer.classList.remove("selected");
            });
            answer.classList.add("selected");
            submitBtn.disabled = false;
          }
        });
      });
  
      time = timePerQuestion.value;
      startTimer(time);
    };
  
    const playAudio = () => {
      const audio = document.querySelector("#countdownAudio");
      audio.play();
    };
  
    const startTimer = (time) => {
      timer = setInterval(() => {
        if (time >= 0) {
          progress(time);
          time--;
        } else {
          checkAnswer();
        }
      }, 1000);
    };
  
    const loadingAnimation = () => {
      startBtn.innerHTML = "Загрузка";
      const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
          startBtn.innerHTML = "Загрузка";
        } else {
          startBtn.innerHTML += ".";
        }
      }, 500);
    };
  
    const submitBtn = document.querySelector(".submit"),
      nextBtn = document.querySelector(".next");
    submitBtn.addEventListener("click", () => {
      checkAnswer();
    });
  
    nextBtn.addEventListener("click", () => {
      nextQuestion();
      submitBtn.style.display = "block";
      nextBtn.style.display = "none";
    });
  
    const checkAnswer = () => {
      clearInterval(timer);
      const selectedAnswer = document.querySelector(".answer.selected");
      if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        console.log(currentQuestion);
        if (answer === questions[currentQuestion - 1].correct_answer) {
          score++;
          selectedAnswer.classList.add("correct");
        } else {
          selectedAnswer.classList.add("wrong");
          const correctAnswer = document
            .querySelectorAll(".answer")
            .forEach((answer) => {
              if (
                answer.querySelector(".text").innerHTML ===
                questions[currentQuestion - 1].correct_answer
              ) {
                answer.classList.add("correct");
              }
            });
        }
      } else {
        const correctAnswer = document
          .querySelectorAll(".answer")
          .forEach((answer) => {
            if (
              answer.querySelector(".text").innerHTML ===
              questions[currentQuestion - 1].correct_answer
            ) {
              answer.classList.add("correct");
            }
          });
      }
      const answersDiv = document.querySelectorAll(".answer");
      answersDiv.forEach((answer) => {
        answer.classList.add("checked");
      });
  
      submitBtn.style.display = "none";
      nextBtn.style.display = "block";
    };
  
    const nextQuestion = () => {
      if (currentQuestion < questions.length) {
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
      } else {
        showScore();
      }
    };
  
    const endScreen = document.querySelector(".end-screen"),
      finalScore = document.querySelector(".final-score"),
      totalScore = document.querySelector(".total-score");
  
    const showScore = () => {
      endScreen.classList.remove("hide");
      quiz.classList.add("hide");
      finalScore.innerHTML = score;
      totalScore.innerHTML = `/ ${questions.length}`;
  
      showConfetti();
  
      const canvas = document.getElementById("canvas");
      canvas.classList.remove("hide");
    };
  
    const restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });
  });