var lines = [];
var loadedLines = [];

var drawingsData = [];
var drawings = [];

var howManyDrawings;

var playBack;
var playInd;

var firstFetched;
var previousDrawing;

var catPic;
var catVid;
var vidFrameInterval;
var howManyFrames;

var checking = false;



var drawnPrev, spacePressed, loadedFirst, pagePressed, drawnVidFrame, vidLoaded;

var name = "cat";

var extJSON;

//Firebase vars
var database, ref;

function preload() {

  extJSON = loadJSON("cat_2.json");
  console.log(extJSON);



  catVid = createVideo("cat.mp4", onVidLoad(), vidFail());


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(252);
  strokeWeight(2);

  playInd = 0;

  playBack = false;
  firstFetched = false;
  loadedFirst = false;
  drawnPrev = false;
  spacePressed = false;
  pagePressed = false;
  drawnVidFrame = false;
  vidLoaded = false;

  fireBaseInit();

  //recreate();

  fetchDrawings();
  console.log(previousDrawing);

  catVid.size(600, 600);

  howManyFrames = 100;

  vidFrameInterval = catVid.duration() / howManyFrames;

  catVid.hide();

  catVid.time = 1;

  // recreate(previousDrawing, true);
  bgRect();
}

function draw() {


  stroke(10);

  //print("first " + drawings[playInd]);

  if (!drawnVidFrame && pagePressed && vidLoaded) {

    image(catVid, 0, 0, 600, 600);
    drawnVidFrame = true;

  }



  if (previousDrawing === null) {
    fill(0);
    text(20, 20, "LOADING");

  } else {
    loadedFirst = true;
  }


  if (!playBack && !drawnPrev && previousDrawing != null) {
    recreate(previousDrawing, true);
    drawnPrev = true;
  }

  //console.log(previousDrawing);

  if (playBack && frameCount % 6 == 0) {
    background(252);

    console.log("drawings " + drawings);
    // recreate(drawings[2]);
    //console.log(drawings[2]);


    recreate(drawings[playInd]);
    playInd++;

    if (playInd > howManyDrawings - 1) {
      playInd = 0;
    }
  }

  playbackBar();

  //Tut text:

  // if (checking) {
  //   // fill(0);
  //   noStroke();
  //   // text("hello!",width/2,height*.1)
  //   text("this is a collaborative flipbook", width / 2, height * .2)
  //   text("the previous drawing will display in grey ", width / 2, height * .3);
  //   text("(you may need to wait for a second)", width / 2, height * .4);
  //   text("draw with the mouse", width / 2, height * .5);
  //   text("when you're done with a frame press the right arrow key to submit", width / 2, height * .6);
  //   text("press space to finish, and play the whole animation ", width / 2, height * .7);
  //   text("(to see your contribution you may need to refresh)", width / 2, height * .8);
  //   text("press h to close or open this menu", width / 2, height * .9);

  //   stroke(10);
  // }


}

function playbackBar() {
  if (playBack) {

    fill(30);
    ellipse(map(playInd, 0, howManyDrawings, 0, width), 20, width / 100, width / 100);

  }
}

function onVidLoad() {
  vidLoaded = true;
}

function vidFail() {
  print("FAILED");
}

function bgRect() {
  fill(220);

  noStroke();
  rectMode(CORNER);
  //rect(0, 0, 640, 480);
  //catVid.time = 1;
  // catVid.play();
  // image(catVid, 100, 100, 500, 500);
  // catVid.pause();

  //image(catpic, 0, 0, 640, 640);

}

function recreate(inJSON, trans) {

  if (trans) {
    stroke(180);
  } else {
    stroke(0);
  }

  //var len = Object.keys(inJSON).length;
  var len = inJSON.lines.length;
  console.log("OBJLEN " + len);

  for (var i = 0; i < len; i++) {

    var curline = inJSON.lines[i];

    line(curline[0], curline[1], curline[2], curline[3]);


  }

}

function fetchDrawings() {
  var ref = database.ref("drawings");
  drawingsData = ref.on("value", gotData);

}

function gotData(data) {

  if (firstFetched) {
    var dataVals = data.val();
    var keys = Object.keys(dataVals);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // Look at each fruit object!
      var curD = (dataVals[key]);
      drawings.push(curD);
    }

    howManyDrawings = keys.length;

    console.log("populated arr? " + drawings);

    if (spacePressed) {
      playBack = true;
    }

  } else {
    var dataVals = data.val();
    var keys = Object.keys(dataVals);

    var lastKey = keys[keys.length - 1]
    print("TARGKEYVAL " + lastKey);
    print("TARGD " + dataVals[lastKey]);

    previousDrawing = dataVals[lastKey];

    firstFetched = true;
  }

}

function keyPressed() {

  if (key == "h") {
    checking = !checking;
  }

  if (key === " ") {
    console.log("SPACE PRESSED");
    spacePressed = true;

    database = firebase.database();
    ref = database.ref('drawings');

    fetchDrawings();
    //console.log(drawings);

  }

  if (keyCode === LEFT_ARROW) {
    background(250);
    bgRect();

    lines = [];
    drawnPrev = false;
  }


  if (keyCode === RIGHT_ARROW) {


    background(250);


    console.log(lines.length * 4);

    let lObj = { lines: lines };

    ref.push(lObj);
    console.log(lObj);



    previousDrawing = lObj;
    drawnPrev = false;

    lines = [];

    //save(lObj, name + "_" + int(millis(), 0) + ".json");

  }

}

function mouseDragged() {

  stroke(0);
  if (mouseIsPressed === true && !playBack) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    var coords = [mouseX, mouseY, pmouseX, pmouseY];
    lines.push(coords)

  }
}

function mousePressed() {

  pagePressed = true;
}

function fireBaseInit() {
  var firebaseConfig = {
    apiKey: "AIzaSyDvPBdmlSrtdjbnRYb_FRBN3wlEYpFP8_A",
    authDomain: "group-rotoscope.firebaseapp.com",
    databaseURL: "https://group-rotoscope.firebaseio.com",
    projectId: "group-rotoscope",
    storageBucket: "group-rotoscope.appspot.com",
    messagingSenderId: "302438753888",
    appId: "1:302438753888:web:169881afc52add2d0b0505"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  database = firebase.database();
  ref = database.ref('drawings');

  var data = {
    name: "jonah",
    score: 100
  }

  //ref.push(data);


  var storage = firebase.storage();


  var storageRef = storage.ref();
}