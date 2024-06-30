import { EngineConfigurationUI } from '@sonolus/core'

export const ui: EngineConfigurationUI = {
    primaryMetric: 'arcade',
    secondaryMetric: 'life',
    menuVisibility: {
        scale: 1,
        alpha: 1,
    },
    judgmentVisibility: {
        scale: 1,
        alpha: 1,
    },
    comboVisibility: {
        scale: 1,
        alpha: 1,
    },
    primaryMetricVisibility: {
        scale: 1,
        alpha: 1,
    },
    secondaryMetricVisibility: {
        scale: 1,
        alpha: 1,
    },
    progressVisibility: {
        scale: 1,
        alpha: 1,
    },
    tutorialNavigationVisibility: {
        scale: 1,
        alpha: 1,
    },
    tutorialInstructionVisibility: {
        scale: 1,
        alpha: 1,
    },
    judgmentAnimation: {
        scale: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'none',
        },
        alpha: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'none',
        },
    },
    comboAnimation: {
        scale: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'none',
        },
        alpha: {
            from: 1,
            to: 1,
            duration: 0,
            ease: 'none',
        },
    },
    judgmentErrorStyle: 'none',
    judgmentErrorPlacement: 'both',
    judgmentErrorMin: 0,
}
