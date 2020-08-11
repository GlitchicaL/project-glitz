let quote = document.querySelector(".quote"); // Quote the user is expected to type
let author = document.querySelector(".quote-author"); // Author of the quote
let wpmSpan = document.querySelector(".wpm-span");
let overlay = document.querySelector(".overlay"); // Overlay over the textarea
let textarea = document.querySelector("textarea"); // Textarea for the user
let timer = document.querySelector(".timer"); // Timer to keep track of time it takes to finish typing the quote

let rocketDiv = document.querySelector(".progress-rocket-div");
let rocket = document.querySelector(".progress-rocket");
let progressBar = document.querySelector(".progress-bar");

var quoteStr = "";
var quoteLetters = []; // Empty array to eventually hold all the span elements containing a character from the random quote
var correctCounter = 0; // Keep track of correct characters
var currentCounter = 0; // Keep track of user position

var rocketClr = "#00B5B3";
var clrGreen = "#00FFA3";
var clrRed = "#FF5F48";

var timerInterval;
var time = 0;

getQuote();

/* EVENT LISTENERS */
// Start Game Event
overlay.addEventListener("click", initiateGame);


// User typing event
textarea.addEventListener("keyup", (e) => {
    if (e.keyCode == 32) { // User presses spacebar

        isMatching(e);

    } else if (e.keyCode == 8) { // User presses backspace

        currentCounter = textarea.value.length;

        // If the user deletes too much past the incorrect position, reset the correctCounter
        if (currentCounter < correctCounter) {
            correctCounter = currentCounter;
        }

        // Reset colors
        for (var i = currentCounter; i < quoteLetters.length; i++) {
            quoteLetters[i].style.color = "#FFFFFF";
            quoteLetters[currentCounter].style.textDecoration = "none";
        }

    } else if (e.keyCode < 48 || e.keyCode > 222) {
        // Return if the user presses a key that is not a character (ex. Shift, Capslock, etc.)
        return;

    } else {
        // If it's not spacebar, backspace, or a key that is not a character, proceed to check for matching characters
        isMatching(e);

    }
});

// New Quote Event
document.querySelector(".new-quote").addEventListener("click", () => {
    location.reload();
})


/* FUNCTIONS */

// Grab the quote, split each character into a span tag, and display
function getQuote() {
    var url = "http://api.quotable.io/random"; // Shoutout to Luke Peavey for this awesome API

    fetch(url).then(response => response.json()).then(data => {
        quoteStr = data.content;
        author.innerHTML = "- " + data.author;

        quoteArray = quoteStr.split("");

        quoteArray.forEach(char => {
            span = document.createElement("span");
            span.innerHTML = char;
            quote.appendChild(span);

            quoteLetters.push(span);
        });
    });
}


// Start the timer/game
function initiateGame() {
    // TODO: Improve countdown/timer with Date()?
    let countdown = 3;
    time = 0;

    overlay.innerHTML = 3;

    countdownInterval = setInterval(() => {
        countdown--;
        overlay.innerHTML = countdown;
    }, 1000);

    setTimeout(() => {
        overlay.style.display = "none";
        clearInterval(countdownInterval);

        textarea.removeAttribute("disabled");
        textarea.focus();

        timerInterval = setInterval(() => {
            time++;
            timer.innerHTML = time;
        }, 1000);
    }, 3000);
}


// Responsible for testing the user input and quote to see if the characters match
function isMatching(event) {
    if (event.key == quoteLetters[correctCounter].innerHTML && correctCounter == currentCounter) {
        // If the pressed key matches the quote position, and the correctCounter is equal to the currentCounter it is correct

        toggleColors(true);
        rocketProgress();

        // Increment the correctCounter, and currentCounter
        correctCounter++;
        currentCounter = correctCounter;

        // Determine if the user has finished the quote
        if (correctCounter == quoteLetters.length) {
            gameOver();
        }
    }
    else { // If it does not match, then it is incorrect

        toggleColors(false);

        // We do not increment the correctCounter since it is incorrect, only the currentCounter
        currentCounter++;
    }
}


// Responsible for changing colors of text/rocket to red or green
function toggleColors(isCorrect) {
    if (!isCorrect) { // User is incorrect

        // Set the letter to red, and also add a red underline
        quoteLetters[currentCounter].style.color = clrRed;
        quoteLetters[currentCounter].style.textDecoration = "underline";
        rocket.style.color = clrRed;
        progressBar.style.background = clrRed;

    } else { // User is correct

        // Set the letter to green, and remove any underline
        quoteLetters[correctCounter].style.color = clrGreen;
        quoteLetters[currentCounter].style.textDecoration = "none";
        rocket.style.color = rocketClr;
        progressBar.style.background = clrGreen;

    }
}


// Animate the rocket as the user types the quote.
function rocketProgress() {
    var progress = Math.round((correctCounter / quoteLetters.length) * 100);

    progressBar.style.width = progress + "%";
    rocketDiv.style.left = progress + "%";
}


// Display time, and calculate WPM
function gameOver() {
    clearInterval(timerInterval);

    textarea.setAttribute("disabled", "disabled");
    textarea.value = "";

    overlay.style.display = "flex";
    overlay.innerHTML = "Good Job!";
    overlay.removeEventListener("click", initiateGame);

    wpmSpan.innerHTML = "WPM: " + calculateWPM()

    progressBar.style.width = "103%";
    rocketDiv.style.left = "103%";
}


// Calculate words per minute
function calculateWPM() {
    var wordCount = quoteStr.split(" ").length;

    var wpm = Math.floor((wordCount / time) * 60);

    return wpm;
}