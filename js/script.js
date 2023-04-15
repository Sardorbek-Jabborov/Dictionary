const toggleBtn = document.querySelector(".header__toggle__btn");
const input = document.getElementById("input");
const noFound = document.querySelector(".no_found");
const loader = document.getElementById("loader");
let audio;

const base = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const word = document.getElementById("word");
const result = document.getElementById("result");
const pronunciation = document.getElementById("pronunciation");
const definitions = document.getElementById("definitions");
const partOfSpeechP = document.getElementById("part-of-speech");
const wordContent = document.getElementById("word__content");
const form = document.getElementById("form");
const dictionary = document.getElementById("dictionary");
const type = document.getElementById("partOfSpeech");

//  ---- GET DATA FROM API ----- // UPDATED
const getData = async (word) => {
  const query = `${base}${word}`;
  loader.style.display = "block";
  noFound.style.display = "none";
  dictionary.innerHTML = "";
  try {
    const response = await fetch(query);
    const data = await response.json();

    if (data.title && data.title === "No Definitions Found") {
      error(word);
    } else {
      loader.style.display = "none";
      updateUI(data);
      localStorage.setItem("word", JSON.stringify(data));
    }
  } catch (error) {
    error(word);
  }
  window.location.hash = word;
};

if (JSON.parse(localStorage.getItem("word"))) {
  updateUI(JSON.parse(localStorage.getItem("word")));
}

// --GET WORD FROM FORM INPUT-- // NEW
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // form.classList.remove("error");
  // dictionary.innerHTML = ``;

  let wordValue = input.value.trim();

  if (wordValue != "") {
    form.classList.remove("error");
    getData(wordValue);
  } else if (wordValue == "") {
    form.classList.add("error");
  }
  form.reset();
});

// --GET WORD FROM INPUT-- // OLD
function getWord() {
  wordValue = word.value.trim();

  if (wordValue != "") {
    // getData(wordValue);
    console.log("IT IS WORKING");
  } else if (wordValue == "") {
    console.log("Empty Input");
    loader.style.display = "none";
  }
}

