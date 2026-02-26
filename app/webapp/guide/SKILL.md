# USER GUIDE SKILL

## PURPOSE

Load when working on the user guide feature: interactive guide sections, screenshot hotspots, interactive demos, or the guide format components.

## HOW IT WORKS IN THIS CODEBASE

**Guide structure:**

```
app/webapp/guide/
├── page.tsx
└── components/
    └── formats/
        ├── InteractiveDemo.tsx        ← Interactive demo component
        └── components/
            ├── ScreenshotHotspots.tsx  ← Clickable hotspots on screenshots
            └── ScreenshotImage.tsx     ← Screenshot display component
```

The guide provides in-app help content — not a static docs site. Users can browse guides without leaving the app.

**Guide data:** Guides are stored in JSON/MDX format and rendered by the guide components. The guide content covers each feature area.

## GOTCHAS

- **InteractiveDemo** embeds live feature demonstrations — ensure the demo data doesn't conflict with real user data
- **ScreenshotHotspots** needs accurate coordinates for each hotspot — update if UI changes

## REFERENCE FILES

- `app/webapp/guide/components/formats/InteractiveDemo.tsx`
- `app/webapp/guide/components/formats/components/ScreenshotHotspots.tsx`
- `app/webapp/guide/components/formats/components/ScreenshotImage.tsx`

## RETROFIT LOG

## LAST UPDATED

2025-02-26
