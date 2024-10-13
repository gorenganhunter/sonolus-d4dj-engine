# Sonolus D4DJ Engine

A recreation of D4DJ Groovy Mix engine in Sonolus.

Unfinished.

Todo list:

- [x] Finish writing play mode
- [x] Make it customizable
- [x] Finish writing tutorial mode
- [x] Finish writing preview mode
- [x] Finish writing watch mode
- [ ] Designed particle effect for D4DJ

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-bandori-engine
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

## Documentation

### `version`

Package version.

### `databaseEngineItem`

Partial database engine item compatible with [sonolus-express](https://github.com/NonSpicyBurrito/sonolus-express).

### `b34djToLevelData(chart, offset?)`

Converts D4DJ (bangbangboom-editor) chart to Level Data.

-   `chart`: D4DJ chart.
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
