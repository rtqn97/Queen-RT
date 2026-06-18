/* ==========================================
   FOR AARATI ❤️
   PARTICLE MORPH SYSTEM
   PART 1
========================================== */

const canvas = document.getElementById("heartCanvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 120;

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

/* ==========================================
   SETTINGS
========================================== */

const PARTICLE_COUNT = 5000;

const SCATTER_DURATION = 4000;
const HEART_DURATION = 4000;
const NAME_DURATION = 4000;

let currentState = "scatter";

let stateStartTime = 0;

/* ==========================================
   ARRAYS
========================================== */

const positions =
new Float32Array(
    PARTICLE_COUNT * 3
);

const scatterTargets =
new Float32Array(
    PARTICLE_COUNT * 3
);

const heartTargets =
new Float32Array(
    PARTICLE_COUNT * 3
);

const textTargets =
new Float32Array(
    PARTICLE_COUNT * 3
);

/* ==========================================
   RANDOM SCATTER
========================================== */

for(let i=0;i<PARTICLE_COUNT;i++){

    const x =
    (Math.random()-0.5)*220;

    const y =
    (Math.random()-0.5)*220;

    const z =
    (Math.random()-0.5)*120;

    positions[i*3] = x;
    positions[i*3+1] = y;
    positions[i*3+2] = z;

    scatterTargets[i*3] = x;
    scatterTargets[i*3+1] = y;
    scatterTargets[i*3+2] = z;

}

/* ==========================================
   HEART SHAPE
========================================== */

function heartPoint(t){

    return {

        x:
        16 *
        Math.pow(
            Math.sin(t),
            3
        ),

        y:
        13*Math.cos(t)
        -5*Math.cos(2*t)
        -2*Math.cos(3*t)
        -Math.cos(4*t)

    };

}

for(let i=0;i<PARTICLE_COUNT;i++){

    const t =
    Math.random()
    * Math.PI * 2;

    const p =
    heartPoint(t);

    heartTargets[i*3] =
    p.x * 2.8;

    heartTargets[i*3+1] =
    p.y * 2.8;

    heartTargets[i*3+2] =
    (Math.random()-0.5)
    * 12;

}

/* ==========================================
   TEXT TARGET
========================================== */

const textCanvas =
document.getElementById(
    "textCanvas"
);

const textCtx =
textCanvas.getContext(
    "2d"
);

textCtx.clearRect(
    0,
    0,
    textCanvas.width,
    textCanvas.height
);

textCtx.fillStyle =
"#ffffff";

textCtx.textAlign =
"center";

textCtx.textBaseline =
"middle";

textCtx.font =
"bold 140px Arial";

textCtx.fillText(
    "AARATI ❤️",
    textCanvas.width / 2,
    textCanvas.height / 2
);

const imageData =
textCtx.getImageData(
    0,
    0,
    textCanvas.width,
    textCanvas.height
);

const textPoints = [];

for(let y=0;y<imageData.height;y+=4){

    for(let x=0;x<imageData.width;x+=4){

        const index =
        (y * imageData.width + x)
        * 4;

        if(
            imageData.data[index + 3]
            > 128
        ){

            textPoints.push({

                x:
                x -
                imageData.width/2,

                y:
                imageData.height/2
                - y

            });

        }

    }

}
/* ==========================================
   PART 2
   PARTICLE GEOMETRY + MORPH ENGINE
========================================== */

while(textPoints.length < PARTICLE_COUNT){

    textPoints.push(

        textPoints[
            Math.floor(
                Math.random()
                * textPoints.length
            )
        ]

    );

}

for(let i=0;i<PARTICLE_COUNT;i++){

    const point =
    textPoints[
        i %
        textPoints.length
    ];

    textTargets[i*3] =
    point.x * 0.22;

    textTargets[i*3+1] =
    point.y * 0.22;

    textTargets[i*3+2] =
    (Math.random()-0.5)*8;

}

/* ==========================================
   GEOMETRY
========================================== */

const geometry =
new THREE.BufferGeometry();

geometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
        positions,
        3
    )

);

const material =
new THREE.PointsMaterial({

    color: 0xff4f88,

    size: 1.15,

    transparent: true,

    opacity: 0.95

});

const particles =
new THREE.Points(
    geometry,
    material
);

scene.add(
    particles
);

/* ==========================================
   STARS
========================================== */

const starPositions = [];

for(let i=0;i<2500;i++){

    starPositions.push(
        (Math.random()-0.5)*400,
        (Math.random()-0.5)*400,
        (Math.random()-0.5)*400
    );

}

const starGeometry =
new THREE.BufferGeometry();

starGeometry.setAttribute(

    "position",

    new THREE.Float32BufferAttribute(
        starPositions,
        3
    )

);

const starMaterial =
new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.35,

    transparent:true,

    opacity:0.7

});

const stars =
new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(
    stars
);

