import { DatabaseEngineItem } from '@sonolus/core'

export { b34djToLevelData, d4djToLevelData } from './b34dj/convert.cjs'
export { d4cToLevelData } from './d4c/convert.cjs'
export * from './b34dj/index.cjs'
export * from './d4c/index.cjs'

export const version = '1.4.5'

export const databaseEngineItem = {
    name: 'd4dj',
    version: 13,
    title: {
        en: 'D4DJ'
    },
    subtitle: {
        en: 'D4DJ Groovy Mix',
        ja: 'D4DJグルミク',
    },
    author: {
        en: 'Gorengan Hunter#329978',
    },
    description: {
        en: [
            'A recreation of D4DJ Groovy Mix engine in Sonolus.',
            '',
            'Version:',
            version,
            '',
            'GitHub Repository:',
            'https://github.com/gorenganhunter/sonolus-d4dj-engine',
        ].join('\n'),
    },
} as const satisfies Partial<DatabaseEngineItem>
