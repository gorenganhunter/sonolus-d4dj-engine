import { slider } from '../slider.js'

export class SliderData extends Archetype {
    importDataTickDir = Object.fromEntries(
        Array.from({ length: 16 }, (_, index) => {
            const i = index + 1;
            return [
                [`time${i}`, { name: `time${i}`, type: Number }],
                [`pos${i}`, { name: `pos${i}`, type: Number }],
            ];
        }).flat()
    );

    activeTime = this.entityMemory({
        min: Number,
        max: Number
    })

    spawnTime() {
        return replay.isReplay ? this.activeTime.min : 999999
    }

    despawnTime() {
        return (this.activeTime.max) || (this.activeTime.min ? 999999 : -999)
    }

    import = this.defineImport(this.importDataTickDir)

    get nextImport() {
        return this.import.get(this.info.index + 1)
    }

    preprocess() {
        // @ts-ignore
        this.activeTime.min = Math.min(this.import.time1, this.import.time2, this.import.time3, this.import.time4, this.import.time5, this.import.time6, this.import.time7, this.import.time8, this.import.time9, this.import.time10, this.import.time11, this.import.time12, this.import.time13, this.import.time14, this.import.time15, this.import.time16)
        // @ts-ignore
        this.activeTime.max = Math.min(this.nextImport.time1, this.nextImport.time2, this.nextImport.time3, this.nextImport.time4, this.nextImport.time5, this.nextImport.time6, this.nextImport.time7, this.nextImport.time8, this.nextImport.time9, this.nextImport.time10, this.nextImport.time11, this.nextImport.time12, this.nextImport.time13, this.nextImport.time14, this.nextImport.time15, this.nextImport.time16)
    }

    updateSequentialOrder = -100
    updateSequential() {
        if (slider.updated) return

        let temp = slider.position

        // @ts-ignore
        if (!slider.updated && this.import.time1 < time.now && this.import.time2 > time.now) { slider.updated = true; temp = this.import.pos1 }

        // @ts-ignore
        if (!slider.updated && this.import.time2 < time.now && this.import.time3 > time.now) { slider.updated = true; temp = this.import.pos2 }

        // @ts-ignore
        if (!slider.updated && this.import.time3 < time.now && this.import.time4 > time.now) { slider.updated = true; temp = this.import.pos3 }

        // @ts-ignore
        if (!slider.updated && this.import.time4 < time.now && this.import.time5 > time.now) { slider.updated = true; temp = this.import.pos4 }

        // @ts-ignore
        if (!slider.updated && this.import.time5 < time.now && this.import.time6 > time.now) { slider.updated = true; temp = this.import.pos5 }

        // @ts-ignore
        if (!slider.updated && this.import.time6 < time.now && this.import.time7 > time.now) { slider.updated = true; temp = this.import.pos6 }

        // @ts-ignore
        if (!slider.updated && this.import.time7 < time.now && this.import.time8 > time.now) { slider.updated = true; temp = this.import.pos7 }

        // @ts-ignore
        if (!slider.updated && this.import.time8 < time.now && this.import.time9 > time.now) { slider.updated = true; temp = this.import.pos8 }

        // @ts-ignore
        if (!slider.updated && this.import.time9 < time.now && this.import.time10 > time.now) { slider.updated = true; temp = this.import.pos9 }

        // @ts-ignore
        if (!slider.updated && this.import.time10 < time.now && this.import.time11 > time.now) { slider.updated = true; temp = this.import.pos10 }

        // @ts-ignore
        if (!slider.updated && this.import.time11 < time.now && this.import.time12 > time.now) { slider.updated = true; temp = this.import.pos11 }

        // @ts-ignore
        if (!slider.updated && this.import.time12 < time.now && this.import.time13 > time.now) { slider.updated = true; temp = this.import.pos12 }

        // @ts-ignore
        if (!slider.updated && this.import.time13 < time.now && this.import.time14 > time.now) { slider.updated = true; temp = this.import.pos13 }

        // @ts-ignore
        if (!slider.updated && this.import.time14 < time.now && this.import.time15 > time.now) { slider.updated = true; temp = this.import.pos14 }

        // @ts-ignore
        if (!slider.updated && this.import.time15 < time.now && this.import.time16 > time.now) { slider.updated = true; temp = this.import.pos15 }

        // @ts-ignore
        if (!slider.updated && this.import.time16 < time.now && this.nextImport.time1 > time.now) { slider.updated = true; temp = this.import.pos16 }

        
        slider.position = temp
//        debug.log(temp)
    }
}
