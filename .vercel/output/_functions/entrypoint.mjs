import './chunks/virtual_Bl55Um6Y.mjs';
import * as z from 'zod';
import OpenAI from 'openai';
import { c as createInvalidVariablesError, g as getEnv$1, s as setOnSetGetEnv } from './chunks/runtime_B644WxQS.mjs';
import { d as defineAction } from './chunks/server_DGQFajdd.mjs';
import { A as ActionError } from './chunks/astro-designed-error-pages_CjwL0e34.mjs';

const schema = {"SECRET_OPENAI":{"context":"server","access":"secret","type":"string"},"PUBLIC_GOOGLE_PROFILE":{"context":"client","access":"public","type":"string"}};

function getEnvFieldType(options) {
  const optional = options.optional ? options.default !== void 0 ? false : true : false;
  let type;
  if (options.type === "enum") {
    type = options.values.map((v) => `'${v}'`).join(" | ");
  } else {
    type = options.type;
  }
  return `${type}${optional ? " | undefined" : ""}`;
}
const stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
  if (typeof input !== "string") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (max !== void 0 && !(input.length <= max)) {
    errors.push("max");
  }
  if (min !== void 0 && !(input.length >= min)) {
    errors.push("min");
  }
  if (length !== void 0 && !(input.length === length)) {
    errors.push("length");
  }
  if (url !== void 0 && !URL.canParse(input)) {
    errors.push("url");
  }
  if (includes !== void 0 && !input.includes(includes)) {
    errors.push("includes");
  }
  if (startsWith !== void 0 && !input.startsWith(startsWith)) {
    errors.push("startsWith");
  }
  if (endsWith !== void 0 && !input.endsWith(endsWith)) {
    errors.push("endsWith");
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: input
  };
};
const numberValidator = ({ gt, min, lt, max, int }) => (input) => {
  const num = parseFloat(input ?? "");
  if (isNaN(num)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (gt !== void 0 && !(num > gt)) {
    errors.push("gt");
  }
  if (min !== void 0 && !(num >= min)) {
    errors.push("min");
  }
  if (lt !== void 0 && !(num < lt)) {
    errors.push("lt");
  }
  if (max !== void 0 && !(num <= max)) {
    errors.push("max");
  }
  if (int !== void 0) {
    const isInt = Number.isInteger(num);
    if (!(int ? isInt : !isInt)) {
      errors.push("int");
    }
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: num
  };
};
const booleanValidator = (input) => {
  const bool = input === "true" ? true : input === "false" ? false : void 0;
  if (typeof bool !== "boolean") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: bool
  };
};
const enumValidator = ({ values }) => (input) => {
  if (!(typeof input === "string" ? values.includes(input) : false)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: input
  };
};
function selectValidator(options) {
  switch (options.type) {
    case "string":
      return stringValidator(options);
    case "number":
      return numberValidator(options);
    case "boolean":
      return booleanValidator;
    case "enum":
      return enumValidator(options);
  }
}
function validateEnvVariable(value, options) {
  const isOptional = options.optional || options.default !== void 0;
  if (isOptional && value === void 0) {
    return {
      ok: true,
      value: options.default
    };
  }
  if (!isOptional && value === void 0) {
    return {
      ok: false,
      errors: ["missing"]
    };
  }
  return selectValidator(options)(value);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-check

// @ts-expect-error
/** @returns {string} */
// used while generating the virtual module
// biome-ignore lint/correctness/noUnusedFunctionParameters: `key` is used by the generated code
const getEnv = (key) => {
	return getEnv$1(key);
};

const _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === '' ? undefined : rawVariable;
	const options = schema[key];

	const result = validateEnvVariable(variable, options);
	if (result.ok) {
		return result.value;
	}
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};

setOnSetGetEnv(() => {
	SECRET_OPENAI = _internalGetSecret("SECRET_OPENAI");

});
let SECRET_OPENAI = _internalGetSecret("SECRET_OPENAI");

