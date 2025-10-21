# Marketin Laravel Bridge

Marketin Laravel Bridge is a lightweight helper that drops the Marketin JavaScript SDK and a self-initialising bridge script into any Laravel application. A single Blade directive renders the SDK, injects a configuration blob, and loads the bridge that wires URL attribution, Livewire events, and conversion tracking.

---

## Table of contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [Quick start](#quick-start)
4. [Installation](#installation)
   - [1. Install the package](#1-install-the-package)
   - [2. Configure environment variables](#2-configure-environment-variables)
   - [3. Add the Blade directive](#3-add-the-blade-directive)
5. [Configuration](#configuration)
   - [Environment variables](#environment-variables)
   - [Bridge hosting](#bridge-hosting)
6. [Usage](#usage)
   - [Blade directives](#blade-directives)
   - [Sample layout integration](#sample-layout-integration)
   - [Tracking data-layer snippet](#tracking-data-layer-snippet)
7. [Self-hosting the bridge (optional)](#self-hosting-the-bridge-optional)
8. [Support](#support)

---

## Features

- One-line Blade directive (`@marketinScripts`) that loads the official Marketin SDK and passes a signed config payload to the bridge.
- CDN defaults for both the SDK (`https://cdn.jsdelivr.net/gh/ayg3/sdk@latest/marketin-sdk.min.js`) and the bridge bundle—no publishing step required.
- Environment-driven configuration so each deployment can set brand, campaign, and affiliate identifiers without touching code.
- Optional `@marketinTracking` directive to push structured events into the data layer you already use.
- Extensible helper that accepts per-render overrides for advanced pages or A/B tests.

## Requirements

| Dependency | Version |
|------------|---------|
| PHP        | 8.2+    |
| Laravel    | 10.x, 11.x, or 12.x |
| Node.js    | 18+ (only for maintainers rebuilding the bundle) |
| NPM        | 9+ (only for maintainers rebuilding the bundle) |

---

## Quick start

```bash
composer require ayg3/marketin-laravel-bridge

# In your base layout <head> tag:
@marketinScripts()
```

Set the required IDs (brand, campaign, affiliate) via environment variables before deploying.

---

## Installation

### 1. Install the package

```bash
composer require ayg3/marketin-laravel-bridge
```

The service provider is auto-discovered; no manual registration is necessary.

### 2. Configure environment variables

Add the IDs Marketin assigned to you. The bridge will refuse to initialise if `MARKETIN_BRAND_ID` is missing.

```dotenv
MARKETIN_BRAND_ID=123
MARKETIN_CAMPAIGN_ID=456
MARKETIN_AFFILIATE_ID=789
MARKETIN_API_ENDPOINT=https://api.marketin.now/api/v1
```

You can leave the campaign or affiliate values blank if you plan to provide them per-page via the directive.

### 3. Add the Blade directive

Place `@marketinScripts()` once in your primary layout (typically inside `<head>`). The directive renders:

1. The Marketin SDK tag (`https://cdn.jsdelivr.net/gh/ayg3/sdk@latest/marketin-sdk.min.js`) with the required `data-navigate-once` attribute.
2. A configuration blob (`window.__marketInBridgeConfig`).
3. The Marketin bridge bundle.

---

## Configuration

The package ships with `config/marketin.php`. You do not need to publish it unless you prefer a file-based override; environment variables are sufficient for most teams.

### Environment variables

| Variable                        | Default                                                          | Description |
|---------------------------------|------------------------------------------------------------------|-------------|
| `MARKETIN_SDK_URL`              | `https://cdn.jsdelivr.net/gh/ayg3/sdk@latest/marketin-sdk.min.js` | CDN location of the Marketin SDK. |
| `MARKETIN_BRAND_ID`             | `null`                                                           | **Required.** Your Marketin brand identifier. |
| `MARKETIN_CAMPAIGN_ID`          | `null`                                                           | Default campaign identifier. |
| `MARKETIN_AFFILIATE_ID`         | `null`                                                           | Default affiliate identifier. |
| `MARKETIN_DEFAULT_CAMPAIGN_ID`  | `null`                                                           | Fallback campaign ID when URL params are absent. |
| `MARKETIN_DEFAULT_AFFILIATE_ID` | `null`                                                           | Fallback affiliate ID when URL params are absent. |
| `MARKETIN_API_ENDPOINT`         | `https://api.marketin.now/api/v1`                                | REST endpoint consumed by the bridge. |
| `MARKETIN_DEBUG`                | `false`                                                          | Enables verbose console logging. |
| `MARKETIN_BRIDGE_URL`           | `https://cdn.jsdelivr.net/gh/ayg3/marketin_laravel_bridge@latest/dist/marketin-bridge.js` | CDN location of the Laravel bridge bundle. |
| `MARKETIN_ASSET_PATH`           | `vendor/marketin`                                                | Target path if you choose to self-host the bridge. |
| `MARKETIN_BRIDGE_FILENAME`      | `marketin-bridge.js`                                             | Filename used when self-hosting. |
| `MARKETIN_TRACKING_ENABLED`     | `true`                                                           | Toggles the `@marketinTracking` directive output. |
| `MARKETIN_TRACKING_LAYER`       | `dataLayer`                                                      | Window variable that receives tracking events. |

### Bridge hosting

By default the directive loads the bridge from the CDN value in `MARKETIN_BRIDGE_URL`. If you prefer to host the file yourself, set `MARKETIN_BRIDGE_URL` to an empty string (or remove it) and follow the [self-hosting instructions](#self-hosting-the-bridge-optional).

---

## Usage

### Blade directives

| Directive             | Purpose |
|-----------------------|---------|
| `@marketinScripts()`  | Injects the SDK, configuration blob, and bridge script. Accepts an optional associative array of overrides. |
| `@marketinTracking()` | Pushes an event into the configured data layer. Also accepts overrides. |

```blade
@marketinScripts(['brandId' => 42, 'campaignId' => 1001])
@marketinTracking(['event' => 'marketin.conversion', 'value' => 99.95, 'currency' => 'USD'])
```

### Sample layout integration

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ config('app.name') }}</title>

    @marketinScripts()
</head>
<body>
    {{ $slot ?? '' }}
</body>
</html>
```

### Tracking data-layer snippet

Place `@marketinTracking()` near the bottom of your layout if you want every page view sent to your analytics layer. You can also emit it ad-hoc inside campaign pages.

```blade
@marketinTracking([
    'event' => 'marketin.page_view',
    'brandId' => config('marketin.brand_id'),
])
```

---

## Self-hosting the bridge (optional)

If corporate policy requires hosting the bridge script yourself, run the publish command once and clear the CDN override:

```bash
php artisan vendor:publish --tag=marketin-assets
# then set MARKETIN_BRIDGE_URL= in your .env file
```

The file will be copied to `public/vendor/marketin/marketin-bridge.js`. Future package updates may ship a newer bundle; rerun the command after upgrading.

> **Note:** Only teams that self-host need to run `php artisan vendor:publish --tag=marketin-assets`. CDN users can skip this step entirely.

---

## Support

- Documentation issues or feature requests: open an issue in the Marketin Laravel Bridge repository.
- SDK behaviour questions: contact the Marketin SDK team or your Marketin solutions engineer.
- Production incidents: escalate through your Marketin account manager.
