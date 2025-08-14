const reviewForm = document.querySelector("#reviewForm");
const noRating = document.querySelector("#no-rate");
const starFormFeedback = document.querySelector("#starFormFeedback");

console.log(noRating.checked);

reviewForm.addEventListener("submit", (event) => {
    if (noRating.checked) {
        event.preventDefault();
        starFormFeedback.classList.add("shown");
    }
});


