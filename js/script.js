//old code using the cat facts API
//function getRandom(max){
//    return Math.floor(Math.random() * max);
//}
//$(document).ready(function(){
//  $("#jack").click(function(){
//    $.get("https://cat-fact.herokuapp.com/facts", function(data, status){
//        var index = getRandom(data.all.length);
//        if (index == 19){
//            index = 20;
//        }
//        $("p").html(data.all[index].text);
//    });
//  });
//});

$(document).ready(function(){
  var catFacts = [
    "Cats can jump up to six times their length in one leap.",
    "The world's oldest cat was 38 years old.",
    "Cats have five toes on their front paws and four toes on their back paws.",
    "Cats have a unique vocal signature, similar to a human fingerprint.", 
    'A group of cats is called a "clowder".', 
    "A cat's whiskers are roughly as wide as its body.",
    "Cats can rotate their ears 180 degrees.", 
    "Cats have a strong territorial instinct.", 
    "A cat spends about 70-80% of its life sleeping.", 
    "The world record for the longest jump by a cat is over 7 feet.", 
    "Cats can't taste sweetness.", 
    "A cat's nose print is unique, much like a human's fingerprint.", 
    "Domestic cats can run up to 30 miles per hour for short distances.", 
    "Cats have a specialized collarbone that allows them to always land on their feet when falling.", 
    'The "M" shape on a cat\'s\ forehead is called the "mark of the tabby."',
    "A cat's whiskers help them measure openings to determine if they can fit through.",
    "The world's richest cat inherited over $12 million.", 
    "The frequency of a domestic cat's purring is the same frequency at which muscles and bones repair themselves.",
    "Cats have excellent night vision due to a layer of cells in their eyes called the tapetum lucidum.",
    "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus.",
    "Cats have a unique grooming pattern that starts with licking their lips and ends with grooming their ears.",
    "The average cat sleeps for about 12-16 hours a day.", 
    // Add more cat facts here
  ];

  function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  $("#jack").click(function(){
    var index = getRandom(catFacts.length);
    $("p").html(catFacts[index]);
  });
});

//confetti:
    //https://jsfiddle.net/hcxabsgh/
(function () {
    // globals
    var canvas;
    var ctx;
    var W;
    var H;
    var mp = 100; //max particles
    var particles = [];
    var angle = 0;
    var tiltAngle = 0;
    var confettiActive = false;
    var animationComplete = true;
    var deactivationTimerHandler;
    var reactivationTimerHandler;
    var animationHandler;

    // objects

    var particleColors = {
        colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
        colorIndex: 0,
        colorIncrementer: 0,
        colorThreshold: 10,
        getColor: function () {
            if (this.colorIncrementer >= 10) {
                this.colorIncrementer = 0;
                this.colorIndex++;
                if (this.colorIndex >= this.colorOptions.length) {
                    this.colorIndex = 0;
                }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
        }
    }

    function confettiParticle(color) {
        this.x = Math.random() * W; // x-coordinate
        this.y = (Math.random() * H) - H; //y-coordinate
        this.r = RandomFromTo(10, 30); //radius;
        this.d = (Math.random() * mp) + 10; //density;
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
        this.tiltAngle = 0;

        this.draw = function () {
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return ctx.stroke();
        }
    }

    $(document).ready(function () {
        SetGlobals();
        InitializeButton();
        InitializeConfetti();

        $(window).resize(function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });

    });

    function InitializeButton() {
        // $('#stopButton').click(DeactivateConfetti);
        $('#jack').click(RestartConfetti);
        $('#jack').click(setTimeout(DeactivateConfetti,4000));
        
    }

    function SetGlobals() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }

    function InitializeConfetti() {
        particles = [];
        animationComplete = false;
        for (var i = 0; i < mp; i++) {
            var particleColor = particleColors.getColor();
            particles.push(new confettiParticle(particleColor));
        }
        StartConfetti();
    }

    function Draw() {
        ctx.clearRect(0, 0, W, H);
        var results = [];
        for (var i = 0; i < mp; i++) {
            (function (j) {
                results.push(particles[j].draw());
            })(i);
        }
        Update();

        return results;
    }

    function RandomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }


    function Update() {
        var remainingFlakes = 0;
        var particle;
        angle += 0.01;
        tiltAngle += 0.1;

        for (var i = 0; i < mp; i++) {
            particle = particles[i];
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
                particle.y = H + 100;
                continue;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
                remainingFlakes++;
            }
            CheckForReposition(particle, i);
        }

        if (remainingFlakes === 0) {
            StopConfetti();
        }
    }

    function CheckForReposition(particle, index) {
        if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
            if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
            {
                repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
            } else {
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                } else {
                    //Enter from the right
                    repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                }
            }
        }
    }
    function stepParticle(particle, particleIndex) {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    }

    function StartConfetti() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        (function animloop() {
            if (animationComplete) return null;
            animationHandler = requestAnimFrame(animloop);
            return Draw();
        })();
    }

    function ClearTimers() {
        clearTimeout(reactivationTimerHandler);
        clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
        confettiActive = false;
        ClearTimers();
    }

    function StopConfetti() {
        animationComplete = true;
        if (ctx == undefined) return;
        ctx.clearRect(0, 0, W, H);
    }

    function RestartConfetti() {
        ClearTimers();
        StopConfetti();
        reactivationTimerHandler = setTimeout(function () {
            confettiActive = true;
            animationComplete = false;
            InitializeConfetti();
            $('#jack').click(setTimeout(DeactivateConfetti,4000));
            
        }, 100);

    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();
})();

