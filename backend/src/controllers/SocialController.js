import { publishListingToTwitter } from "../service/SocialService.js";

export const publishToTwitter = async (req, res) => {
  try {
    const property = req.body;
    const result = await publishListingToTwitter(property);
    return res.status(200).json({
      message: "Listing published to Twitter.",
      ...result,
    });
  } catch (error) {
    console.error("Error publishing to Twitter:", error);
    const status = error.statusCode || 502;
    return res.status(status).json({
      message: "Failed to publish listing to Twitter.",
      error: error.message,

      previewText: error.previewText,
    });
  }
};
