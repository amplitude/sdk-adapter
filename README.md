<p align="center">
  <a href="https://amplitude.com" target="_blank" align="center">
    <img src="https://static.amplitude.com/lightning/46c85bfd91905de8047f1ee65c7c93d6fa9ee6ea/static/media/amplitude-logo-with-text.4fb9e463.svg" width="280">
  </a>
  <br />
</p>

# Amplitude Browser SDK Adapter Tool

Amplitude's tool to ease engineering cost of migrating SDK libraries. Currently supported only for the [browser SDK](https://github.com/amplitude/Amplitude-TypeScript/tree/main/packages/analytics-browser). Segment's analytics SDK API can be kept and analytics actions will be forwarded to Amplitude. Currently support `track` and `identify` calls.

# Usage

### 1. Import packages

```js
import { AnalyticsAdapter } from "sdk-adapter";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { createInstance } from "@amplitude/analytics-browser";
```

### 2. Create instances of Amplitude and Segment SDKs

```js
const amplitude = createInstance();
amplitude.init(AMPLITUDE_API_KEY);

const segment = new AnalyticsBrowser();
segment.load({ writeKey: SEGMENT_WRITE_KEY });
```

### 3. Create adapter instance and replace Segment APIs with supported adapter APIs

```js
const analytics = new AnalyticsAdapter(segment, amplitude);
analytics.track('test event')
```
