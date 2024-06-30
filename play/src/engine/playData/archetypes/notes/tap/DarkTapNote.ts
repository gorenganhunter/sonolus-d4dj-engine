import { EffectClip, ParticleEffect, SkinSprite } from '@sonolus/sonolus.js-compiler/play'
import { perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.js'
import { note } from '../../../note.js'
import { particle } from '../../../particle.js'
import { skin } from '../../../skin.js'
import { Note } from '../Note.js'
import { effect } from '../../../effect.js'
import { buckets } from '../../../buckets.js'
import { TapNote } from './TapNote.js'

export class DarkTapNote extends TapNote {
    sprite: SkinSprite = skin.sprites.darkTapNote
    effect: ParticleEffect = particle.effects.darkTapNote
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; } = {
        perfect: effect.clips.tap1Perfect,
        great: effect.clips.tap1Great,
        good: effect.clips.tap1Good,
    }
}
