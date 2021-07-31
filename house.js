var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true); 
var lights = {};
var ground, box, shadowGenerator,shadowGenerator1,shadowGeneratorG,scene,camHeight;
var frameRate = 10;

var createScene = function () {
    scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
    scene.collisionsEnabled = true;

    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, camHeight, 900), scene);
    camera.setTarget(new BABYLON.Vector3(10,00,10));
    camera.speed = 20;
    camera.fov = 0.8;
    camera.inertia = 0.5;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(50, 200, 50);
    camera.checkCollisions = true;
    camera.attachControl(canvas, true); 
    scene.registerBeforeRender(function () {scene.activeCamera.position.y = 200; });
    /*
    scene.onPointerObservable.add(function (pointerInfo) {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERPICK:
                let m = pointerInfo.pickInfo.pickedMesh;
                vector = pointerInfo.pickInfo.pickedPoint;
            break;
        }
});*/

console.log(scene);
    createLight();
    buildGround(); 
    buildgarden();   
    var roof=buildRoof();
    var ceiling=SetCeiling();
    var kitchenwall=buildWallsR1();
    var roomwall=buildWallsR2();
    var labell=labels();
    var kitchenScene=kitchen();
    var room=room1();
    var skybox=skyboxSet();

    var ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, {
        ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
        blurRatio: 1 // Ratio of the combine post-process (combines the SSAO and the scene)
     });
        ssao.radius = 8;
        ssao.totalStrength = 0.9;
        ssao.expensiveBlur =true;
        ssao.samples = 4;
        ssao.maxZ = 100;
        scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera)

        var defaultpipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
        defaultpipeline.fxaaEnabled = true;

    return scene;
};

