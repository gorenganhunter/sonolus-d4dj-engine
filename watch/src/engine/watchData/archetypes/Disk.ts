import { diskLayout } from "../../../../../shared/src/engine/data/utils.js"
import { options } from "../../configuration/options.js"
import { skin } from "../skin.js"
import { timeToScaledTime } from "./timeScale.js"

export class Disk extends SpawnableArchetype({ xOrigin: Number, yOrigin: Number, tsg: Number, skin: SkinSpriteId, z: Number, whMultiplier: Number, spin: Boolean }) {
    layout = this.entityMemory(Quad)

    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    preprocess(): void {
        if (!this.spawnData.spin) {
            const dw = 3.8
            const dh = dw * 0.09

            const origin = {
                x: this.spawnData.xOrigin,
                y: this.spawnData.yOrigin
            }

            diskLayout(origin, dw * this.spawnData.whMultiplier, dh * this.spawnData.whMultiplier, 0).copyTo(this.layout)
        }
    }

    updateParallel(): void {
        if (!this.spawnData.spin) return skin.sprites.draw(this.spawnData.skin, this.layout, this.spawnData.z, 1)

        const dw = 3.8
        const dh = dw * 0.09

        let dt = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.spawnData.tsg)
        dt %= 3.6

        const origin = {
            x: this.spawnData.xOrigin,
            y: this.spawnData.yOrigin
        }

        const angle = Math.PI * dt / 1.8

        skin.sprites.draw(this.spawnData.skin, diskLayout(origin, dw * this.spawnData.whMultiplier, dh * this.spawnData.whMultiplier, angle), this.spawnData.z, 1)
    }
}
