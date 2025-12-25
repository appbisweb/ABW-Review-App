import { e as createComponent, k as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_DuGK6xcE.mjs';
import 'piccolore';
/* empty css                                 */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { a as actions } from '../chunks/virtual_Bl55Um6Y.mjs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as LabelPrimitive from '@radix-ui/react-label';
export { renderers } from '../renderers.mjs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}

function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}

function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}

const TOPICS = [
  { id: "website", label: "Website" },
  { id: "beratung", label: "Beratung" },
  { id: "webapp", label: "Web-App" },
  { id: "optimierung", label: "Website-Optimierung" },
  { id: "entwicklung", label: "Entwicklung" }
];
function ReviewForm({ googleReviewUrl }) {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [hint, setHint] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const toggleTopic = (topicId) => {
    setSelectedTopics(
      (prev) => prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    );
  };
  const handleGenerate = async () => {
    if (selectedTopics.length === 0) {
      setError("Bitte wähle mindestens ein Thema aus");
      return;
    }
    setIsLoading(true);
    setError(null);
    const { data, error: actionError } = await actions.generateReview({
      topics: selectedTopics,
      hint: hint.trim() || void 0
    });
    setIsLoading(false);
    if (actionError) {
      setError(actionError.message || "Fehler beim Generieren");
      return;
    }
    if (data?.reviewText) {
      setReviewText(data.reviewText);
    }
  };
  const handleCopy = async () => {
    if (!reviewText) return;
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = reviewText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const openGoogleReview = () => {
    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
  };
  const charCount = reviewText.length;
  const isOverLimit = charCount > 500;
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto shadow-lg", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold tracking-tight", children: "Bewertung für App bis Web" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-base", children: "Wähle die Themen aus, zu denen du uns bewerten möchtest. Wir erstellen dir einen Textvorschlag, den du anpassen kannst." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Themen auswählen" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: TOPICS.map((topic) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: "flex items-center gap-3 p-3 rounded-lg border border-input bg-background hover:bg-accent/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5",
            children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: selectedTopics.includes(topic.id),
                  onCheckedChange: () => toggleTopic(topic.id)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: topic.label })
            ]
          },
          topic.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "hint", className: "text-sm font-medium", children: [
          "Stichwort",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-normal", children: "(optional, max. 80 Zeichen)" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "hint",
            type: "text",
            value: hint,
            onChange: (e) => setHint(e.target.value),
            maxLength: 80,
            placeholder: "z.B. schnelle Umsetzung, gute Kommunikation...",
            className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleGenerate,
          disabled: isLoading || selectedTopics.length === 0,
          className: "w-full h-11 text-base font-semibold",
          children: isLoading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  className: "opacity-25",
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "currentColor",
                  strokeWidth: "4",
                  fill: "none"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  className: "opacity-75",
                  fill: "currentColor",
                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                }
              )
            ] }),
            "Text wird erstellt..."
          ] }) : "Text vorschlagen"
        }
      ),
      error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm", children: error }),
      reviewText && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "review", className: "text-sm font-medium", children: "Dein Bewertungstext" }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: `text-xs font-mono ${isOverLimit ? "text-destructive font-bold" : "text-muted-foreground"}`,
              children: [
                charCount,
                " / 500"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "review",
            value: reviewText,
            onChange: (e) => setReviewText(e.target.value),
            rows: 5,
            className: "resize-none text-base leading-relaxed",
            placeholder: "Hier erscheint dein generierter Text..."
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              onClick: handleCopy,
              className: "flex-1 h-11",
              children: copied ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-4 w-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7"
                      }
                    )
                  }
                ),
                "Kopiert!"
              ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-4 w-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      }
                    )
                  }
                ),
                "Kopieren"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              onClick: openGoogleReview,
              className: "flex-1 h-11",
              children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    children: [
                      /* @__PURE__ */ jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
                      /* @__PURE__ */ jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
                    ]
                  }
                ),
                "Bei Google bewerten"
              ] })
            }
          )
        ] })
      ] })
    ] })
  ] });
}

const PUBLIC_GOOGLE_PROFILE = "https://www.google.com/search?sca_esv=78f855ae0023c887&rlz=1C5CHFA_enDE951DE951&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E7ecam66QvVoUpPNbt7tCsBwfz-LhgUKhA7r7ue1kl3MdLphZoD7c_QAdCe2TljcNHaRBOBNtxyKGVTKHBoUhMX0DXBUnDKtfXG-Sirok8QE0fPZUHGZEpmJbKiOXXAZ19zw6cv6WlCA-VFKXm7DNWQDXyG5&q=App+bis+Web+-+ultra+schnelle+Websites+%26+Web-Apps+Rezensionen&sa=X&ved=2ahUKEwj3gfzduNiRAxUA2QIHHU3kAP0Q0bkNegQIORAE&biw=1512&bih=805&dpr=2";

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="de"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Bewerte App bis Web - Dein Partner für Webentwicklung, Web-Apps und Website-Optimierung"><meta name="robots" content="noindex, nofollow"><title>Bewertung abgeben | App bis Web</title>${renderHead()}</head> <body class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30"> <!-- Subtle pattern overlay --> <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Qzk0OTQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyek0zNiAxNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" aria-hidden="true"></div> <main class="relative min-h-screen flex flex-col items-center justify-center px-4 py-12"> <!-- Header --> <header class="text-center mb-8 space-y-2"> <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4"> <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
Schnell & Einfach
</div> <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">
App bis Web
</h1> <p class="text-muted-foreground max-w-md mx-auto">
Hilf uns mit deiner Bewertung. Wir erstellen dir einen passenden Text, 
          den du noch anpassen kannst.
</p> </header> <!-- Form Component --> ${renderComponent($$result, "ReviewForm", ReviewForm, { "client:load": true, "googleReviewUrl": PUBLIC_GOOGLE_PROFILE, "client:component-hydration": "load", "client:component-path": "@/components/ReviewForm", "client:component-export": "ReviewForm" })} <!-- Footer --> <footer class="mt-12 text-center text-xs text-muted-foreground/60 space-y-1"> <p>Der generierte Text ist ein Vorschlag. Du kannst ihn frei anpassen.</p> <p class="flex items-center justify-center gap-1">
Made with
<svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path> </svg>
by App bis Web
</p> </footer> </main> </body></html>`;
}, "/Users/janluther/Google Drive/ABW-Review-App/src/pages/index.astro", void 0);

const $$file = "/Users/janluther/Google Drive/ABW-Review-App/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
