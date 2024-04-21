var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-=_+[]\\;\',./{}|:"<>?';
var backGroundMusic = new Audio();
var userName = 'Steve';
function preLoad() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/c418-alpha.mp3', true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (xhr.status === 200) {
            backGroundMusic.src = URL.createObjectURL(xhr.response);
            document.getElementById("start-button").style.display = "inline";
        }
    };
    xhr.addEventListener("progress", function(event) {
        if (event.lengthComputable) {
            var loaded = event.loaded;
            var total = event.total;
            var progress = (loaded / total) * 100;
            document.getElementById("progress").style.width = progress + "%";
            console.debug("Loading assets... ",event.loaded/1024,"kb /",event.total/1024,"kb",progress,"%")
            if (progress == 100) {
                document.getElementById("progress-bar").style.display = 'none';
                document.getElementById("loading-text").style.display = 'none';
                document.getElementById("settings").style.display = 'flex';
            }
        }
    });
    xhr.send();
    let textField = document.querySelector('.text-field');
    textField.addEventListener('focus', function() { this.classList.add('focused'); });
    textField.addEventListener('blur', function() { this.classList.remove('focused'); });
    document.getElementById("start-button").addEventListener("click", function() {
        var username = document.getElementById("username").value;
        console.debug("Username:",username);
        if (username == '') {
            userName = 'Steve';
        } else {
            userName = username;
        }
        document.getElementById("settings").style.display = "none";
        startPlay();
    });
    fetch('assets/endpoem.html')
        .then(response => response.text())
        .then(text => {
            document.getElementById('scrolling-content').innerHTML = text;
        })
        .catch(error => {
            alert('Error reading the file:', error);
        });
}

function startPlay() {
    backGroundMusic.play();
    let text = document.getElementById('scrolling-content').innerHTML;
    document.getElementById('scrolling-content').innerHTML = text.replace(/\$PLAYERNAME\$/g, userName);
    document.getElementById('scrolling-content').style.display = '';
    document.getElementById('scrolling-content').style.animation = 'scrollText 462s linear';
    console.debug("Started to play.");
    const backgroundElements = document.querySelectorAll('.background');
    backgroundElements.forEach((background) => { background.style.animationDuration = '60s'; });
    setInterval(function() {
        let elements = document.querySelectorAll('.random-text');
        elements.forEach(function(element) {
            var newText = '';
            var textLength = element.textContent.trim().length;
            for (var i = 0; i < textLength; i++) {
              var randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
              newText += randomChar;
            }
            element.textContent = newText;
        });
    }, 50);
    setTimeout(function() {
        let element = document.getElementById('scrolling-content-end');
        element.style.animation = 'scrollText2 16s linear';
        element.style.display = 'block';
        document.getElementById('scrolling-content').style.display = 'none';
        setTimeout(function() {
            const backgroundElements = document.querySelectorAll('.background');
            backgroundElements.forEach((background) => {
                background.style.animationDuration = '0s';
            });
            console.log("Done playing.")
        }, 17000);
    }, 462000);
}
preLoad();