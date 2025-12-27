import { BUSINESS_PROFILE } from "./business";

type AgentContext = {
  now: Date;
};

const lowercaseIncludes = (source: string, ...needles: string[]) => {
  const haystack = source.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
};

const formatProductList = () =>
  BUSINESS_PROFILE.coreProducts
    .map(
      (item) =>
        `• ${item.name}: ${item.summary} — ${item.price}`,
    )
    .join("\n");

const formatBundles = () =>
  BUSINESS_PROFILE.bundles
    .map((bundle) => `• ${bundle.name}: ${bundle.price} — ${bundle.details}`)
    .join("\n");

const formatDelivery = () =>
  BUSINESS_PROFILE.delivery.map((line) => `• ${line}`).join("\n");

const formatFaqs = () =>
  BUSINESS_PROFILE.faqs
    .map((item) => `• ${item.question} — ${item.answer}`)
    .join("\n");

export const generateAgentReply = (
  rawMessage: string,
  context: AgentContext,
) => {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();
  const dayName = context.now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (!message) {
    return {
      title: "Need a bit more info",
      body:
        "Could you share a quick question? বলুন কীভাবে সাহায্য করতে পারি.",
    };
  }

  if (lowercaseIncludes(lower, "hello", "hi", "hey", "গুড মর্নিং")) {
    return {
      title: "বিনীত শুভেচ্ছা!",
      body: `Hello! আমি LuminaTech Solutions-এর স্মার্ট এজেন্ট। বলুন তো, আজ ${dayName} কী লক্ষ্য নিয়ে এসেছেন?`,
    };
  }

  if (
    lowercaseIncludes(lower, "price", "pricing", "cost", "fee", "money") ||
    lowercaseIncludes(lower, "plan", "package", "bundle")
  ) {
    return {
      title: "Our plans & bundles",
      body: `আমাদের জনপ্রিয় প্যাকেজগুলো নিচে দিলাম:\n${formatProductList()}\n\nBundles:\n${formatBundles()}\n\nWant a 14-day trial? বললে সাথে সাথে বুক করে দেবো.`,
    };
  }

  if (
    lowercaseIncludes(lower, "trial", "demo", "try", "sample", "test") ||
    lowercaseIncludes(lower, "start", "onboard", "setup")
  ) {
    return {
      title: "Fast onboarding",
      body:
        "We activate নতুন workspace within 2 business days. আপনি চাইলে today-ই একটি guided 14-day trial শুরু করতে পারি, অথবা Zoom demo বুক করবেন?",
    };
  }

  if (
    lowercaseIncludes(
      lower,
      "support",
      "help",
      "customer care",
      "service",
      "issue",
      "problem",
      "জরুরি",
    )
  ) {
    return {
      title: "Support that stays close",
      body: `Our support টিম online 9am-8pm BST (Sat-Thu) এবং জরুরি সাপোর্ট ২৪/৭. Direct help দরকার হলে please mail ${BUSINESS_PROFILE.contact.email} বা call ${BUSINESS_PROFILE.contact.phone}. বলুন, আমি তো আছি পাশে.`,
    };
  }

  if (
    lowercaseIncludes(lower, "deliver", "deployment", "availability", "how long")
  ) {
    return {
      title: "Deployment details",
      body: `সবকিছু ক্লাউডে ready. Activation 2 business days, onboarding manager data migrate করে দেয়. Delivery highlights:\n${formatDelivery()}`,
    };
  }

  if (
    lowercaseIncludes(
      lower,
      "integration",
      "api",
      "zapier",
      "whatsapp",
      "connect",
    )
  ) {
    return {
      title: "Integrations & workflow",
      body:
        "We connect with Zapier, native WhatsApp inbox, Slack, এবং open API. আপনার যে টুল integrate করতে চান বললেই গাইড দেবো.",
    };
  }

  if (
    lowercaseIncludes(lower, "faq", "questions") ||
    lowercaseIncludes(lower, "common", "info")
  ) {
    return {
      title: "Quick answers",
      body: `Top প্রশ্নগুলোর উত্তর দিলাম:\n${formatFaqs()}\n\nআর কিছু জানতে চান?`,
    };
  }

  if (lowercaseIncludes(lower, "thanks", "thank you", "ধন্যবাদ")) {
    return {
      title: "Always here",
      body:
        "ধন্যবাদ! আরো কিছু লাগলে বলুন, আমার সঙ্গে আপনি সবসময় চ্যাট করতে পারেন অথবা support টিমে হ্যান্ডওভার করব।",
    };
  }

  if (
    lowercaseIncludes(lower, "human", "agent", "representative") ||
    lowercaseIncludes(lower, "contact", "phone", "email")
  ) {
    return {
      title: "Human support",
      body: `নিশ্চিতভাবে। আপনি সরাসরি আমাদের success টিমকে call করতে পারেন ${BUSINESS_PROFILE.contact.phone} নম্বরে বা mail ${BUSINESS_PROFILE.contact.email}. আমি meantime-এও আপনাকে রাস্তা দেখাতে পারি।`,
    };
  }

  return {
    title: "Let’s figure it out",
    body:
      "এটা নিয়ে নিশ্চিত নই right now, কিন্তু human advisor আপনাকে দ্রুত সাহায্য করবে। দয়া করে support@luminatech.team-এ mail করুন অথবা আমাকে একটু context দিন।",
  };
};
