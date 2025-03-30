const { hash } = require("@sonolus/core")
const fs = require("fs")

const pkg = require("./package.json")

const engine = {
    name: 'd4dj',
    version: 13,
    title: { en: 'D4DJ' },
    subtitle: { en: 'D4DJ Groovy Mix!' },
    author: { en: 'Gorengan Hunter#329978' },
    tags: [],
    description: {
        en: 'A recreation of D4DJ Groovy Mix engine in Sonolus.\n' +
            `Version: ${pkg.version}\n` +
            '\n' +
            'Github Repository\n' +
            'https://github.com/gorenganhunter/sonolus-d4dj-engine'
        },
    skin: 'd4dj-2-3-1',
    background: 'd4dj-default-stage',
    effect: 'd4dj-01',
    particle: 'd4dj-particle-2',
    thumbnail: {
        hash: '821631ad43438350041d139113edd2040543f49a',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/821631ad43438350041d139113edd2040543f49a'
    },
    playData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/'
    },
    watchData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/'
    },
    previewData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/'
    },
    tutorialData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/'
    },
    configuration: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/'
    }
}

const files = {
    playData: "./dist/EnginePlayData",
    watchData: "./dist/EngineWatchData",
    previewData: "./dist/EnginePreviewData",
    tutorialData: "./dist/EngineTutorialData",
    configuration: "./dist/EngineConfiguration"
}

const db = require("./d4dj-server/pack/db.json")
const dbc = require("./d4c/pack/db.json")

for (const file of Object.keys(files)) {
    const path = files[file]
    const buffer = fs.readFileSync(path)
    const hashed = hash(buffer)
    fs.rmSync(`./d4dj-private-data/${db.engines[0][file].hash}`)
    fs.writeFileSync(`./d4dj-private-data/${hashed}`, buffer)
    engine[file] = {
        hash: hashed,
        url: `https://cdn.jsdelivr.net/gh/gorenganhunter/d4dj-private-data/${hashed}`
    }
}

const version = {
    last_updated: new Date().toISOString()
}

fs.writeFileSync("./d4dj-private-data/version.json", JSON.stringify(version))

db.engines[0] = engine
dbc.engines[0] = engine

fs.writeFileSync("./d4dj-server/pack/db.json", JSON.stringify(db))

fs.writeFileSync("./d4dj-server/version.json", JSON.stringify(version))

fs.writeFileSync("./d4c/pack/db.json", JSON.stringify(dbc))

fs.writeFileSync("./d4c/version.json", JSON.stringify(version))
