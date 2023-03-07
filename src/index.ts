import { AnalyticsBrowser, Analytics, Context } from "@segment/analytics-next";
import {
  Identify,
  identify,
} from "@amplitude/analytics-browser";
import { BrowserClient } from "@amplitude/analytics-types";
import { resolveUserArguments, resolveArguments } from "./utils";

export class AnalyticsAdapter implements Partial<Analytics> {
  private segment: AnalyticsBrowser;
  private amplitude: BrowserClient;

  constructor(segment: AnalyticsBrowser, amplitude: BrowserClient) {
    this.segment = segment;
    this.amplitude = amplitude;
  }

  async identify(...args: Parameters<Analytics["identify"]>) {

    const [id, _traits, options, callback] = resolveUserArguments(
      await this.segment.user()
    )(...args);

    this.amplitude.setUserId(id || this.amplitude.getUserId());
    const identifyUserProps = new Identify();

    Object.keys(_traits).forEach((key) => {
      const value = _traits[key];
      identifyUserProps.set(key, value);
    });

    identify(identifyUserProps);

    return new Context({ type: "identify" }, "123");
  }

  async track(...args: Parameters<Analytics["track"]>) {
    const [name, data, opts, cb] = resolveArguments(...args);

    this.amplitude.track(name, data);

    return new Context({ type: "track" }, "123");
  }

}
