import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';

let camera, scene, renderer;
let topRenderer, camera2
let cube, backWall, leftWall, rightWall, frontWall;
let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false,
    rotateLeft = false,
    rotateRight = false;
let characterSpeed = 0.1;
let rotationSpeed = 0.05;
let previousCubePosition = new THREE.Vector3();

function init() {

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);

    // MAIN CAMERA
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    // TOP Camera
    camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera2.position.set(0, 0, 0); // set the position of the camera to the top right corner of the scene

    //Lights

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-10, 30, -10);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 100;
    light.intensity = 1;
    light.shadow.mapSize.width = 1200;
    light.shadow.mapSize.height = 1200;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.castShadow = true;
    scene.add(ambientLight);


    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(-10, 30, -10);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.camera.near = 0.1;
    // directionalLight.shadow.camera.far = 100;
    // directionalLight.intensity = 0.5;
    // directionalLight.shadow.mapSize.width = 1200;
    // directionalLight.shadow.mapSize.height = 1200;
    // scene.add(directionalLight);


    // OBJECTS

    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        metalness: 0.2,
        roughness: 0.8
    });
    

    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);

    // CUBE/AI Textures/Material

    const cubeTextureEye = new THREE.TextureLoader().load("cubeTextureEye.png");
    const cubeTextureTop = new THREE.TextureLoader().load("cubeTextureTop.png");
    const cubeTextureFace = new THREE.TextureLoader().load("cubeTextureFace.png");
    var materialFront = new THREE.MeshBasicMaterial({ map: cubeTextureFace });
    var materialBack = new THREE.MeshBasicMaterial({ map: cubeTextureFace });
    var materialTop = new THREE.MeshBasicMaterial({ map: cubeTextureTop });
    var materialBottom = new THREE.MeshBasicMaterial({ map: cubeTextureFace });
    var materialLeft = new THREE.MeshBasicMaterial({ map: cubeTextureFace });
    var materialRight = new THREE.MeshBasicMaterial({ map: cubeTextureEye });
    
    // Create a mesh face material and assign the materials to the cube faces
    var cubeMaterial = [
        materialFront, materialBack, materialTop,
        materialBottom, materialLeft, materialRight
    ];

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    // cube.health = health;
    scene.add(cube);
    cube.add(camera2);
    
    // Walls :
    const wallGeometry = new THREE.BoxGeometry(10, 5, 0.01);

    // MATERIALS:

    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.5,
        shininess: 100
    });

    // const blueGridText = new THREE.TextureLoader().load("grid_10x5_blue.png");
    // const blueGridMat = new THREE.MeshBasicMaterial({
    //     map: blueGridText,
    //     transparent: true,
    //     opacity: 0.6
    // });

    // const redGridText = new THREE.TextureLoader().load("grid_10x5_red.png");
    // const redGridMat = new THREE.MeshBasicMaterial({
    //     map: redGridText,
    //     transparent: true,
    //     opacity: 0.8
    // });

    // const greenGridText = new THREE.TextureLoader().load("grid_10x5_green.png");
    // const greenGridMat = new THREE.MeshBasicMaterial({
    //     map: greenGridText,
    //     transparent: true,
    //     opacity: 0.8
    // });

    // const greyGridText = new THREE.TextureLoader().load("grid_10x5_grey.png");
    // const greyGridMat = new THREE.MeshBasicMaterial({
    //     map: greyGridText,
    //     transparent: true,
    //     opacity: 0.8
    // });


    backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 2, -5);
    // backWall.receiveShadow = true;
    // backWall.castShadow = true;

    const leftWallGeometry = new THREE.BoxGeometry(0.01, 5, 10);
    leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-5, 2, 0);
    // leftWall.receiveShadow = true;
    // leftWall.castShadow = true;

    const rightWallGeometry = new THREE.BoxGeometry(0.01, 5, 10);
    rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(5, 2, 0);
    // rightWall.receiveShadow = true;
    // rightWall.castShadow = true;

    const frontWallGeometry = new THREE.BoxGeometry(10, 5, 0.01);
    frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, 2, 5);
    // frontWall.receiveShadow = true;
    // frontWall.castShadow = true;

    scene.add(backWall);
    scene.add(leftWall);
    scene.add(rightWall);
    scene.add(frontWall);

    //Renderer Main
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Renderer Top
    topRenderer = new THREE.WebGLRenderer({
        antialias: true
    });
    topRenderer.setClearColor(0x000000, 0); // set the background color to transparent
    topRenderer.setSize(window.innerWidth / 4, window.innerHeight / 4); // set the size of the viewport
    topRenderer.domElement.style.position = 'absolute'; // set the position of the viewport
    topRenderer.domElement.style.top = '10px'; // set the top position of the viewport
    topRenderer.domElement.style.right = '10px'; // set the right position of the viewport
    document.body.appendChild(topRenderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

}

function checkCollision() {
    // Create a bounding box for the cube
    const cubeBoundingBox = new THREE.Box3().setFromObject(cube);

    // Create a bounding box for the walls
    const backWallBoundingBox = new THREE.Box3().setFromObject(backWall);
    const leftWallBoundingBox = new THREE.Box3().setFromObject(leftWall);
    const rightWallBoundingBox = new THREE.Box3().setFromObject(rightWall);
    const frontWallBoundingBox = new THREE.Box3().setFromObject(frontWall);

    // Check for collision between the cube and the wall
    if (cubeBoundingBox.intersectsBox(backWallBoundingBox) ||
        cubeBoundingBox.intersectsBox(leftWallBoundingBox) ||
        cubeBoundingBox.intersectsBox(rightWallBoundingBox) ||
        cubeBoundingBox.intersectsBox(frontWallBoundingBox)) {
        // If there is a collision, move the cube back to its previous position
        cube.position.copy(previousCubePosition); //<<
    } else {
        // Update the previous cube position if there was no collision
        previousCubePosition.copy(cube.position);
    }


}

function animate() {
    checkCollision()
    requestAnimationFrame(animate);
    //  Rotate the cube
    if (rotateLeft) {
        cube.rotateY(rotationSpeed);
    }
    if (rotateRight) {
        cube.rotateY(-rotationSpeed);
    }

    // Move fron/back/left/right 
    if (moveForward && cube.position.z > -10 + characterSpeed) {
        cube.translateZ(-characterSpeed);
    }
    if (moveBackward && cube.position.z < 10 - characterSpeed) {
        cube.translateZ(characterSpeed);
    }
    if (moveLeft && cube.position.x > -10 + characterSpeed) {
        cube.translateX(-characterSpeed);
    }
    if (moveRight && cube.position.x < 10 - characterSpeed) {
        cube.translateX(characterSpeed);
    }



    renderer.render(scene, camera);
    topRenderer.render(scene, camera2);

}

function onKeyDown(event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'KeyQ':
            rotateLeft = true;
            break;

        case 'KeyE':
            rotateRight = true;
            break;

    }

}

function onKeyUp(event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

        case 'KeyQ':
            rotateLeft = false;
            break;

        case 'KeyE':
            rotateRight = false;
            break;

    }

}


window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


init();
animate();