/* ==========================================
   LERP FUNCTION
========================================== */

function lerp(
    start,
    end,
    amount
){

    return start +
    (end-start)
    * amount;

}

/* ==========================================
   MORPH
========================================== */

function morphToTarget(
    target,
    speed
){

    const array =
    geometry.attributes
    .position.array;

    for(
        let i=0;
        i<array.length;
        i++
    ){

        array[i] =
        lerp(

            array[i],

            target[i],

            speed

        );

    }

    geometry.attributes
    .position
    .needsUpdate = true;

}

/* ==========================================
   LOOP STATES

   scatter
   heart
   text
========================================== */

function updateState(){

    const elapsed =
    Date.now()
    - stateStartTime;

    if(
        currentState ===
        "scatter"
    ){

        morphToTarget(
            scatterTargets,
            0.018
        );

        if(
            elapsed >
            SCATTER_DURATION
        ){

            currentState =
            "heart";

            stateStartTime =
            Date.now();

        }

    }

    else if(
        currentState ===
        "heart"
    ){

        morphToTarget(
            heartTargets,
            0.03
        );

        if(
            elapsed >
            HEART_DURATION
        ){

            currentState =
            "text";

            stateStartTime =
            Date.now();

        }

    }

    else if(
        currentState ===
        "text"
    ){

        morphToTarget(
            textTargets,
            0.03
        );

        if(
            elapsed >
            NAME_DURATION
        ){

            currentState =
            "scatter";

            stateStartTime =
            Date.now();

        }

    }

          }
/* ==========================================
   PART 3
   STARTUP + MESSAGE + FLOATING HEARTS
========================================== */

const startBtn =
document.getElementById(
    "startBtn"
);

const intro =
document.getElementById(
    "intro"
);

const music =
document.getElementById(
    "bgMusic"
);

const loadingText =
document.getElementById(
    "loadingText"
);

const letter =
document.getElementById(
    "letter"
);

const lines =
document.querySelectorAll(
    ".line"
);

const signature =
document.querySelector(
    ".signature"
);

/* ==========================================
   PREPARE MESSAGE
========================================== */

lines.forEach(line=>{

    line.style.opacity="0";
    line.style.transform=
    "translateY(20px)";
    line.style.transition=
    "1.5s";

});

signature.style.opacity="0";
signature.style.transition="2s";

/* ==========================================
   SHOW MESSAGE
========================================== */

function showMessage(){

    letter.classList.add(
        "show"
    );

    lines.forEach(
        (line,index)=>{

        setTimeout(()=>{

            line.style.opacity=
            "1";

            line.style.transform=
            "translateY(0)";

        },

        index * 3000

        );

    });

    setTimeout(()=>{

        signature.style.opacity=
        "1";

    },

    lines.length * 3000

    );

}

/* ==========================================
   FLOATING HEARTS
========================================== */

const floatingArea =
document.getElementById(
    "floating-hearts"
);

function createHeart(){

    const heart =
    document.createElement(
        "div"
    );

    heart.classList.add(
        "heart"
    );

    heart.innerHTML =
    "❤️";

    heart.style.left =
    Math.random()*100
    + "%";

    heart.style.fontSize =
    (14 + Math.random()*28)
    + "px";

    heart.style.animationDuration =
    (5 + Math.random()*6)
    + "s";

    floatingArea.appendChild(
        heart
    );

    setTimeout(()=>{

        heart.remove();

    },11000);

}

setInterval(
    createHeart,
    300
);

/* ==========================================
   START BUTTON
========================================== */

startBtn.addEventListener(
    "click",
    ()=>{

        music.play()
        .catch(()=>{});

        intro.style.display =
        "none";

        loadingText.style.opacity =
        "1";

        stateStartTime =
        Date.now();

        currentState =
        "scatter";

        /* MESSAGE APPEARS
           AROUND 32 SEC
        */

        setTimeout(()=>{

            loadingText.style.opacity =
            "0";

            showMessage();

        },32000);

    }
);

/* ==========================================
   HEART BEAT EFFECT
========================================== */

let beatTime = 0;

/* ==========================================
   MAIN ANIMATION LOOP
========================================== */

function animate(){

    requestAnimationFrame(
        animate
    );

    updateState();

    beatTime += 0.04;

    if(
        currentState ===
        "heart"
    ){

        const beat =
        1 +
        Math.sin(
            beatTime
        ) * 0.06;

        particles.scale.set(
            beat,
            beat,
            beat
        );

    }

    else{

        particles.scale.set(
            1,
            1,
            1
        );

    }

    particles.rotation.y +=
    0.002;

    stars.rotation.y +=
    0.0004;

    renderer.render(
        scene,
        camera
    );

}

animate();

/* ==========================================
   RESIZE
========================================== */

window.addEventListener(
    "resize",
    ()=>{

        camera.aspect =
        window.innerWidth /
        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
