let expressao = "";
let isOpen = true;
let historico = [];

// Insere número ou operador no display
function insertNumber(valor) {
  const display = document.getElementById("display");
  if (valor === '÷') valor = '/';
  if (valor === 'X') valor = '*';
  if (valor === ',') valor = '.';
  expressao += valor;
  display.value = expressao;
}

// Alterna entre abrir e fechar parênteses
function handleParenthesisClick() {
  const display = document.getElementById("display");
  expressao += isOpen ? '(' : ')';
  isOpen = !isOpen;
  display.value = expressao;
}

// Limpa tudo
function limpar() {
  expressao = "";
  document.getElementById("display").value = "";
}

// Calcula a expressão
function calcular() {
  const display = document.getElementById("display");
  try {
    let expr = expressao.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    const resultado = eval(expr);
    historico.push(`${expressao} = ${resultado}`);
    display.value = resultado;
    expressao = resultado.toString();
  } catch {
    display.value = "Erro";
  }
}

// Ativa o botão C
document.getElementById("c").onclick = limpar;

// Permite usar Backspace no teclado
document.addEventListener("keydown", function(event) {
  const display = document.getElementById("display");
  if (event.key === "Backspace") {
    expressao = expressao.slice(0, -1);
    display.value = expressao;
    event.preventDefault();
  }
});

// Histórico
document.getElementById("historyBtn").addEventListener("click", () => {
  const box = document.getElementById("historyBox");
  if (historico.length === 0) {
    box.innerHTML = "<em>Sem histórico ainda</em>";
  } else {
    box.innerHTML = "<strong>Histórico:</strong><br>" + historico.map((h, i) => `${i + 1}. ${h}`).join("<br>");
  }
  box.classList.toggle("visible");
});

// Canvas animado
const canvas = document.getElementById("fundo");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const mouse = { x: null, y: null };
const ghost = { x: canvas.width / 2, y: canvas.height / 2 };
const retreatPoint = { x: 50, y: 50 };
let mouseBlocked = false;

const content = document.getElementById("content");
content.addEventListener("mouseenter", () => mouseBlocked = true);
content.addEventListener("mouseleave", () => mouseBlocked = false);
content.addEventListener("touchstart", () => mouseBlocked = true);
content.addEventListener("touchend", () => mouseBlocked = false);

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });

const particles = [];
const numParticles = 1500;

for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 2,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const target = (mouseBlocked || mouse.x === null || mouse.y === null)
    ? retreatPoint
    : mouse;

  ghost.x += (target.x - ghost.x) * 0.05;
  ghost.y += (target.y - ghost.y) * 0.05;

  for (let p of particles) {
    

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  // Tentáculos conectando partículas ao perseguidor (sempre visíveis)
  for (let p of particles) {
  const dx = ghost.x - p.x;
  const dy = ghost.y - p.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 180) {
    const rayCount = 3 + Math.floor(Math.random() * 3); // 3 a 5 raios por partícula

    for (let i = 0; i < rayCount; i++) {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;

      const cpX = (p.x + ghost.x) / 2 + offsetX;
      const cpY = (p.y + ghost.y) / 2 + offsetY;

      const pulse = 1 + Math.sin(Date.now() / 100 + i * 10) * 0.7;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(cpX, cpY, ghost.x, ghost.y);

      // Cor mutante tipo raio
      const r = 255 + Math.floor(Math.random() * 55);
      const g = 255;
      const b = 255;
      const alpha = 0.2 + Math.random() * 0.8;

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = 1.5 + Math.random() * 2.5;
      ctx.shadowColor = " rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 15;
      ctx.stroke();
    }
  }
}

  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const length = 30 + Math.random() * 40;
    const endX = ghost.x + Math.cos(angle) * length;
    const endY = ghost.y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(ghost.x, ghost.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 250, 255, 0.8)";
  ctx.shadowColor = "red";
  ctx.shadowBlur = 15;
  ctx.fill();

  requestAnimationFrame(draw);
}

draw();