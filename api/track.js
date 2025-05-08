export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  const { slug, trackingNo } = req.body;
  if (!slug || !trackingNo) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const headers = {
    "aftership-api-key": "asat_353bf042888246b2870fc22d4b813534",
    "Content-Type": "application/json"
  };

  // Step 1: Register tracking number
  await fetch("https://api.aftership.com/v4/trackings", {
    method: "POST",
    headers,
    body: JSON.stringify({ tracking: { slug, tracking_number: trackingNo } })
  });

  // Step 2: Fetch tracking info
  const response = await fetch(`https://api.aftership.com/v4/trackings/${slug}/${trackingNo}`, {
    method: "GET",
    headers
  });

  const json = await response.json();
  if (json.meta.code !== 200) {
    return res.status(500).json({ error: json.meta.message });
  }

  res.status(200).json(json.data);
}