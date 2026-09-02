import { TwitterApi } from "twitter-api-v2";

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
