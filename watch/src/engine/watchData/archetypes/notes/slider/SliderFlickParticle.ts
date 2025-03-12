import { particle, linearEffectLayout } from "../../../particle.js"

export class SliderFlickParticle extends SpawnableArchetype({ start: Number, startLane: Number, direction: Number }) {

    lastEffect = this.entityMemory(Number)
    i = this.entityMemory(Number)

    spawnTime() {
        return this.spawnData.start
    }
    
    despawnTime() {
        return this.spawnData.start + 0.05 * Math.abs(this.spawnData.direction)
    }

    preprocess() {
        // debug.log(1000)
        this.lastEffect = this.spawnData.start - 0.025
        this.i = 0.525
    }

    updateParallel() {
        if ((this.i + 0.525) / 1.05 > Math.abs(this.spawnData.direction) * 2) return
        // if ((time.now < (this.spawnData.start + (this.i + 1) * 0.025)) && (time.now > (this.spawnData.start + this.5))) {
        if (time.now - this.lastEffect > 0.025) {
            // debug.log(this.lastEffect)
            // let lane = Math.lerp(this.spawnData.startLane, this.spawnData.endLane, (this.i + 0.5) / (Math.abs(this.spawnData.endLane - this.spawnData.startLane) * 2)) * 2.1

            const lane = this.spawnData.startLane * 2.1 + (this.i * (this.spawnData.direction > 0 ? 1 : -1))

            // debug.log(lane)

            particle.effects.sliderFlick.spawn(new Rect({
                l: lane - 0.525,
                r: lane + 0.525,
                b: 1,
                t: 0.5
            }), 1, false)

            this.lastEffect = this.lastEffect + 0.025
            this.i += 1.05
        }
    }
}