function updateUI(word) {
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  container.innerHTML = `
  <div class="dictionary__header">
    <div class="dictionary__word">
      <h1 class="heading-l text-black-2d" id="result">${word[0].word}</h1>
      <p
      class="dictionary__spelling heading-m text-purple"
      id="pronunciation"
      >
        ${word[0].phonetics[0].text}
      </p>
    </div>
    <button class="dictionary__audio" onclick="volume()">
      <i class="fa-sharp fa-solid fa-play"></i>
      </button>
  </div>
  `;

  for (let i = 0; i < word.length; i++) {
    let type = word[i].meanings;
    console.log(type);
    word[i].phonetics.map((phonetic) => {
      if (phonetic.audio) {
        audio = new Audio();
        audio.setAttribute("src", `${phonetic.audio}`);
      } else {
        audio.setAttribute("src", "");
      }
    });
    const meaningAndSynonymContainer = document.createElement("div");

    for (let i = 0; i < type.length; i++) {
      let finalWord = type[i];
      console.log(finalWord);

      const partOfSpeech = document.createElement("p");
      partOfSpeech.setAttribute("class", "heading-m text-black-2d");
      partOfSpeech.textContent = `${finalWord.partOfSpeech}`;

      const definitions = document.createElement("ul");
      definitions.setAttribute("class", "dictionary__definitions");

      for (let i = 0; i < finalWord.definitions.length; i++) {
        let definition = finalWord.definitions[i];

        const li = document.createElement("li");
        li.setAttribute("class", "dictionary__definition");
        li.innerHTML = `
        <span></span>
        <div id="definitions">
          <p class="body-m text-black-2d" id="definitions">
            ${definition.definition}
          </p>
          <p class="body-m text-gray-bold">${
            definition.example ? definition.example : ""
          }</p>
        </div>`;

        definitions.appendChild(li);
      }

      const partOfSpeechContainer = document.createElement("div");
      partOfSpeechContainer.setAttribute("class", "dictionary__part_of_speech");
      partOfSpeechContainer.innerHTML = `
        ${partOfSpeech.outerHTML}
        <span></span>
      `;

      const meaningContainer = document.createElement("div");
      meaningContainer.setAttribute("class", "dictionary__meaning");
      meaningContainer.innerHTML = `
        <p class="heading-s text-gray-bold">Meaning</p>
        ${definitions.outerHTML}
      `;

      const synonymContainer = document.createElement("div");
      synonymContainer.setAttribute("class", "dictionary__synonym");

      const synonymLink = document.createElement("a");
      synonymLink.setAttribute("class", "heading-s text-purple bold");
      synonymLink.setAttribute("target", "_blank");
      synonymLink.setAttribute(
        "href",
        finalWord.synonyms[0]
          ? `https://en.wiktionary.org/wiki/${finalWord.synonyms[0]}`
          : "https://en.wiktionary.org/wiki/Wiktionary:Main_Page"
      );
      synonymLink.innerHTML = `${
        finalWord.synonyms[0] ? finalWord.synonyms[0] : "not found"
      }`;

      const synonymTitle = document.createElement("p");
      synonymTitle.setAttribute("class", "heading-s text-gray-bold");
      synonymTitle.innerHTML = `Synonyms`;

      synonymContainer.appendChild(synonymTitle);
      synonymContainer.appendChild(synonymLink);

      meaningAndSynonymContainer.setAttribute("class", "dictionary__meanings");
      meaningAndSynonymContainer.innerHTML = `
        ${partOfSpeechContainer.outerHTML}
        ${meaningContainer.outerHTML}
        ${synonymContainer.outerHTML}
      `;

      container.appendChild(meaningAndSynonymContainer);
    }
  }
  const sourceContainer = document.createElement("div");
  sourceContainer.setAttribute("class", "dictionary__source");
  const sourceLink = document.createElement("a");
  sourceLink.setAttribute(
    "href",
    `https://en.wiktionary.org/wiki/${word[0].word}`
  );
  sourceLink.setAttribute("target", "_blank");
  sourceLink.setAttribute("class", "body-s text-gray-bold");
  sourceLink.textContent = "Source";
  const sourceText = document.createElement("a");
  sourceText.setAttribute(
    "href",
    `https://en.wiktionary.org/wiki/${word[0].word}`
  );
  sourceText.setAttribute("target", "_blank");
  sourceText.setAttribute("class", "body-s text-black-2d");
  sourceText.textContent = `https://en.wiktionary.org/wiki/${word[0].word}`;
  const sourceIcon = document.createElement("a");
  sourceIcon.setAttribute(
    "href",
    `https://en.wiktionary.org/wiki/${word[0].word}`
  );
  sourceIcon.setAttribute("target", "_blank");
  sourceIcon.innerHTML =
    '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
  sourceContainer.appendChild(sourceLink);
  sourceContainer.appendChild(sourceText);
  sourceContainer.appendChild(sourceIcon);
  container.appendChild(sourceContainer);
  dictionary.innerHTML = "";
  dictionary.appendChild(container);
}

const volume = () => {
  audio.play();
};

// ---- ERROR ----- //
const error = () => {
  loader.style.display = "none";
  noFound.style.display = "flex";
};

const savedDarkModeState = localStorage.getItem("darkMode");
if (savedDarkModeState === "on") {
  // If the saved state is "on", set the data-theme attribute
  document.body.setAttribute("data-theme", "dark");
  toggleBtn.classList.add("dark");
}

// ------- DARK MODE ------ //
const darkMode = () => {
  toggleBtn.classList.toggle("dark");

  // Toggle the data-theme attribute
  const isDarkModeOn = document.body.getAttribute("data-theme") === "dark";
  if (isDarkModeOn) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("darkMode", "off");
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("darkMode", "on");
  }
};
