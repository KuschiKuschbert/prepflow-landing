# Sound Effects Directory

This directory contains sound effects for the PrepFlow Mini-Arcade system.

## Required Sound Files

- `pop.mp3` - Confetti celebration sound
- `throw-fast.mp3` - Tomato throw sound (optional, fallback available)
- `splat-heavy.mp3` - Tomato splat sound (optional, fallback available)
- `click.mp3` - Docket catch sound
- `whoosh.mp3` - Docket movement sound
- `success.mp3` - Achievement unlock sound
- `fireLoop.mp3` - Fire ambient sound (optional, uses Web Audio API fallback)
- `extinguisher.mp3` - Water spray sound (optional, uses Web Audio API fallback)
- `alert.mp3` - Time alert sound

## Fallback Behavior

All games include Web Audio API fallbacks that generate sounds programmatically if MP3 files are missing. The system will work without these files, but custom sound effects provide a better experience.

## Mute Support

All sounds respect the global mute setting (`window.arcadeMuted`) and can be toggled via the ArcadeMuteButton component.
