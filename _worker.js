async function createAirtableRecord(env, body) {
  try {
    const result = fetch(
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
    return result;
  } catch (error) {
    console.error(error);
  }
}

// TODO: Dietary
// TODO: Sunday attendance

// Existing code
// async function submitHandler
// export default ...

async function submitHandler(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
    });
  }
  const body = await request.formData();

  const { name, rsvp, main_meal, dessert, non_drinker, more_info} =
    Object.fromEntries(body);

  // The keys in "fields" are case-sensitive, and
  // should exactly match the field names you set up
  // in your Airtable table, such as "First Name".
  const reqBody = {
    fields: {
      Name: name,
      RSVP: rsvp,
      "Main Meal": main_meal,
      Dessert: dessert,
      Alcohol: non_drinker,
      Other: more_info
    },
  };
  await createAirtableRecord(env, reqBody);
}

// Existing code
// export default ...

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/submit") {
        await submitHandler(request, env);
      }
      return new Response("Not found", { status: 404 });
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request);
  },
};
