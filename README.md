# Sonolus D4DJ Engine

A recreation of D4DJ Groovy Mix engine in Sonolus.

Todo list:

- [x] Finish writing play mode
- [x] Make it customizable
- [x] Finish writing tutorial mode
- [x] Finish writing preview mode
- [x] Finish writing watch mode
- [x] Designed particle effect for D4DJ

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-d4dj-engine
```

## Custom Resources

### Skin Sprites

| Name                                          |
| --------------------------------------------- |
| `DJ Stage`                                    |
| `DJ Scratch Note`                             |
| `DJ Scratch Arrow`                            |
| `DJ Slider`                                   |
| `DJ Slider Bar`                               |
| `DJ Line`                                     |
| `DJ Disk Outside`                             |
| `DJ Disk Inside`                              |
| `DJ Turntable Base`                           |
| `DJ Shadow`                                   |
| `DJ Shadow Note`                              |
| `DJ Shadow Slider`                            |
| `DJ Shadow Slider Arrow`                      |
| `DJ Slider Arrow Glow`                        |

### Effect Clips

| Name                                          |
| --------------------------------------------- |
| `DJ Scratch Empty`                            |
| `DJ Scratch Perfect`                          |
| `DJ Tap 1 Good`                               |
| `DJ Tap 1 Great`                              |
| `DJ Tap 1 Perfect`                            |
| `DJ Tap 2 Good`                               |
| `DJ Tap 2 Great`                              |
| `DJ Tap 2 Perfect`                            |
| `DJ Long Good`                                |
| `DJ Long Great`                               |
| `DJ Long Perfect`                             |
| `DJ Slider Good`                              |
| `DJ Slider Great`                             |
| `DJ Slider Perfect`                           |
| `DJ Slider Flick Perfect`                     |

### Particle Effects

| Name                                          |
| --------------------------------------------- |
| `DJ Scratch Linear Particle`                  |
| `DJ Scratch Circular Particle`                |

## Documentation

### `version`

Package version.

### `databaseEngineItem`

Partial database engine item compatible with [sonolus-express](https://github.com/NonSpicyBurrito/sonolus-express).

### `b34djToLevelData(chart, offset?)`

Converts D4DJ (bangbangboom-editor) chart to Level Data.

-   `chart`: D4DJ chart.
-   `offset`: offset (default: `0`).

### `d4cToLevelData(chart, offset?)`

Converts D4C chart to Level Data.

-   `chart`: D4C chart.
-   `offset`: offset (default: `0`).

### Assets

The following assets are exposed as package entry points:

-   `EngineConfiguration`
-   `EnginePlayData`
-   `EngineWatchData`
-   `EnginePreviewData`
-   `EngineTutorialData`
-   `EngineThumbnail`

In Node.js, you can obtain path to assets using `require.resolve('sonolus-d4dj-engine/EngineConfiguration')` or `import.meta.resolve('sonolus-d4dj-engine/EngineConfiguration')`.
