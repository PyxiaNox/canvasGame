var canvas
var canvasContext

var ballX = 50
var ballY = 50
var ballSpeedX = 8
var ballSpeedY = 4

var paddle1Y = 250
var paddle2Y = 250
const paddleHeight = 100
const paddleWidth = 10

var player1Score = 0
var player2Score = 0
const winningScore = 5
var winningScreen = false

window.onload = function(){
    canvas = document.getElementById("gameCanvas")
    canvasContext = canvas.getContext("2d")

    var framesPerSecond = 30
    setInterval(function(){
        drawAll()
        moveAll()
    }, 1000/framesPerSecond)

    canvas.addEventListener("mousemove",
        function(event){
            var mousePos = mousePosition(event)
            paddle1Y = mousePos.y - (paddleHeight/2)
            //paddle2Y = mousePos.y - (paddleHeight/2)
        })

    canvas.addEventListener("mousedown", handleMouseClick)
}

function drawAll(){
    colorRect(0, 0, canvas.clientWidth, canvas.clientHeight, "black")

    if(winningScreen){
        canvasContext.fillStyle = "white"

        if(player1Score >= winningScore){
            canvasContext.fillText("Le joueur de gauche a gagné !", 350, 250)
        } else if(player2Score >= winningScore){
            canvasContext.fillText("Le joueur de droite a gagné !", 350, 250)
        }
        
        canvasContext.fillText("Rejouer ?", 350, 500)
        return
    }

    drawNet()

    colorRect(0, paddle1Y, paddleWidth, paddleHeight, "blue")
    colorRect(canvas.clientWidth-paddleWidth, paddle2Y, paddleWidth, paddleHeight, "blue")
    colorCircle(ballX, ballY, 10, "yellow") 

    canvasContext.fillText(player1Score, 100, 100)
    canvasContext.fillText(player2Score, canvas.clientWidth-100, 100)
}

function moveAll(){
    if(winningScreen){
        return
    }

    computerMove()

    ballX += ballSpeedX
    ballY += ballSpeedY

    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight){
            ballSpeedX = -ballSpeedX
            var deltaY = ballY - (paddle1Y+paddleHeight/2)
            ballSpeedY = deltaY * 0.35
        } else{
            player2Score++
            ballReset()
        }
    }
    if(ballX > canvas.clientWidth){
        if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight){
            ballSpeedX -= ballSpeedX
            var deltaY = ballY - (paddle2Y+paddleHeight/2)
            ballSpeedY = deltaY * 0.35
        } else{
            player1Score++
            ballReset()
        }
    }

    if(ballY < 0){
        ballSpeedY = -ballSpeedY
    }
    if(ballY > canvas.clientHeight){
        ballSpeedY = -ballSpeedY
    }
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor
    canvasContext.fillRect(leftX, topY, width, height)
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor
    canvasContext.beginPath()
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)
    canvasContext.fill()
}

function mousePosition(event){
    var rect = canvas.getBoundingClientRect()
    var root = document.documentElement
    var mouseX = event.clientX - rect.left - root.scrollLeft
    var mouseY = event.clientY - rect.top - root.scrollTop

    return{
        x:mouseX,
        y:mouseY
    }
}

function handleMouseClick(event){
    if(winningScreen){
        player1Score = 0
        player2Score = 0
        winningScreen = false
    }
}

function ballReset(){
    if(player1Score >= winningScore || player2Score >= winningScore){
        winningScreen = true
    }

    ballSpeedX = -ballSpeedX

    ballX = canvas.clientWidth/2
    ballY = canvas.clientHeight/2
}

function computerMove(){
    var paddle2YCenter = paddle2Y + (paddleHeight/2)

    if(paddle2YCenter < ballY-35){
        paddle2Y += 6
    } else if(paddle2YCenter > ballY+35){
        paddle2Y -= 6
    }
}

function drawNet(){
    for(var i=0; i<canvas.clientHeight; i+=40){
        colorRect(canvas.clientWidth/2-1, i, 2, 20, "green")
    }
}