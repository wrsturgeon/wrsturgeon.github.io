function slideshow() {
    document.getElementById("invert-btm").style.opacity = 0;
    setTimeout(invertHalf, 1500);
}

function invertHalf() {
    document.getElementById("invert-top").style.opacity = 1;
    setTimeout(deinvert, 250);
}

function deinvert() {
    document.getElementById("invert-btm").style.opacity = 1;
    switchImage();
    document.getElementById("invert-top").style.opacity = 0;
    setTimeout(slideshow, 250);
}

function switchImage() {
    // Search for the image currently shown
    stackedImages = document.getElementsByClassName("stacked-image");
    for (im of stackedImages) {
        if (im.style.opacity > 0) {
            n = 1 + parseInt(im.id.substr(2));
            console.log(n);
            if (n > stackedImages.length) {n -= stackedImages.length;} // modulo
            document.getElementById("im" + ((n < 10) ? '0' + n.toString() : n.toString())).style.opacity = 1;
            im.style.opacity = 0;
            return;
        }
    }
    // If none currently shown, show the first one
    document.getElementById("im01").style.opacity = 1;
}

// Start the ball rolling
invertHalf();