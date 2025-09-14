const Tetris = {
    board: [],
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    pSize: 20,
    canvasHeight: 440,
    canvasWidth: 200,
    boardHeight: 22,
    boardWidth: 10,
    spawnX: 4,
    spawnY: 1,
    shapes: [
      [[-1, 1], [0, 1], [1, 1], [0, 0]],
      [[-1, 0], [0, 0], [1, 0], [2, 0]],
      [[-1, -1], [-1, 0], [0, 0], [1, 0]],
      [[1, -1], [-1, 0], [0, 0], [1, 0]],
      [[0, -1], [1, -1], [-1, 0], [0, 0]],
      [[-1, -1], [0, -1], [0, 0], [1, 0]],
      [[0, -1], [1, -1], [0, 0], [1, 0]],
    ],
    colors: ["#a000f0", "#00f0f0", "#f0a000", "#0000f0", "#00f000", "#f00000", "#f0f000"],
    curShape: null,
    curShapeIndex: null,
    curX: 0,
    curY: 0,
    nextShape: null,
    nextShapeIndex: null,
    score: 0,
    scoreDisplay: null,
    level: 1,
    levelDisplay: null,
    numLevels: 10,
    time: 0,
    timeDisplay: null,
    lines: 0,
    linesDisplay: null,
    isActive: false,
    curComplete: false,
    timer: null,
    pTimer: null,
    baseSpeed: 700,
    speed: 700,
    levelScores: [],
    highScores: [],
    sounds: {
      move: null,
      clear: null,
      gameOver: null,
      land: null,
      rotate: null,
      drop: null,
    },
    keyBindings: {
      left: "ArrowLeft",
      right: "ArrowRight",
      down: "ArrowDown",
      rotate: "ArrowUp",
      pause: "Escape",
    },
  
    init() {
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.nextCanvas = document.createElement("canvas");
      this.nextCanvas.width = 110;
      this.nextCanvas.height = 110;
      this.nextCtx = this.nextCanvas.getContext("2d");
      document.getElementById("next_shape").appendChild(this.nextCanvas);

      this.initSounds();
      this.loadHighScores();
      this.initBoard();
      this.initInfo();
      this.initLevelScores();
      this.initShapes();
      this.bindKeyEvents();
      this.initSettings();
  
      document.getElementById("start").addEventListener("click", () => {
        if (this.isGameOver) {
          this.reset();
          this.play();
          document.getElementById("start").textContent = "Pause";
          return;
        }
        if (!this.isActive) {
          this.play();
          document.getElementById("start").textContent = "Pause";
        } else if (!this.isPaused) {
          this.togglePause();
        } else {
          this.togglePause();
        }
      });
  
      document.getElementById("reset").addEventListener("click", () => {
        this.reset();
      });
    },

    initSounds() {
      this.sounds.move = new Audio("sounds/move.mp3");
      this.sounds.clear = new Audio("sounds/clear.mp3");
      this.sounds.gameOver = new Audio("sounds/gameover.mp3");
      this.sounds.land = new Audio("sounds/land.mp3");
      this.sounds.rotate = new Audio("sounds/move.mp3");
      this.sounds.drop = new Audio("sounds/land.mp3");
      Object.values(this.sounds).forEach(audio => {
        audio.preload = "auto";
        audio.volume = 0.5;
        audio.load();
      });
    },

    playSound(soundName) {
      const audio = this.sounds[soundName];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    },

    initBoard() {
      this.board = Array(this.boardHeight * this.boardWidth).fill(0);
    },
  
    initInfo() {
      this.scoreDisplay = document.querySelector("#score span");
      this.levelDisplay = document.querySelector("#level span");
      this.linesDisplay = document.querySelector("#lines span");
      this.timeDisplay = document.querySelector("#time span");
      this.updateInfo();
      this.updateHighScores();
    },
  
    initLevelScores() {
      let c = 1;
      for (let i = 1; i <= this.numLevels; i++) {
        this.levelScores[i] = [c * 1000, 40 * i, 5 * i];
        c *= 2;
      }
    },
  
    initShapes() {
      this.curComplete = false;
      this.nextShapeIndex = this.nextShapeIndex ?? Math.floor(Math.random() * this.shapes.length);
      this.nextShape = this.shapes[this.nextShapeIndex];
      this.curShapeIndex = this.nextShapeIndex;
      this.curShape = this.nextShape;
      this.nextShapeIndex = Math.floor(Math.random() * this.shapes.length);
      this.nextShape = this.shapes[this.nextShapeIndex];
      this.curX = this.spawnX;
      this.curY = this.spawnY;
      if (!this.checkMove(this.curX, this.curY, this.curShape)) {
        this.gameOver();
        return;
      }
      this.drawBoard();
      this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
      this.drawNextShape();
    },
  
    initSettings() {
      const modal = document.getElementById("settings-modal");
      const openBtn = document.getElementById("settings");
      const closeBtn = document.getElementById("close-settings");
      const saveBtn = document.getElementById("save-settings");
      const speedInput = document.getElementById("game-speed");
      const keyButtons = document.querySelectorAll(".key-btn");

      let resetSettingsBtn = document.getElementById("reset-settings");
      if (!resetSettingsBtn) {
        resetSettingsBtn = document.createElement("button");
        resetSettingsBtn.id = "reset-settings";
        resetSettingsBtn.textContent = "Reset Settings";
        resetSettingsBtn.style.marginTop = "10px";
        saveBtn.insertAdjacentElement("afterend", resetSettingsBtn);
      }

      resetSettingsBtn.onclick = () => {
        this.baseSpeed = 700;
        this.speed = 700;
        this.keyBindings = {
          left: "ArrowLeft",
          right: "ArrowRight",
          down: "ArrowDown",
          rotate: "ArrowUp",
          pause: "Escape",
        };
        speedInput.value = this.baseSpeed;
        keyButtons.forEach(btn => {
          const action = btn.dataset.action;
          btn.textContent = this.keyBindings[action];
        });
      };

      openBtn.addEventListener("click", () => {
        speedInput.value = this.baseSpeed;
        keyButtons.forEach(btn => {
          const action = btn.dataset.action;
          btn.textContent = this.keyBindings[action];
        });
        modal.style.display = "flex";
      });
  
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
  
      saveBtn.addEventListener("click", () => {
        this.baseSpeed = Math.max(100, Math.min(2000, parseInt(speedInput.value, 10)));
        this.speed = this.baseSpeed;
        modal.style.display = "none";
      });
  
      keyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          btn.textContent = "Press a key...";
          const listener = (e) => {
            btn.textContent = e.key;
            this.keyBindings[btn.dataset.action] = e.key;
            document.removeEventListener("keydown", listener);
          };
          document.addEventListener("keydown", listener);
        });
      });
    },
  
    bindKeyEvents() {
      document.addEventListener("keydown", (e) => {
        if (!this.isActive) return;
        if (e.key === this.keyBindings.left) this.move("L");
        else if (e.key === this.keyBindings.right) this.move("R");
        else if (e.key === this.keyBindings.down) this.move("D");
        else if (e.key === this.keyBindings.rotate) this.move("RT");
      });
    },
  
    loadHighScores() {
      this.highScores = JSON.parse(localStorage.getItem("tetrisHighScores")) || [];
      this.highScores.sort((a, b) => b - a);
      this.highScores = this.highScores.slice(0, 1);
    },
  
    saveHighScore() {
      this.highScores.push(this.score);
      this.highScores.sort((a, b) => b - a);
      this.highScores = this.highScores.slice(0, 1);
      localStorage.setItem("tetrisHighScores", JSON.stringify(this.highScores));
      this.updateHighScores();
    },
  
    updateHighScores() {
      const list = document.getElementById("high-scores-list");
      list.innerHTML = this.highScores.map(score => `<li>${score}</li>`).join("");
    },
  
    updateInfo() {
      this.scoreDisplay.textContent = this.score;
      this.levelDisplay.textContent = this.level;
      this.linesDisplay.textContent = this.lines;
      this.timeDisplay.textContent = this.time;
    },
  
    drawShape(x, y, shape, type, ctx = this.ctx, animate = false) {
      shape.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.boardWidth && ny >= 0 && ny < this.boardHeight) {
          ctx.fillStyle = this.colors[type];
          ctx.fillRect(nx * this.pSize, ny * this.pSize, this.pSize, this.pSize);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(nx * this.pSize, ny * this.pSize, this.pSize, this.pSize);
          if (animate) {
            ctx.save();
            ctx.translate(nx * this.pSize + this.pSize / 2, ny * this.pSize + this.pSize / 2);
            ctx.scale(1.1, 1.1);
            ctx.translate(-this.pSize / 2, -this.pSize / 2);
            ctx.fillRect(0, 0, this.pSize, this.pSize);
            ctx.strokeRect(0, 0, this.pSize, this.pSize);
            ctx.restore();
            setTimeout(() => {
              this.drawBoard();
              this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
            }, 100);
          }
        }
      });
    },
  
    drawBoard() {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let y = 0; y < this.boardHeight; y++) {
        for (let x = 0; x < this.boardWidth; x++) {
          const idx = this.getBoardIdx(x, y);
          if (this.board[idx]) {
            this.ctx.fillStyle = this.colors[this.board[idx] - 1];
            this.ctx.fillRect(x * this.pSize, y * this.pSize, this.pSize, this.pSize);
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x * this.pSize, y * this.pSize, this.pSize, this.pSize);
          }
        }
      }
    },
  
    drawNextShape() {
      this.nextCtx.clearRect(0, 0, 110, 110);
      this.nextCtx.fillStyle = "#000";
      this.nextCtx.fillRect(0, 0, 110, 110);
      this.nextCtx.save();
      this.nextCtx.translate(2, 2);
      const centerX = 2.5;
      const centerY = 2.5;
      this.drawShape(centerX, centerY, this.nextShape, this.nextShapeIndex, this.nextCtx);
      this.nextCtx.restore();
    },
  
    play() {
      this.isActive = true;
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (!this.isPaused) {
            this.time++;
            this.updateInfo();
          }
        }, 1000);
      }
      const gameLoop = (time) => {
        if (this.isPaused) {
          this.drawBoard();
          this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
          return;
        }
        if (!this.lastTime) this.lastTime = time;
        const delta = time - this.lastTime;
        if (delta >= this.speed) {
          this.move("D");
          this.lastTime = time;
        }
        if (this.curComplete) {
          this.playSound("land");
          this.markBoardShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
          this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex, this.ctx, true);
          this.calcScore({ shape: true });
          this.checkRows();
          this.checkScore();
          this.initShapes();
          if (this.isActive) this.play();
        } else {
          this.pTimer = requestAnimationFrame(gameLoop);
        }
      };
      this.pTimer = requestAnimationFrame(gameLoop);
    },
  
    togglePause() {
      if (this.isActive && !this.isPaused) {
        this.isPaused = true;
        this.clearTimers();
        this.canvas.classList.add("paused");
        document.getElementById("start").textContent = "Resume";
      } else if (this.isActive && this.isPaused) {
        this.isPaused = false;
        this.canvas.classList.remove("paused");
        this.drawBoard();
        this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
        this.play();
        document.getElementById("start").textContent = "Pause";
      }
    },
  
    gameOver() {
      this.playSound("gameOver");
      this.saveHighScore();
      this.clearTimers();
      this.isActive = false;
      this.canvas.classList.add("game-over");
      document.getElementById("start").style.display = "none";
      document.getElementById("reset").style.display = "block";
      this.showGameOver();
    },
  
    showGameOver() {
      this.isGameOver = true;
      this.isPaused = false;
      const oldOverlay = document.getElementById('game-over-overlay');
      if (oldOverlay) oldOverlay.remove();
      let overlay = document.createElement('div');
      overlay.id = 'game-over-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.background = 'rgba(0,0,0,0.7)';
      overlay.style.zIndex = '10';
      let msg = document.createElement('div');
      msg.textContent = 'Game Over';
      msg.style.color = '#fff';
      msg.style.fontSize = '2.5em';
      msg.style.marginBottom = '20px';
      let playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.style.fontSize = '1.2em';
      playAgainBtn.style.background = '#e1ff5f';
      playAgainBtn.style.borderRadius = '2px';
      playAgainBtn.style.color = '#202020';
      playAgainBtn.style.cursor = 'pointer';
      playAgainBtn.style.border = 'none';
      playAgainBtn.style.padding = '10px 30px';
      playAgainBtn.style.fontWeight = 'bold';
      playAgainBtn.style.transition = 'all 0.3s ease';
      playAgainBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      playAgainBtn.onmouseover = function() {
        playAgainBtn.style.background = '#d4f542';
      };
      playAgainBtn.onmouseout = function() {
        playAgainBtn.style.background = '#e1ff5f';
      };
      playAgainBtn.onclick = () => {
        overlay.remove();
        this.reset();
        this.play();
        document.getElementById("start").textContent = "Pause";
      };
      overlay.appendChild(msg);
      overlay.appendChild(playAgainBtn);
      let tetrisDiv = document.getElementById('tetris');
      tetrisDiv.style.position = 'relative';
      tetrisDiv.appendChild(overlay);
      document.getElementById('start').textContent = 'Start';
    },
  
    reset() {
      this.clearTimers();
      this.board = [];
      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.time = 0;
      this.curComplete = false;
      this.isActive = false;
      this.nextShapeIndex = null;
      this.speed = this.baseSpeed;
      this.canvas.classList.remove("game-over", "paused");
      document.getElementById("start").textContent = "Start";
      document.getElementById("start").style.display = "block";
      document.getElementById("reset").style.display = "none";
      this.initBoard();
      this.updateInfo();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
  
    clearTimers() {
      clearInterval(this.timer);
      cancelAnimationFrame(this.pTimer);
      this.timer = null;
      this.pTimer = null;
      this.lastTime = null;
    },
  
    move(dir) {
      let tempX = this.curX;
      let tempY = this.curY;
      let newShape = this.curShape;
      switch (dir) {
        case "L":
          tempX--;
          break;
        case "R":
          tempX++;
          break;
        case "D":
          tempY++;
          break;
        case "RT":
          if (this.curShapeIndex !== 6) {
            newShape = this.curShape.map(([x, y]) => [-y, x]);
          }
          break;
      }
      if (this.checkMove(tempX, tempY, newShape)) {
        if (dir === "L" || dir === "R") {
          this.playSound("move");
        } else if (dir === "RT") {
          this.playSound("rotate");
        } else if (dir === "D") {
          this.playSound("drop");
        }
        this.curX = tempX;
        this.curY = tempY;
        this.curShape = newShape;
        this.drawBoard();
        this.drawShape(this.curX, this.curY, this.curShape, this.curShapeIndex);
      } else if (dir === "D") {
        this.curComplete = true;
      }
    },
  
    checkMove(x, y, shape) {
      return shape.every(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return (
          nx >= 0 &&
          nx < this.boardWidth &&
          ny < this.boardHeight &&
          (ny < 0 || !this.board[this.getBoardIdx(nx, ny)])
        );
      });
    },
  
    markBoardShape(x, y, shape, type) {
      shape.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (ny >= 0) {
          this.board[this.getBoardIdx(nx, ny)] = type + 1;
        }
      });
    },
  
    async checkRows() {
      let linesCleared = 0;
      for (let y = this.boardHeight - 1; y >= 0; y--) {
        if (this.isRowFull(y)) {
          await this.animateRowClear(y);
          this.removeRow(y);
          linesCleared++;
          for (let ny = y; ny > 0; ny--) {
            this.shiftRow(ny - 1, ny);
          }
          this.board.splice(0, this.boardWidth, ...Array(this.boardWidth).fill(0));
          y++;
        }
      }
      if (linesCleared > 0) {
        this.playSound("clear");
        this.calcScore({ lines: linesCleared });
      }
    },
  
    isRowFull(y) {
      for (let x = 0; x < this.boardWidth; x++) {
        if (!this.board[this.getBoardIdx(x, y)]) return false;
      }
      return true;
    },
  
    removeRow(y) {
      for (let x = 0; x < this.boardWidth; x++) {
        this.board[this.getBoardIdx(x, y)] = 0;
      }
    },
  
    shiftRow(fromY, toY) {
      for (let x = 0; x < this.boardWidth; x++) {
        this.board[this.getBoardIdx(x, toY)] = this.board[this.getBoardIdx(x, fromY)];
        this.board[this.getBoardIdx(x, fromY)] = 0;
      }
    },
  
    animateRowClear(y) {
      return new Promise(resolve => {
        let opacity = 1;
        const animate = () => {
          this.drawBoard();
          for (let x = 0; x < this.boardWidth; x++) {
            const idx = this.getBoardIdx(x, y);
            if (this.board[idx]) {
              this.ctx.fillStyle = this.colors[this.board[idx] - 1];
              this.ctx.globalAlpha = opacity;
              this.ctx.fillRect(x * this.pSize, y * this.pSize, this.pSize, this.pSize);
              this.ctx.strokeStyle = "#fff";
              this.ctx.strokeRect(x * this.pSize, y * this.pSize, this.pSize, this.pSize);
            }
          }
          this.ctx.globalAlpha = 1;
          opacity -= 0.1;
          if (opacity > 0) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(animate);
      });
    },
  
    calcScore({ lines = 0, shape = false }) {
      let score = 0;
      const levelData = this.levelScores[Math.min(this.level, this.numLevels)];
      if (lines > 0) {
        score += lines * levelData[1];
        this.lines += lines;
      }
      if (shape) {
        score += levelData[2];
      }
      this.score += score;
      this.updateInfo();
    },
  
    checkScore() {
      const levelData = this.levelScores[this.level];
      if (this.score >= levelData[0]) {
        this.level++;
        this.speed = Math.max(100, this.baseSpeed - (this.level - 1) * 50);
        this.updateInfo();
      }
    },
  
    getBoardIdx(x, y) {
      return x + y * this.boardWidth;
    },

  };
  
  Tetris.init();
