import { AnalyticsBrowser, Analytics, Context } from "@segment/analytics-next";
import { Identify, identify } from "@amplitude/analytics-browser";
import { BrowserClient } from "@amplitude/analytics-types";
import { resolveUserArguments, resolveArguments } from "./utils";

interface AnalyticsAdapterConfig {
  enableSegment: boolean;
  enableAmplitude: boolean;
}

export class AnalyticsAdapter implements Partial<Analytics> {
  private segment: AnalyticsBrowser;
  private amplitude: BrowserClient;
  private config: AnalyticsAdapterConfig;

  constructor(
    segment: AnalyticsBrowser,
    amplitude: BrowserClient,
    config: AnalyticsAdapterConfig = {
      enableSegment: false,
      enableAmplitude: true,
    }
  ) {
    this.segment = segment;
    this.amplitude = amplitude;
    this.config = config;
  }

  async identify(...args: Parameters<Analytics["identify"]>) {
    const [id, _traits, options, callback] = resolveUserArguments(
      await this.segment.user()
    )(...args);
    const { enableSegment, enableAmplitude } = this.config;

    if (enableSegment) {
      this.segment.identify(...args);
    }
    
    if (enableAmplitude) {
      this.amplitude.setUserId(id || this.amplitude.getUserId());
      const identifyUserProps = new Identify();

      Object.keys(_traits).forEach((key) => {
        const value = _traits[key];
        identifyUserProps.set(key, value);
      });

      identify(identifyUserProps);
    }

    return new Context({ type: "identify" }, "123");
  }

  async track(...args: Parameters<Analytics["track"]>) {
    const [name, data, opts, cb] = resolveArguments(...args);
    const { enableSegment, enableAmplitude } = this.config;
    if (enableSegment) {
      this.segment.track(...args);
    }
    if (enableAmplitude) {
      this.amplitude.track(name, data);
    }

    return new Context({ type: "track" }, "123");
  }
}
