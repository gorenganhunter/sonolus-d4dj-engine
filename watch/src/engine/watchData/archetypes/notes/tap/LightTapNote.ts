import { EffectClip, ParticleEffect, SkinSprite } from '@sonolus/sonolus.js-compiler/play'
import { particle } from '../../../particle.js'
import { skin } from '../../../skin.js'
import { TapNote } from './TapNote.js'
import { effect } from '../../../effect.js'
import { buckets } from '../../../buckets.js'

export class LightTapNote extends TapNote {
    sprite: SkinSprite = skin.sprites.lightTapNote
    effect: { linear: ParticleEffect, circular: ParticleEffect } = {
        linear: particle.effects.lightTapNoteLinear,
        circular: particle.effects.lightTapNoteCircular
    }
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; } = {
        perfect: effect.clips.tap2Perfect,
        great: effect.clips.tap2Great,
        good: effect.clips.tap2Good,
    }
}
