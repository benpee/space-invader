document.addEventListener('DOMContentLoaded', function () {
    const squares = document.querySelectorAll('.grid div');
    const resultDisplay = document.querySelector('#result');
    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let result = 0;
    let direction = 1;
    let invaderId;
    const alienInvadersTakenDown = [];

    // define the alien invader
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39
    ]

    // draw the alien invaders
    alienInvaders.forEach(invader =>
        squares[currentInvaderIndex + invader].classList.add('invader')
    );

    // draw the shooter
    squares[currentShooterIndex].classList.add('shooter');

    // move the shooter along a line
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch (e.keyCode) {
            case 37:
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case 39:
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter);

    // move the alien invaders
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

        if (leftEdge && direction === -1 || (rightEdge && direction === 1)) {
            direction = width;
        }

        if (direction === width) {
            if (leftEdge) direction = 1
            if (rightEdge) direction = -1;
        }
        for (alien of alienInvaders)
            squares[alien].classList.remove('invader');

        for (alien of alienInvaders)
            alien += direction;

        for (alien of alienInvaders) {
            if (!alienInvadersTakenDown.includes(alien))
                squares[alien].classList.add('invader');
        }
    }

    // decide a game over
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultDisplay.textContent = 'Game Over';
        squares[currentShooterIndex].classList.add('boom');
        clearInterval(invaderId);
    }

    alienInvaders.map(alienInvader => {
        if (alienInvader > (squares.length - (width - 1))) {
            resultDisplay.textContent = 'Game Over';
            clearInterval(invaderId);
        }
    });

    // decide a win
    if (alienInvadersTakenDown.length === alienInvaders.length) {
        resultDisplay.textContent = 'You Win!';
        clearInterval(invaderId);
    }

    invaderId = setInterval(moveInvaders, 500);

    // shoot at aliens
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex

        // move the laser from the shooter to the alien Invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('boom')
                }, 250);
                clearInterval(invaderId);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown)
                result++;
                resultDisplay.textContent = result;
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('laser')
                }, 100);
            }
        }
        document.addEventListener('keyup', function (e) {
            if (e.keyCode === 32) laserId = setInterval(moveLaser, 100)
        })
    }
    document.addEventListener('keyup', shoot)
});