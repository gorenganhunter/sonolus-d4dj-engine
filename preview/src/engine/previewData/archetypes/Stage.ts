import { options } from '../../configuration/options.js'
import { chart } from '../chart.js'
import { panel } from '../panel.js'
import { print } from '../print.js'
import { layer, line, skin } from '../skin.js'

export class Stage extends Archetype {
    preprocessOrder = 1
    preprocess() {
        canvas.set({
            scroll: Scroll.LeftToRight,
            size: (panel.count * panel.w * screen.h) / 20,
        })
    }

    render() {
        this.renderPanels()

        if (options.barLine) return

        this.renderBeats()

        this.printTimes()
        this.printMeasures()
    }

    renderPanels() {
        for (let i = 0; i < panel.count; i++) {
            const x = i * panel.w

            const b = 0
            const t = panel.h

            skin.sprites.line.draw(
                new Rect({
                    l: x - 3.55,
                    r: x - 3.45,
                    b,
                    t,
                }),
                layer.stage + 1,
                1,
            )
            skin.sprites.line.draw(
                new Rect({
                    l: x + 3.45,
                    r: x + 3.55,
                    b,
                    t,
                }),
                layer.stage + 1,
                1,
            )
            skin.sprites.lane.draw(
                new Rect({
                    l: x - 3.5,
                    r: x + 3.5,
                    b,
                    t
                }),
                layer.stage,
                options.opacity
            )

            for (let j = 1; j < 6; j++) {
                const layout = new Rect({
                    l: x + (j - 2.45),
                    r: x + (j - 2.55),
                    b,
                    t,
                })

                skin.sprites.line.draw(layout, layer.stage + 1, 1)
            }
        }
    }

    renderBeats() {
        for (let i = 0; i <= Math.floor(chart.beats); i++) {
            line(skin.sprites.simLine, i, i % 4 === 0 ? 0.5 : 0.25)
        }
    }

    printTimes() {
        for (let i = 1; i <= Math.floor(chart.duration); i++) {
            print(i, i, PrintFormat.Time, 0, PrintColor.Theme, 'left')
        }
    }

    printMeasures() {
        for (let i = 4; i <= Math.floor(chart.beats); i += 4) {
            print(
                i / 4 + 1,
                bpmChanges.at(i).time,
                PrintFormat.MeasureCount,
                0,
                PrintColor.Theme,
                'right',
            )
        }
    }
}
