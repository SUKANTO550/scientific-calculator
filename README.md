# Scientific Calculator

A free, offline scientific calculator for Android, with symbolic calculus powered by SymPy.

**Version 1.3**

## Download

Get the latest APK from the [Releases](../../releases) page.

To install:
1. Download `ScientificCalculator-1.3.apk` on your Android phone.
2. Open the file. If asked, allow installs from your browser or file manager.
3. Tap **Install**.

Requires Android 8.0 (API 26) or newer. Works fully offline.

## Features

- Scientific calculation with multi-line display
- Modes: algebra, complex numbers, equation solving, matrices and vectors, series, statistics, and function tables
- Symbolic calculus (indefinite integrals and more) using SymPy running on-device via Pyodide

## Build from source

Requirements: Android Studio (or Android SDK) and JDK 17.

```sh
git clone https://github.com/SUKANTO550/scientific-calculator.git
cd scientific-calculator
./gradlew assembleDebug
```

The APK is written to `app/build/outputs/apk/debug/`.

## Project structure

- `app/src/main/java/` - Android `WebView` host (`MainActivity.java`)
- `app/src/main/assets/` - calculator UI and engine (HTML, CSS, JavaScript)
- `app/src/main/assets/modes/` - calculator modes
- `app/src/main/assets/calculus/` - symbolic calculus engine

## Contributing

Bug reports and pull requests are welcome. Open an issue to discuss larger changes first.

## Third-party components

This app bundles the following, each under its own license:

- [Pyodide](https://github.com/pyodide/pyodide) - MPL-2.0
- [SymPy](https://github.com/sympy/sympy) - BSD-3-Clause
- [mpmath](https://github.com/mpmath/mpmath) - BSD-3-Clause
- [Inter](https://github.com/rsms/inter) and [Courier Prime](https://quoteunquote.com/courierprime) fonts - SIL Open Font License 1.1
- [AndroidX WebKit](https://developer.android.com/jetpack/androidx/releases/webkit) - Apache-2.0

## About

Created by **Sukanto Biswas**, Mechanical Engineer
© 2026 FreeTility

Released under the [MIT License](LICENSE).
