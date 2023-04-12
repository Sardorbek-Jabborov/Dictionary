const base = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const word = document.getElementById("word");
const result = document.getElementById("result");
const pronunciation = document.getElementById("pronunciation");
const definitions = document.getElementById("definitions");
const audio = document.getElementById("audio");
const partOfSpeechP = document.getElementById("part-of-speech");
const wordContent = document.getElementById("word__content");
// const gettt = document.getElementById("gettt");

const getData = async (word) => {
  const query = `${base}${word}`;

  try {
    const response = await fetch(query);
    const data = await response.json();

    if (data.title && data.title === "No Definitions Found") {
      error(word);
    } else {
      updateUI(data);
    }
  } catch (error) {
    console.error(`Error fetching data for ${word}: ${error}`);
  }
};

function getWord() {
  wordValue = word.value.trim();

  if (wordValue != "") {
    getData(wordValue);
  }
}

const updateUI = (word) => {
  console.log(word);
  result.innerHTML = `${word[0].word}`;

  for (let i = 0; i < word.length; i++) {
    let type = word[i].meanings;
    pronunciation.innerHTML = `${word[i].phonetics[0].text}`;
    for (let i = 0; i < type.length; i++) {
      let finalWord = type[i];
      console.log(finalWord);

      const definitions = document.createElement("ul");
      definitions.setAttribute("id", "definitions");
      const p = document.createElement("p");
      p.setAttribute("id", "part-of-speech");
      p.textContent = finalWord.partOfSpeech;
      wordContent.appendChild(p);
      wordContent.appendChild(definitions);

      for (let i = 0; i < finalWord.definitions.length; i++) {
        let definition = finalWord.definitions[i];
        // console.log(definition.definition);
        definitions.innerHTML += `
      <li>
      ${definition.definition}
      </li>
      `;
      }
    }

    // console.log(word[i].phonetics);

    word[i].phonetics.map((phonetic) => {
      if (phonetic.audio) {
        console.log(audio);
      audio.innerHTML = "";
      audio.innerHTML = `
        <audio src="${phonetic.audio}" controls></audio>
      `;
      }
    });
  }
};

const error = (word) => {
  const result = document.getElementById("result");
  result.innerHTML = `THERE IS NO DEFINITION FOR "${word}"`;
  wordContent.textContent = "";
  audio.innerHTML = "";
  pronunciation.innerHTML = "";
};
