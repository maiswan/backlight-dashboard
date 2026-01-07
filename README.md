## backlight-dashboard

The official dashboard companion for the [backlight](https://github.com/maiswan/backlight) software LED controller. It supports all the command-editing functionalities the backlight API exposes. 

## Setup

```bash
npm install
npm run [dev|build]
```

This dashboard can be integrated into a device running backlight. Simply `npm run build` this dashboard and copy the artifacts to the `/dashboard/dist` folder.

> [!TIP]
> If you mount the build onto a device running backlight, you can omit the server IP settings in the dashboard. The dashboard will automagically connect to the locally-running backlight instance.
