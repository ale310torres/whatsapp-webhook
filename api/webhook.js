export default async function handler(req, res) {
  const verifyToken = "torres123";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === verifyToken) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Invalid verify token");
  }

  if (req.method === "POST") {
  console.log("Webhook payload full:", JSON.stringify(req.body, null, 2));
  return res.status(200).send("EVENT_RECEIVED");
}
  }

  return res.status(405).send("Method Not Allowed");
}
