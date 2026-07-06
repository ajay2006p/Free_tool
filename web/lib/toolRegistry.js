// Maps "<category>/<service>" -> the working tool component.
import {
  JsonFormatter, Base64Tool, UrlEncoder, JwtDecoder, UuidGenerator,
  HashGenerator, PasswordGenerator, LoremIpsum, CaseConverter, WordCounter,
  ColorConverter, RegexTester, MarkdownPreviewer, QrCodeGenerator,
} from "../components/tools/dev";
import {
  XmlFormatter, HtmlFormatter, YamlFormatter, SqlFormatter, CssMinifier,
  JsMinifier, CsvConverter, GradientGenerator, ImageCompressor,
} from "../components/tools/moredev";
import { BoxShadowGenerator, BorderRadiusGenerator, ImageToBase64 } from "../components/tools/generators";
import { MetaTagGenerator, OpenGraphGenerator, RobotsTxtGenerator, SlugGenerator } from "../components/tools/seo";
import { TwitterCardGenerator, SchemaGenerator, HeadingChecker, SitemapGenerator } from "../components/tools/moreseo";
import { TextDiff, RemoveDuplicates, SortLines, ReverseText, FindReplace, TextRepeater } from "../components/tools/text";
import { PercentageCalculator, BmiCalculator, AgeCalculator, LoanCalculator, TipCalculator, DiscountCalculator } from "../components/tools/calculators";
import { UnitConverter, NumberBaseConverter, RomanNumeralConverter, TimestampConverter } from "../components/tools/converters";
import { Notes, TodoList, Kanban, Pomodoro, HabitTracker, GoalTracker, ExpenseTracker, BookmarkManager } from "../components/tools/productivity";
import { SalaryCalculator, CoverLetterBuilder, ResumeBuilder } from "../components/tools/career";
import { InvoiceGenerator, TimeTracker } from "../components/tools/freelance";
import { HashtagGenerator, FancyText, YoutubeThumbnail, YoutubeEmbed, SocialCharacterCounter, UtmBuilder } from "../components/tools/social";
import { Game2048, SnakeGame, TicTacToe } from "../components/tools/games";
import { MortgageCalculator, CompoundInterest, CalorieCalculator, GpaCalculator, ScientificCalculator } from "../components/tools/calculators2";
import { RandomNumber, DiceCoin, SpinWheel, ColorContrast } from "../components/tools/tools2";
import { Stopwatch, CountdownDate, TypingTest } from "../components/tools/productivity2";
import { TextToSpeech, MorseCode } from "../components/tools/misc";
import { ImageResizer, ImageCropper } from "../components/tools/image";
import { PromptOptimizer } from "../components/tools/prompt";
import { PdfMerge, PdfSplit, PdfCompress, ImagesToPdf, PdfSign, ImageConverter, SocialImageResizer } from "../components/tools/files";
import { ScreenRecorder, KeywordDensity } from "../components/tools/media";
import { SipCalculator, IncomeTaxCalculator, GstCalculator, DateCalculator } from "../components/tools/finance";
import { UrlShortener } from "../components/tools/urlshortener";
import { SocialMediaDownloader } from "../components/tools/socialdownload";

