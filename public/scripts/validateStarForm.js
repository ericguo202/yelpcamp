const starForm = document.querySelector("form");
const noRating = document.querySelector("#no-rate");
const starFormFeedback = document.querySelector("#starFormFeedback");

console.log(noRating.checked);

starForm.addEventListener("submit", (event) => {
    if (noRating.checked) {
        event.preventDefault();
        starFormFeedback.classList.add("shown");
    }
});


