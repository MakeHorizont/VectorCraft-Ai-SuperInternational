
import { TranslationDictionary } from './types';

export const hi: TranslationDictionary = {
  header: {
    title: "VectorCraft AI",
    subtitle: "Gemini 3 Pro द्वारा संचालित",
    docs: "दस्तावेज़ीकरण",
  },
  tabs: {
    create: "उत्पत्ति (Create)",
    transform: "पुनर्निर्माण (Edit)",
  },
  hero: {
    title: "आप क्या बनाना चाहते हैं?",
    subtitle: "एक वस्तु का वर्णन करें, शैली को परिभाषित करें, और हम वेक्टर कला को इंजीनियर करेंगे।",
    titleTransform: "सुधार और एनीमेशन",
    subtitleTransform: "तर्क, शैली या गति को अपग्रेड करने के लिए मौजूदा SVG अपलोड करें।",
  },
  inputs: {
    sourceSvgLabel: "स्रोत SVG कोड / फ़ाइल",
    sourceSvgPlaceholder: "यहाँ SVG कोड चिपकाएँ या फ़ाइल अपलोड करें...",
    objectLabel: "वस्तु का विवरण",
    objectPlaceholder: "जैसे: एक भविष्यवादी हेलमेट...",
    transformLabel: "परिवर्तन के लक्ष्य",
    transformPlaceholder: "जैसे: रंगों को सोने में बदलें, रेखाएँ मोटी करें...",
    styleLabel: "दृश्य शैली",
    stylePlaceholder: "जैसे: फ्लैट डिजाइन, नियॉन...",
    techLabel: "तकनीकी और एनीमेशन",
    techPlaceholder: "जैसे: गियर को घुमाएं, होवर प्रभाव जोड़ें...",
    resolutionLabel: "कैनवास रिज़ॉल्यूशन",
    customRes: "कस्टम",
    urlsLabel: "संदर्भ URL",
    urlsPlaceholder: "https://...",
    intelligenceLabel: "बुद्धिमत्ता",
    searchLabel: "Google खोज",
    dropzoneDefault: "SVG/चित्र यहाँ छोड़ें, Ctrl+V",
    dropzoneDragging: "संलग्न करने के लिए छोड़ें",
    pasteLabel: "चिपकाएँ",
    addOptions: "उन्नत विकल्प",
    hideOptions: "विकल्प छिपाएं",
    generateButton: "उत्पन्न करें",
    transformButton: "रूपांतरित करें",
    generatingButton: "प्रक्रिया में...",
  },
  preview: {
    resultTitle: "परिणाम",
    copyTooltip: "SVG कोड कॉपी करें",
    downloadButton: "निर्यात करें",
    downloadSvg: "SVG डाउनलोड करें",
    downloadPng: "PNG डाउनलोड करें",
    downloadZip: "ZIP डाउनलोड करें (सभी)",
    generatedBy: "Gemini 3 Pro द्वारा निर्मित",
    emptyStateTitle: "इनपुट की प्रतीक्षा है",
    emptyStateDesc: "उत्पन्न कलाकृति यहां दिखाई देगी",
    emptyStateDescShort: "कलाकृति",
    bgDark: "अंधेरा",
    bgLight: "रोशनी",
    bgGrid: "ग्रिड"
  },
  history: {
    title: "उत्पादन लॉग",
    empty: "अभी तक कोई इतिहास नहीं।",
    restore: "पुनर्स्थापित",
    delete: "हटाएं",
    clearAll: "लॉग साफ़ करें"
  },
  refine: {
    label: "द्वंद्वात्मक परिष्करण (Aufhebung)",
    placeholder: "किन विरोधाभासों को हल किया जाना चाहिए?",
    button: "संश्लेषण",
    processing: "प्रसंस्करण...",
  },
  errors: {
    generationFailed: "पीढ़ी विफल",
    defaultDetails: "Gemini से संपर्क करते समय एक अप्रत्याशित त्रुटि हुई।",
  },
  suggestions: {
    camera: 'रेट्रो कैमरा',
    rocket: 'अंतरिक्ष रॉकेट',
    bird: 'ओरिगामी पक्षी',
    house: 'आइसोमेट्रिक घर'
  }
};
