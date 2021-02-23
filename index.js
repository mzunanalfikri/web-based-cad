document.getElementById("helpMessage").style.display = "none";

document.getElementById("helpButton").addEventListener("click", function() {
    var x = document.getElementById("helpMessage");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
});