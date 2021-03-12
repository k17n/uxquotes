const QUOTE_DOM_ELEMENTS = {
  quote: $(".quote"),
  author: $(".author"),
};
const HTML2CANVAS_CONFIG = {
  scale: 2,
  width: screen.width,
  height: screen.height,
  // onclone: function(document) {$('#siteLink').css({"display":"block","position": "absolute", "bottom": "20px","right": "20px"});}
};
const TOAST_MESSAGE = document.getElementById("toastMessage");
const TOAST_TIMEOUT = 3000;
let quotesData = [];

$(document).ready(function () {
  $.getJSON("/assets/data/quotes.json", function (data) {
    quotesData = data;
    showRandomQuote();
  });
});

const showRandomQuote = () => {
  // Create array of object keys, ["0", "1", ...]
  let keys = Object.keys(quotesData);

  // Generate random index based on number of keys
  let randomIndex = Math.floor(Math.random() * keys.length);

  // Select a key from the array of keys using the random index
  let randomKey = keys[randomIndex];

  // Use the key to get the corresponding quote from the "quotesData" object
  let randomQuote = quotesData[randomKey];

  QUOTE_DOM_ELEMENTS.quote.text(randomQuote.quote);
  QUOTE_DOM_ELEMENTS.author.text(`- ${randomQuote.author}`);

  confetti.start(1200, 50, 150);
};

const tweetQuote = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?hashtags=UXquotes%2CDailyUXMotivation&text=\"${QUOTE_DOM_ELEMENTS.quote.text()}\" ${QUOTE_DOM_ELEMENTS.author.text()}`;
  window.open(twitterUrl, "_blank");
};

const copyQuote = () => {
  const ELEMENT_TO_COPY = document.getElementById("quoteContainerInner");
  let range = document.createRange();
  range.selectNode(ELEMENT_TO_COPY);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy"); //NO I18N
  window.getSelection().removeAllRanges();
  TOAST_MESSAGE.classList.add('toast--show');
  setTimeout(function(){ TOAST_MESSAGE.classList.remove('toast--show'); }, TOAST_TIMEOUT);
};

const downloadQuote = () => {
  let currentTime = new Date();

  $("#confetti-canvas").attr("data-html2canvas-ignore", "true");
  confetti.pause();

  html2canvas(document.body, HTML2CANVAS_CONFIG).then(function (canvas) {
    saveAs(canvas.toDataURL(), `UXquotes-${currentTime.toLocaleString()}.png`);
    confetti.resume();
  });
};

const saveAs = (uri, filename) => {
  let link = document.createElement("a");

  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //Simulate click
    link.click();

    //Remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};
