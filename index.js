addListeners();

function addListeners() {
    animObj = animaster();
    const animationsHandler = {}

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animationsHandler.resetFadeIn = animObj.fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            if (animationsHandler.resetFadeIn){
                const block = document.getElementById('fadeInBlock');
                animationsHandler.resetFadeIn(block);
            }
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animationsHandler.resetFadeOut = animObj.fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            if (animationsHandler.resetFadeOut){
                const block = document.getElementById('fadeOutBlock');
                animationsHandler.resetFadeOut(block);
            }
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animationsHandler.resetMoveAndScale = animObj.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            if (animationsHandler.resetMoveAndScale){
                const block = document.getElementById('moveBlock');
                animationsHandler.resetMoveAndScale(block);
            }
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animationsHandler.resetMoveAndScale = animObj.scale(block, 1000, 1.25);
        });
    
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            if (animationsHandler.resetMoveAndScale){
                const block = document.getElementById('moveBlock');
                animationsHandler.resetMoveAndScale(block);
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animObj.showAndHide(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animObj.moveAndHide(block, 3000, {x : 100, y : -20});
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (animationsHandler.heartBeatingStop) {
                animationsHandler.heartBeatingStop.stop();
            }
            animationsHandler.heartBeatingStop = animObj.heartBeating(block, 1000);  
        });
    
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (animationsHandler.heartBeatingStop) {
                animationsHandler.heartBeatingStop.stop();
                animationsHandler.heartBeatingStop = null;
            }
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster(){
    function resetFadeIn(element){
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }
    function resetFadeOut(element){
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }   

    function resetMoveAndScale(element){
        element.style.transform = null;
        element.style.transitionDuration = null;
    }
    return {
        move : function(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return () => resetMoveAndScale(element);
        },
        scale : function(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return () => resetMoveAndScale(element);
        },
        fadeIn : function(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return () => resetFadeIn(element);
        },
        fadeOut : function(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return () => resetFadeOut(element);
        },
        showAndHide: function(element, duration){
            this.fadeIn(element, duration / 3)
            setTimeout(() => this.fadeOut(element, duration / 3),duration / 3);
        },
        moveAndHide : function(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation);
            setTimeout(() => this.fadeOut(element, 3 * duration / 5), 2 * duration / 5);
        },
        heartBeating : function(element, duration) {
            this.scale(element, duration / 2, 1.4);
            let isGrowing = false;
            const id = setInterval(() => { 
                this.scale(element, duration / 2, isGrowing ? 1.4 : 1 / 1.4);
                isGrowing = !isGrowing;
            }, duration / 2); 

            return {
                stop: () => clearInterval(id),
            };        
        }
    }
}