const s = (p) => {
  let opAudShader, img, fft, audio, toggleBtn
 

  p.preload = () => { 
    audio = p.loadSound('https://res.cloudinary.com/de3c6e2g5/video/upload/v1609118597/201211-005_sel01_ernavl.wav')
    //audio = p.loadSound('audio/BL01_sel01bAlt01.wav')
    opAudShader = p.loadShader('shaders/base.vert', 'shaders/opAud.frag')
    img = p.loadImage('https://res.cloudinary.com/de3c6e2g5/image/upload/v1608941534/06_L375667_ktb1mu.jpg')
  }

  p.setup = () => {
      playBtn = document.querySelector('#play-btn')
      playBtn.addEventListener('click', () => {
        document.body.classList.add('start-anim')
          audio.loop()
      })
          
      p.pixelDensity(1)
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

      toggleBtn = document.querySelector('#toggle-btn')
      toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('toggle--on')
        this.toggleAudio()
      })

      fft = new p5.FFT()
      p.shader(opAudShader)

      opAudShader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
      opAudShader.setUniform('u_texture', img)
      opAudShader.setUniform('u_tResolution', [img.width, img.height])
  }

  p.draw = () => {
    fft.analyze()

    const bass = fft.getEnergy("bass") 
    const treble = fft.getEnergy("treble") 
    const mid = fft.getEnergy("mid") 

    let ranDOM = Math.random(17) *.043;
    
    const mapBass = p.map(bass, 0, 150, 0, 9.0) 
    //const mapBass = p.map(bass, 0, 143, 0, 9.0)
   
    const mapTremble = p.map(treble, 0, 255, 0, 0.17)
   // const mapTremble = p.map(treble, 30, 235, 0, 0.27)
  
    const mapMid = p.map(mid, 0, 255, 0.0, 0.07)
     // const mapMid = p.map(mid, 0, 255, 0.0, 0.06)

    var volume = p.map(p.mouseX, 0, p.width, .1, 1.0);
    audio.amp(volume * 1.4);
    var speed = p.map(p.mouseY, 0, p.height, 0.01, 3.7);
    let speedAlt = speed + ranDOM;
    audio.rate(speedAlt);

    opAudShader.setUniform('u_time', p.frameCount / 8)
    opAudShader.setUniform('u_bass', mapBass)
    opAudShader.setUniform('u_tremble', mapTremble)
    opAudShader.setUniform('u_mid', mapMid )

    p.rect(0,0, p.width, p.height)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    opAudShader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
  }
  toggleAudio = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.loop()
    }
  }
};

new p5(s)
