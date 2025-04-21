let config = {
  renderer: Phaser.AUTO,
  scale: {
    width: innerWidth - 20,
    height: innerHeight - 20,
  },
  backgroundColor: "#0099cc",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;

function preload() {
  this.load.image('background', './assets/background.png');
  this.load.image('road', './assets/road.png');
  this.load.image('columnUp', './assets/pipe-up.png');
  this.load.image('columnDown', './assets/pipe-down.png');
  this.load.spritesheet('bird', './assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
  const background = this.add.tileSprite(
    game.config.width / 2,
    game.config.height / 2,
    game.config.width,
    560,
    "background"
  );
  const roads = this.physics.add.staticGroup();
  let topColumns=this.physics.add.staticGroup({
      key: "columnUp",
      repeat: 3,
      setXY: { x: 200, y: 10, stepX: 300},
      }); 
  let bottomColumns =this.physics.add.staticGroup({
  key: "columnDown",
  repeat: 3,
  setXY: { x: 350, y: 410,stepX: 300},
  });


  const road = roads.create(100, 650, "road").setScale(10, 1.6).refreshBody();
 

  bird = this.physics.add.sprite(0, 50, "bird").setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  this.physics.add.overlap(bird, road, () => (hasLanded = true), null, this);
  this.physics.add.collider(bird, road);

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
  this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);

  messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`,
     { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
  Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);
}

function update() {
if (!isGameStarted) {
  bird.setVelocityY(-160);
}

if (cursors.space.isDown && !isGameStarted) {
  isGameStarted = true;
  messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
}

if (cursors.up.isDown && !hasLanded && !hasBumped) {
      bird.setVelocityY(-160);
}
  
if (!hasLanded || !hasBumped) {
bird.body.velocity.x = 50;
}

if (hasLanded || hasBumped || !isGameStarted) {
bird.body.velocity.x = 0;
}
if (hasLanded || hasBumped) {
messageToPlayer.text = `Oh no! You crashed!`;
}

if (bird.x > game.config.width-250) {
bird.setVelocityY(40);
messageToPlayer.text = `Congrats! You won!`;
} 

}

