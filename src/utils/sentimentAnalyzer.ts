import { CitizenTicket, SentimentScore } from '../types';

/**
 * Multilingual NLP Sentiment & Frustration Analyzer for Citizen Grievances
 * Analyzes English, Tamil (தமிழ்), and Tanglish texts for urgency and frustration markers.
 */

interface TriggerRule {
  pattern: RegExp;
  category: 'frustration' | 'urgency';
  weight: number;
  label_en: string;
  label_ta: string;
}

const TRIGGER_RULES: TriggerRule[] = [
  // High distress / Health / Danger markers (Urgency)
  { pattern: /stomach illness|illness|வாந்தி|மயக்கம்|நோய்|உடல்நலம் பாதிக்க/i, category: 'urgency', weight: 28, label_en: 'Health hazard', label_ta: 'சுகாதார பாதிப்பு' },
  { pattern: /emergency|ambulance|ஆம்புலன்ஸ்|அவசர|மரண|உயிர்/i, category: 'urgency', weight: 30, label_en: 'Emergency medical risk', label_ta: 'மருத்துவ அவசரநிலை' },
  { pattern: /pregnant|பிரசவம்|கர்ப்பிணி|குழந்தை|maternal/i, category: 'urgency', weight: 26, label_en: 'Maternal/child safety', label_ta: 'தாய்-சேய் பாதுகாப்பு' },
  { pattern: /collapsed|அடித்து செல்ல|இடிந்து|washed away|landslide/i, category: 'urgency', weight: 25, label_en: 'Physical collapse', label_ta: 'கட்டமைப்பு சிதைவு' },
  { pattern: /seawater|saline|brackish|உப்பு\s*தண்ணி|உப்புநீர்|நச்சு/i, category: 'urgency', weight: 24, label_en: 'Water contamination', label_ta: 'குடிநீர் நச்சு/உப்பு' },
  { pattern: /isolated|முடங்கி|துண்டிக்கப்பட்டு|cutoff|stretcher/i, category: 'urgency', weight: 22, label_en: 'Community isolation', label_ta: 'போக்குவரத்து முடக்கம்' },
  { pattern: /burnout|fire|தீ|விபத்து|danger|அபாயம்|மின்னழுத்த/i, category: 'urgency', weight: 20, label_en: 'Electrical/Fire hazard', label_ta: 'மின்/விபத்து ஆபத்து' },

  // Prolonged neglect / Suffering / Agitation markers (Frustration)
  { pattern: /கஷ்டப்படுறோம்|struggling|suffering|துன்பம்|வேதனை/i, category: 'frustration', weight: 28, label_en: 'Citizen hardship', label_ta: 'மக்கள் துன்பம்' },
  { pattern: /weeks|மாதங்களாக|நாட்களாக|3 weeks|15 நாளா|45\+ days|months/i, category: 'frustration', weight: 26, label_en: 'Prolonged neglect', label_ta: 'நீண்டகால புறக்கணிப்பு' },
  { pattern: /non-functional|வேலை செய்யவில்லை|பழுதாகி|ruined|tripping|repeated/i, category: 'frustration', weight: 22, label_en: 'Recurring failure', label_ta: 'தொடர் பழுது' },
  { pattern: /wasting|வீணாகுது|ரூபாய்க்கு|சேறாகி|flooding/i, category: 'frustration', weight: 18, label_en: 'Resource wastage', label_ta: 'வள விரயம்' },
  { pattern: /poor people|ஏழை|கிராமத்து மக்கள்|பரிதாப/i, category: 'frustration', weight: 16, label_en: 'Vulnerable demographic', label_ta: 'விளிம்புநிலை மக்கள்' },
  { pattern: /urgent|உடனடியாக|need immediate|உடனே/i, category: 'frustration', weight: 18, label_en: 'Immediate demand', label_ta: 'உடனடி கோரிக்கை' },
];

export function analyzeTicketSentiment(text: string, severity?: string, upvotes: number = 0): SentimentScore {
  const normalized = (text || '').toLowerCase();

  let frustrationScore = 30; // baseline
  let urgencyScore = 25; // baseline
  const matchedTriggers: { en: string; ta: string }[] = [];

  // Severity baseline adjustment
  if (severity === 'critical') {
    urgencyScore += 25;
    frustrationScore += 15;
  } else if (severity === 'high') {
    urgencyScore += 15;
    frustrationScore += 10;
  }

  // Upvotes scale frustration (collective community backing)
  if (upvotes > 30) {
    frustrationScore += 12;
  } else if (upvotes > 10) {
    frustrationScore += 6;
  }

  // Evaluate keywords and emotional tokens
  TRIGGER_RULES.forEach((rule) => {
    if (rule.pattern.test(normalized)) {
      if (rule.category === 'urgency') {
        urgencyScore += rule.weight;
      } else {
        frustrationScore += rule.weight;
      }

      if (!matchedTriggers.some((t) => t.en === rule.label_en)) {
        matchedTriggers.push({ en: rule.label_en, ta: rule.label_ta });
      }
    }
  });

  // Cap scores between 0 and 100
  urgencyScore = Math.min(99, Math.max(10, Math.round(urgencyScore)));
  frustrationScore = Math.min(99, Math.max(10, Math.round(frustrationScore)));

  // Composite Sentiment Score: 55% Urgency + 45% Frustration
  const compositeScore = Math.min(99, Math.round(urgencyScore * 0.55 + frustrationScore * 0.45));

  let tone: 'critical' | 'high' | 'moderate' | 'low' = 'low';
  let label_en = 'Standard Request';
  let label_ta = 'வழக்கமான கோரிக்கை';

  if (compositeScore >= 82) {
    tone = 'critical';
    label_en = 'Critical Distress';
    label_ta = 'அதிதீவிர விரக்தி & ஆபத்து';
  } else if (compositeScore >= 68) {
    tone = 'high';
    label_en = 'High Frustration';
    label_ta = 'அதிக விரக்தி & கவலை';
  } else if (compositeScore >= 48) {
    tone = 'moderate';
    label_en = 'Moderate Concern';
    label_ta = 'மிதமான அதிருப்தி';
  } else {
    tone = 'low';
    label_en = 'Standard Need';
    label_ta = 'சாதாரண தேவை';
  }

  return {
    score: compositeScore,
    urgency_index: urgencyScore,
    frustration_index: frustrationScore,
    label_en,
    label_ta,
    tone,
    triggers: matchedTriggers.slice(0, 3).map((t) => t.en),
  };
}

export function attachSentimentToTicket(ticket: CitizenTicket): CitizenTicket {
  if (ticket.sentiment) return ticket;
  const combinedText = `${ticket.title_en} ${ticket.title_ta} ${ticket.description_en} ${ticket.description_ta} ${ticket.raw_submission || ''}`;
  const sentiment = analyzeTicketSentiment(combinedText, ticket.severity, ticket.upvotes);
  return {
    ...ticket,
    sentiment,
  };
}
