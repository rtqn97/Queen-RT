const canvas = document.getElementById("heartCanvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.z = 55;

const renderer = new THREE.WebGLRenderer({
canvas: canvas,
alpha: true,
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
window.devicePixelRatio
);

/* HEART SHAPE */

function heartShape(t){

    return {

        x: 16 * Math.pow(Math.sin(t),3),

        y:
            13 * Math.cos(t)
            - 5 * Math.cos(2*t)
            - 2 * Math.cos(3*t)
            - Math.cos(4*t)

    };

}

/* PARTICLES */

const particleCount = 7000;

const positions = [];

for(let i = 0; i < particleCount; i++){

    const t = Math.random() * Math.PI * 2;

    const p = heartShape(t);

    positions.push(
        p.x * 1.3,
        p.y * 1.3,
        (Math.random() - 0.5) * 18
    );

}

const geometry =
new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        positions,
        3
    )
);

const material =
new THREE.PointsMaterial({

    color: 0xff4f88,

    size: 0.32,

    transparent: true,

    opacity: 0.95

});

const heartParticles =
new THREE.Points(
    geometry,
    material
);

scene.add(heartParticles);

/* STARS */

const starGeometry =
new THREE.BufferGeometry();

const starPositions = [];

for(let i=0;i<2500;i++){

    starPositions.push(
        (Math.random()-0.5)*250,
        (Math.random()-0.5)*250,
        (Math.random()-0.5)*250
    );

}

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

    size: 0.12

});

const stars =
new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);

/* ANIMATION */

function animate(){

    requestAnimationFrame(
        animate
    );

    heartParticles.rotation.y += 0.003;

    heartParticles.rotation.x += 0.0008;

    heartParticles.rotation.z += 0.0005;

    stars.rotation.y += 0.0005;

    renderer.render(
        scene,
        camera
    );

}

animate();

/* ELEMENTS */

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

const nameReveal =
document.getElementById(
"nameReveal"
);

const letter =
document.getElementById(
"letter"
);

/* START EXPERIENCE */

startBtn.addEventListener(
"click",
() => {

    music.play().catch(
        ()=>{}
    );

    intro.style.display =
    "none";

    loadingText.style.opacity =
    "1";

    /* SHOW NAME */

    setTimeout(()=>{

        nameReveal.classList.add(
        "show"
        );

    },3000);

    /* SHOW LETTER */

    setTimeout(()=>{

        letter.classList.add(
        "show"
        );

    },6000);

    /* HIDE LOADING */

    setTimeout(()=>{

        loadingText.style.opacity =
        "0";

    },6500);

}
);

/* FLOATING HEARTS */

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
    Math.random()*100 + "%";

    heart.style.fontSize =
    (15 + Math.random()*30)
    + "px";

    heart.style.animationDuration =
    (5 + Math.random()*5)
    + "s";

    floatingArea.appendChild(
    heart
    );

    setTimeout(()=>{

        heart.remove();

    },10000);

}

setInterval(
createHeart,
350
);

/* RESIZE */

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
