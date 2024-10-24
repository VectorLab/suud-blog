export default eventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      return getAllSettings();
    } else if (method === "POST") {
      const body = await readBody(event);
      const allowedKeys = [
        "site_name",
        "site_description",
        "site_keywords",
        "username",
        "trait",
        "hero_image",
        "about_description",
        "about_image",
        "trading_record",
        "contact_address",
        "contact_phone",
        "contact_email",
        "contact_chat"
      ];

      Object.entries(body).forEach(([key, value]) => {
        if (allowedKeys.includes(key)) {
          setSetting(key, value);
        }
      });

      return { message: "Settings updated successfully" };
    } else {
      throw { statusCode: 405, statusMessage: "Method Not Allowed" };
    }
  } catch (error) {
    console.log("Error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message: error.statusMessage || "Internal Server Error",
      },
    };
  }
});