async function submitHandler(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
    });
  }
  const body = await request.formData();

  const { name, coming, main_meal, dessert, non_drinker, more_info } =
    Object.fromEntries(body);

  // The keys in "fields" are case-sensitive, and
  // should exactly match the field names you set up
  // in your Airtable table, such as "First Name".
  const reqBody = {
    fields: {
      Name: name,
      RSVP: coming,
      "Main Meal": main_meal,
      Dessert: dessert,
      Dietary: dessert,
      Alcohol: non_drinker,
      Other: more_info
    },
  };
  await createAirtableRecord(env, reqBody);
}

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

// Existing code
// async function submitHandler
// export default ...

// Existing code
// export default ...

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/submit") {
      await submitHandler(request, env);
    }
    return new Response("Not found", { status: 404 });
  },
};