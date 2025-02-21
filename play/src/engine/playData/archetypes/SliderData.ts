import { slider } from '../slider.js'

export class SliderData extends Archetype {
    exportDataTickDir = Object.fromEntries(
        Array.from({ length: 16 }, (_, index) => {
            const i = index + 1;
            return [
                [`time${i}`, { name: `time${i}`, type: Number }],
                [`pos${i}`, { name: `pos${i}`, type: Number }],
            ];
        }).flat()
    );

    export = this.defineExport(this.exportDataTickDir)

    used = this.entityMemory(Number)

    updateSequentialOrder = -3
    updateSequential() {
        if (slider.saved) return

        slider.saved = true

        if ((time.now - slider.lastSavedTime) < 0.01) return
        if (slider.position === slider.lastSavedPosition) return

        switch (this.used) {
            case 0:
                this.export("time1", time.now)
                this.export("pos1", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 1:
                this.export("time2", time.now)
                this.export("pos2", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 2:
                this.export("time3", time.now)
                this.export("pos3", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 3:
                this.export("time4", time.now)
                this.export("pos4", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 4:
                this.export("time5", time.now)
                this.export("pos5", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 5:
                this.export("time6", time.now)
                this.export("pos6", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 6:
                this.export("time7", time.now)
                this.export("pos7", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 7:
                this.export("time8", time.now)
                this.export("pos8", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 8:
                this.export("time9", time.now)
                this.export("pos9", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 9:
                this.export("time10", time.now)
                this.export("pos10", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 10:
                this.export("time11", time.now)
                this.export("pos11", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 11:
                this.export("time12", time.now)
                this.export("pos12", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 12:
                this.export("time13", time.now)
                this.export("pos13", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 13:
                this.export("time14", time.now)
                this.export("pos14", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 14:
                this.export("time15", time.now)
                this.export("pos15", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            case 15:
                this.export("time16", time.now)
                this.export("pos16", slider.position)
                slider.lastSavedTime = time.now
                slider.lastSavedPosition = slider.position
                break
            default:
                slider.saved = false
                this.despawn = true
                break
        }

        this.used++
    }
}
