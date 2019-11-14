let { append, cons, first, isEmpty, isList, length, rest } = functionalLight;
let { make, random, listMinOne, inList, ateSelf, outTheMap, pause, gotFood, growSnake, movement, foodSpawn } = require('snake-functions');

const size = 20
const canvasSize = 24
const easy = 6
const medium = easy * 2
const hard = easy * 3

const firstWorld = {

    direction: "right",
    canPress: true,
    frameRate: medium,
    foodPos: { x: random(), y: random() },
    snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
    pause: false,
    score: 0,
    playing: false,
    gameover: false,

}
function sketchProc(processing) {
    food = processing.loadImage("images/defaultSkin/food.png")
    body = processing.loadImage("images/defaultSkin/body.png")
    headDown = processing.loadImage("images/defaultSkin/headDown.png")
    headRight = processing.loadImage("images/defaultSkin/headRight.png")
    headUp = processing.loadImage("images/defaultSkin/headUp.png")
    headleft = processing.loadImage("images/defaultSkin/headLeft.png")
    wallpaper = processing.loadImage("images/defaultSkin/wallpaper.png")
    pause = processing.loadImage("images/defaultSkin/pause.png")
    click = processing.loadImage("images/defaultSkin/click.png")
    gOver = processing.loadImage("images/defaultSkin/gameover.png")
    font = processing.createFont("Impact")


    /**
        * First world's settings.
        */
    processing.setup = function () {
        processing.size(canvasSize * size, canvasSize * size + 4 * size);
        processing.background(0, 0, 0);
        processing.state = firstWorld
    }


    /**
        * Sets world.direction, limits movement towards opposite direction.
        * @returns {object}
        * @param {object} world
        * @param keycode
        */
    processing.onKeyEvent = function (world, keyCode) {
        switch (keyCode) {
            case processing.UP:
                if (world.direction == "down") {
                    return world
                }
                else {
                    return make(world, { direction: "up" });
                }
            case processing.DOWN:
                if (world.direction == "up") {
                    return world
                }
                else {
                    return make(world, { direction: "down" });
                }
            case processing.LEFT:
                if (world.direction == "right") {
                    return world
                }
                else {
                    return make(world, { direction: "left" });
                }
            case processing.RIGHT:
                if (world.direction == "left") {
                    return world
                }
                else {
                    return make(world, { direction: "right" });
                }
            case 80:
                if (world.pause == false) {
                    return make(world, { pause: true, canPress: true })
                    break;
                }
                else {
                    return make(world, { pause: false })
                    break;
                }
            default:
                console.log(keyCode);
                return make(world, {});
        }
    }

    /**
            * Executes itself once every frame
            * @returns {object}
            * @param {object} world
            * @example processing.onTic(processing.state)
            */
    processing.onTic = function (world) {

        processing.frameRate(world.frameRate)
        //If player ate it self or got out of the canvas, gameover is set to true.
        if (ateSelf(movement(world)) || outTheMap(movement(world))) {
            return make(world, { gameover: true, canPress: false });
        }

        //If pause or gameover is set to true, returns same world constantly.
        if (world.pause || world.gameover) {
            return make(world, { canPress: false })
        }
        //If is game is not playing.
        if (!world.playing) {
            return world;

        }
        return make(gotFood(movement(world)), { canPress: true });
    }

    /**
        * Executes the function 'image' from processing as many times as the list length.
        * @param {list} list
        * @return {undefined}
        * */
    function drawSnakeBody(list) {
        if (length(list) == 1) {
            processing.image(body, first(list).x * size, first(list).y * size)
        }
        else {
            processing.image(body, first(list).x * size, first(list).y * size)
            drawSnakeBody(rest(list))
        }
    }

    /**
        * Modifies direction of the snake's head depending on world.direction.
        * @param {object} world 
        * @return {undefined}
        * */
    function drawSnakeHead(world) {
        switch (world.direction) {
            case "up":
                processing.image(headUp, world.snake[0].x * size, world.snake[0].y * size)
                break;
            case "down":
                processing.image(headDown, world.snake[0].x * size, world.snake[0].y * size)
                break;
            case "left":
                processing.image(headleft, world.snake[0].x * size, world.snake[0].y * size)
                break;
            case "right":
                processing.image(headRight, world.snake[0].x * size, world.snake[0].y * size)
                break;
        }
    }

    /**
        * If world.gameover equals true draws game over message.
        * @param {object} world
        * @returns {undefined}
        */
    let localStorageName = "sankeHighScore";
    var highScore;

    function gameOverMs(world) {
        if (world.gameover == true) {
            //this operator set the highscore in the local storage, that way
            //the highscore is saved even when you restart your computer
            localStorage.setItem(localStorageName, Math.max(world.score, highScore));

            processing.image(gOver, 20, 20)
        }
    }

    /**
        * if world.pause equals true draws Pause message.
        * @param {object} world
        * @returns {undefined}
        */
    function pauseMs(world) {
        if (world.pause == true && !world.gameover) {
            processing.image(pause, 81, 200)
        }
    }

    /**
    * Click message.
    * @param {object} world
    * @returns {undefined}
    */
    function clickMs(world) {

        if (!world.playing) {
            //this operator checks if there is a previous highscore, in whichs case will print it,
            // and otherwise will set it to zero, and it must be placed in the start screen
            highScore = localStorage.getItem(localStorageName) == null ? 0 :
                localStorage.getItem(localStorageName);

            processing.image(click, 20, 20)
        }
    }


    /**
        * Score message.
        * @param {object} world
        * @returns {undefined}
        */
    function scoreMs(world) {
        processing.textFont(font, 45);
        processing.text(world.score, 150, 544);
    }


    //this function prints the highscore

    function highScoreMs() {
        processing.text(highScore, 410, 544);
    }

    //Draws the game.
    processing.drawGame = function (world) {
        processing.background(100, 100, 250);
        processing.image(wallpaper, 0, 0)
        processing.image(food, world.foodPos.x * 20, world.foodPos.y * 20)
        processing.fill(200, 200, 200);
        drawSnakeBody(rest(world.snake))
        drawSnakeHead(world)
        processing.fill(255, 255, 255);
        gameOverMs(world);
        pauseMs(world);
        clickMs(world);
        scoreMs(world);
        highScoreMs();
    }

    //Makes current world's state equal to onTic's output and draws the world. Executes several times a second.
    processing.draw = function () {
        processing.state = processing.onTic(processing.state);
        processing.drawGame(processing.state);
    }


    /**
        *Sets current world to initial world.
        * @returns {object}
        * */
    processing.restart = function () {
        processing.state = firstWorld;
    }


    /**
        *Sets current world to initial world.
        * @param {number} frames
        * @returns {object}
        * */
    processing.changeFrameRate = function (frames) {
        if (!processing.state.playing) {
            processing.state = make(processing.state, { frameRate: frames });
        }
    }


    /**
        *Executes when key is pressed.
        * @returns {object}
        * */
    processing.keyPressed = function () {
        if ((processing.state.canPress && processing.state.playing) || processing.keyCode == 80) {
            processing.state = processing.onKeyEvent(make(processing.state, { canPress: false }), processing.keyCode);
        }
        else {
            return 0
        }
    }

    //Changes source of skin variables.
    processing.changeSkin = function (skin) {
        switch (skin) {
            case 'skin1':
                food = processing.loadImage("images/skin1/food.png")
                body = processing.loadImage("images/skin1/body.png")
                headDown = processing.loadImage("images/skin1/headDown.png")
                headRight = processing.loadImage("images/skin1/headRight.png")
                headUp = processing.loadImage("images/skin1/headUp.png")
                headleft = processing.loadImage("images/skin1/headLeft.png")
                wallpaper = processing.loadImage("images/skin1/wallpaper.png")
                pause = processing.loadImage("images/skin1/pause.png")
                click = processing.loadImage("images/skin1/click.png")
                gOver = processing.loadImage("images/skin1/gameover.png")
                break;
            case 'skin2':
                food = processing.loadImage("images/skin2/food.png")
                body = processing.loadImage("images/skin2/body.png")
                headDown = processing.loadImage("images/skin2/headDown.png")
                headRight = processing.loadImage("images/skin2/headRight.png")
                headUp = processing.loadImage("images/skin2/headUp.png")
                headleft = processing.loadImage("images/skin2/headLeft.png")
                wallpaper = processing.loadImage("images/skin2/wallpaper.png")
                pause = processing.loadImage("images/skin2/pause.png")
                click = processing.loadImage("images/skin2/click.png")
                gOver = processing.loadImage("images/skin2/gameover.png")
                break;
            case 'skin3':
                food = processing.loadImage("images/skin3/food.png")
                body = processing.loadImage("images/skin3/body.png")
                headDown = processing.loadImage("images/skin3/headDown.png")
                headRight = processing.loadImage("images/skin3/headRight.png")
                headUp = processing.loadImage("images/skin3/headUp.png")
                headleft = processing.loadImage("images/skin3/headLeft.png")
                wallpaper = processing.loadImage("images/skin3/wallpaper.png")
                pause = processing.loadImage("images/skin3/pause.png")
                click = processing.loadImage("images/skin3/click.png")
                gOver = processing.loadImage("images/skin3/gameover.png")
                break;
            case 'skin4':
                food = processing.loadImage("images/skin4/food.png")
                body = processing.loadImage("images/skin4/snake.png")
                headDown = processing.loadImage("images/skin4/snake.png")
                headRight = processing.loadImage("images/skin4/snake.png")
                headUp = processing.loadImage("images/skin4/snake.png")
                headleft = processing.loadImage("images/skin4/snake.png")
                wallpaper = processing.loadImage("images/skin4/wallpaper.png")
                pause = processing.loadImage("images/skin4/pause.png")
                click = processing.loadImage("images/skin4/click.png")
                gOver = processing.loadImage("images/skin4/gameover.png")
                break;
            case 'defaultSkin':
                food = processing.loadImage("images/defaultSkin/food.png")
                body = processing.loadImage("images/defaultSkin/body.png")
                headDown = processing.loadImage("images/defaultSkin/headDown.png")
                headRight = processing.loadImage("images/defaultSkin/headRight.png")
                headUp = processing.loadImage("images/defaultSkin/headUp.png")
                headleft = processing.loadImage("images/defaultSkin/headLeft.png")
                wallpaper = processing.loadImage("images/defaultSkin/wallpaper.png")
                pause = processing.loadImage("images/defaultSkin/pause.png")
                click = processing.loadImage("images/defaultSkin/click.png")
                gOver = processing.loadImage("images/defaultSkin/gameover.png")
                break;
        }
    }
    
    /**
    * When mouse is clicked, world.playing is set true.
    @param {object} world
    @param {object} event
    @returns {object}
    @example make(world, { playing: true })
    */
    processing.mouseClicked = function () {
        processing.state = make(processing.state, { playing: true });
    }
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);