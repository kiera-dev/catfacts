$(document).ready(function () {
  const catFacts = [
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

  const getRandom = max => Math.floor(Math.random() * max);

  const confettiButton = $("#jack");
  const catFactParagraph = $("p");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let W = window.innerWidth;
  let H = window.innerHeight;
  const mp = 100; // max particles
  let particles = [];
  let angle = 0;
  let confettiActive = false;
  let animationComplete = true;
  let animationHandler;

  function confettiParticle(color) {
    this.x = Math.random() * W;
    this.y = Math.random() * -H;
    this.r = getRandom(10) + 20;
    this.d = Math.random() * mp + 10;
    this.color = color;
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = () => {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
      ctx.stroke();
    };
  }

  function initializeConfetti() {
    particles = [];
    animationComplete = false;
    for (let i = 0; i < mp; i++) {
      const particleColor = particleColors.getColor();
      particles.push(new confettiParticle(particleColor));
    }
    startConfetti();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(particle => particle.draw());
    update();
  }

  function update() {
    let remainingFlakes = 0;
    angle += 0.01;

    particles.forEach((particle, i) => {
      if (animationComplete) return;

      if (!confettiActive && particle.y < -15) {
        particle.y = H + 100;
        return;
      }

      stepParticle(particle, i);

      if (particle.y <= H) {
        remainingFlakes++;
      }
      checkForReposition(particle, i);
    });

    if (remainingFlakes === 0) {
      stopConfetti();
    } else {
      animationHandler = requestAnimationFrame(draw);
    }
  }

  function stepParticle(particle, particleIndex) {
    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
    particle.x += Math.sin(angle);
    particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
  }

  function checkForReposition(particle, index) {
    if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
      repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
    }
  }

  function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
    particle.x = xCoordinate;
    particle.y = yCoordinate;
    particle.tilt = tilt;
  }

  function startConfetti() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    animationComplete = false;
    draw();
  }

  function clearTimers() {
    cancelAnimationFrame(animationHandler);
  }

  function stopConfetti() {
    animationComplete = true;
    ctx.clearRect(0, 0, W, H);
  }

  function restartConfetti() {
    clearTimers();
    stopConfetti();
    confettiActive = true;
    initializeConfetti();
    setTimeout(() => {
      confettiActive = false;
    }, 4000);

    const index = getRandom(catFacts.length);
    catFactParagraph.html(catFacts[index]);
  }

  const particleColors = {
    colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
    colorIndex: 0,
    colorIncrementer: 0,
    getColor() {
      if (this.colorIncrementer >= 10) {
        this.colorIncrementer = 0;
        this.colorIndex = (this.colorIndex + 1) % this.colorOptions.length;
      }
      this.colorIncrementer++;
      return this.colorOptions[this.colorIndex];
    }
  };

  confettiButton.click(restartConfetti);

  $(window).resize(() => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    if (!confettiActive) {
      stopConfetti();
    }
  });
});
