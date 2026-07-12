const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const drawBtn = document.getElementById("drawBtn");
const resetBtn = document.getElementById("resetBtn");

const roundText = document.getElementById("round");
const remainText = document.getElementById("remain");
const resultDiv = document.getElementById("result");
const historyDiv = document.getElementById("history");

let pool = [];
let used = [];
let round = 1;

// ======================
// 애니메이션용 공
// ======================

const balls = [];

for (let i = 1; i <= 45; i++) {

    balls.push({
        num: i,
        x: Math.random() * (canvas.width - 30) + 15,
        y: Math.random() * (canvas.height - 30) + 15,
        vx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1)
    });

}

function ballColor(n){

    if(n<=10) return "#fbc400";
    if(n<=20) return "#4aa3ff";
    if(n<=30) return "#ff5555";
    if(n<=40) return "#999999";

    return "#45b649";

}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(const b of balls){

        b.x += b.vx;
        b.y += b.vy;

        if(b.x<15 || b.x>canvas.width-15)
            b.vx *= -1;

        if(b.y<15 || b.y>canvas.height-15)
            b.vy *= -1;

        ctx.beginPath();
        ctx.arc(b.x,b.y,15,0,Math.PI*2);
        ctx.fillStyle=ballColor(b.num);
        ctx.fill();

        ctx.fillStyle="white";
        ctx.font="12px Arial";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(b.num,b.x,b.y);

    }

    requestAnimationFrame(animate);

}

animate();

// ======================
// 게임
// ======================

function resetGame(){

    pool=[];

    used=[];

    round=1;

    for(let i=1;i<=45;i++)
        pool.push(i);

    resultDiv.innerHTML="";
    historyDiv.innerHTML="";

    updateInfo();

}

function updateInfo(){

    roundText.textContent=Math.min(round,8);

    remainText.textContent=pool.length;

}

drawBtn.onclick=draw;

resetBtn.onclick=resetGame;

resetGame();

function draw(){

    if(round>8){

        alert("게임 종료!");
        return;

    }

    let result=[];

    // 마지막 회차
    if(pool.length===3){

        result=result.concat(pool);

        while(result.length<6){

            const n=used[Math.floor(Math.random()*used.length)];

            if(!result.includes(n))
                result.push(n);

        }

        pool=[];

    }

    else{

        for(let i=0;i<6;i++){

            const idx=Math.floor(Math.random()*pool.length);

            const n=pool.splice(idx,1)[0];

            used.push(n);

            result.push(n);

        }

    }

    result.sort((a,b)=>a-b);

    let html="";

    result.forEach(n=>{

        html+=`<div class="ball" style="background:${ballColor(n)}">${n}</div>`;

    });

    resultDiv.innerHTML=html;

    let history=`<div class="historyRow"><b>${round}회차</b><br>`;

    result.forEach(n=>{

        history+=`<div class="smallBall" style="background:${ballColor(n)}">${n}</div>`;

    });

    history+="</div>";

    historyDiv.innerHTML+=history;

    round++;

    updateInfo();

    if(round===9){

        document.getElementById("info").innerHTML+=
        "<h3>🎉 45개의 번호를 모두 사용했습니다.</h3>";

    }

}
