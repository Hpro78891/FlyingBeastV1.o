let user
let cursors
// const gameState = {}

class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'StartScene'
    });
  }
  preload() {
    this.load.image('bg', 'assets/background.png');
  }

  create() {
    // bg image

    this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.add.text(280, 180, 'Headless', {
      font: "80px Times New Roman"
    });
    this.add.text(390, 260, "Powered By CodeCrust.", {
      font: "18px Times New Roman"
    });

    this.input.on('pointerup', () => {

      this.scene.stop('StartScene');
      this.scene.start('GameScene');

    });


  }

}

class GameScene extends Phaser.Scene { /// game inside of this class
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload() {


    this.load.image('bg', 'assets/background.png');
    this.load.image('bot1', 'assets/enemy1.png');
    this.load.image('bot2', 'assets/enemy2.png');
    this.load.image('bot3', 'assets/enemy3.png');
    this.load.image('platforms', 'assets/platform.png');
    this.load.image('platform_destroy','assets/platform_cement.png');
    this.load.image('sword', 'assets/Ssword.png');

    this.load.spritesheet('player', 'assets/Splayer.png', {
      frameWidth: 72,
      frameHeight: 90
    });
  }

  create() {

    // bg image
    let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
    let scaleX = this.cameras.main.width / image.width
    let scaleY = this.cameras.main.height / image.height
    let scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)


    // camera

    this.cameras.main.setBounds(0, 0, 1920, 700);
    this.physics.world.setBounds(0, 0, 1920, 800);



    cursors = this.input.keyboard.createCursorKeys();



    // container  player and sword

    user = this.add.container(100, 100);
    this.player = this.physics.add.sprite(10, 0, 'player');
    this.sword= this.physics.add.sprite(70, 10, 'sword');

    // player.body.setCollideWorldBounds(true);
    // sword.body.setCollideWorldBounds(true);



    // player.setflipX(true);
    // sword.setflipX(true);

    let swordLength = 0.2;
    this.sword.setScale(swordLength);

    user.add([this.player, this.sword]);

    this.physics.world.enable(user);
    user.body.setCollideWorldBounds(true);
    user.body.setGravityY(1000);

    this.player.body.immovable = true;

    this.player.body.allowGravity = false;
    this.sword.body.immovable = true;

    this.sword.body.allowGravity = false;


    user.body.setBounce(0.4);







    //camera
    this.cameras.main.startFollow(user);
    this.cameras.main.followOffset.set(-300, 0);


    // platforms
    const platforms = this.physics.add.staticGroup();
    const platPositions = [{
      x: 50,
      y: 575
    }, {
      x: 550,
      y: 275
    }, {
      x: 1050,
      y: 575
    }, {
      x: 1350,
      y: 795
    }];
    platPositions.forEach(plat => {
      platforms.create(plat.x, plat.y, 'platforms').setScale(.8).setSize(330, 50);
    });


    const platform_destroy = this.physics.add.staticImage(100, 800, 'platform_destroy').setDisplaySize(1920, 100);



    // bots
    let botGroup = this.physics.add.group();
    let bot2Group = this.physics.add.group();


    function BotGen() {

      const botX = Math.random() * 1900;
      const botY = Math.random() * 550;
      botGroup.create(botX, botY, 'bot1').setScale(.3);
    }

    function Bot2Gen() {

      const botX = Math.random() * 1900;
      const botY = Math.random() * 550;
      bot2Group.create(botX, botY, 'bot2').setScale(.3);

    }


    const botLoop = this.time.addEvent({
      delay: 1000,
      callback: BotGen,
      callbackScope: this,

      loop: true


    });

    const bot2Loop = this.time.addEvent({
      delay: 1000,
      callback: Bot2Gen,
      callbackScope: this,
      loop: true
    });

    // end bot 

    //score 
    var score = 0;
    var scoreText;
    scoreText = this.add.text(16, 16, 'score:0', {
      fontSize: '32px',
      fill: '#000'
    });


    // function 

    function userCollidebotGroup(player, bot) { //user collide with botGroup function
      score += 1;
      scoreText.setText(`Score: ${score}`);
      bot.setVisible(false);
      bot.destroy();
      swordLength += .002;
      this.sword.setScale(swordLength);

    }

    // collider

    this.physics.add.collider(user, platforms, () => { // user and platforms
      user.body.setVelocityX(0);
    });



    // user collider with botgroup  
    this.physics.add.collider(botGroup, this.sword, userCollidebotGroup, null, this);
    this.physics.add.collider(bot2Group, this.sword, userCollidebotGroup, null, this);


    this.physics.add.collider(user, platform_destroy, () => { // user and platform destroy
      user.destroy();
    });

    // this.physics.add.collider(bot2Group,platforms, () =>{
    // bo
    // })

    // bot kill user ( player )

    this.physics.add.collider(botGroup, this.player, () => {
      user.destroy();

    });


    this.physics.add.collider(bot2Group, this.player, () => {
      user.destroy();

    });



    // 



    // game over 
    function gameOver() {
      this.input.on('pointerup', () => {
        this.add.text(280, 180, 'Headless', {
          font: "80px Times New Roman"
        });
        this.add.text(390, 260, "GameOver.", {
          font: "18px Times New Roman"
        });

        score = 0;
        this.scene.restart()
        this.scene.GameScene();

      });

    }
    // gameOver();





  }

  update() {

    if (cursors.left.isDown) {
      user.body.setVelocityX(-160);
      this.sword.setPosition(-70,10);
      this.player.setFlipX(true);
      this.sword.setFlipX(true);

    } else if (cursors.right.isDown) {
      user.body.setVelocityX(+160);
      this.sword.setPosition(70,10);
      this.player.setFlipX(false);
      this.sword.setFlipX(false);


    } else if (cursors.up.isDown) {

      user.body.setVelocityY(-330);

    }



  }


}



const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 800,
  // backgroundColor: "#5f2a55",

  scene: [StartScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 9.8
      },
      debug: false,
      enableBody: true

    }
  }

};

const game = new Phaser.Game(config);