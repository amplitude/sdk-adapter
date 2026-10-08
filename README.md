<p align="center">
  <a href="https://amplitude.com" target="_blank" align="center">
    <img src="https://static.amplitude.com/brand/amplitude-logo-with-text.svg" width="280">
  </a>
  <br />
</p>

# Amplitude Browser SDK Adapter Tool

Amplitude's tool to ease engineering cost of migrating SDK libraries. Currently supported only for the [browser SDK](https://github.com/amplitude/Amplitude-TypeScript/tree/main/packages/analytics-browser). Segment's analytics SDK API can be kept and analytics actions will be forwarded to Amplitude. Currently support `track` and `identify` calls.

# Usage

### 1. Install
```
npm install 
```

### 2. Import packages

```js
import { AnalyticsAdapter } from "sdk-adapter";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { createInstance } from "@amplitude/analytics-browser";
```

### 3. Create instances of Amplitude and Segment SDKs

```js
const amplitude = createInstance();
amplitude.init(AMPLITUDE_API_KEY);

const segment = new AnalyticsBrowser();
segment.load({ writeKey: SEGMENT_WRITE_KEY });
```

### 4. Create adapter instance and replace Segment APIs with supported adapter APIs

```js
const analytics = new AnalyticsAdapter(segment, amplitude);
analytics.track('test event')
```
