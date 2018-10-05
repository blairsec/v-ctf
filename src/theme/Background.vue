<template>
  <div class="bg"></div>
</template>

<style lang="scss">
@import './colors.scss';

div.bg {
  width: 100vw;
  height: 100vh;
  z-index: -1000000;
  position: fixed;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('./bg.png');
  background-size: cover;
}
</style>

<!--
  <template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import colors from './colors.scss'
console.log(colors)

// from https://gist.github.com/mjackson/5311256
function rgbToHsl (r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  var max = Math.max(r, g, b)
  var min = Math.min(r, g, b)
  var h = (max + min) / 2
  var s = (max + min) / 2
  var l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }

    h /= 6
  }

  return [ h, s, l ]
}

export default {
  name: 'Background',
  methods: {
    gaussian () {
      let sum = 0
      for (let i = 0; i < 10; i++) {
        sum += Math.random()
      }
      return (sum - 5) / 5
    },
    genStars (numStars) {
      var currStarCount = this.stars.length
      var newStarCount = Math.min(Math.floor(this.STARS * numStars), 1500)
      if (newStarCount === currStarCount) {
      } else if (newStarCount > this.stars.length) {
        for (let i = currStarCount; i < newStarCount; i++) {
          let d = Math.pow(Math.abs(this.gaussian()) + 1, 3)
          this.stars[i] = {
            x: Math.random(),
            y: Math.random(),
            r: 4 / d,
            vx: this.BASE_SPEED * this.gaussian(),
            vy: -this.BASE_SPEED * (4 / d),
            h: [rgbToHsl(parseInt(colors.primary.slice(1, 3), 16), parseInt(colors.primary.slice(3, 5), 16), parseInt(colors.primary.slice(5, 7), 16))[0] * 360, rgbToHsl(parseInt(colors.secondary.slice(1, 3), 16), parseInt(colors.secondary.slice(3, 5), 16), parseInt(colors.secondary.slice(5, 7), 16))[0] * 360][Math.floor(Math.random() * 2)] + this.gaussian() * 50
          }
        }
      } else {
        this.stars = this.stars.slice(0, newStarCount)
      }
    },
    tick (canvas) {
      var yCons = 1300 / canvas.height
      for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].x += this.stars[i].vx + this.gaussian() * this.BASE_SPEED
        this.stars[i].y += (this.stars[i].vy + this.gaussian() * this.BASE_SPEED * 2) * yCons

        if (this.stars[i].x < 0) this.stars[i].x += 1
        if (this.stars[i].x > 1) this.stars[i].x -= 1
        if (this.stars[i].y < 0) this.stars[i].y += 1
        if (this.stars[i].y > 1) this.stars[i].y -= 1
      }
    },
    resize (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    },
    setup (canvas, ctx) {
      this.resize(canvas)
      this.repaint(canvas, ctx)
      window.setInterval(() => { this.tick(canvas); this.resize(canvas); this.repaint(canvas, ctx); this.genStars(canvas.height / 1000) }, 50)
    },
    repaint (canvas, ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < this.stars.length; i++) {
        ctx.fillStyle = 'hsl(' + this.stars[i].h + ',100%,60%)'
        ctx.beginPath()
        ctx.arc(this.stars[i].x * canvas.width, this.stars[i].y * canvas.height, this.stars[i].r, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    }
  },
  data () {
    return {
      STARS: 50,
      BASE_SPEED: 0.0002,
      stars: []
    }
  },
  mounted () {
    this.setup(this.$refs.canvas, this.$refs.canvas.getContext('2d'))
  }
}
</script>

<style lang="scss">
@import './colors.scss';

canvas {
  position: fixed;
  z-index: -100;
}

canvas {
  background-color: $background;
}
</style>
-->
