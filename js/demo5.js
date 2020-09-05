const s = (p) => {
  let demo5Shader, img, fft, audio, toggleBtn 

  p.preload = () => {
    audio = p.loadSound('audio/BL01_sel01b.wav')
    demo5Shader = p.loadShader('shaders/base.vert', 'shaders/d5.frag')
    img = p.loadImage('img/4.jpg')
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


      //audio.loop()

      fft = new p5.FFT()
      p.shader(demo5Shader)

      demo5Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
      demo5Shader.setUniform('u_texture', img)
      demo5Shader.setUniform('u_tResolution', [img.width, img.height])
  }

  p.draw = () => {
    fft.analyze()

    const bass = fft.getEnergy("bass") / 2
    const treble = fft.getEnergy("treble") * 3
  
    const mid = fft.getEnergy("mid") 

    const mapBass = p.map(bass, 0, 150, 0, 9.0)
    //const mapTremble = p.map(treble, 0, 255, 0, 0.5)
    const mapTremble = p.map(treble, 0, 255, 0, 0.17)
    const mapMid = p.map(mid, 0, 255, 0.0, 0.07)
    //    const mapMid = p.map(mid, 0, 255, 0.0, 0.1)

    var volume = p.map(p.mouseX, 0, p.width, .07, 1.3);
    audio.amp(volume);
    var speed = p.map(p.mouseY, 0, p.height, 0.07, 4.3);
    audio.rate(speed);



    demo5Shader.setUniform('u_time', p.frameCount / 8)
    //demo5Shader.setUniform('u_time', p.frameCount / 8)

    console.log(mapBass);
    console.log(mapTremble);
    console.log(mapMid);
   
    demo5Shader.setUniform('u_bass', mapBass)
    demo5Shader.setUniform('u_tremble', mapTremble)
    demo5Shader.setUniform('u_mid', mapMid)

    p.rect(0,0, p.width, p.height)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    demo5Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
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