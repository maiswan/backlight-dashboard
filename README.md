## backlight-dashboard

Tthe official dashboard designed for the [backlight](https://github.com/maiswan/backlight) software LED controller.

## Features
Not many features other than being user-friendly.

The dashboard supports most functionalities the backlight API exposes. One exception is the `targets` parameter (support will be implemented in the near future).

## Setup
This guide uses npm, but other package managers should work equally well.
```bash
npm install
npm run [dev|build]
```

This dashboard can be integrated into the Raspberry Pi or other SBCs running backlight. Simply `npm run build` this dashboard and copy the artifacts to the `/dashboard/dist` folder.

> [!TIP]
> If you mount the build onto the device running backlight, you can omit the server IP settings in the dashboard. The dashboard will automagically connect to the locally-running backlight instance.