export const toolRegistry = {
  // Developer tools
  "tools/json-formatter": JsonFormatter,
  "tools/base64-encoder": Base64Tool,
  "tools/url-encoder": UrlEncoder,
  "tools/jwt-decoder": JwtDecoder,
  "tools/uuid-generator": UuidGenerator,
  "tools/hash-generator": HashGenerator,
  "tools/password-generator": PasswordGenerator,
  "tools/regex-tester": RegexTester,
  "tools/markdown-previewer": MarkdownPreviewer,
  "tools/color-converter": ColorConverter,
  "tools/gradient-generator": GradientGenerator,
  "tools/box-shadow-generator": BoxShadowGenerator,
  "tools/border-radius-generator": BorderRadiusGenerator,
  "tools/qr-code-generator": QrCodeGenerator,
  "tools/lorem-ipsum": LoremIpsum,
  "tools/xml-formatter": XmlFormatter,
  "tools/html-formatter": HtmlFormatter,
  "tools/yaml-formatter": YamlFormatter,
  "tools/sql-formatter": SqlFormatter,
  "tools/css-minifier": CssMinifier,
  "tools/js-minifier": JsMinifier,
  "tools/csv-converter": CsvConverter,
  "tools/random-number": RandomNumber,
  "tools/dice-coin": DiceCoin,
  "tools/spin-wheel": SpinWheel,
  "tools/color-contrast": ColorContrast,
  "tools/url-shortener": UrlShortener,
  // Image
  "image/image-resizer": ImageResizer,
  "image/image-cropper": ImageCropper,
  "image/image-compressor": ImageCompressor,
  "image/image-to-base64": ImageToBase64,
  // Games
  "games/game-2048": Game2048,
  "games/snake": SnakeGame,
  "games/tic-tac-toe": TicTacToe,
  // Files & PDF
  "files/pdf-merge": PdfMerge,
  "files/pdf-split": PdfSplit,
  "files/pdf-compress": PdfCompress,
  "files/images-to-pdf": ImagesToPdf,
  "files/pdf-esign": PdfSign,
  "files/image-converter": ImageConverter,
  "files/social-image-resizer": SocialImageResizer,
  "files/screen-recorder": ScreenRecorder,
  // Text
  "text/word-counter": WordCounter,
  "text/case-converter": CaseConverter,
  "text/text-diff": TextDiff,
  "text/remove-duplicate-lines": RemoveDuplicates,
  "text/sort-lines": SortLines,
  "text/reverse-text": ReverseText,
  "text/find-replace": FindReplace,
  "text/text-repeater": TextRepeater,
  "text/text-to-speech": TextToSpeech,
  "text/prompt-optimizer": PromptOptimizer,
  // Calculators
  "calculators/percentage-calculator": PercentageCalculator,
  "calculators/bmi-calculator": BmiCalculator,
  "calculators/age-calculator": AgeCalculator,
  "calculators/loan-calculator": LoanCalculator,
  "calculators/tip-calculator": TipCalculator,
  "calculators/discount-calculator": DiscountCalculator,
  "calculators/mortgage-calculator": MortgageCalculator,
  "calculators/compound-interest": CompoundInterest,
  "calculators/calorie-calculator": CalorieCalculator,
  "calculators/gpa-calculator": GpaCalculator,
  "calculators/scientific-calculator": ScientificCalculator,
  "calculators/sip-calculator": SipCalculator,
  "calculators/income-tax-calculator": IncomeTaxCalculator,
  "calculators/gst-calculator": GstCalculator,
  "calculators/date-calculator": DateCalculator,
  // Converters
  "converters/unit-converter": UnitConverter,
  "converters/number-base-converter": NumberBaseConverter,
  "converters/roman-numeral-converter": RomanNumeralConverter,
  "converters/timestamp-converter": TimestampConverter,
  "converters/morse-code": MorseCode,
  // SEO
  "seo/meta-tag-generator": MetaTagGenerator,
  "seo/open-graph-generator": OpenGraphGenerator,
  "seo/twitter-card-generator": TwitterCardGenerator,
  "seo/schema-generator": SchemaGenerator,
  "seo/heading-checker": HeadingChecker,
  "seo/sitemap-generator": SitemapGenerator,
  "seo/robots-txt-generator": RobotsTxtGenerator,
  "seo/slug-generator": SlugGenerator,
  "seo/keyword-density": KeywordDensity,
  // Productivity
  "productivity/notes": Notes,
  "productivity/todo": TodoList,
  "productivity/kanban": Kanban,
  "productivity/pomodoro": Pomodoro,
  "productivity/habit-tracker": HabitTracker,
  "productivity/goal-tracker": GoalTracker,
  "productivity/expense-tracker": ExpenseTracker,
  "productivity/bookmark-manager": BookmarkManager,
  "productivity/stopwatch": Stopwatch,
  "productivity/countdown": CountdownDate,
  "productivity/typing-test": TypingTest,
  // Career
  "career/resume-builder": ResumeBuilder,
  "career/cover-letter": CoverLetterBuilder,
  "career/salary-calculator": SalaryCalculator,
  // Freelance
  "freelance/invoice-generator": InvoiceGenerator,
  "freelance/time-tracker": TimeTracker,
  // Social Media
  "social/video-downloader": SocialMediaDownloader,
  "social/hashtag-generator": HashtagGenerator,
  "social/fancy-text-generator": FancyText,
  "social/youtube-thumbnail": YoutubeThumbnail,
  "social/youtube-embed": YoutubeEmbed,
  "social/social-character-counter": SocialCharacterCounter,
  "social/utm-builder": UtmBuilder,
};

export function getTool(categorySlug, serviceSlug) {
  return toolRegistry[`${categorySlug}/${serviceSlug}`] || null;
}
