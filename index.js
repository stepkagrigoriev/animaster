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
            animationsHandler.resetMoveAndHide = animObj.moveAndHide(block, 3000, {x : 100, y : -20}); 
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if(animationsHandler.resetMoveAndHide){
                const block = document.getElementById('moveAndHideBlock');
                animationsHandler.resetMoveAndHide();
            } 
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
    
    
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
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
        _steps : [],
        addMove : function(duration, translation){
            this._steps.push({
                type : "move",
                duration,
                translation,
            });
            return this;
        },
        addScale : function(duration, ratio){
            this._steps.push({
                type : "scale",
                duration,
                ratio,
            });
            return this;
        },
        addFadeIn : function(duration){
            this._steps.push({
                type : "fadeIn",
                duration,
            });
            return this;
        },
        addFadeOut : function(duration){
            this._steps.push({
                type : "fadeOut",
                duration,
            });
            return this;
        },
        move : function(element, duration, translation) {
            this.addMove(duration, translation);
            this.play(element);
            return () => resetMoveAndScale(element);
        },
        scale : function(element, duration, ratio) {
            this.addScale(duration, ratio);
            this.play(element);
            return () => resetMoveAndScale(element);
        },
        fadeIn : function(element, duration) {
            this.addFadeIn(duration);
            this.play(element);
            return () => resetFadeIn(element);
        },
        fadeOut : function(element, duration) {
            this.addFadeOut(duration);
            this.play(element);
            return () => resetFadeOut(element);
        },
        showAndHide: function(element, duration){
            this.fadeIn(element, duration / 3)
            setTimeout(() => this.fadeOut(element, duration / 3),duration / 3);
        },
        moveAndHide : function(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation);
            const id = setTimeout(() => this.fadeOut(element, 3 * duration / 5), 2 * duration / 5);
            return () => {
                clearTimeout(id);
                resetFadeOut(element);
                resetMoveAndScale(element);
            }
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
        },
        play : function(element) {
            let ind = 0;
            const steps = this._steps;
            const next = function(){
                if (ind >= steps.length){
                    return;
                }
                let step = steps[ind];
                switch (step.type){
                    case "move":
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(step.translation, null);
                        break;
                    case "scale":
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(null, step.ratio);
                        break;
                    case "fadeIn":
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                    case "fadeOut":
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    default:
                        break;
                }
                ind++;
                setTimeout(next, step.duration);
            }
            next();
            this._steps = [];
        },
    }
}