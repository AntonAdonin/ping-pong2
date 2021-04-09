//Обращаемся к игровому полю в HTML
let canvas = document.getElementById("game");
//Делаем поле двухмерным
let context = canvas.getContext("2d");
//Размер игровой клетки
let grid = 15;
//Высота платформы
let paddleHeight = grid * 5;
//Скорость платформы
let paddleSpeed = 5;
//Скорость мяча
let ballSpeed = 3.5;
//Набранные очки
let leftCounter = 0;
let rightCounter = 0;


//Описываем левую платформу
let leftPaddle = {
    //указываем начальные координаты платформы
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight * 2,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
};

//Описываем правую платформу
let rightPaddle = {
    //указываем начальные координаты платформы
    x: canvas.width - grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
};

// Задаём максимальное расстояние, на которое может опуститься платформа
let maxLeftPaddleY = canvas.height - grid - leftPaddle.height;
let maxRightPaddleY = canvas.height - grid - rightPaddle.height;
//Описываем мяч
let ball = {
    //Начальное положение мяча
    x: canvas.width / 2,
    y: canvas.height / 2,
    //ширина и высота мяча
    width: grid,
    height: grid,
    //Признак перезапуска мяча
    restarting: false,
    //Начальное ускорение
    dx: ballSpeed,
    dy: -ballSpeed
};

//Главный цикл игры
function loop(){
    //Очищаем игровое поле
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Если платформы куда-то двигались - путь продолжают
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    //проверка выхода за границы холста
    //ушла ли платформа вверх
    if(leftPaddle.y <= grid){
        leftPaddle.y = grid;
    }
    //ушла ли платформа вниз
if(leftPaddle.y > maxLeftPaddleY){
        leftPaddle.y = maxLeftPaddleY;
    }
    //ушла ли платформа вверх
    if(rightPaddle.y <= grid)
        rightPaddle.y = grid;

    //ушла ли платформа вниз
    if(rightPaddle.y > maxRightPaddleY)
        rightPaddle.y = maxRightPaddleY

    //задаем цвет
    context.fillStyle = 'white';
    //Рисуем платформы
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, grid);
    for(let i = grid; i < canvas.height - grid; i += grid*2)
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    
    //задаем цвет
    context.fillStyle = 'green';
    //Рисуем мяч
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //если мяч двигался, то пусть продолжает
    ball.x += ball.dx;
    ball.y += ball.dy;
    // левая платформа двигается как мяч
    leftPaddle.y = ball.y - leftPaddle.height / 2

    //коснулся ли мяч стен
    if(ball.y <= grid || ball.y + grid >= canvas.height - grid){
        ball.dy *= -1;
        sound();
    }
    //отслеживаем нажатия клавишь
    document.addEventListener("keydown", function(e){
        //если нажата стрелка вверх
        if(e.which == 38){
            //двигаем правую платформу вверх
            rightPaddle.dy = -paddleSpeed;
        }
        //иначе если нажата стрелка вниз
        else if(e.which == 40){
            //двигаем правую платформу вниз
            rightPaddle.dy = paddleSpeed;
        }

    });

    document.addEventListener("keyup", function(e){
        //если нажата стрелка вверх
        if(e.which == 38){
            //двигаем правую платформу вверх
            rightPaddle.dy = 0;
        }
        //иначе если нажата стрелка вниз
        else if(e.which == 40){
            //двигаем правую платформу вниз
            rightPaddle.dy = 0;
        }
        
    });

    //если мяч коснулся платформ
    if(collides(ball, leftPaddle)){
        ball.dx *= -1;
        sound();
        leftCounter ++;
    }
    if(collides(ball, rightPaddle)){
        ball.dx *= -1;
        sound();
        rightCounter ++;
    }
    // цвет текста
    context.fillStyle = "#ff0000";
    // задаем размер и шрифт
    context.font = "20px Times New Roman"
    context.fillText(leftCounter, 300, 500)
    context.fillText(rightCounter, 450, 500)
        
    //Если мяч улетел за игровое поле влево ИЛИ вправо
    if((ball.x < 0 || ball.x > canvas.width) && !ball.restarting){
        ball.restarting = true;
        //Даём секунду игрокам на подготовку
        setTimeout(() => {
            ball.restarting = false;
            //Возвращаем мяч в центр поля
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            leftCounter = 0
            rightCounter = 0
        }, 1000);
    }
}

//Запуск игры
requestAnimationFrame(loop);

//Функция проверки столковений
function collides(obj1, obj2){
    return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}
//Запуск звука
function sound(){
    let audio = new Audio();
    audio.src = "src/music/pop.mp3";
    audio.autoplay = true;
}
