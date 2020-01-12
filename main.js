window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)}; // prettier-ignore

const TRACKING_VERSION = "1";
const dimensions = {
  TRACKING_VERSION: "dimension1",
  CLIENT_ID: "dimension2",
  WINDOW_ID: "dimension3",
  HIT_ID: "dimension4",
  HIT_TIME: "dimension5",
  HIT_TYPE: "dimension6"
};

function uuid() {
  return `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
}

ga("create", "UA-46044816-3", { siteSpeedSampleRate: 100 });
ga("set", "transport", "beacon");

Object.keys(dimensions).forEach(function(key) {
  ga("set", dimensions[key], "(not set)");
});

ga(function(tracker) {
  tracker.set({
    [dimensions.TRACKING_VERSION]: TRACKING_VERSION,
    [dimensions.CLIENT_ID]: tracker.get("clientId"),
    [dimensions.WINDOW_ID]: uuid()
  });
  const originalBuildHitTask = tracker.get("buildHitTask");
  tracker.set("buildHitTask", function(model) {
    const qt = model.get("queueTime") || 0;
    model.set(dimensions.HIT_TIME, String(new Date() - qt), true);
    model.set(dimensions.HIT_ID, uuid(), true);
    model.set(dimensions.HIT_TYPE, model.get("hitType"), true);
    originalBuildHitTask(model);
  });

  ga("send", "pageview");
});

addEventListener("click", function(event) {
  if (event.target.tagName === "A") {
    ga("send", "event", "Outbound Link", "click", event.target.href);
  }
});