let openaiClient = null;
function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: SECRET_OPENAI });
  }
  return openaiClient;
}
const TOPIC_LABELS = {
  website: "Website",
  beratung: "Beratung",
  webapp: "Web-App",
  optimierung: "Website-Optimierung",
  entwicklung: "Entwicklung"
};
function handleOpenAIError(error) {
  if (error instanceof OpenAI.APIError) {
    switch (error.status) {
      case 401:
        throw new Error(
          "API-Konfigurationsfehler. Bitte kontaktiere den Administrator."
        );
      case 429:
        throw new Error(
          "Der Service ist momentan überlastet. Bitte versuche es in ein paar Minuten erneut."
        );
      case 500:
      case 502:
      case 503:
        throw new Error(
          "Der KI-Service ist vorübergehend nicht verfügbar. Bitte versuche es später erneut."
        );
      default:
        throw new Error(
          "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut."
        );
    }
  }
  throw new Error("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
}
async function generateReviewText({
  topics,
  hint
}) {
  const client = getOpenAIClient();
  const model = "gpt-4o-mini";
  const variationNonce = crypto.randomUUID().slice(0, 8);
  const topicList = topics.map((t) => TOPIC_LABELS[t]).join(", ");
  const systemPrompt = `Du bist ein Assistent, der authentische, individuelle Google-Bewertungen für "App bis Web" (ein Webentwicklungs-Unternehmen) auf Deutsch schreibt.

WICHTIGE REGELN:
- Schreibe im lockeren Du-Ton, als wäre der Kunde ein zufriedener Nutzer
- MAXIMAL 500 Zeichen (inkl. Leerzeichen) - das ist kritisch!
- 1-3 natürliche Sätze
- KEINE Emojis
- KEINE generischen Floskeln wie "sehr zu empfehlen" oder "top Service"
- KEINE erfundenen harten Fakten (keine konkreten Preise, Zeiten, Namen)
- Variiere Satzstruktur und Perspektive stark
- Die genannten Themen müssen erkennbar einfließen
- Klingt wie eine echte Person, nicht wie Marketing-Copy
- Variation-ID für diesen Text: ${variationNonce} (nutze diese zur internen Variation, erwähne sie nicht)`;
  const userPrompt = `Schreibe eine Google-Bewertung für "App bis Web" zu folgenden Themen: ${topicList}${hint ? `

Zusätzlicher Kontext vom Kunden: ${hint}` : ""}

Denk daran: max. 500 Zeichen, authentisch, variiert, Du-Ton.`;
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.9
      // Higher for more variation
    });
    let reviewText = response.choices[0]?.message?.content?.trim() || "";
    if (reviewText.length > 500) {
      const retryResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
          { role: "assistant", content: reviewText },
          {
            role: "user",
            content: "Der Text ist zu lang. Bitte kürze ihn auf maximal 450 Zeichen, ohne den Kern zu verlieren."
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      reviewText = retryResponse.choices[0]?.message?.content?.trim() || reviewText.slice(0, 500);
    }
    return reviewText;
  } catch (error) {
    handleOpenAIError(error);
  }
}

const rateLimitStore = /* @__PURE__ */ new Map();
const WINDOW_MS = 60 * 60 * 1e3;
const MAX_REQUESTS = 5;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1e3);
function checkRateLimit(identifier) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  if (!entry || entry.resetAt < now) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: new Date(resetAt)
    };
  }
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt)
    };
  }
  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: new Date(entry.resetAt)
  };
}

const topicEnum = z.enum([
  "website",
  "beratung",
  "webapp",
  "optimierung",
  "entwicklung"
]);
const server = {
  generateReview: defineAction({
    input: z.object({
      topics: z.array(topicEnum).min(1, "Bitte wähle mindestens ein Thema aus"),
      hint: z.string().max(80, "Das Stichwort darf maximal 80 Zeichen haben").optional()
    }),
    handler: async (input, context) => {
      const clientIP = context.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || context.request.headers.get("x-real-ip") || "unknown";
      const rateLimit = checkRateLimit(clientIP);
      if (!rateLimit.allowed) {
        const minutesLeft = Math.ceil(
          (rateLimit.resetAt.getTime() - Date.now()) / 6e4
        );
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: `Du hast das Limit erreicht. Bitte warte noch ${minutesLeft} Minuten.`
        });
      }
      const reviewText = await generateReviewText({
        topics: input.topics,
        hint: input.hint
      });
      return {
        reviewText,
        remaining: rateLimit.remaining
      };
    }
  })
};

export { server };
