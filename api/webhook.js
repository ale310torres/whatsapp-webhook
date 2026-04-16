export default async function handler(req, res) {
  const verifyToken = "torres123";
  const activepiecesWebhookUrl = "PEGA_AQUI_TU_WEBHOOK_DE_ACTIVEPIECES";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified successfully");
      return res.status(200).send(challenge);
    }

    console.log("Invalid verify token");
    return res.status(403).send("Invalid verify token");
  }

  if (req.method === "POST") {
    try {
      console.log("Webhook payload full:");
      console.log(JSON.stringify(req.body, null, 2));

      const value = req.body?.entry?.[0]?.changes?.[0]?.value;
      const message = value?.messages?.[0];

      if (message) {
        const payloadForActivepieces = {
          from: message.from || null,
          type: message.type || null,
          text: message.text?.body || null,
          message_id: message.id || null,
          timestamp: message.timestamp || null,
          wa_id: value?.contacts?.[0]?.wa_id || null,
          profile_name: value?.contacts?.[0]?.profile?.name || null,
          phone_number_id: value?.metadata?.phone_number_id || null,
          display_phone_number: value?.metadata?.display_phone_number || null,
          raw: req.body,
        };

        await fetch(activepiecesWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadForActivepieces),
        });

        console.log("Forwarded to Activepieces");
      } else {
        console.log("No incoming message found in payload");
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("POST webhook error:", error);
      return res.status(200).send("EVENT_RECEIVED");
    }
  }

  return res.status(405).send("Method Not Allowed");
}
