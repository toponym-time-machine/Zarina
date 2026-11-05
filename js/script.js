(() => {
  "use strict";

  const sections = [...document.querySelectorAll("[data-section]")];
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  let currentSection = "home";


  // MOBILE MENU

  function closeMenu() {
    mainNav.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }


  // PAGE NAVIGATION

  function showSection(name, updateHash = true) {

    const requested = sections.find(
      section => section.dataset.section === name
    );

    if (!requested) return;

    sections.forEach(section => {

      const active = section === requested;

      section.hidden = !active;

      section.classList.toggle("is-visible", active);

    });

    currentSection = name;

    navLinks.forEach(link => {

      const active =
        link.dataset.nav === name ||
        (name === "article" && link.dataset.nav === "investigations");

      link.classList.toggle("active", active);

    });

    closeMenu();

    if (updateHash) {

      const hash = name === "article"
        ? "investigations"
        : name;

      history.replaceState(null, "", `#${hash}`);

    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // NAVIGATION LINKS

  navLinks.forEach(link => {

    link.addEventListener("click", event => {

      event.preventDefault();

      showSection(link.dataset.nav);

    });

  });


  // MOBILE MENU BUTTON

  menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

  });


  // OPEN FULL ARTICLE

  function openArticle(slug) {

    const template = document.getElementById(`article-${slug}`);

    const destination = document.getElementById("article-content");

    if (!template || !destination) return;

    destination.replaceChildren(
      template.content.cloneNode(true)
    );

    showSection("article");

    setupImageFallbacks(destination);

  }


  // ARTICLE CARD CLICK EVENTS

  document.addEventListener("click", event => {

    const opener = event.target.closest("[data-open-article]");

    if (opener) {

      openArticle(opener.dataset.openArticle);

    }

  });


  // BACK TO INVESTIGATIONS

  document
    .getElementById("back-to-investigations")
    .addEventListener("click", () => {

      showSection("investigations");

    });



  // SEARCH AND FILTER SYSTEM

  const searchInput = document.getElementById("article-search");

  const archiveCards = [
    ...document.querySelectorAll(".archive-card")
  ];

  const filterButtons = [
    ...document.querySelectorAll(".filter-button")
  ];

  const noResults = document.getElementById("no-results");

  let activeFilter = "all";


  function filterArchive() {

    const query = (searchInput.value || "")
      .trim()
      .toLowerCase();

    let visible = 0;

    archiveCards.forEach(card => {

      const categoryMatch =
        activeFilter === "all" ||
        card.dataset.country === activeFilter;

      const textMatch =
        !query ||
        card.dataset.search.includes(query) ||
        card.textContent.toLowerCase().includes(query);

      const show = categoryMatch && textMatch;

      card.hidden = !show;

      if (show) visible++;

    });

    noResults.hidden = visible !== 0;

  }


  // SEARCH INPUT

  searchInput.addEventListener("input", filterArchive);


  // FILTER BUTTONS

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      activeFilter = button.dataset.filter;

      filterButtons.forEach(item => {

        item.classList.toggle("active", item === button);

      });

      filterArchive();

    });

  });



  // INTERACTIVE QUIZ

  const quizQuestions = [

    {
      category: "SILICON VALLEY · USA",

      question: "What does “silicon” in Silicon Valley refer to?",

      options: [
        "A type of mountain rock",
        "A material used in semiconductor chips",
        "The name of a famous inventor"
      ],

      answer: 1,

      explanation:
        "Correct. Silicon is a material used in semiconductors. The name originally linked the Santa Clara Valley with its growing chip industry; today it can represent the wider technology sector."
    },


    {
      category: "THE BLACK COUNTRY · ENGLAND",

      question:
        "What is the cultural background behind “black by day and red by night”?",

      options: [
        "The colours of the region’s flag",
        "Smoke by day and glowing industrial furnaces at night",
        "A local legend about the weather"
      ],

      answer: 1,

      explanation:
        "Correct. Elihu Burritt’s 1862 description refers to industrial smoke and the glow of furnaces. The phrase connects the name with the region’s industrial past."
    },


    {
      category: "CANARY WHARF · LONDON",

      question: "Why is the area called Canary Wharf?",

      options: [
        "Canaries were bred there",
        "It was named after a ship captain",
        "A dock handled fruit from the Canary Islands"
      ],

      answer: 2,

      explanation:
        "Correct. A quay and warehouse in the West India Docks handled produce from the Canary Islands. The old trading name later became the name of London’s financial district."
    },


    {
      category: "BOZZHYRA · KAZAKHSTAN",

      question:
        "Which statement about the name Bozzhyra is the most careful?",

      options: [
        "Its etymology has only one universally agreed translation",
        "One interpretation connects “boz” with a pale colour and “zhyra” with a ravine",
        "It is the Kazakh word for a city"
      ],

      answer: 1,

      explanation:
        "Correct. One linguistic interpretation connects “boz” with pale or greyish colour and “zhyra” with a ravine or gully. The interpretation should be presented cautiously because explanations are not identical in every source."
    },


    {
      category: "KOLSAI LAKES · KAZAKHSTAN",

      question:
        "What does “Kolsai” commonly mean in the name Kolsai Lakes?",

      options: [
        "Lake in the gorge",
        "Blue mountain",
        "Forest of birches"
      ],

      answer: 0,

      explanation:
        "Correct. The name is commonly explained from Kazakh “köl” (lake) and “say” (gorge or ravine), often rendered as “lake in the gorge”."
    }

  ];


  let quizIndex = 0;

  let quizScore = 0;

  let hasAnswered = false;


  // QUIZ ELEMENTS

  const quizCounter = document.getElementById("quiz-counter");

  const quizProgressLabel = document.getElementById("quiz-progress-label");

  const quizProgressBar = document.getElementById("quiz-progress-bar");

  const quizCategory = document.getElementById("quiz-category");

  const quizQuestion = document.getElementById("quiz-question");

  const quizOptions = document.getElementById("quiz-options");

  const quizFeedback = document.getElementById("quiz-feedback");

  const quizNext = document.getElementById("quiz-next");

  const quizCard = document.getElementById("quiz-card");

  const quizResult = document.getElementById("quiz-result");



  // RENDER QUIZ QUESTION

  function renderQuizQuestion() {

    const item = quizQuestions[quizIndex];

    hasAnswered = false;

    quizCounter.textContent =
      `QUESTION ${String(quizIndex + 1).padStart(2, "0")} / ${String(quizQuestions.length).padStart(2, "0")}`;

    quizProgressLabel.textContent =
      `${Math.round((quizIndex / quizQuestions.length) * 100)}% COMPLETE`;

    quizProgressBar.style.width =
      `${(quizIndex / quizQuestions.length) * 100}%`;

    quizCategory.textContent = item.category;

    quizQuestion.textContent = item.question;

    quizFeedback.hidden = true;

    quizFeedback.textContent = "";

    quizNext.hidden = true;

    quizNext.textContent =
      quizIndex === quizQuestions.length - 1
        ? "See your result"
        : "Next question →";


    quizOptions.replaceChildren();


    item.options.forEach((option, index) => {

      const button = document.createElement("button");

      button.type = "button";

      button.className = "quiz-option";

      button.dataset.answer = String(index);


      const letter = document.createElement("span");

      letter.textContent = String.fromCharCode(65 + index);


      const label = document.createElement("b");

      label.textContent = option;


      const arrow = document.createElement("i");

      arrow.textContent = "↗";


      button.append(letter, label, arrow);


      button.addEventListener("click", () => {

        chooseQuizAnswer(index, button);

      });


      quizOptions.append(button);

    });

  }



  // CHECK ANSWER

  function chooseQuizAnswer(index, chosenButton) {

    if (hasAnswered) return;

    hasAnswered = true;

    const item = quizQuestions[quizIndex];

    const correct = index === item.answer;

    if (correct) quizScore++;


    [...quizOptions.querySelectorAll("button")].forEach(button => {

      button.disabled = true;

      const answer = Number(button.dataset.answer);

      if (answer === item.answer) {

        button.classList.add("correct");

      } else if (button === chosenButton) {

        button.classList.add("incorrect");

      }

    });


    quizFeedback.innerHTML =
      `<strong>${correct ? "That’s right!" : "Not quite — here is the clue."}</strong> ${item.explanation}`;

    quizFeedback.hidden = false;

    quizNext.hidden = false;


    quizProgressLabel.textContent =
      `${Math.round(((quizIndex + 1) / quizQuestions.length) * 100)}% COMPLETE`;

    quizProgressBar.style.width =
      `${((quizIndex + 1) / quizQuestions.length) * 100}%`;

  }



  // NEXT QUESTION

  quizNext.addEventListener("click", () => {

    if (!hasAnswered) return;

    quizIndex++;


    if (quizIndex < quizQuestions.length) {

      renderQuizQuestion();

    } else {

      quizCard.hidden = true;

      quizResult.hidden = false;


      document.getElementById("quiz-score").textContent =
        `${quizScore} / ${quizQuestions.length}`;


      const message = quizScore === 5

        ? "Excellent work. You can recognise how place names preserve history, language and cultural memory."

        : quizScore >= 3

          ? "Good investigation. Review the articles and look for the cultural clues behind the names you missed."

          : "Every investigation takes practice. Revisit the five reports and try the quiz again.";


      document.getElementById("quiz-result-message").textContent =
        message;


      quizProgressLabel.textContent = "100% COMPLETE";

      quizProgressBar.style.width = "100%";

    }

  });



  // RESTART QUIZ

  document.getElementById("quiz-restart").addEventListener("click", () => {

    quizIndex = 0;

    quizScore = 0;

    quizResult.hidden = true;

    quizCard.hidden = false;

    renderQuizQuestion();

  });



  // IMAGE FALLBACK SYSTEM

  function setupImageFallbacks(root = document) {

    root.querySelectorAll(".image-frame img").forEach(img => {

      if (img.complete && img.naturalWidth === 0) {

        img.parentElement.classList.add("is-missing");

      }


      img.addEventListener("error", () => {

        img.parentElement.classList.add("is-missing");

      }, { once: true });


      img.addEventListener("load", () => {

        img.parentElement.classList.remove("is-missing");

      }, { once: true });

    });

  }



  // INITIAL PAGE

  function loadInitialSection() {

    const hash = window.location.hash.replace("#", "");

    if (
      ["home", "investigations", "comparison", "quiz", "sources"].includes(hash)
    ) {

      showSection(hash, false);

    } else {

      showSection("home", false);

    }

  }



  // START WEBSITE

  setupImageFallbacks();

  renderQuizQuestion();

  loadInitialSection();

})();