async function createAirtableRecord(env, body) {
  console.log("airtable");
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const text = await res.text();
    if (!res.ok) {
      console.error("Airtable error", res.status, text);
      throw new Error(`Airtable returned ${res.status}: ${text}`);
    }

    // return parsed JSON (contains the created record id)
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function submitHandler(request, env) {
  console.log("submitHandler");
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
    });
  }

  const body = await request.formData();
  const { name, rsvp, main_meal, dessert, dietary, sunday, non_drinker, more_info } =
    Object.fromEntries(body);

  const reqBody = {
    fields: {
      Name: name,
      RSVP: rsvp,
      "Main Meal": main_meal,
      Dessert: dessert,
      Dietary: dietary,
      Sunday: sunday,
      Alcohol: non_drinker,
      Other: more_info
    },
  };

  try {
    const airtableResp = await createAirtableRecord(env, reqBody);
    return new Response.redirect("/thanks", 302);
  } catch (err) {
    console.error("Failed to create airtable record:", err);
    return new Response("Failed to save", { status: 500 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      console.log("API", url.pathname);
      if (url.pathname === "/api/submit" || url.pathname === "/api/submit/") {
        console.log("SUBMIT");
        // IMPORTANT: return the response from submitHandler
        return await submitHandler(request, env);
      }
      return new Response("Not found..?", { status: 404 });
    }

    // Otherwise, serve the static assets.
    return env.ASSETS.fetch(request);
  },
};
