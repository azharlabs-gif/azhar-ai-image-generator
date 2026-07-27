export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to generate image."
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", response.headers.get("content-type") || "image/png");
    return res.status(200).send(buffer);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
