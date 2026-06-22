import { TwitterApi } from "twitter-api-v2";

// Social API integration — actively POSTS a listing to Twitter/X (not an embed).
// Credentials come from the backend .env (never the frontend) so the app keys
// stay secret:
//   TWITTER_API_KEY, TWITTER_API_SECRET,
//   TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
//
// Create them at https://developer.twitter.com → an app with Read+Write
// permission, then generate Access Token & Secret for your account.

const hasCredentials = () =>
  Boolean(
    process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET,
  );

const getClient = () =>
  new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

// Build the tweet text from a property, keeping within the 280-char limit.
export const buildListingTweet = (property) => {
  const price =
    typeof property.price === "number"
      ? `₪${property.price.toLocaleString()}`
      : "Price on request";

  const lines = [
    `🏡 New listing: ${property.type || "Property"} in ${property.city || "town"}`,
    `📍 ${[property.street, property.city].filter(Boolean).join(", ")}`,
    `💰 ${price} · ${property.rooms ?? "?"} rooms · ${property.size ?? "?"} sqm`,
    `#RealEstate #${(property.city || "Home").replace(/\s+/g, "")}`,
  ];

  return lines.join("\n").slice(0, 280);
};

export const publishListingToTwitter = async (property) => {
  if (!property || typeof property !== "object") {
    const err = new Error("A property object is required.");
    err.statusCode = 400;
    throw err;
  }

  const text = buildListingTweet(property);

  // Allow previewing the generated tweet without real credentials configured.
  if (!hasCredentials()) {
    const err = new Error(
      "Twitter credentials are not configured on the server.",
    );
    err.statusCode = 503;
    err.previewText = text;
    throw err;
  }

  const client = getClient();
  const { data } = await client.v2.tweet(text);

  return {
    tweetId: data.id,
    text: data.text,
    url: `https://twitter.com/i/web/status/${data.id}`,
  };
};
