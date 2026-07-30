"use client";

/* ============================================================================
   Mounts the right tool for a "<category>/<service>" key.

   This file is the code-splitting boundary for all 136 tools, and it has to be
   a client component to be one: next/dynamic only produces a separate browser
   chunk when the import() sits in the client graph. Called from the server page
   instead, every tool ended up in one ~500 kB chunk that each tool page had to
   download in full — the OCR engine and the PDF builders included.

   SSR stays on (the App Router default for next/dynamic), so the chosen tool is
   still rendered into the server HTML. The SEO copy and the no-JS view depend on
   that, so do not add `{ ssr: false }` here.
   ========================================================================== */

import dynamic from "next/dynamic";

const lazy = (loader) => dynamic(loader);

// key -> lazily loaded tool. Each entry becomes its own chunk.
const TOOLS = {
  // Developer tools
  "tools/json-formatter": lazy(() => import("./tools/dev").then((m) => m.JsonFormatter)),
  "tools/base64-encoder": lazy(() => import("./tools/dev").then((m) => m.Base64Tool)),
  "tools/url-encoder": lazy(() => import("./tools/dev").then((m) => m.UrlEncoder)),
  "tools/jwt-decoder": lazy(() => import("./tools/dev").then((m) => m.JwtDecoder)),
  "tools/uuid-generator": lazy(() => import("./tools/dev").then((m) => m.UuidGenerator)),
  "tools/hash-generator": lazy(() => import("./tools/dev").then((m) => m.HashGenerator)),
  "tools/password-generator": lazy(() => import("./tools/dev").then((m) => m.PasswordGenerator)),
  "tools/regex-tester": lazy(() => import("./tools/dev").then((m) => m.RegexTester)),
  "tools/markdown-previewer": lazy(() => import("./tools/dev").then((m) => m.MarkdownPreviewer)),
  "tools/color-converter": lazy(() => import("./tools/dev").then((m) => m.ColorConverter)),
  "tools/gradient-generator": lazy(() => import("./tools/moredev").then((m) => m.GradientGenerator)),
  "tools/box-shadow-generator": lazy(() => import("./tools/generators").then((m) => m.BoxShadowGenerator)),
  "tools/border-radius-generator": lazy(() => import("./tools/generators").then((m) => m.BorderRadiusGenerator)),
  "tools/qr-code-generator": lazy(() => import("./tools/dev").then((m) => m.QrCodeGenerator)),
  "tools/lorem-ipsum": lazy(() => import("./tools/dev").then((m) => m.LoremIpsum)),
  "tools/xml-formatter": lazy(() => import("./tools/moredev").then((m) => m.XmlFormatter)),
  "tools/html-formatter": lazy(() => import("./tools/moredev").then((m) => m.HtmlFormatter)),
  "tools/yaml-formatter": lazy(() => import("./tools/moredev").then((m) => m.YamlFormatter)),
  "tools/sql-formatter": lazy(() => import("./tools/moredev").then((m) => m.SqlFormatter)),
  "tools/css-minifier": lazy(() => import("./tools/moredev").then((m) => m.CssMinifier)),
  "tools/js-minifier": lazy(() => import("./tools/moredev").then((m) => m.JsMinifier)),
  "tools/csv-converter": lazy(() => import("./tools/moredev").then((m) => m.CsvConverter)),
  "tools/random-number": lazy(() => import("./tools/tools2").then((m) => m.RandomNumber)),
  "tools/dice-coin": lazy(() => import("./tools/tools2").then((m) => m.DiceCoin)),
  "tools/spin-wheel": lazy(() => import("./tools/tools2").then((m) => m.SpinWheel)),
  "tools/color-contrast": lazy(() => import("./tools/tools2").then((m) => m.ColorContrast)),
  "tools/url-shortener": lazy(() => import("./tools/urlshortener").then((m) => m.UrlShortener)),
  "tools/barcode-generator": lazy(() => import("./tools/barcode").then((m) => m.BarcodeGenerator)),
  "tools/json-to-typescript": lazy(() => import("./tools/codegen").then((m) => m.JsonToTypescript)),
  "tools/cron-expression": lazy(() => import("./tools/codegen").then((m) => m.CronExplainer)),
  "tools/html-to-markdown": lazy(() => import("./tools/codegen").then((m) => m.HtmlMarkdown)),
  "tools/password-strength": lazy(() => import("./tools/extras").then((m) => m.PasswordStrength)),
  "tools/link-in-bio": lazy(() => import("./tools/linkinbio").then((m) => m.LinkInBio)),
  // Image
  "image/image-resizer": lazy(() => import("./tools/image").then((m) => m.ImageResizer)),
  "image/image-cropper": lazy(() => import("./tools/image").then((m) => m.ImageCropper)),
  "image/image-compressor": lazy(() => import("./tools/moredev").then((m) => m.ImageCompressor)),
  "image/image-to-base64": lazy(() => import("./tools/generators").then((m) => m.ImageToBase64)),
  "image/image-to-text": lazy(() => import("./tools/ocr").then((m) => m.ImageToText)),
  "image/favicon-generator": lazy(() => import("./tools/imagetools2").then((m) => m.FaviconGenerator)),
  "image/meme-generator": lazy(() => import("./tools/imagetools2").then((m) => m.MemeGenerator)),
  "image/color-palette": lazy(() => import("./tools/imagetools2").then((m) => m.ColorPaletteFromImage)),
  "image/text-to-handwriting": lazy(() => import("./tools/imagetools2").then((m) => m.TextToHandwriting)),
  "image/placeholder-image": lazy(() => import("./tools/imagetools2").then((m) => m.PlaceholderImage)),
  "image/poster-maker": lazy(() => import("./tools/poster").then((m) => m.PosterMaker)),
  // Games
  "games/game-2048": lazy(() => import("./tools/games").then((m) => m.Game2048)),
  "games/snake": lazy(() => import("./tools/games").then((m) => m.SnakeGame)),
  "games/tic-tac-toe": lazy(() => import("./tools/games").then((m) => m.TicTacToe)),
  "games/would-you-rather": lazy(() => import("./tools/wouldyourather").then((m) => m.WouldYouRather)),
  // Files & PDF
  "files/pdf-merge": lazy(() => import("./tools/files").then((m) => m.PdfMerge)),
  "files/pdf-split": lazy(() => import("./tools/files").then((m) => m.PdfSplit)),
  "files/pdf-compress": lazy(() => import("./tools/files").then((m) => m.PdfCompress)),
  "files/images-to-pdf": lazy(() => import("./tools/files").then((m) => m.ImagesToPdf)),
  "files/pdf-esign": lazy(() => import("./tools/files").then((m) => m.PdfSign)),
  "files/image-converter": lazy(() => import("./tools/files").then((m) => m.ImageConverter)),
  "files/social-image-resizer": lazy(() => import("./tools/files").then((m) => m.SocialImageResizer)),
  "files/screen-recorder": lazy(() => import("./tools/media").then((m) => m.ScreenRecorder)),
  "files/certificate-generator": lazy(() => import("./tools/certificate").then((m) => m.CertificateGenerator)),
  // Text
  "text/word-counter": lazy(() => import("./tools/dev").then((m) => m.WordCounter)),
  "text/case-converter": lazy(() => import("./tools/dev").then((m) => m.CaseConverter)),
  "text/text-diff": lazy(() => import("./tools/text").then((m) => m.TextDiff)),
  "text/remove-duplicate-lines": lazy(() => import("./tools/text").then((m) => m.RemoveDuplicates)),
  "text/sort-lines": lazy(() => import("./tools/text").then((m) => m.SortLines)),
  "text/reverse-text": lazy(() => import("./tools/text").then((m) => m.ReverseText)),
  "text/find-replace": lazy(() => import("./tools/text").then((m) => m.FindReplace)),
  "text/text-repeater": lazy(() => import("./tools/text").then((m) => m.TextRepeater)),
  "text/text-to-speech": lazy(() => import("./tools/misc").then((m) => m.TextToSpeech)),
  "text/speech-to-text": lazy(() => import("./tools/speech").then((m) => m.SpeechToText)),
  "text/emoji-picker": lazy(() => import("./tools/extras").then((m) => m.EmojiPicker)),
  "text/prompt-optimizer": lazy(() => import("./tools/prompt").then((m) => m.PromptOptimizer)),
  "text/paraphrasing-tool": lazy(() => import("./tools/paraphrase").then((m) => m.ParaphrasingTool)),
  // Calculators
  "calculators/percentage-calculator": lazy(() => import("./tools/calculators").then((m) => m.PercentageCalculator)),
  "calculators/bmi-calculator": lazy(() => import("./tools/calculators").then((m) => m.BmiCalculator)),
  "calculators/age-calculator": lazy(() => import("./tools/calculators").then((m) => m.AgeCalculator)),
  "calculators/loan-calculator": lazy(() => import("./tools/calculators").then((m) => m.LoanCalculator)),
  "calculators/tip-calculator": lazy(() => import("./tools/calculators").then((m) => m.TipCalculator)),
  "calculators/discount-calculator": lazy(() => import("./tools/calculators").then((m) => m.DiscountCalculator)),
  "calculators/mortgage-calculator": lazy(() => import("./tools/calculators2").then((m) => m.MortgageCalculator)),
  "calculators/compound-interest": lazy(() => import("./tools/calculators2").then((m) => m.CompoundInterest)),
  "calculators/calorie-calculator": lazy(() => import("./tools/calculators2").then((m) => m.CalorieCalculator)),
  "calculators/gpa-calculator": lazy(() => import("./tools/calculators2").then((m) => m.GpaCalculator)),
  "calculators/scientific-calculator": lazy(() => import("./tools/calculators2").then((m) => m.ScientificCalculator)),
  "calculators/sip-calculator": lazy(() => import("./tools/finance").then((m) => m.SipCalculator)),
  "calculators/income-tax-calculator": lazy(() => import("./tools/finance").then((m) => m.IncomeTaxCalculator)),
  "calculators/gst-calculator": lazy(() => import("./tools/finance").then((m) => m.GstCalculator)),
  "calculators/date-calculator": lazy(() => import("./tools/finance").then((m) => m.DateCalculator)),
  // Converters
  "converters/unit-converter": lazy(() => import("./tools/converters").then((m) => m.UnitConverter)),
  "converters/number-base-converter": lazy(() => import("./tools/converters").then((m) => m.NumberBaseConverter)),
  "converters/roman-numeral-converter": lazy(() => import("./tools/converters").then((m) => m.RomanNumeralConverter)),
  "converters/timestamp-converter": lazy(() => import("./tools/converters").then((m) => m.TimestampConverter)),
  "converters/morse-code": lazy(() => import("./tools/misc").then((m) => m.MorseCode)),
  "converters/currency-converter": lazy(() => import("./tools/money").then((m) => m.CurrencyConverter)),
  // SEO
  "seo/meta-tag-generator": lazy(() => import("./tools/seo").then((m) => m.MetaTagGenerator)),
  "seo/open-graph-generator": lazy(() => import("./tools/seo").then((m) => m.OpenGraphGenerator)),
  "seo/twitter-card-generator": lazy(() => import("./tools/moreseo").then((m) => m.TwitterCardGenerator)),
  "seo/schema-generator": lazy(() => import("./tools/moreseo").then((m) => m.SchemaGenerator)),
  "seo/heading-checker": lazy(() => import("./tools/moreseo").then((m) => m.HeadingChecker)),
  "seo/sitemap-generator": lazy(() => import("./tools/moreseo").then((m) => m.SitemapGenerator)),
  "seo/robots-txt-generator": lazy(() => import("./tools/seo").then((m) => m.RobotsTxtGenerator)),
  "seo/slug-generator": lazy(() => import("./tools/seo").then((m) => m.SlugGenerator)),
  "seo/keyword-density": lazy(() => import("./tools/media").then((m) => m.KeywordDensity)),
  // Productivity
  "productivity/notes": lazy(() => import("./tools/productivity").then((m) => m.Notes)),
  "productivity/todo": lazy(() => import("./tools/productivity").then((m) => m.TodoList)),
  "productivity/kanban": lazy(() => import("./tools/productivity").then((m) => m.Kanban)),
  "productivity/pomodoro": lazy(() => import("./tools/productivity").then((m) => m.Pomodoro)),
  "productivity/habit-tracker": lazy(() => import("./tools/productivity").then((m) => m.HabitTracker)),
  "productivity/goal-tracker": lazy(() => import("./tools/productivity").then((m) => m.GoalTracker)),
  "productivity/expense-tracker": lazy(() => import("./tools/productivity").then((m) => m.ExpenseTracker)),
  "productivity/bookmark-manager": lazy(() => import("./tools/productivity").then((m) => m.BookmarkManager)),
  "productivity/stopwatch": lazy(() => import("./tools/productivity2").then((m) => m.Stopwatch)),
  "productivity/countdown": lazy(() => import("./tools/productivity2").then((m) => m.CountdownDate)),
  "productivity/typing-test": lazy(() => import("./tools/productivity2").then((m) => m.TypingTest)),
  "productivity/survey-maker": lazy(() => import("./tools/survey").then((m) => m.SurveyMaker)),
  "productivity/meeting-scheduler": lazy(() => import("./tools/scheduler").then((m) => m.MeetingScheduler)),
  "productivity/presentation-maker": lazy(() => import("./tools/slides").then((m) => m.PresentationMaker)),
  "productivity/flashcard-maker": lazy(() => import("./tools/quiz").then((m) => m.QuizMaker)),
  // Career
  "career/resume-builder": lazy(() => import("./tools/career").then((m) => m.ResumeBuilder)),
  "career/resume-template-builder": lazy(() => import("./tools/resumeTemplates").then((m) => m.ResumeTemplateBuilder)),
  "career/cover-letter": lazy(() => import("./tools/career").then((m) => m.CoverLetterBuilder)),
  "career/salary-calculator": lazy(() => import("./tools/career").then((m) => m.SalaryCalculator)),
  // Freelance
  "freelance/invoice-generator": lazy(() => import("./tools/freelance").then((m) => m.InvoiceGenerator)),
  "freelance/time-tracker": lazy(() => import("./tools/freelance").then((m) => m.TimeTracker)),
  // Social Media
  "social/video-downloader": lazy(() => import("./tools/socialdownload").then((m) => m.SocialMediaDownloader)),
  "social/hashtag-generator": lazy(() => import("./tools/social").then((m) => m.HashtagGenerator)),
  "social/fancy-text-generator": lazy(() => import("./tools/social").then((m) => m.FancyText)),
  "social/youtube-thumbnail": lazy(() => import("./tools/social").then((m) => m.YoutubeThumbnail)),
  "social/youtube-embed": lazy(() => import("./tools/social").then((m) => m.YoutubeEmbed)),
  "social/social-character-counter": lazy(() => import("./tools/social").then((m) => m.SocialCharacterCounter)),
  "social/utm-builder": lazy(() => import("./tools/social").then((m) => m.UtmBuilder)),
  "social/wedding-hashtag-generator": lazy(() => import("./tools/wedding").then((m) => m.WeddingHashtag)),
  // AI Tools (free, no API key)
  "ai/ai-assistant": lazy(() => import("./tools/assistant").then((m) => m.AiAssistant)),
  "ai/ai-cover-letter": lazy(() => import("./tools/aitools").then((m) => m.AiCoverLetter)),
  "ai/resume-bullet-generator": lazy(() => import("./tools/aitools").then((m) => m.ResumeBulletGenerator)),
  "ai/ai-email-writer": lazy(() => import("./tools/aitools").then((m) => m.AiEmailWriter)),
  "ai/business-name-generator": lazy(() => import("./tools/aitools").then((m) => m.BusinessNameGenerator)),
  "ai/slogan-generator": lazy(() => import("./tools/aitools").then((m) => m.SloganGenerator)),
  "ai/ai-image-prompt": lazy(() => import("./tools/imageprompt").then((m) => m.AiImagePrompt)),
};

export default function ToolMount({ toolKey }) {
  const Tool = TOOLS[toolKey];
  return Tool ? <Tool /> : null;
}
