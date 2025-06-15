document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('game-container');
    const startBtn = document.getElementById('start-btn');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let timer;
    let spawnInterval;
    
    // Fitness icons
    const icons = ['🏋️', '🏃', '🥊', '🧘', '🚴'];
    
    startBtn.addEventListener('click', startGame);
    
    function startGame() {
      if (gameActive) return;
      
      // Reset game
      container.innerHTML = '';
      score = 0;
      timeLeft = 30;
      gameActive = true;
      scoreDisplay.textContent = score;
      timeDisplay.textContent = timeLeft + 's';
      startBtn.textContent = 'PLAYING...';
      
      // Start timer
      timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft + 's';
        if (timeLeft <= 0) endGame();
      }, 1000);
      
      // Spawn random icons
      spawnInterval = setInterval(spawnIcon, 800);
    }
    
    function spawnIcon() {
      if (!gameActive) return;
      
      const icon = document.createElement('div');
      icon.textContent = icons[Math.floor(Math.random() * icons.length)];
      icon.style.position = 'absolute';
      icon.style.fontSize = '50px';
      icon.style.cursor = 'pointer';
      
      // Random position
      const x = Math.random() * (container.offsetWidth - 50);
      const y = Math.random() * (container.offsetHeight - 50);
      icon.style.left = x + 'px';
      icon.style.top = y + 'px';
      
      // Click handler
      icon.addEventListener('click', () => {
        if (!gameActive) return;
        score++;
        scoreDisplay.textContent = score;
        icon.remove();
      });
      
      // Auto-remove after 1.5s if not clicked
      setTimeout(() => {
        if (icon.parentNode) icon.remove();
      }, 1500);
      
      container.appendChild(icon);
    }
    
    function endGame() {
      gameActive = false;
      clearInterval(timer);
      clearInterval(spawnInterval);
      startBtn.textContent = 'PLAY AGAIN';
      container.innerHTML = `<div style="color:#00ffcc; font-size:24px; margin-top:100px;">Game Over! Score: ${score}</div>`;
    }
  });

  

   function calcBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value) / 100;
    const result = document.getElementById('bmiResult');
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      result.textContent = `BMI: ${bmi.toFixed(2)} (${category})`;
    } else {
      result.textContent = 'Enter valid values.';
    }
  }

  let totalCalories = 0;
  function addCalories() {
    const foodSelect = document.getElementById('foodSelect');
    const quantity = parseFloat(document.getElementById('quantity').value);
    const calPerUnit = parseFloat(foodSelect.value);
    if (!calPerUnit || isNaN(quantity)) return;
    const cal = calPerUnit * quantity;
    totalCalories += cal;
    document.getElementById('totalCalories').textContent = totalCalories.toFixed(2);
    document.getElementById('quantity').value = '';
  }

  document.addEventListener('mousemove', (e) => {
    const light = document.querySelector('.cursor-light');
    light.style.left = `${e.clientX}px`;
    light.style.top = `${e.clientY}px`;
  });
  
  // For mobile touch
  document.addEventListener('touchmove', (e) => {
    const light = document.querySelector('.cursor-light');
    light.style.left = `${e.touches[0].clientX}px`;
    light.style.top = `${e.touches[0].clientY}px`;
  });

   // Trigger re-animation when clicking/touching the image
    document.querySelector('.hero-img img').addEventListener('click', function() {
      this.style.animation = 'none';
      void this.offsetWidth; // Trigger reflow
      this.style.animation = 'intenseGlow 2s ease-out';
    });
    
    // For mobile touch
    document.querySelector('.hero-img img').addEventListener('touchstart', function() {
      this.style.animation = 'none';
      void this.offsetWidth;
      this.style.animation = 'intenseGlow 2s ease-out';
    });

    const canvas = document.getElementById('poolCanvas');
  const ctx = canvas.getContext('2d');
  const winMsg = document.getElementById('winMessage');
  const playAgainBtn = document.getElementById('playAgainBtn');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let ball = { x: WIDTH/4, y: HEIGHT/2, r: 14, dx: 0, dy: 0 };

  const pocket = { x: WIDTH - 20, y: HEIGHT/2, r: 20 };

  let dragging = false;
  let dragStart = null;
  let dragEnd = null;
  let gameOver = false;

  function drawTable() {
    ctx.fillStyle = '#0a3b16';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Pocket
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, pocket.r, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.shadowColor = '#0008';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw '8' label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('8', ball.x, ball.y);
  }

  function drawAimLine() {
    if (!dragging || !dragStart || !dragEnd) return;
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(dragEnd.x, dragEnd.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10,6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.dx *= 0.95;
    ball.dy *= 0.95;

    if (Math.abs(ball.dx) < 0.05) ball.dx = 0;
    if (Math.abs(ball.dy) < 0.05) ball.dy = 0;

    // Keep ball inside table
    ball.x = Math.min(Math.max(ball.r, ball.x), WIDTH - ball.r);
    ball.y = Math.min(Math.max(ball.r, ball.y), HEIGHT - ball.r);
  }

  function checkPocket() {
    return distance(ball, pocket) < pocket.r;
  }

  function checkWin() {
    if (checkPocket() && !gameOver) {
      gameOver = true;
      winMsg.style.display = 'block';
      setTimeout(() => {
        window.open('https://www.tiktok.com/@salmankhannutrition', '_blank');
      }, 700);
    }
  }

  function draw() {
    drawTable();
    drawBall();
    drawAimLine();
  }

  function update() {
    if (!gameOver) {
      updateBall();
      checkWin();
    }
    draw();
    requestAnimationFrame(update);
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }

  canvas.addEventListener('pointerdown', e => {
    if (gameOver) return;
    dragging = true;
    dragStart = getPos(e);
    dragEnd = dragStart;
  });

  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    dragEnd = getPos(e);
  });

  canvas.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;

    if (!dragStart || !dragEnd) return;

    // Calculate power and angle based on drag direction (from ball to drag start)
    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;

    let power = Math.min(20, Math.hypot(dx, dy) / 4);
    if(power < 2) return; // ignore very weak shots

    let angle = Math.atan2(dy, dx);

    ball.dx = Math.cos(angle) * power;
    ball.dy = Math.sin(angle) * power;

    dragStart = dragEnd = null;
  });

  playAgainBtn.addEventListener('click', () => {
    ball = { x: WIDTH/4, y: HEIGHT/2, r: 14, dx: 0, dy: 0 };
    gameOver = false;
    winMsg.style.display = 'none';
  });

  draw();
  update();
