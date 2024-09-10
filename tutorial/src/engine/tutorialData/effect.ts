import { EffectClipName } from '@sonolus/core'

export const effect = defineEffect({
    clips: {
        // tapEmpty: EffectClipName.Stage,
        // scratchEmpty: "DJ Scratch Empty",

        longLoop: EffectClipName.Hold,

        // scratchBad: "DJ Scratch Bad",
        scratchPerfect: "DJ Scratch Perfect",

        // sliderFlickBad: "DJ Slider Flick Bad",
        sliderFlickPerfect: "DJ Slider Flick Perfect",

        // sliderBad: "DJ Slider Bad",
        // sliderGood: "DJ Slider Good",
        // sliderGreat: "DJ Slider Great",
        sliderPerfect: "DJ Slider Perfect",

        // longBad: "DJ Long Bad",
        // longGood: "DJ Long Good",
        // longGreat: "DJ Long Great",
        longPerfect: "DJ Long Perfect",
        
        // tap1Bad: "DJ Tap 1 Bad",
        // tap1Good: "DJ Tap 1 Good",
        // tap1Great: "DJ Tap 1 Great",
        tap1Perfect: "DJ Tap 1 Perfect",
        
        // tap2Bad: "DJ Tap 2 Bad",
        // tap2Good: "DJ Tap 2 Good",
        // tap2Great: "DJ Tap 2 Great",
        // tap2Perfect: "DJ Tap 2 Perfect",

        perfect: EffectClipName.Perfect,
        // great: EffectClipName.Great,
        // good: EffectClipName.Good,
        
        perfectAlt: EffectClipName.PerfectAlternative,
        // greatAlt: EffectClipName.GreatAlternative,
        // goodAlt: EffectClipName.GoodAlternative,
    },
})

export const getScheduleSFXTime = (targetTime: number) =>
    targetTime - 0.5 - Math.max(audio.offset, 0)
