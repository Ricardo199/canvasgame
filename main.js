let timerID;
let timer2ID;

class RandomImage {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.x = Math.round(Math.random() * (this.canvas.width - 32));
        this.y = Math.round(Math.random() * (this.canvas.height - 32));
        this.img = new Image();
        this.img.src = "favicon_io/favicon-32x32.png";
        this.intervalID = null;
    }
    drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, this.x, this.y);
    }
    isClicked(mouseX, mouseY) {
        let offset = 50;
        console.log("RandomImage - x:", this.x);
        console.log("RandomImage - y:", this.y);
        return Math.abs(this.x - mouseX) <= offset && Math.abs(this.y - mouseY) <= offset;
    }
    moveImage() {
        this.x = Math.round(Math.random() * (this.canvas.width - 32));
        this.y = Math.round(Math.random() * (this.canvas.height - 32));
        this.drawImage();
    }
    centerImage() {
        this.x = this.canvas.width / 2 - 16;
        this.y = this.canvas.height / 2 - 16;
        this.drawImage();
    }
}

class Player {
    constructor() {
        this.score = 0;
        this.scoreBoard = document.getElementById("score");
    }
    increaseScore() {
        this.score++;
        console.log("Player - score:", this.score);
    }
    decreaseScore() {
        this.score--;
        console.log("Player - score:", this.score);
    }
    updateScoreBoard() {
        this.scoreBoard.textContent = this.score + " points";
        console.log("Player - score:", this.score);
    }
    hasWon() {
        return this.score == 5;
    };
}

function startGame(image, player, speed, button) {
    clearInterval(timerID);
    timerID = setInterval(() => {
        image.moveImage();
        speed = speed / 2;
    }, speed);
    
    let time = button.value/1000;  
    let timer2ID = window.setInterval(() => {
        time--;
        if (time <= 0) {
            clearInterval(timer2ID);
            alert("you lost!");
            document.getElementById("score").textContent = "0 points";
            image.centerImage();
            button.isClicked = false;
        }
        document.getElementById("time").textContent = time + " seconds";
    }, 1000);

    image.canvas.addEventListener("click", (event) => {
        let rect = image.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        
        if (image.isClicked(mouseX, mouseY)) {
            alert("you clicked the image!");
            image.moveImage();
            speed = Math.max(1000, speed - 1000);
            player.increaseScore();
            
            if (player.hasWon()) {
                alert("you won!");
                document.getElementById("score").textContent = "You won!";
                clearInterval(timerID);
                clearInterval(timer2ID);
                image.centerImage();
                button.isClicked = false;
            }
            
            clearInterval(timer2ID);
            time = button.value/1000;
            timer2ID = window.setInterval(() => {
                time--;
                if (time <= 0) {
                    clearInterval(timer2ID);
                    alert("you lost!");
                    document.getElementById("score").textContent = "0 points";
                    image.centerImage();
                    button.isClicked = false;
                    clearInterval(timerID);
                    clearInterval(timer2ID);
                    image.centerImage();
                    player.score = 0;
                }
                document.getElementById("time").textContent = time + " seconds";
            }, 1000);
        } else {
            alert("you missed the image!");
            image.moveImage();
            player.decreaseScore();
            speed -= 1000;
            
            if (player.score < 0) {
                clearInterval(timer2ID);
                    alert("you lost!");
                    document.getElementById("score").textContent = "0 points";
                    image.centerImage();
                    button.isClicked = false;
                    clearInterval(timerID);
                    image.centerImage();
            }
        }
        
        player.updateScoreBoard();
    });
}

window.onload = () => {
    let image = new RandomImage();
    let player = new Player(30000);
    let button = document.getElementById("start");
    let buttonR = document.getElementById("restart");
    var speed = 4000;
    image.centerImage();
    button.addEventListener("click", () => {
        window.clearInterval(timerID);
        window.clearInterval(timer2ID);
        image.moveImage();
        let old_element = document.getElementById("start");
        let new_element = old_element.cloneNode(true);
        old_element.replaceWith(new_element);
        document.getElementById("score").textContent = "0 points";
        player.score = 0;
        startGame(image, player, speed, button);
    });
    buttonR.addEventListener("click", () => {  
        window.clearInterval(timerID);
        window.clearInterval(timer2ID);
        let old_element = document.getElementById("start");
        let new_element = old_element.cloneNode(true);
        old_element.replaceWith(new_element);      
        image.centerImage();
        clearInterval(timerID);
        clearInterval(timer2ID);
        document.getElementById("score").textContent = "0 points";
        document.getElementById("time").textContent = "5 seconds";
        player.score = 0;
    });
};