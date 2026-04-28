export type LeadDeliveryResponse = {
  ok?: boolean;
  leadId?: string;
  error?: string;
};

async function readLeadDeliveryResponse(response: Response) {
  const body = await response.text();

  if (!body.trim()) {
    throw new Error("Lead delivery returned an empty response.");
  }

  try {
    return JSON.parse(body) as LeadDeliveryResponse;
  } catch {
    throw new Error("Lead delivery returned an invalid JSON response.");
  }
}

export async function deliverLead(values: Record<string, unknown>) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT;

  if (!endpoint) {
    console.info("Lead received without live Apps Script endpoint", values);
    return { ok: true } satisfies LeadDeliveryResponse;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.LEAD_FORM_SHARED_SECRET ?? "",
      ...values,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Lead delivery failed with ${response.status}`);
  }

  const result = await readLeadDeliveryResponse(response);

  if (!result.ok) {
    throw new Error(result.error || "Lead delivery was rejected.");
  }

  return result;
}
