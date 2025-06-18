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
        return (replay.isReplay && !streams.has(0, -999999)) ? this.activeTime.min : 999999
    }

    despawnTime() {
        return this.activeTime.max
    }

    import = this.defineImport(this.importDataTickDir)

    get nextImport() {
        return this.import.get(this.info.index + 1)
    }

    preprocess() {
        // @ts-ignore
        this.activeTime.min = Math.min(this.import.time1 || 999999, this.import.time2 || 999999, this.import.time3 || 999999, this.import.time4 || 999999, this.import.time5 || 999999, this.import.time6 || 999999, this.import.time7 || 999999, this.import.time8 || 999999, this.import.time9 || 999999, this.import.time10 || 999999, this.import.time11 || 999999, this.import.time12 || 999999, this.import.time13 || 999999, this.import.time14 || 999999, this.import.time15 || 999999, this.import.time16 || 999999)
        // @ts-ignore
        this.activeTime.max = Math.min(this.nextImport.time1 || 999999, this.nextImport.time2 || 999999, this.nextImport.time3 || 999999, this.nextImport.time4 || 999999, this.nextImport.time5 || 999999, this.nextImport.time6 || 999999, this.nextImport.time7 || 999999, this.nextImport.time8 || 999999, this.nextImport.time9 || 999999, this.nextImport.time10 || 999999, this.nextImport.time11 || 999999, this.nextImport.time12 || 999999, this.nextImport.time13 || 999999, this.nextImport.time14 || 999999, this.nextImport.time15 || 999999, this.nextImport.time16 || 999999)
    }

    updateSequentialOrder = -100
    updateSequential() {
        if (slider.updated) return

        let temp = slider.position

        // @ts-ignore
        if (!slider.updated && this.import.time1 < time.now && (this.import.time2 > time.now || (!this.import.time2 && !this.import.pos2))) { slider.updated = true; temp = this.import.pos1 }

        // @ts-ignore
        if (!slider.updated && this.import.time2 < time.now && (this.import.time3 > time.now || (!this.import.time3 && !this.import.pos3))) { slider.updated = true; temp = this.import.pos2 }

        // @ts-ignore
        if (!slider.updated && this.import.time3 < time.now && (this.import.time4 > time.now || (!this.import.time4 && !this.import.pos4))) { slider.updated = true; temp = this.import.pos3 }

        // @ts-ignore
        if (!slider.updated && this.import.time4 < time.now && (this.import.time5 > time.now || (!this.import.time5 && !this.import.pos5))) { slider.updated = true; temp = this.import.pos4 }

        // @ts-ignore
        if (!slider.updated && this.import.time5 < time.now && (this.import.time6 > time.now || (!this.import.time6 && !this.import.pos6))) { slider.updated = true; temp = this.import.pos5 }

        // @ts-ignore
        if (!slider.updated && this.import.time6 < time.now && (this.import.time7 > time.now || (!this.import.time7 && !this.import.pos7))) { slider.updated = true; temp = this.import.pos6 }

        // @ts-ignore
        if (!slider.updated && this.import.time7 < time.now && (this.import.time8 > time.now || (!this.import.time8 && !this.import.pos8))) { slider.updated = true; temp = this.import.pos7 }

        // @ts-ignore
        if (!slider.updated && this.import.time8 < time.now && (this.import.time9 > time.now || (!this.import.time9 && !this.import.pos9))) { slider.updated = true; temp = this.import.pos8 }

        // @ts-ignore
        if (!slider.updated && this.import.time9 < time.now && (this.import.time10 > time.now || (!this.import.time10 && !this.import.pos10))) { slider.updated = true; temp = this.import.pos9 }

        // @ts-ignore
        if (!slider.updated && this.import.time10 < time.now && (this.import.time11 > time.now || (!this.import.time11 && !this.import.pos11))) { slider.updated = true; temp = this.import.pos10 }

        // @ts-ignore
        if (!slider.updated && this.import.time11 < time.now && (this.import.time12 > time.now || (!this.import.time12 && !this.import.pos12))) { slider.updated = true; temp = this.import.pos11 }

        // @ts-ignore
        if (!slider.updated && this.import.time12 < time.now && (this.import.time13 > time.now || (!this.import.time13 && !this.import.pos13))) { slider.updated = true; temp = this.import.pos12 }

        // @ts-ignore
        if (!slider.updated && this.import.time13 < time.now && (this.import.time14 > time.now || (!this.import.time14 && !this.import.pos14))) { slider.updated = true; temp = this.import.pos13 }

        // @ts-ignore
        if (!slider.updated && this.import.time14 < time.now && (this.import.time15 > time.now || (!this.import.time15 && !this.import.pos15))) { slider.updated = true; temp = this.import.pos14 }

        // @ts-ignore
        if (!slider.updated && this.import.time15 < time.now && (this.import.time16 > time.now || (!this.import.time16 && !this.import.pos16))) { slider.updated = true; temp = this.import.pos15 }

        // @ts-ignore
        if (!slider.updated && this.import.time16 < time.now && (this.nextImport.time1 > time.now || (!this.nextImport.time1 && !this.nextImport.pos1))) { slider.updated = true; temp = this.import.pos16 }

        slider.position = temp
        //        debug.log(temp)
    }
}