function createLight(){
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 400, 0), scene);
    light1.intensity = 0.05;
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 400, 900), scene);
    light2.intensity = 0.05;
    var light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(100, 400, 0), scene);
	light3.intensity=0.3;
    var light4 = new BABYLON.PointLight("light4", new BABYLON.Vector3(-100, 400, 900), scene);
	light4.intensity=0.3;
    var light5 = new BABYLON.PointLight("light5", new BABYLON.Vector3(0, 400, -500), scene);
    light5.intensity = 0.5;
    light5.range=200;
    var light6 = new BABYLON.HemisphericLight("light6", new BABYLON.Vector3(0, 500, -500), scene);
    light6.range=500;
    light6.intensity = 1;

    //SHADOWS
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light3);
    //shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.bias = 0.001;
    shadowGenerator.normalBias = 0.00001;
    shadowGenerator.contactHardeningLightSizeUVRatio = 0.035;  

    shadowGenerator1 = new BABYLON.ShadowGenerator(1024, light4);
    //shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator1.bias = 0.001;
    shadowGenerator1.normalBias = 0.00001;
    shadowGenerator1.contactHardeningLightSizeUVRatio = 0.035;   

    shadowGeneratorG = new BABYLON.ShadowGenerator(1024, light5);
    //shadowGenerator.useContactHardeningShadow = true;
    shadowGeneratorG.bias = 0.001;
    shadowGeneratorG.normalBias = 0.00001;
    shadowGeneratorG.contactHardeningLightSizeUVRatio = 0.035;   


}
function buildRoof(){
    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.scaling=new BABYLON.Vector3(300,1000,800);
    roof.position=new BABYLON.Vector3(0,500,0);
    roof.rotation.z = Math.PI / 2;
    roof.receiveShadows=true;
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    roof.material = roofMat;
    const roof2 = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof2.scaling=new BABYLON.Vector3(300,800,800);
    roof2.position=new BABYLON.Vector3(120,500,800);
    roof2.rotation.z = Math.PI / 2;
    roof2.material = roofMat;
    roof2.receiveShadows=true;
}
function buildGround(){
    const floormat = new BABYLON.StandardMaterial("floormat",scene);
    floormat.diffuseTexture = new BABYLON.Texture("./textures/concrete.jpg");
    floormat.backFaceCulling=false;
    ground = BABYLON.MeshBuilder.CreateGround("ground", {height:800, width: 1000}, scene);
    ground.material = floormat;
    //ground.checkCollisions=true;
    ground.receiveShadows=true;

    const floormat2 = new BABYLON.StandardMaterial("floormat2");
    floormat2.diffuseTexture = new BABYLON.Texture("./textures/hardwoodfloor.jpg");
    floormat2.backFaceCulling=false;
    var ground2 = BABYLON.MeshBuilder.CreateGround("ground", {width: 800, height: 800}, scene);
    ground2.position= new BABYLON.Vector3(100,0,800);
    ground2.material = floormat2;
    //ground2.checkCollisions=true;
    ground2.receiveShadows=true;  
}
function buildgarden(){
    const grassMat = new BABYLON.StandardMaterial("grassMat");
    grassMat.diffuseTexture = new BABYLON.Texture("./textures/grass.jpg");
    grassMat.backFaceCulling=false;
    grassMat.diffuseTexture.uScale = 5.0;
    grassMat.diffuseTexture.vScale = 5.0;
    var grass = BABYLON.MeshBuilder.CreateGround("grass", {width: 2000,height:3000}, scene);
    grass.position=new BABYLON.Vector3(0,-0.1,-1000);
    grass.material = grassMat; 
   // ground.checkCollisions=true;
   // grass.receiveShadows=true;

BABYLON.SceneLoader.Append("fence/", "scene.gltf", scene, function (fence) {
    var fence=scene.getMeshByName("Cube__0");
    fence.scaling=new BABYLON.Vector3(0.5,0.55,0.5);
    fence.position=new BABYLON.Vector3(-300,-20,-0.5);
    //fence.rotation=new BABYLON.Vector3(0Math.PI/2,,0);
   
 const locations=[];
 locations.push([-10,0,-300]);
 locations.push([0,0,-300]);
 locations.push([10,0,-300]);
 locations.push([20,0,-300]);
 locations.push([30,0,-300]);
 locations.push([40,0,-300]);
 locations.push([50,0,-300]);
 locations.push([60,0,-300]);
 locations.push([70,0,-300]);
 locations.push([80,0,-300]);
 locations.push([90,0,-300]);
 locations.push([100,0,-300]);
 locations.push([110,0,-300]);
 locations.push([120,0,-300]);
 locations.push([130,0,-300]);
 locations.push([140, 0,-300]);
 
 
 locations.push([-10,0,300]);
 locations.push([0,0,300]);
 locations.push([10,0,300]);
 locations.push([20,0,300]);
 locations.push([30,0,300]);
 locations.push([40,0,300]);
 locations.push([50,0,300]);
 locations.push([60,0,300]);
 locations.push([70,0,300]);
 locations.push([80,0,300]);
 locations.push([90,0,300]);
 locations.push([100,0,300]);
 locations.push([110,0,300]);
 locations.push([120,0,300]);
 locations.push([130,0,300]);
 locations.push([140, 0,300]);
    const fencess=[];
    for(let i=0;i<locations.length;i++){
        fencess[i]=fence.clone("cit"+i);
        fencess[i].position.y=locations[i][0];  
        fencess[i].position.x=locations[i][2];  

    }
});
BABYLON.SceneLoader.ImportMesh("", "tree/", "scene.gltf", scene, function(Mtree) {
    var tree=Mtree[0];
    tree.scaling=new BABYLON.Vector3(1,1,1);
    tree.position=new BABYLON.Vector3(400,20,-1000);
    tree.isVisible = false;
var x=-700;
var y=20;
var z=-200;
    for (var index = 0; index < 3; index++) {
        var newInstance = tree.clone("tree" + index);
        newInstance.setParent(tree);
        x+=400;
        z+=300;
        newInstance.position=new BABYLON.Vector3(x,y,z);
       shadowGeneratorG.getShadowMap().renderList.push(newInstance);

    }

});   
}
function  buildWallsR1(){
    const wallmat = new BABYLON.StandardMaterial("wallmat");
    wallmat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
    wallmat.backFaceCulling=false;
    var wall1 = BABYLON.MeshBuilder.CreateGround("wall1", {width: 180, height: 400}, scene);
    wall1.material = wallmat;
    wall1.checkCollisions=true;
    wall1.rotation= new BABYLON.Vector3(Math.PI / 2,0,Math.PI / 2);
    wall1.position= new BABYLON.Vector3(500,200,310);
    shadowGenerator.getShadowMap().renderList.push(wall1);
    wall1.receiveShadows=true;

    var wall11 = BABYLON.MeshBuilder.CreateGround("wall11", {width: 340, height: 400}, scene);
    wall11.material = wallmat;
    wall11.checkCollisions=true;
    wall11.rotation= new BABYLON.Vector3(Math.PI / 2,0,Math.PI / 2);
    wall11.position= new BABYLON.Vector3(500,200,-230);
    shadowGenerator.getShadowMap().renderList.push(wall11);
    wall11.receiveShadows=true;

    var wall12 = BABYLON.MeshBuilder.CreateGround("wall12", {width: 280, height: 100}, scene);
    wall12.material = wallmat;
    wall12.checkCollisions=true;
    wall12.rotation= new BABYLON.Vector3(Math.PI / 2,0,Math.PI / 2);
    wall12.position= new BABYLON.Vector3(500,350,80);
    shadowGenerator.getShadowMap().renderList.push(wall12);
    wall12.receiveShadows=true;

    var wall13 = BABYLON.MeshBuilder.CreateGround("wall13", {width: 280, height: 200}, scene);
    wall13.material = wallmat;
    wall13.checkCollisions=true;
    wall13.rotation= new BABYLON.Vector3(Math.PI / 2,0,Math.PI / 2);
    wall13.position= new BABYLON.Vector3(500,100,80);
    shadowGenerator.getShadowMap().renderList.push(wall13);
    wall13.receiveShadows=true;

    var wall2 = BABYLON.MeshBuilder.CreateGround("wall2", {width: 800, height: 400}, scene);
    wall2.material = wallmat;
    wall2.checkCollisions=true;
    wall2.rotation= new BABYLON.Vector3(-Math.PI / 2,0,-Math.PI / 2);
    wall2.position= new BABYLON.Vector3(-500,200,0);
    shadowGenerator.getShadowMap().renderList.push(wall2);
    wall2.receiveShadows=true;
    
    var wall3 = BABYLON.MeshBuilder.CreateGround("wall3", {width: 400, height: 400}, scene);
    wall3.material = wallmat;
    wall3.checkCollisions=true;
    wall3.rotation= new BABYLON.Vector3(-Math.PI / 2,0,0);
    wall3.position= new BABYLON.Vector3(300,200,400);
    shadowGenerator.getShadowMap().renderList.push(wall3);
    wall3.receiveShadows=true;

    var wall32 = BABYLON.MeshBuilder.CreateGround("wall32", {width: 400, height: 400}, scene);
    wall32.material = wallmat;
    wall32.checkCollisions=true;
    wall32.rotation= new BABYLON.Vector3(-Math.PI / 2,0,0);
    wall32.position= new BABYLON.Vector3(-300,200,400);
    shadowGenerator.getShadowMap().renderList.push(wall32);
    wall32.receiveShadows=true;

    var wall33 = BABYLON.MeshBuilder.CreateGround("wall33", {width: 200, height: 100}, scene);
    wall33.material = wallmat;
    wall33.checkCollisions=true;
    wall33.rotation= new BABYLON.Vector3(-Math.PI / 2,0,0);
    wall33.position= new BABYLON.Vector3(0,350,400);
    shadowGenerator.getShadowMap().renderList.push(wall33);
    wall33.receiveShadows=true;
    
    var wall4 = BABYLON.MeshBuilder.CreateGround("wall4", {width: 400, height: 400}, scene);
    wall4.material = wallmat;
    wall4.checkCollisions=true;
    wall4.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall4.position= new BABYLON.Vector3(300,200,-400);
    shadowGenerator.getShadowMap().renderList.push(wall4);
    shadowGenerator1.getShadowMap().renderList.push(wall4);
    wall4.receiveShadows=true;

    var wall5 = BABYLON.MeshBuilder.CreateGround("wall5", {width: 400, height: 400}, scene);
    wall5.material = wallmat;
    wall5.checkCollisions=true;
    wall5.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall5.position= new BABYLON.Vector3(-300,200,-400);
    shadowGenerator.getShadowMap().renderList.push(wall5);
    wall5.receiveShadows=true;
    
    var wall51 = BABYLON.MeshBuilder.CreateGround("wall51", {width: 200, height: 100}, scene);
    wall51.material = wallmat;
    wall51.checkCollisions=true;
    wall51.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall51.position= new BABYLON.Vector3(0,350,-400);
    shadowGenerator.getShadowMap().renderList.push(wall51);
    wall51.receiveShadows=true;
       
}
function  buildWallsR2(){
    const wallmat = new BABYLON.StandardMaterial("wallmat");
   
    wallmat.diffuseTexture = new BABYLON.Texture("./textures/concretewall.jpg");
    wallmat.backFaceCulling=false;
    wallmat.diffuseTexture.uScale =1;
    wallmat.diffuseTexture.vScale = 1;

    var wall1 = BABYLON.MeshBuilder.CreateGround("wall1", {width: 800, height: 400}, scene);
    wall1.material = wallmat;
    wall1.checkCollisions=true;
    wall1.rotation= new BABYLON.Vector3(Math.PI / 2,0,Math.PI / 2);
    wall1.position= new BABYLON.Vector3(500,200,800);
    shadowGenerator1.getShadowMap().renderList.push(wall1);
   // shadowGenerator.getShadowMap().renderList.push(wall1);
    wall1.receiveShadows=true;
    
    var wall2 = BABYLON.MeshBuilder.CreateGround("wall2", {width: 800, height: 400}, scene);
    wall2.material = wallmat;
    wall2.checkCollisions=true;
    wall2.rotation= new BABYLON.Vector3(Math.PI / 2,0,-Math.PI / 2);
    wall2.position= new BABYLON.Vector3(-300,200,800);
    shadowGenerator1.getShadowMap().renderList.push(wall3);
    wall2.receiveShadows=true;

    var wall3 = BABYLON.MeshBuilder.CreateGround("wall3", {width: 800, height: 400}, scene);
    wall3.material = wallmat;
    wall3.checkCollisions=true;
    wall3.rotation= new BABYLON.Vector3(-Math.PI / 2,0,0);
    wall3.position= new BABYLON.Vector3(100,200,1200);
    wall3.receiveShadows=true;
    shadowGenerator1.getShadowMap().renderList.push(wall3);

    var wall31 = BABYLON.MeshBuilder.CreateGround("wall31", {width: 400, height: 400}, scene);
    wall31.material = wallmat;
    wall31.checkCollisions=true;
    wall31.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall31.position= new BABYLON.Vector3(300,200,401);
    shadowGenerator1.getShadowMap().renderList.push(wall31);
    wall31.receiveShadows=true;

    var wall32 = BABYLON.MeshBuilder.CreateGround("wall32", {width: 400, height: 400}, scene);
    wall32.material = wallmat;
    wall32.checkCollisions=true;
    wall32.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall32.position= new BABYLON.Vector3(-300,200,401);
    shadowGenerator1.getShadowMap().renderList.push(wall32);
    shadowGenerator.getShadowMap().renderList.push(wall32);
    wall32.receiveShadows=true;

    var wall33 = BABYLON.MeshBuilder.CreateGround("wall33", {width: 200, height: 95}, scene);
    wall33.material = wallmat;
    wall33.checkCollisions=true;
    wall33.rotation= new BABYLON.Vector3(Math.PI / 2,0,0);
    wall33.position= new BABYLON.Vector3(0,355,401);
    shadowGenerator1.getShadowMap().renderList.push(wall33);
    wall33.receiveShadows=true;

}
function SetCeiling(){
    const ceilingTex = new BABYLON.StandardMaterial("ceilingTex");
    ceilingTex.diffuseTexture = new BABYLON.Texture("./textures/tavan.jpg");
    ceilingTex.backFaceCulling=false;  

    var ceiling = BABYLON.MeshBuilder.CreateGround("ceiling", {width: 1000, height: 800}, scene);
    ceiling.position= new BABYLON.Vector3(0,400,0);
    ceiling.material = ceilingTex;
    ceiling.receiveShadows=true;
    
    var ceiling2 = BABYLON.MeshBuilder.CreateGround("ceiling2", {width: 800, height: 800}, scene);
    ceiling2.position= new BABYLON.Vector3(100,400,800);
    ceiling2.material = ceilingTex;
    ceiling2.receiveShadows=true;
}
function skyboxSet(){
    var reflectionTexture = new BABYLON.HDRCubeTexture("./textures/skyboxh3.hdr", scene, 512);
    var sky=scene.createDefaultSkybox(reflectionTexture,true,5000,0);
    scene.environmentTexture=reflectionTexture;
    sky.position=new BABYLON.Vector3(300,1000,0);
}
function cabinets(){
    const boxmat = new BABYLON.StandardMaterial("boxmat");
    const texture = new BABYLON.Texture("./textures/cabinet.jpg");
    boxmat.diffuseTexture = texture;
    var columns = 6;
    var rows = 1;
    const faceUV = new Array(6);
    for (let i = 0; i < 6; i++) {faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);}
    const options = {faceUV: faceUV, wrap: true, height: 100, width: 200, depth: 90 };
    const box=new BABYLON.MeshBuilder.CreateBox("box",options);    
    box.material=boxmat;
    box.checkCollisions=true;
    box.position=new BABYLON.Vector3(-398,52,350);
    shadowGenerator.getShadowMap().renderList.push(box);
    
    const box1=new BABYLON.MeshBuilder.CreateBox("box1",options);    
    box1.material=boxmat;
    box1.checkCollisions=true;
    box1.position=new BABYLON.Vector3(-200,52,350);
    shadowGenerator.getShadowMap().renderList.push(box1);

    const box2=new BABYLON.MeshBuilder.CreateBox("box2",options);    
    box2.material=boxmat;
    box2.checkCollisions=true;
    box2.position=new BABYLON.Vector3(-453,52,205);
    box2.rotation.y=-Math.PI / 2;
    shadowGenerator.getShadowMap().renderList.push(box2);

}
function kitchen(){
    var cabinet=cabinets();

    BABYLON.SceneLoader.Append("masa/", "scene.gltf", scene, function (masa) {
    var masa=scene.getMeshByName("node5");
    var chair1=scene.getMeshByName("node11");
    var chair2=scene.getMeshByName("node13");
    var chair3=scene.getMeshByName("node7");
    var chair4=scene.getMeshByName("node9");
    chair1.setParent(masa);
    chair2.setParent(masa);
    chair3.setParent(masa);
    chair4.setParent(masa);
    var cup1=scene.getMeshByName("node15");
    var cup2=scene.getMeshByName("node17");
    var cup3=scene.getMeshByName("node19");
    cup1.setParent(masa);
    cup2.setParent(masa);
    cup3.setParent(masa);

    masa.scaling = new BABYLON.Vector3(120, 90, 120);   
    masa.position=new BABYLON.Vector3(-290,1.5,150);
    masa.receiveShadows=true;
    shadowGenerator.getShadowMap().renderList.push(masa);
    shadowGenerator.getShadowMap().renderList.push(chair1);
    shadowGenerator.getShadowMap().renderList.push(chair2);
    shadowGenerator.getShadowMap().renderList.push(chair3);
    shadowGenerator.getShadowMap().renderList.push(chair4);
    shadowGenerator.getShadowMap().renderList.push(cup1);
    shadowGenerator.getShadowMap().renderList.push(cup2);
    shadowGenerator.getShadowMap().renderList.push(cup3);
    });
    BABYLON.SceneLoader.ImportMesh("", "sink3/", "scene.gltf", scene, function(SinkMesh) {
        var sink=SinkMesh[0];
        sink.scaling = new BABYLON.Vector3(170, 110,150);   
        sink.position=new BABYLON.Vector3(-432,0,50);
        sink.rotation=new BABYLON.Vector3(0,Math.PI/2,0);  
        shadowGenerator.getShadowMap().renderList.push(sink);
    });
    BABYLON.SceneLoader.Append("kutu/", "lara2.gltf", scene, function (kutu) {
        var kutu=scene.getMeshByName("node0_primitive2");    
        var kutub=scene.getMeshByName("node0_primitive1");
        var kutub2=scene.getMeshByName("node0_primitive0");
        kutub.setParent(kutu);
        kutub2.setParent(kutu);
        kutu.scaling = new BABYLON.Vector3(1100,1100, 1100);   
        kutu.position=new BABYLON.Vector3(-350,200,-5);
        kutu.rotation=new BABYLON.Vector3(0,0,0);   
        kutu.receiveShadows=true;
        shadowGenerator.getShadowMap().renderList.push(kutu);
        shadowGenerator.getShadowMap().renderList.push(kutub);
        shadowGenerator.getShadowMap().renderList.push(kutub2);

          
    });
    BABYLON.SceneLoader.Append("fridge/", "scene.gltf", scene, function (fridge) {
        var lampbos=scene.getMeshByName( "defaultMaterial");
        lampbos.name="bosMesh";
    
        var lol=scene.getMeshByName("defaultMaterial");
        lol.name="bosMesh2";
        var lampM1=scene.getMeshByName("bosMesh2");
    
        var lol2=scene.getMeshByName("defaultMaterial");
        lol2.name="bosMesh3";
        var lampM2=scene.getMeshByName("bosMesh3");
    
        var lol3=scene.getMeshByName("defaultMaterial");
        lol3.name="bosMesh4";
        var lampM3=scene.getMeshByName("bosMesh4");
    
    
        var lol4=scene.getMeshByName("defaultMaterial");
        lol4.name="bosMesh6";
        
        var lol5=scene.getMeshByName("defaultMaterial");
        lol5.name="bosMesh7";
        
    var fridge=scene.getMeshByName( "bosMesh");
    fridge.scaling = new BABYLON.Vector3(190, 160, 160);   
    fridge.position=new BABYLON.Vector3(410,160,-150);
    fridge.rotation=new BABYLON.Vector3(0,-Math.PI/2,0);
    fridge.receiveShadows=true;
    shadowGenerator.getShadowMap().renderList.push(fridge);
    });
    BABYLON.SceneLoader.Append("painting/", "scene.gltf", scene, function (painting) {
    var painting=scene.getMeshByName("Drawing small_Drawing_0");
    painting.scaling = new BABYLON.Vector3(7,7, 7);   
    painting.position=new BABYLON.Vector3(-370,-550,399);
    painting.rotation=new BABYLON.Vector3(0,0,0);    
    //shadowGenerator.getShadowMap().renderList.push(painting);
    // painting.receiveShadows=true; 
    });
    BABYLON.SceneLoader.ImportMesh("", "cross/", "scene.gltf", scene, function(crossMesh) {
        var cross=crossMesh[0];    
        cross.scaling = new BABYLON.Vector3(40, 40, 40);   
        cross.position=new BABYLON.Vector3(400,250,400);
        cross.rotation=new BABYLON.Vector3(0,0,Math.PI);
        cross.receiveShadows=true; 
    });
    BABYLON.SceneLoader.ImportMesh("", "cam2/", "scene.gltf", scene, function(camMesh) {
        var cam=camMesh[0];
        cam.scaling = new BABYLON.Vector3(150, 130, 100);   
        cam.position=new BABYLON.Vector3(505,250,80);
        cam.rotation=new BABYLON.Vector3(0,Math.PI/2,0);  
    });
    BABYLON.SceneLoader.Append("lamp2/", "scene.gltf", scene, function (lamp2) {
        var lamp2=scene.getMeshByName( "Wall_Lamp_Can1_0");
        lamp2.scaling = new BABYLON.Vector3(0.004,0.004,0.004);   
        lamp2.rotation = new BABYLON.Vector3(0,0,Math.PI);   
        lamp2.position=new BABYLON.Vector3(-2.47,-3.84,2.4);
        shadowGenerator.getShadowMap().renderList.push(lamp2);
       
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
        sphere.position=new BABYLON.Vector3(250,300,375);
        sphere.scaling=new BABYLON.Vector3(50,50,50);
        sphere.visibility = 0.01;
            
        var hl = new BABYLON.HighlightLayer("hl1", scene);
        hl.addMesh(sphere, BABYLON.Color3.Red());
        hl.blurHorizontalSize=5;
        hl.blurVerticalSize=5;

        var lamp22=lamp2.clone("lamp2c");
        lamp22.position=new BABYLON.Vector3(2.47,-3.84,2.4);
        shadowGenerator.getShadowMap().renderList.push(lamp22);

        const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {});
        sphere2.position=new BABYLON.Vector3(-250,300,375);
        sphere2.scaling=new BABYLON.Vector3(50,50,50);
        sphere2.visibility = 0.01;
            
        var hl2 = new BABYLON.HighlightLayer("hl2", scene);
        hl2.addMesh(sphere2, BABYLON.Color3.Red());
        hl2.blurHorizontalSize=5;
        hl2.blurVerticalSize=5;

    });

    const posterTex = new BABYLON.StandardMaterial("posterTex");
    posterTex.diffuseTexture = new BABYLON.Texture("./textures/keyboardposter.png");
    var poster = BABYLON.MeshBuilder.CreateGround("poster", {width: 100, height: 140}, scene);
    poster.position= new BABYLON.Vector3(220,220,-399);
    poster.rotation=new BABYLON.Vector3(-Math.PI/2,Math.PI,0); 
    poster.material = posterTex;

    const openTex = new BABYLON.StandardMaterial("openTex");
    openTex.diffuseTexture = new BABYLON.Texture("./textures/open.jpg");
    var open = BABYLON.MeshBuilder.CreateGround("open", {width: 120, height: 50}, scene);
    open.position= new BABYLON.Vector3(0,330,-399);
    open.rotation=new BABYLON.Vector3(-Math.PI/2,Math.PI,0); 
    open.material = openTex;

    const forrestTex = new BABYLON.StandardMaterial("forrestTex");
    forrestTex.diffuseTexture = new BABYLON.Texture("./textures/forrest.jpg");
    var forrest = BABYLON.MeshBuilder.CreatePlane("forrest", {width: 300, height: 140}, scene);
    forrest.position= new BABYLON.Vector3(550,250,80);
    forrest.rotation=new BABYLON.Vector3(0,Math.PI/2,0);  

    forrest.material = forrestTex;


}
function room1(){
   
    BABYLON.SceneLoader.Append("puzzlelamp/", "scene.gltf", scene, function (puzzlelamp) {
        var puzzlelamp=scene.getMeshByName("node0");
        puzzlelamp.name="nodenot0";
        var plamp=scene.getMeshByName("nodenot0");

        var plamp1=scene.getMeshByName("node1");
        plamp1.name="nodenot1";
        var lamp1=scene.getMeshByName("nodenot1");

        var plamp2=scene.getMeshByName("node2");
        plamp2.name="nodenot2";
        var lamp2=scene.getMeshByName("nodenot2");

        var plamp3=scene.getMeshByName("node3");
        plamp3.name="nodenot3";
        var lamp3=scene.getMeshByName("nodenot3");

        var plamp4=scene.getMeshByName("node4");
        plamp4.name="nodenot4";
        var lamp4=scene.getMeshByName("nodenot4");

        lamp1.setParent(plamp);
        lamp2.setParent(plamp);
        lamp3.setParent(plamp);
        lamp4.setParent(plamp);
        
        plamp.scaling = new BABYLON.Vector3(120,120,120);   
        plamp.position=new BABYLON.Vector3(-420,0,1150);
        plamp.rotation=new BABYLON.Vector3(-Math.PI/2,-Math.PI,-Math.PI/2);
    shadowGenerator1.getShadowMap().renderList.push(plamp);

        
    });
    BABYLON.SceneLoader.ImportMesh("", "lamp/", "scene.gltf", scene, function(lampMes) {
        var lamp=lampMes[0];
    lamp.scaling = new BABYLON.Vector3(150, 150, 150);   
    lamp.position=new BABYLON.Vector3(-220,150,1120);

    var lamplight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-220,200,1120), scene);
    lamplight.intensity=0.5;
    });
    BABYLON.SceneLoader.Append("TV/", "scene.gltf", scene, function (TV) {
    var TV=scene.getMeshByName(  "tv_tv_0");
    TV.scaling = new BABYLON.Vector3(5, 5, 5);   
    TV.position=new BABYLON.Vector3(-489,250,900);
    TV.rotation=new BABYLON.Vector3(0,Math.PI/2,0);
    TV.receiveShadows=true; 
    shadowGenerator1.getShadowMap().renderList.push(TV);

    });
    BABYLON.SceneLoader.Append("kapı/", "scene.gltf", scene, function (kapı) {
        var kapı=scene.getMeshByName("node1");
        var kapıkolu=scene.getMeshByName("node2");
        kapıkolu.setParent(kapı);
    
        var kapı2=kapı.clone("kapı2c");
       // console.log(kapı);  
        var hinge = BABYLON.MeshBuilder.CreateBox("hinge", {}, scene)
        hinge.isVisible = false;
        kapı.parent = hinge;
        hinge.position=new BABYLON.Vector3(-100,0,402);
        kapı.scaling = new BABYLON.Vector3(5.2,3.3, 3.4);   
        kapı.position=new BABYLON.Vector3(100,0,0);
        kapı.rotation=new BABYLON.Vector3(-Math.PI/2,0,0);
        shadowGenerator1.getShadowMap().renderList.push(kapı);
        shadowGenerator.getShadowMap().renderList.push(kapı);
        shadowGenerator.getShadowMap().renderList.push(kapı2);
        kapı.receiveShadows=true; 
        kapı.checkCollisions=true;
        kapı2.checkCollisions=true;
        kapı2.scaling = new BABYLON.Vector3(5.2,3.3, 3.4);   
        kapı2.position=new BABYLON.Vector3(100,0,0);
        var hinge2=BABYLON.MeshBuilder.CreateBox("hinge2", {}, scene)
        hinge2.isVisible = false;
        kapı2.parent = hinge2;
        hinge2.position=new BABYLON.Vector3(-100,0,-400);

    
        var sweep = new BABYLON.Animation("sweep", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var sweep_keys = []; 
            sweep_keys.push({frame: 0,value: 0});
            sweep_keys.push({frame: 3 * frameRate,value: 0});
            sweep_keys.push({frame: 5 * frameRate,value: Math.PI/3});
            sweep.setKeys(sweep_keys);
        
        kapı.actionManager = new BABYLON.ActionManager(scene);

        scene.onKeyboardObservable.add(function (pointerInfo) {
            switch (pointerInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    console.log("KEY DOWN: ", pointerInfo.event.keyCode);
                        if (pointerInfo.event.keyCode=="79"){
                            //console.log("yes");
                            kapı2.actionManager=new BABYLON.ActionManager(scene);
                            scene.beginDirectAnimation(hinge2, [sweep], 0, 25 * frameRate, false);  
    
                        }                
                    break;
               
            }
    });
    
            BABYLON.SceneLoader.Append("/button/","button.obj", scene, function (buttonx) {
            var buttonx=scene.getMeshByName("Object.1");
            buttonx.name="button";
            var button=scene.getMeshByName("button");
        
            button.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);   
            button.position=new BABYLON.Vector3(200,200,382);
            button.rotation=new BABYLON.Vector3(0,0,-Math.PI/2);

            var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

            myMaterial.diffuseColor = new BABYLON.Color3(0.4, 0, 0);
           // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            myMaterial.emissiveColor = new BABYLON.Color3(0.50, 0, 0);
            //myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

            button.material = myMaterial;
                
            var button1=button.clone("buttonc1");
            button1.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);   
            button1.position=new BABYLON.Vector3(150,200,382);
            button1.rotation=new BABYLON.Vector3(0,0,-Math.PI/2);
            var button2=button.clone("buttonc2");
            button2.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);   
            button2.position=new BABYLON.Vector3(200,250,382);
            button2.rotation=new BABYLON.Vector3(0,0,-Math.PI/2);
            var button3=button.clone("buttonc3");
            button3.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);   
            button3.position=new BABYLON.Vector3(150,250,382);
            button3.rotation=new BABYLON.Vector3(0,0,-Math.PI/2);

            shadowGenerator1.getShadowMap().renderList.push(button);
            shadowGenerator1.getShadowMap().renderList.push(button1);
            shadowGenerator1.getShadowMap().renderList.push(button2);
            shadowGenerator1.getShadowMap().renderList.push(button3);

        
            button1.actionManager = new BABYLON.ActionManager(scene);
            button1.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                scene.beginDirectAnimation(hinge, [sweep], 0, 25 * frameRate, false); })); 
            });
            
    });
    BABYLON.SceneLoader.Append("couch/", "scene.gltf", scene, function (couch) {
        var couch=scene.getMeshByName( "couch_3dc_Mat_couch_3dc_lambert_0");
        couch.scaling = new BABYLON.Vector3(1.3, 1.3, 1.3);   
        couch.position=new BABYLON.Vector3(300,0,850);
        couch.rotation=new BABYLON.Vector3(0,-Math.PI/2,0);
        couch.receiveShadows=true; 
        shadowGenerator1.getShadowMap().renderList.push(couch);

    });
    BABYLON.SceneLoader.ImportMesh("", "k2/", "scene.gltf", scene, function(kitaplıkM) {
        var kitaplık=kitaplıkM[0];
        kitaplık.scaling = new BABYLON.Vector3(8,7,8);   
        kitaplık.position=new BABYLON.Vector3(130,125,1165);
        kitaplık.rotation=new BABYLON.Vector3(0,Math.PI,0);
        kitaplık.receiveShadows=true; 
        shadowGenerator1.getShadowMap().renderList.push(kitaplık);
    });

   
    const halıtex = new BABYLON.StandardMaterial("halıtex");
    halıtex.diffuseTexture = new BABYLON.Texture("./textures/carpet.jpg");
    var halı = BABYLON.MeshBuilder.CreateGround("halı", {width: 300, height: 400}, scene);
    halı.position= new BABYLON.Vector3(100,1,800);
    halı.material = halıtex;
    halı.receiveShadows=true;
    
   const TVTex = new BABYLON.StandardMaterial("TVTex");
    //TVTex.diffuseTexture = new BABYLON.VideoTexture("video", "/statik.mp4", scene, true);
    TVTex.diffuseTexture = new BABYLON.Texture("./textures/static.jpg");
    var tvw = BABYLON.MeshBuilder.CreateGround("tvw", {width: 290, height: 175}, scene);
    tvw.position= new BABYLON.Vector3(486,250,900);
    tvw.rotation=new BABYLON.Vector3(-Math.PI/2,-3*(Math.PI/2),0);
    TVTex.alpha = 0.7;
    tvw.material = TVTex;
            
}
function labels(){
    var label1 = BABYLON.MeshBuilder.CreateGround("label1", {width: 40, height: 15}, scene);
    const texlab = new BABYLON.StandardMaterial("texlab");label1.material = texlab;
    label1.position=new BABYLON.Vector3(150,180,402);
    label1.rotation= new BABYLON.Vector3(-Math.PI/2,Math.PI,0);
    texlab.diffuseTexture = new BABYLON.Texture("./textures/5471.png");
   
    var label2 = BABYLON.MeshBuilder.CreateGround("label2", {width: 40, height: 15}, scene);
    const texlab2 = new BABYLON.StandardMaterial("texlab2");
    label2.material = texlab2;
    label2.position=new BABYLON.Vector3(200,180,402);
    label2.rotation= new BABYLON.Vector3(-Math.PI/2,Math.PI,0);
    texlab2.diffuseTexture = new BABYLON.Texture("./textures/1745.png");    
    
    var label3 = BABYLON.MeshBuilder.CreateGround("label3", {width: 40, height: 15}, scene);
    const texlab3 = new BABYLON.StandardMaterial("texlab3");
    label3.material = texlab3;
    label3.position=new BABYLON.Vector3(200,230,402);
    label3.rotation= new BABYLON.Vector3(-Math.PI/2,Math.PI,0);
    texlab3.diffuseTexture = new BABYLON.Texture("./textures/5417.png");    
    
    var label4= BABYLON.MeshBuilder.CreateGround("label4", {width: 40, height: 15}, scene);
    const texlab4 = new BABYLON.StandardMaterial("texlab4");
    label4.material = texlab4;
    label4.position=new BABYLON.Vector3(150,230,402);
    label4.rotation= new BABYLON.Vector3(-Math.PI/2,Math.PI,0);
    texlab4.diffuseTexture = new BABYLON.Texture("./textures/4571.png");
}
var scene = createScene(); 
engine.runRenderLoop(function () {scene.render();});
window.addEventListener("resize", function () {engine.resize();});
