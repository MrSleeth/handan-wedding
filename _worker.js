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

    // If the client expects JSON (e.g. fetch/ajax), return JSON so client-side can handle navigation.
    const accept = request.headers.get("accept") || "";
    if (accept.includes("application/json")) {
      return new Response(JSON.stringify({ success: true, id: airtableResp.id, redirect: "/thanks" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // For normal form POSTs, send a 303 See Other so the browser will perform a GET to /thanks
    const thanksUrl = new URL("/thanks", request.url).toString();
    return Response.redirect(thanksUrl, 303);
  } catch (err) {
    console.error("Failed to create airtable record:", err);
    return new Response("Failed to save", { status: 500 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (url.pathname.startsWith("/api/")) {
      console.log("API", url.pathname);
      if (url.pathname === "/api/submit" || url.pathname === "/api/submit/") {
        console.log("SUBMIT");
        // IMPORTANT: return the response from submitHandler
        return await submitHandler(request, env);
      }
      else if (url.pathname === "/api/photos" || url.pathname === "/api/photos/") {
        // PUT: Store the request body in R2
        if (request.method === "PUT") {
          await env.MY_BUCKET.put(key, request.body);
          return new Response(`Put ${key} successfully!`);
        }

        // GET: Retrieve the object from R2
        const object = await env.MY_BUCKET.get(key);
        if (object === null) {
          return new Response("Object not found", { status: 404 });
        }
      }
      return new Response("Not found..?", { status: 404 });
    }

    // Otherwise, serve the static assets.
    return env.ASSETS.fetch(request);
  },
};