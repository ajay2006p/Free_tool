/* ============================================================================
   Hand-written content for the tools that previously fell back to the generic
   generator in toolContent.js.

   The generator produced three paragraphs and three FAQs per page with the tool
   name substituted in. Across 87 pages that reads as one page repeated 87 times
   — which is what search engines and ad reviewers mean by "low value content",
   and it is worth less than having no copy at all.

   Everything below is written for its specific tool. Each entry aims to explain
   something a user actually needs to know: the failure mode people hit, the
   distinction they get wrong, or the reason the tool behaves as it does. If a
   paragraph would read equally well on a different tool's page, it does not
   belong here.

   Merged into OVERRIDES by toolContent.js, so adding an entry here also flips
   the page to indexable via hasRichContent().
   ========================================================================== */

export const EXTRA_OVERRIDES = {
  // ---- Developer Tools ------------------------------------------------------

  "url-encoder": {
    title: "URL Encoder & Decoder — Percent-Encoding Online",
    description:
      "Percent-encode or decode URLs and query strings instantly. Handles UTF-8, reserved characters and the space-versus-plus difference. Free, runs in your browser.",
    intro: [
      "URL encoding — properly called percent-encoding — replaces characters that would otherwise break a URL with a percent sign and their hexadecimal byte value. A space becomes %20, a question mark %3F, an ampersand %26. Paste a URL or a query-string value here and convert it in either direction.",
      "The characters that matter are the reserved ones: ? & = # / and space. If a value inside a query parameter contains an unencoded ampersand, everything after it is parsed as a new parameter, and your value is silently truncated. The same applies to a # — anything following it is treated as a fragment and never reaches the server at all. This is the single most common cause of a URL that works in testing and fails with real data.",
      "There are two encoding conventions and they are not interchangeable. In a query string, a space may be encoded as either %20 or +, because the form-encoding standard defines + as a space. In a path segment, + is a literal plus sign and only %20 means a space. Encoding a path with form rules produces a URL that resolves to the wrong resource, which is why this tool distinguishes between the two.",
    ],
    howto: [
      "Paste the URL or the individual parameter value into the input box.",
      "Choose encode or decode.",
      "Copy the result — encode a full URL to make it safe to share, or a single value before inserting it into a query string.",
    ],
    faqs: [
      {
        q: "Should a space be %20 or a plus sign?",
        a: "In a query string both are accepted, because the form-encoding standard defines + as a space. In a URL path only %20 is a space — a + there is a literal plus character. When in doubt use %20, which is correct in both positions.",
      },
      {
        q: "Why did my URL break when the value contained an ampersand?",
        a: "Because an unencoded & starts a new query parameter. Everything after it is parsed as a separate key-value pair, so your value is cut short. Encode the value as %26 before inserting it and the whole string survives intact.",
      },
      {
        q: "Do I encode the whole URL or just part of it?",
        a: "Just the parts that contain user data — individual parameter values or path segments. Encoding an entire URL turns its own :// and ? into percent codes, producing a string that is no longer a URL at all.",
      },
      {
        q: "How are non-English characters handled?",
        a: "They are encoded as UTF-8 bytes, so each character becomes one or more percent codes. The é in café becomes %C3%A9 — two bytes, two codes. Decoding reverses it exactly, so accented and non-Latin text round-trips without loss.",
      },
    ],
  },

  "jwt-decoder": {
    title: "JWT Decoder — Inspect Token Header & Payload",
    description:
      "Decode a JSON Web Token to read its header, payload claims and expiry. Runs entirely in your browser, so tokens are never transmitted. Free, no signup.",
    intro: [
      "A JSON Web Token is three base64url-encoded sections joined by dots: a header describing the signing algorithm, a payload carrying the claims, and a signature. Paste a token here to read the first two in plain JSON.",
      "The most important thing to understand about JWTs is that the payload is encoded, not encrypted. Anyone holding the token can read every claim in it — no key required, which is exactly what this tool demonstrates. That makes JWTs unsuitable for carrying anything confidential. A user id or a role is fine; an email address is a judgement call; a password or an internal secret never is.",
      "The claims worth checking first when debugging are the timestamps. exp is expiry and iat is issued-at, both as Unix seconds rather than milliseconds. An expired token is by far the most common cause of an authentication failure that appeared to work moments earlier. Also check iss and aud — a token issued by the right service but intended for a different audience will be rejected by a correctly configured verifier.",
      "This tool decodes; it does not verify. Verification requires the signing secret or public key, and pasting a signing secret into any web page would be a serious mistake. A decoded token tells you what it claims to be, never whether that claim is authentic — that check belongs on your server.",
    ],
    howto: [
      "Paste the full token, including both dots and all three sections.",
      "Read the decoded header and payload as formatted JSON.",
      "Check exp against the current time to confirm whether the token is still valid.",
    ],
    faqs: [
      {
        q: "Does this verify the token signature?",
        a: "No, and no browser tool safely can. Verification needs the signing secret or public key, which should never be pasted into a web page. This decodes the header and payload so you can inspect claims and expiry. Signature verification belongs in your backend.",
      },
      {
        q: "Is it safe to paste a real token here?",
        a: "Decoding happens entirely in your browser and the token is never transmitted. That said, a valid token is a live credential — treat it as you would a password, and prefer expired or test tokens when you have the choice.",
      },
      {
        q: "Why can anyone read my JWT payload?",
        a: "Because JWTs are signed, not encrypted. The signature proves the contents were not altered; it does not hide them. Base64url is an encoding, not a cipher. Never put anything confidential in a JWT payload.",
      },
      {
        q: "My token looks valid but is rejected — why?",
        a: "Check exp first, since expiry is the usual cause. After that, confirm iss and aud match what the verifying service expects, and check for clock skew between servers — a token issued seconds in the future by a fast clock will fail an iat check.",
      },
    ],
  },

  "uuid-generator": {
    title: "UUID Generator — Bulk v4 UUIDs, Free Online",
    description:
      "Generate cryptographically random version 4 UUIDs singly or in bulk. Uses the browser's Web Crypto API, so every identifier is created on your own device.",
    intro: [
      "A UUID is a 128-bit identifier written as 32 hexadecimal digits in five hyphen-separated groups. This generator produces version 4 UUIDs, the variant whose bits are random rather than derived from a timestamp or hardware address, and it can produce them in bulk for seeding a database or building test fixtures.",
      "The appeal of UUIDs is that they can be generated independently anywhere — on a client, on several servers, offline — without coordination, and still not collide. Version 4 has 122 random bits. The collision probability is small enough that you would need to generate billions of UUIDs before it became worth thinking about, which is why distributed systems rely on them where a database's auto-incrementing integer cannot work.",
      "Randomness quality is the part that matters and is easy to get wrong. These are generated with the Web Crypto API, the browser's cryptographically secure random source. Many naive implementations use Math.random(), which is not cryptographically secure and can produce predictable sequences — fine for a shuffle, genuinely dangerous for anything acting as an unguessable identifier such as a password-reset token or a share link.",
      "One practical caution before using UUIDs as primary keys: they are random, so inserting them into a clustered index writes to scattered points in the index rather than appending at the end. On large tables this causes page splits and measurably slower inserts. Many teams use a UUID as a public-facing identifier alongside an internal sequential key.",
    ],
    howto: [
      "Choose how many UUIDs you need.",
      "They are generated instantly using your browser's cryptographic random source.",
      "Copy one or the whole list to your clipboard.",
    ],
    faqs: [
      {
        q: "What does version 4 mean?",
        a: "It is the variant whose bits are randomly generated, as opposed to version 1 which embeds a timestamp and MAC address. Version 4 leaks no information about when or where it was created, which is why it is the usual default.",
      },
      {
        q: "Could two UUIDs ever be the same?",
        a: "In principle yes, in practice no. Version 4 has 122 random bits, so you would need to generate on the order of a billion UUIDs per second for decades before a collision became probable. It is not a risk worth engineering around.",
      },
      {
        q: "Are these random enough for security tokens?",
        a: "They come from the Web Crypto API, the same cryptographically secure source used for real key generation — not Math.random(). That makes them suitable for unguessable identifiers. For actual secrets such as session tokens, prefer a dedicated token generator with a documented length.",
      },
      {
        q: "Should I use a UUID as a database primary key?",
        a: "It depends on the table. UUIDs distribute randomly across a clustered index, which causes page splits and slower inserts at scale. A common pattern is an internal auto-incrementing key for storage plus a UUID as the public identifier, which avoids exposing row counts.",
      },
    ],
  },

  "markdown-previewer": {
    title: "Markdown Previewer — Live HTML Preview Online",
    description:
      "Write Markdown and see the rendered HTML update live beside it. Supports headings, lists, tables, code blocks and links. Free and runs in your browser.",
    intro: [
      "Write Markdown on one side and watch the rendered result on the other. Useful for drafting a README, checking that a table's pipes line up, or confirming a nested list indents the way you intended before committing it.",
      "Markdown's most common frustration is that indentation is significant in ways that are easy to miss. A nested list item needs consistent indentation relative to its parent — usually two or four spaces — and mixing tabs with spaces produces output that looks right in the source and collapses in the render. Code blocks have the same sensitivity: an indented fence inside a list item behaves differently from one at the left margin.",
      "The other thing worth knowing is that Markdown is not one specification. Original Markdown, CommonMark and GitHub Flavored Markdown differ in real ways — tables, strikethrough, task lists and automatic URL linking are GFM extensions absent from the original. This preview follows the common conventions, so a document that renders here will generally render on GitHub, but a platform using a stricter parser may not support every extension.",
    ],
    howto: [
      "Type or paste Markdown into the editor.",
      "The rendered HTML updates live beside it as you type.",
      "Adjust the source until the preview matches what you intended, then copy it out.",
    ],
    faqs: [
      {
        q: "Which flavour of Markdown does this support?",
        a: "The common conventions, close to GitHub Flavored Markdown — headings, emphasis, lists, links, images, tables, fenced code blocks and blockquotes. Documents that render correctly here generally render correctly on GitHub.",
      },
      {
        q: "Why is my nested list not indenting?",
        a: "Almost always inconsistent indentation, or tabs mixed with spaces. Nested items need consistent whitespace relative to the parent item — pick two or four spaces and use it throughout. Tabs and spaces look identical in an editor and parse differently.",
      },
      {
        q: "Can I use raw HTML inside Markdown?",
        a: "Markdown permits inline HTML and most parsers pass it through, which is useful for things Markdown cannot express. Many platforms sanitise or strip it when rendering user content, so it may not survive everywhere.",
      },
      {
        q: "Is my document uploaded?",
        a: "No. Parsing and rendering both happen in your browser, so unpublished drafts and internal documentation stay on your device.",
      },
    ],
  },

  "color-converter": {
    title: "Color Converter — HEX, RGB and HSL with Preview",
    description:
      "Convert colours between HEX, RGB and HSL with a live preview swatch. Understand which format to use where. Free, instant and runs in your browser.",
    intro: [
      "Convert a colour between HEX, RGB and HSL and see it previewed as you go. Enter any of the three formats and the others update to match.",
      "The three notations describe the same colours in different ways, and each is convenient for something different. HEX is compact and the default in design handoffs. RGB is the same information in decimal, and its rgba() form is the usual way to add transparency. HSL is the one worth learning, because it is the only one you can reason about: hue is a position on the colour wheel in degrees, saturation is intensity, lightness is how close to white or black it sits.",
      "That makes HSL far better for building a palette. Producing a darker shade of a brand colour in HEX means guessing at digits and checking the result; in HSL you keep the hue and saturation and lower the lightness, which gives a genuinely related shade rather than an approximation. A full set of tints and shades comes from moving one number.",
      "One conversion detail worth expecting: HEX and RGB map to each other exactly, since both describe 8 bits per channel. HSL involves floating-point arithmetic, so a round trip can shift a channel by one unit. That difference is invisible on screen but will show up if you compare strings.",
    ],
    howto: [
      "Enter a colour in HEX, RGB or HSL.",
      "The other two formats update instantly, with a live preview swatch.",
      "Copy whichever notation your stylesheet or design tool needs.",
    ],
    faqs: [
      {
        q: "Which format should I use in CSS?",
        a: "Any of them work. HEX is most common for solid colours, rgba() is convenient for transparency, and HSL is best when you are generating variations — changing lightness while holding hue and saturation produces a properly related shade.",
      },
      {
        q: "What does the fourth value in rgba() or a 8-digit HEX mean?",
        a: "Alpha, meaning opacity — 0 is fully transparent and 1 fully opaque in rgba(), or 00 to FF in an 8-digit HEX. It affects only that colour, unlike the CSS opacity property which also fades every child element.",
      },
      {
        q: "Why did my colour change slightly after converting to HSL and back?",
        a: "HSL conversion uses floating-point maths, so rounding can shift a channel by one unit. The difference is imperceptible on screen but visible if you compare the hex strings. Keep your source values in one format if exact equality matters.",
      },
      {
        q: "What makes HSL easier to work with?",
        a: "Its numbers correspond to things you can picture. Hue is an angle on the colour wheel, saturation is intensity and lightness is closeness to white or black. Adjusting a colour is a deliberate change to one of those, rather than guessing at hex digits.",
      },
    ],
  },

  "gradient-generator": {
    title: "CSS Gradient Generator — Build and Copy Gradients",
    description:
      "Build linear and radial CSS gradients visually, adjust colour stops and angles, and copy production-ready CSS. Free, instant and runs in your browser.",
    intro: [
      "Build a CSS gradient by adjusting colours, stop positions and angle, then copy the finished declaration. The preview updates live, which is considerably faster than editing values in a stylesheet and reloading.",
      "Gradient angles in CSS are less intuitive than they look. 0deg points upward and angles increase clockwise, so 90deg runs left to right and 180deg runs top to bottom. This differs from the mathematical convention where 0 points right and angles increase anticlockwise, which is why a gradient often appears rotated a quarter turn from what you expected.",
      "The most common quality problem with gradients is a muddy grey band through the middle, and it has a specific cause. Browsers interpolate between colours in sRGB, so blending two saturated complementary colours passes through a desaturated midpoint — blue to yellow goes through grey rather than through green. The practical fix is to add an intermediate colour stop that keeps saturation up through the transition, or to choose endpoint colours closer together on the colour wheel.",
      "For subtle background gradients, keep the endpoints close in hue and vary lightness instead. A gradient between two lightness values of the same hue reads as depth; one between two distant hues reads as decoration and dates quickly.",
    ],
    howto: [
      "Pick your start and end colours, and add intermediate stops if you want them.",
      "Choose linear or radial and set the angle or shape.",
      "Copy the generated CSS straight into your stylesheet.",
    ],
    faqs: [
      {
        q: "Why does my gradient look rotated?",
        a: "CSS gradient angles start with 0deg pointing up and increase clockwise, unlike the mathematical convention. 90deg is left to right, 180deg is top to bottom. If a gradient is a quarter turn off, this is why.",
      },
      {
        q: "Why is there a grey band in the middle of my gradient?",
        a: "Browsers interpolate in sRGB, so blending two saturated complementary colours passes through a desaturated midpoint. Add an intermediate stop that keeps saturation high through the transition, or pick endpoints closer together on the colour wheel.",
      },
      {
        q: "What is the difference between linear and radial?",
        a: "A linear gradient blends along a straight line at the angle you set. A radial gradient blends outward from a point in a circle or ellipse. Linear suits backgrounds and buttons; radial suits spotlight and glow effects.",
      },
      {
        q: "Do gradients work in all browsers?",
        a: "Yes. Unprefixed linear-gradient and radial-gradient have been supported in every current browser for many years. Vendor prefixes are no longer needed unless you are supporting genuinely ancient versions.",
      },
    ],
  },

  "box-shadow-generator": {
    title: "Box Shadow Generator — Visual CSS Shadow Builder",
    description:
      "Build CSS box-shadows visually with offset, blur, spread and colour controls, then copy the CSS. Supports inset and layered shadows. Free, in-browser.",
    intro: [
      "Adjust offset, blur, spread and colour with live preview, then copy the resulting box-shadow declaration. Faster than guessing at four numbers and reloading a page to check.",
      "The four values do distinct things and spread is the one most often misunderstood. Horizontal and vertical offsets move the shadow. Blur softens its edge. Spread grows or shrinks the shadow before blurring is applied — a negative spread pulls it in, which is how you get a tight shadow that does not leak out from the sides of an element.",
      "Realistic shadows follow how light actually behaves. Light usually comes from above, so a small positive vertical offset with no horizontal offset looks natural, while a shadow offset sideways reads as artificial unless the whole design implies a light source there. Larger blur with lower opacity suggests an object further from its surface; a tight, darker shadow suggests it is close to it.",
      "The single biggest improvement to most shadows is layering two or three instead of using one. A real shadow is darker and tighter near the object and lighter and more diffuse further out, which one shadow cannot express. Two comma-separated shadows — one small and slightly darker, one large and very faint — look dramatically better than a single heavy one, and this is what most design systems do.",
    ],
    howto: [
      "Set the horizontal and vertical offsets to place the shadow.",
      "Adjust blur and spread until the softness looks right, then set colour and opacity.",
      "Toggle inset for an inner shadow, and copy the generated CSS.",
    ],
    faqs: [
      {
        q: "What does spread actually do?",
        a: "It grows or shrinks the shadow before the blur is applied. A positive spread makes it larger than the element, a negative spread smaller. Negative spread is useful for a tight shadow that does not leak out at the sides.",
      },
      {
        q: "How do I make a shadow look realistic?",
        a: "Layer two or three rather than using one. A real shadow is darker and tighter near the object and fainter further out. One small, slightly darker shadow plus one large, very faint one looks far better than a single heavy shadow.",
      },
      {
        q: "What is an inset shadow for?",
        a: "It draws the shadow inside the element instead of outside, making it appear recessed. It is the usual way to make an input field or a pressed button look inset into the surface.",
      },
      {
        q: "Do box-shadows hurt performance?",
        a: "A static shadow is cheap. Animating blur or spread is expensive, because the browser must repaint every frame. If you need a shadow to animate, transition opacity on a second layered shadow instead — that composites on the GPU.",
      },
    ],
  },

  "border-radius-generator": {
    title: "Border Radius Generator — Round Corners Visually",
    description:
      "Set each corner's radius visually and copy the CSS, including elliptical corners and the squircle-style slash syntax. Free and runs in your browser.",
    intro: [
      "Drag each corner to the radius you want and copy the resulting border-radius declaration, including the shorthand for setting all four corners at once.",
      "The property accepts one to four values and the order is clockwise from the top left: top-left, top-right, bottom-right, bottom-left. Two values set the diagonal pairs. The slash syntax is the one people rarely learn — values before the slash are horizontal radii and after it vertical, which produces elliptical rather than circular corners and is how organic blob shapes are made in pure CSS.",
      "For a perfect circle from a square element, set the radius to 50%. Percentages resolve against the element's own dimensions, so 50% on a non-square element produces an ellipse rather than a circle, which is usually what you want for a pill-shaped button — though a very large pixel value such as 9999px is the more reliable way to get a pill, since it caps at half the height regardless of width.",
      "One detail that catches people out: when adjacent radii together exceed the length of a side, the browser scales all radii down proportionally to fit. That is why setting a very large radius on a short element produces something smaller than the number you typed, rather than a broken shape.",
    ],
    howto: [
      "Adjust each corner individually, or set one value for all four.",
      "Switch on the elliptical option if you want different horizontal and vertical radii.",
      "Copy the generated CSS.",
    ],
    faqs: [
      {
        q: "What order do the four values go in?",
        a: "Clockwise from the top left: top-left, top-right, bottom-right, bottom-left. With two values, the first sets the top-left and bottom-right pair and the second the other diagonal.",
      },
      {
        q: "How do I make a perfect circle?",
        a: "Set border-radius to 50% on a square element. On a non-square element 50% gives an ellipse, because percentages resolve against each dimension separately.",
      },
      {
        q: "What does the slash in border-radius mean?",
        a: "It separates horizontal from vertical radii — values before the slash are horizontal, after it vertical. Different values produce elliptical corners, which is how organic blob shapes are built in pure CSS.",
      },
      {
        q: "Why is my radius smaller than the value I set?",
        a: "When adjacent radii together exceed the length of a side, the browser scales all of them down proportionally so the shape stays valid. A large radius on a short element is capped at half its height.",
      },
    ],
  },

  "lorem-ipsum": {
    title: "Lorem Ipsum Generator — Placeholder Text, Free",
    description:
      "Generate lorem ipsum placeholder text by paragraphs, sentences or words. Free, instant and runs entirely in your browser with no signup.",
    intro: [
      "Generate as much or as little placeholder text as a layout needs, by paragraph, sentence or word count.",
      "Lorem ipsum is scrambled Latin taken from Cicero's De Finibus Bonorum et Malorum, written in 45 BC. Typesetters have used it since the sixteenth century for one specific reason: it has the letter distribution and word-length rhythm of real prose without being readable. That matters because readable placeholder text pulls attention to itself — anyone reviewing a design starts editing the copy instead of assessing the layout.",
      "The professional caution is worth stating plainly. Lorem ipsum is for testing typography and spacing, not for validating a design. Real content is never as even: headlines run two lines longer than expected, product names are inconveniently long, some fields are empty and some overflow. A layout that only ever holds lorem ipsum tends to break the day real copy arrives. Use it to check leading and measure, then replace it with realistic content — including the awkward edge cases — before signing anything off.",
      "One practical habit: never ship it. Lorem ipsum reaching production is common enough to be a running joke, and it is trivially findable in a site search. Search your codebase for 'lorem' before any release.",
    ],
    howto: [
      "Choose paragraphs, sentences or words, and how many you want.",
      "The text is generated instantly.",
      "Copy it into your mockup or template.",
    ],
    faqs: [
      {
        q: "Where does lorem ipsum come from?",
        a: "From Cicero's De Finibus Bonorum et Malorum, written in 45 BC, scrambled by typesetters from the sixteenth century onward. It reads as prose-shaped text without being readable, which keeps attention on the layout.",
      },
      {
        q: "Why not use real text as placeholder?",
        a: "Because readable text distracts reviewers, who start editing the copy instead of evaluating the design. That said, test with realistic content before shipping — real copy is uneven in ways lorem ipsum never is, and that is where layouts break.",
      },
      {
        q: "Does lorem ipsum mean anything?",
        a: "Not as presented. The source is real Latin about pleasure and pain, but the words have been scrambled and altered for centuries, so the placeholder version is deliberately meaningless.",
      },
      {
        q: "Will it hurt my SEO if it reaches production?",
        a: "Yes, and it is a bad look besides. A page of meaningless Latin is thin content with no value to anyone, and it is trivially findable. Search your codebase for 'lorem' before every release.",
      },
    ],
  },

  "xml-formatter": {
    title: "XML Formatter — Pretty-Print and Validate XML",
    description:
      "Indent and pretty-print XML with proper nesting, and catch structural errors as you go. Free, instant and runs entirely in your browser.",
    intro: [
      "Paste minified or badly indented XML and get it back properly nested, with each level indented so the structure is readable. Malformed markup is flagged rather than silently mangled.",
      "XML is stricter than HTML in ways that cause most of the errors people hit. Every element must be explicitly closed — there is no equivalent of an unclosed <li>. Tag names are case-sensitive, so <Item> and <item> are different elements. Attribute values must always be quoted. And there must be exactly one root element containing everything else; two top-level siblings make a document that no parser will accept.",
      "The five reserved characters are the other frequent source of breakage: < > & ' and \". An ampersand inside text content must be written &amp; even in a URL, which is why a query string pasted directly into an XML element so often produces a parse error. Content that genuinely needs raw characters belongs in a CDATA section.",
      "If you are working with RSS feeds, sitemaps, SOAP payloads or Android layouts, all of these rules apply — those are all XML, and a sitemap rejected by Search Console is very often an unescaped ampersand in a URL.",
    ],
    howto: [
      "Paste your XML into the box.",
      "It is parsed, validated and re-indented automatically.",
      "Copy the formatted result, or fix any structural error that is reported.",
    ],
    faqs: [
      {
        q: "Why does my XML fail to parse?",
        a: "The usual causes are an unescaped ampersand in text or a URL, an unclosed tag, mismatched case between opening and closing tags, an unquoted attribute value, or more than one root element. XML is far stricter than HTML about all five.",
      },
      {
        q: "Which characters have to be escaped?",
        a: "Five: & becomes &amp;, < becomes &lt;, > becomes &gt;, \" becomes &quot; and ' becomes &apos;. The ampersand is the one that catches people, because URLs in feeds and sitemaps are full of them.",
      },
      {
        q: "What is a CDATA section for?",
        a: "It marks a block whose content should not be parsed as markup, so raw < and & characters are allowed. It is the usual way to embed HTML inside an RSS description without escaping every character.",
      },
      {
        q: "Can I format an RSS feed or sitemap with this?",
        a: "Yes — both are XML and follow the same rules. It is a quick way to check why a sitemap was rejected, which is very often an unescaped ampersand inside a URL.",
      },
    ],
  },

  "html-formatter": {
    title: "HTML Formatter — Indent and Tidy HTML Online",
    description:
      "Clean up messy or minified HTML with consistent indentation and readable nesting. Free, instant and runs entirely in your browser.",
    intro: [
      "Paste minified, exported or badly indented HTML and get it back with consistent indentation, so the nesting structure is visible at a glance.",
      "This is most useful on HTML you did not write: markup exported from a page builder, copied out of devtools, or pasted from an email template where everything sits on one line. Reading that structure without indentation is genuinely difficult, and an unclosed div is nearly impossible to spot until the document is formatted.",
      "Formatting reveals structural problems but does not fix them. Browsers are extremely forgiving of broken HTML — they silently insert missing closing tags and reparent misplaced elements — which is why a page can render acceptably while its markup is invalid. Once indented, an element that closes at the wrong level or a table cell outside a row becomes obvious.",
      "A note on whitespace: HTML collapses runs of whitespace, so indentation is safe almost everywhere. The exceptions are <pre> and <textarea>, where whitespace is significant and reformatting changes what the user sees. Inline elements are also whitespace-sensitive at their boundaries — adding a line break between two <span>s introduces a rendered space that was not there before.",
    ],
    howto: [
      "Paste your HTML into the box.",
      "It is re-indented with consistent nesting automatically.",
      "Copy the tidied markup, or use the visible structure to find an unclosed tag.",
    ],
    faqs: [
      {
        q: "Does formatting fix broken HTML?",
        a: "No — it makes problems visible rather than repairing them. Once indented, an unclosed div or a misplaced element is obvious, but you still need to correct it yourself.",
      },
      {
        q: "Will re-indenting change how my page renders?",
        a: "Almost never, since HTML collapses runs of whitespace. The exceptions are <pre> and <textarea>, where whitespace is preserved, and the boundaries between inline elements, where a new line break introduces a rendered space.",
      },
      {
        q: "Why does my page render fine if the HTML is invalid?",
        a: "Browsers recover aggressively from malformed markup, inserting missing tags and moving misplaced elements. It usually works, but the result can differ between browsers and often breaks scripts and styles that expect the structure you intended.",
      },
      {
        q: "Can I format an email template?",
        a: "Yes, and email HTML is exactly where this helps most, since those templates are typically deeply nested tables exported as a single line. Keep the formatted version for editing and minify before sending, as some clients are sensitive to overall size.",
      },
    ],
  },

  "yaml-formatter": {
    title: "YAML Formatter — Clean and Validate YAML Online",
    description:
      "Normalise YAML indentation and catch syntax errors before they break a pipeline. Free, instant and runs entirely in your browser.",
    intro: [
      "Paste YAML and get back consistently indented, normalised output, with syntax errors reported rather than silently accepted.",
      "YAML uses indentation to express structure, which makes it readable and makes it fragile. Tabs are not permitted for indentation at all — the specification forbids them — and a single tab that a previous editor inserted will fail to parse with a message that rarely points at the real problem. Inconsistent indentation between sibling keys does the same. These two account for most YAML errors people encounter in CI pipelines and Kubernetes manifests.",
      "The other classic trap is implicit typing. Unquoted yes, no, on, off and true are all parsed as booleans, so a country code of NO becomes false. A version number like 1.20 becomes the number 1.2, losing the trailing zero. A MAC address or a time like 22:30 can be read as a sexagesimal number. The fix is always the same: quote any value whose exact string form matters.",
      "This is worth checking before committing anything that a pipeline will consume. A YAML error in a CI configuration or a Kubernetes manifest usually surfaces as a failed run several minutes later, with an error message describing where the parser gave up rather than where the mistake actually is.",
    ],
    howto: [
      "Paste your YAML into the box.",
      "It is parsed, checked and re-indented consistently.",
      "Copy the normalised result, or correct any error that is reported.",
    ],
    faqs: [
      {
        q: "Why does my YAML fail with an indentation error?",
        a: "Most often a tab character. YAML forbids tabs for indentation entirely, and one inserted by an editor is invisible. Inconsistent indentation between sibling keys causes the same failure. Configure your editor to insert spaces in .yml and .yaml files.",
      },
      {
        q: "Why did my value NO turn into false?",
        a: "YAML's implicit typing reads unquoted yes, no, on, off, true and false as booleans, so the country code NO becomes false. Quote any value whose string form matters — \"NO\" stays a string.",
      },
      {
        q: "Why did my version number 1.20 become 1.2?",
        a: "Because unquoted it is parsed as a number, and trailing zeros are not significant in numbers. Quote it as \"1.20\" to keep the exact string.",
      },
      {
        q: "What is the difference between YAML and JSON here?",
        a: "YAML is a superset of JSON, so valid JSON is valid YAML. YAML adds indentation-based structure, comments and multi-line strings, which is why it is preferred for configuration that humans edit.",
      },
    ],
  },

  "sql-formatter": {
    title: "SQL Formatter — Beautify and Indent SQL Queries",
    description:
      "Format messy SQL into readable, consistently indented queries with clear clause structure. Free, instant and runs entirely in your browser.",
    intro: [
      "Paste a query that arrived as one long line — from a log, an ORM's debug output or a colleague's message — and get it back with each clause on its own line and joins and conditions indented sensibly.",
      "This matters most for the queries that are hard to read precisely when you most need to read them. A five-table join with several conditions and a subquery is nearly impossible to reason about unformatted, and that is usually the query you are looking at because it is slow or returning the wrong rows.",
      "Formatting frequently exposes a specific class of bug: a join condition that ended up in the WHERE clause instead of the ON clause. Both often return the same rows for inner joins, so the mistake is invisible — until someone changes it to a LEFT JOIN, at which point the WHERE condition silently filters out exactly the unmatched rows the left join was added to keep. Laid out clearly, the misplaced condition is easy to see.",
      "Formatting is cosmetic and changes nothing about execution: SQL ignores whitespace, so the query plan is identical before and after. If a query is slow, read the execution plan rather than reformatting it — though a formatted query is considerably easier to read the plan against.",
    ],
    howto: [
      "Paste your SQL query into the box.",
      "Clauses are placed on their own lines with consistent indentation.",
      "Copy the formatted query back into your editor or documentation.",
    ],
    faqs: [
      {
        q: "Does formatting change how the query runs?",
        a: "No. SQL ignores whitespace, so the parsed statement and the execution plan are identical. Formatting only affects readability.",
      },
      {
        q: "Will it work with my database's dialect?",
        a: "Standard SELECT, INSERT, UPDATE, DELETE and JOIN syntax formats correctly across MySQL, PostgreSQL, SQL Server, SQLite and Oracle. Vendor-specific extensions and procedural blocks may format less cleanly, since they are not part of standard SQL.",
      },
      {
        q: "Should a join condition go in ON or WHERE?",
        a: "In ON. For inner joins both usually return identical rows, which hides the mistake — but with a LEFT JOIN a condition in WHERE filters out the unmatched rows the left join was meant to preserve, quietly converting it into an inner join.",
      },
      {
        q: "Is my query sent to a server?",
        a: "No. Formatting happens entirely in your browser, so queries containing table names, schema details or embedded values stay on your device.",
      },
    ],
  },

  "css-minifier": {
    title: "CSS Minifier — Compress CSS for Production",
    description:
      "Strip comments and whitespace from CSS to reduce file size for production. Free, instant and runs entirely in your browser.",
    intro: [
      "Remove comments, redundant whitespace and unnecessary semicolons from a stylesheet to reduce the number of bytes shipped to a browser.",
      "The saving is real but usually smaller than expected once compression is accounted for. Minification typically removes 15-30% of a stylesheet's raw size, but servers already gzip or brotli CSS in transit, and those algorithms are very effective on the repetitive whitespace minification strips. On an already-compressed response, minification often adds only a few percent more. It is worth doing — it costs nothing — but it is not where a slow page is losing its time.",
      "The larger win in CSS is almost always removing rules nobody uses. Most sites ship stylesheets where a substantial fraction of the rules match no element on any page, usually inherited from a framework or a previous design. Minifying dead CSS makes dead CSS smaller. Removing it makes the file smaller and the browser's style calculation faster.",
      "Keep your source readable and minify as a build step. Editing minified CSS directly is miserable and the mistakes are hard to spot, which is exactly why the practice is to minify on the way out rather than to work in minified files.",
    ],
    howto: [
      "Paste your CSS into the box.",
      "Comments and unnecessary whitespace are stripped automatically.",
      "Copy the minified output into your production build.",
    ],
    faqs: [
      {
        q: "How much smaller will my CSS get?",
        a: "Typically 15-30% of raw size, depending on how heavily commented and formatted the source is. After gzip or brotli — which your server almost certainly applies — the additional saving is usually only a few percent, since compression already handles repetitive whitespace well.",
      },
      {
        q: "Will minifying break my styles?",
        a: "It should not. Only comments and whitespace that CSS ignores are removed. The one thing to watch is a CSS hack that deliberately relies on unusual whitespace or malformed syntax to target an old browser — those can be affected.",
      },
      {
        q: "Should I minify by hand or in my build?",
        a: "In your build. Keep the source readable and minify on the way out. Editing minified CSS directly is error-prone and unnecessary.",
      },
      {
        q: "What helps more than minifying?",
        a: "Removing rules nothing uses. Most stylesheets carry a large fraction of dead rules inherited from frameworks or old designs. That reduces both the file size and the browser's style-matching work, which minification cannot touch.",
      },
    ],
  },

  "js-minifier": {
    title: "JavaScript Minifier — Compress JS Files Online",
    description:
      "Strip comments and whitespace from JavaScript to reduce bundle size. Free, instant and runs entirely in your browser with no upload.",
    intro: [
      "Remove comments and unnecessary whitespace from JavaScript to reduce the bytes a browser has to download.",
      "JavaScript size matters more than CSS size, and for a reason worth understanding. A stylesheet is parsed and applied; a script must be downloaded, parsed, compiled and executed, and all of that happens on the main thread. On a mid-range phone, parse and compile time for a large bundle is frequently a bigger cost than the download itself. Reducing bytes reduces every stage.",
      "This tool performs safe minification — stripping comments and whitespace. Production build tools go considerably further: renaming local variables to single letters, eliminating unreachable code, and tree-shaking unused exports out of the bundle entirely. Those transformations need full scope analysis to stay correct, which is why they belong in a build pipeline rather than a paste box.",
      "Two practical cautions. First, minified code is unreadable in a stack trace, so generate source maps in your build if you want usable production errors. Second, if a minified script behaves differently from the original, the usual cause is code relying on something minification does not preserve — most often reading a function's .name, or depending on automatic semicolon insertion where a missing semicolon was doing real work.",
    ],
    howto: [
      "Paste your JavaScript into the box.",
      "Comments and unnecessary whitespace are removed automatically.",
      "Copy the minified output for production use.",
    ],
    faqs: [
      {
        q: "Does this rename variables like a build tool?",
        a: "No. It performs safe minification — comments and whitespace only. Variable renaming and dead-code elimination require full scope analysis to remain correct, which is a job for a build-step minifier such as esbuild, terser or SWC.",
      },
      {
        q: "Why does minified JavaScript matter more than minified CSS?",
        a: "Because scripts must be parsed, compiled and executed on the main thread, not just downloaded. On mid-range phones that processing often costs more than the download. Fewer bytes reduces every stage of the cost.",
      },
      {
        q: "My code broke after minifying — why?",
        a: "Usually a dependency on something minification does not preserve. Reading a function's .name breaks if names change. Code relying on automatic semicolon insertion can change meaning when lines are joined. Adding explicit semicolons resolves most such cases.",
      },
      {
        q: "Is my code uploaded anywhere?",
        a: "No. Minification runs entirely in your browser, so proprietary or unreleased source stays on your device.",
      },
    ],
  },

  "csv-converter": {
    title: "CSV to JSON Converter — Both Directions, Free",
    description:
      "Convert CSV to JSON and JSON back to CSV, with correct handling of quoted fields and embedded commas. Free and runs in your browser.",
    intro: [
      "Convert a CSV export into a JSON array of objects, or flatten JSON back into CSV rows. The first CSV row is treated as the header and becomes the object keys.",
      "CSV looks trivially simple and is not, because the delimiter can appear inside the data. A field containing a comma must be wrapped in double quotes, and a field containing a double quote escapes it by doubling it. This is why naively splitting a CSV line on commas breaks the moment a real address or a product description arrives — the classic bug in hand-rolled CSV parsing.",
      "Line endings are the other recurring problem. CSV files exported on Windows end lines with a carriage return and line feed, while Unix tools use a line feed alone. A parser that only handles one leaves a stray carriage return on the end of every final field, producing values that look correct and never match a comparison. Excel also frequently writes a UTF-8 byte order mark at the start of the file, which turns the first column's header into something with an invisible prefix.",
      "Converting the other way, remember that JSON is hierarchical and CSV is flat. Nested objects and arrays have no natural CSV representation, so they must be flattened into dotted column names or serialised into a single cell. Any conversion of deeply nested JSON to CSV involves a decision about which of those to do.",
    ],
    howto: [
      "Paste your CSV or JSON into the input box.",
      "Choose the direction you want to convert.",
      "Copy the converted result — CSV headers become JSON keys and vice versa.",
    ],
    faqs: [
      {
        q: "How are commas inside a field handled?",
        a: "A field containing a comma must be wrapped in double quotes, and the parser respects that. A double quote inside a quoted field is escaped by doubling it. This is why splitting a CSV line on commas is unreliable — quoted fields have to be parsed properly.",
      },
      {
        q: "Why do my values have a stray character at the end?",
        a: "Almost certainly a carriage return from a Windows-style line ending, or a UTF-8 byte order mark that Excel wrote at the start of the file. Both are invisible and both break exact comparisons.",
      },
      {
        q: "What happens to nested JSON when converting to CSV?",
        a: "CSV is flat and has no way to express nesting, so nested objects must either be flattened into dotted column names or serialised into a single cell. Deeply nested structures do not round-trip cleanly.",
      },
      {
        q: "Is the first row treated as a header?",
        a: "Yes. Converting CSV to JSON uses the first row as the object keys. Going the other way, the object keys become the header row.",
      },
    ],
  },

  "random-number": {
    title: "Random Number Generator — Any Range, Free Online",
    description:
      "Generate random numbers in any range, singly or in bulk, with optional unique-only results. Free and runs entirely in your browser.",
    intro: [
      "Pick a minimum and maximum and generate one number or many. Useful for draws, sampling, assigning turns, or seeding test data.",
      "The range here is inclusive at both ends, which is worth stating because it is a genuine source of confusion. Asking for 1 to 10 can return both 1 and 10. Many programming functions are exclusive of the upper bound — JavaScript's Math.random() scaled to 10 never returns 10 — and the mismatch is a classic off-by-one bug.",
      "For a draw or anything where a repeat would be unfair, use the unique option. Without it each number is drawn independently, so duplicates are not just possible but expected: drawing ten numbers from 1 to 10 independently will almost never produce all ten. That is correct behaviour for dice and wrong behaviour for a raffle, and the distinction catches people out.",
      "On fairness: results come from your browser's random source, which is uniformly distributed — every value in the range is equally likely. Human intuition disagrees with what that looks like. Genuine randomness produces clusters and short runs, and a sequence with no repeats at all would actually be evidence against randomness rather than for it.",
    ],
    howto: [
      "Set the minimum and maximum for your range.",
      "Choose how many numbers you want, and whether they must be unique.",
      "Generate and copy the result.",
    ],
    faqs: [
      {
        q: "Are the minimum and maximum included?",
        a: "Yes, the range is inclusive at both ends — 1 to 10 can return 1 and can return 10. This differs from many programming functions, which exclude the upper bound.",
      },
      {
        q: "Why did I get the same number twice?",
        a: "Because each draw is independent by default, so duplicates are expected rather than surprising. For a raffle or any draw without replacement, switch on the unique option so each number appears at most once.",
      },
      {
        q: "Is this random enough for a prize draw?",
        a: "For an informal draw, yes — it uses the browser's random source and is uniformly distributed. For anything with legal or financial consequences, use a process that can be independently audited, since no client-side generator can prove to a third party that a result was not re-rolled.",
      },
      {
        q: "The results do not look random — is something wrong?",
        a: "Probably not. Genuine randomness produces clusters and short runs far more often than intuition suggests, and evenly spread results with no repeats would actually be suspicious. Small samples look lumpy; that is what random looks like.",
      },
    ],
  },

  "dice-coin": {
    title: "Dice Roller & Coin Flip — Free Online, No Signup",
    description:
      "Roll any number of dice or flip a coin instantly in your browser. Supports multiple dice and standard RPG dice types. Free, no signup.",
    intro: [
      "Roll dice or flip a coin when the physical article is missing — for a board game, a tabletop session, or settling something quickly.",
      "Multiple dice can be rolled at once with the total shown, which matters for tabletop games where 3d6 is a different proposition from 1d20 even though both peak in a similar range. Rolling three six-sided dice produces a bell curve strongly clustered around 10 and 11, because there are many combinations that sum to those and exactly one that sums to 3. A single twenty-sided die is flat — every result from 1 to 20 is equally likely. That difference in distribution is the whole reason game systems specify dice the way they do.",
      "On coin flips and the gambler's fallacy: each flip is independent, so five heads in a row does not make tails more likely on the sixth. The coin has no memory. The probability remains one half every time, and any intuition that a run is 'due' to break is simply wrong — this is among the most persistent errors in reasoning about probability.",
      "Results come from the browser's random source and are uniformly distributed, so a die is fair in a way a physical die with worn edges is not.",
    ],
    howto: [
      "Choose your dice type and how many to roll, or select the coin.",
      "Roll or flip — the result and the total appear immediately.",
      "Roll again as many times as you need.",
    ],
    faqs: [
      {
        q: "Are the rolls genuinely fair?",
        a: "Yes. Results come from the browser's random source and are uniformly distributed, so every face is equally likely. That makes it fairer than a physical die, which can be biased by wear or manufacturing.",
      },
      {
        q: "After five heads, is tails more likely?",
        a: "No. Each flip is independent and the probability stays at one half regardless of history. The belief that a run is 'due' to break is the gambler's fallacy — the coin has no memory of previous flips.",
      },
      {
        q: "Why does rolling 3d6 feel different from 1d20?",
        a: "Because the distributions differ. Three six-sided dice produce a bell curve clustered around 10 and 11, since many combinations sum there and only one sums to 3. A twenty-sided die is flat, with every result equally likely. Game systems choose between them deliberately.",
      },
      {
        q: "Which dice types are supported?",
        a: "The standard tabletop set — d4, d6, d8, d10, d12 and d20 — and you can roll several at once with the total shown.",
      },
    ],
  },

  "spin-wheel": {
    title: "Spin the Wheel — Random Name & Option Picker",
    description:
      "Add your options and spin a wheel to pick one at random. Free, instant and runs entirely in your browser with no signup.",
    intro: [
      "Type in your options — names, tasks, lunch spots, anything — and spin to pick one at random. Useful for classrooms, standups, giveaways and decisions nobody wants to make.",
      "The wheel format does something a plain random picker does not: it makes the selection visibly fair. When a group can watch the pointer land, the result feels legitimate in a way that a number appearing on screen does not, even though the underlying randomness is identical. For picking who presents first or who takes an unwanted task, that perceived fairness is the actual point.",
      "Each spin is independent, so a name can come up twice in a row. If you are working through a list without repeats — assigning everyone a turn, drawing several winners — remove each option after it is selected rather than spinning again and hoping.",
      "Every option gets an equal slice, so the odds are simply one divided by the number of entries. Adding the same name twice genuinely doubles its chance, which is occasionally useful as a weighting trick and occasionally an accidental duplicate that quietly skews a draw.",
    ],
    howto: [
      "Enter your options, one per line.",
      "Spin the wheel and watch it land on a winner.",
      "Remove the selected option if you are drawing without repeats, then spin again.",
    ],
    faqs: [
      {
        q: "Is every option equally likely?",
        a: "Yes. Each entry gets an equal slice and the result comes from the browser's random source, so the chance is one divided by the number of options. Entering the same name twice doubles its chance.",
      },
      {
        q: "Can the same name come up twice in a row?",
        a: "Yes — each spin is independent, so repeats are expected rather than a fault. To draw without repeats, remove each option once it has been selected.",
      },
      {
        q: "Are my options saved?",
        a: "They stay in your browser for the session and are never sent to a server. Nothing you type is transmitted or stored remotely.",
      },
      {
        q: "How many options can I add?",
        a: "There is no fixed limit, though the wheel becomes hard to read much beyond a few dozen slices. For very long lists a plain random picker is more practical than a wheel.",
      },
    ],
  },

  "color-contrast": {
    title: "Color Contrast Checker — WCAG AA & AAA Ratios",
    description:
      "Check text and background colour contrast against WCAG AA and AAA thresholds, with the exact ratio shown. Free and runs in your browser.",
    intro: [
      "Enter a text colour and a background colour to get the contrast ratio between them and see whether it meets the WCAG thresholds for normal and large text.",
      "The ratio runs from 1:1 for identical colours to 21:1 for pure black on pure white. WCAG AA — the level most legislation and procurement requirements reference — needs 4.5:1 for normal text and 3:1 for large text, defined as 18pt or 14pt bold. AAA raises those to 7:1 and 4.5:1. The large-text allowance exists because bigger letterforms have thicker strokes and remain legible at lower contrast.",
      "The failure this catches most often is light grey placeholder and helper text on white. It is a near-universal design habit and it fails AA routinely — grey at #999 on white is about 2.8:1, well under the threshold. That text is frequently the most important on the form, since it explains what is expected in the field.",
      "Two things worth knowing about scope. Contrast requirements apply to non-text elements too: form borders, focus indicators and icons that convey meaning need 3:1 against what surrounds them, which is why very faint input outlines fail. And contrast is not the whole of colour accessibility — a red-green pairing can pass contrast comfortably while being indistinguishable to someone with the most common form of colour blindness. Never rely on colour alone to carry meaning.",
    ],
    howto: [
      "Enter your foreground text colour and your background colour.",
      "Read the contrast ratio and the AA and AAA pass or fail results.",
      "Adjust the lightness of either colour until it passes for your text size.",
    ],
    faqs: [
      {
        q: "What ratio do I need to pass?",
        a: "For WCAG AA, 4.5:1 for normal text and 3:1 for large text — 18pt, or 14pt bold. AAA requires 7:1 and 4.5:1. AA is the level most accessibility legislation and procurement rules reference.",
      },
      {
        q: "Does this apply to icons and borders as well as text?",
        a: "Yes. Non-text elements that convey meaning — form borders, focus rings, meaningful icons — need 3:1 against adjacent colours. Very faint input outlines are a frequent failure.",
      },
      {
        q: "Why does my grey placeholder text fail?",
        a: "Because light grey on white is usually around 2.5-3:1, below the 4.5:1 needed for normal text. It is an extremely common pattern and it fails, which matters because placeholder text often carries the instructions for the field.",
      },
      {
        q: "Is passing contrast enough for accessibility?",
        a: "No. Contrast handles legibility but not colour dependence — a red-green pair can pass comfortably while being indistinguishable to someone with red-green colour blindness. Always pair colour with text, shape or an icon when it carries meaning.",
      },
    ],
  },

  "url-shortener": {
    title: "URL Shortener — Short Links with Click Stats",
    description:
      "Shorten long links into compact URLs and track how many times each is clicked. Free, no signup and no expiry on your links.",
    intro: [
      "Turn a long URL into a short one that is easier to share, and see how many times it has been clicked.",
      "The practical value is in the places where length genuinely hurts. A URL carrying campaign parameters and session identifiers can run to hundreds of characters, which breaks across lines in emails, gets truncated in printed material, and produces a QR code so dense that phone cameras struggle to read it. A short link solves all three, and QR density is the one people notice least until a code will not scan.",
      "Click counts tell you how many times a link was opened, which is genuinely useful for comparing where an audience came from — the same destination shared with different short links on different channels shows which channel worked. Be aware that counts include bots and link previews: messaging apps and social platforms fetch a URL to build a preview card, and some of that traffic registers.",
      "One thing to be conscious of when sharing shortened links: recipients cannot see where the link goes before clicking. That is exactly why phishing uses shorteners heavily, and why some corporate mail filters treat shortened links with suspicion. In contexts where trust matters, saying where a link leads alongside it is worth the extra words.",
    ],
    howto: [
      "Paste the long URL you want to shorten.",
      "Copy the generated short link and share it.",
      "Return any time to check how many clicks it has received.",
    ],
    faqs: [
      {
        q: "Do the short links expire?",
        a: "No. Links stay active with no expiry date and no account required to keep them working.",
      },
      {
        q: "Are the click counts accurate?",
        a: "They count every request to the short URL, which includes bots and link-preview fetches from messaging apps and social platforms. Treat the number as a good relative measure between channels rather than an exact count of humans.",
      },
      {
        q: "Why do some email filters flag shortened links?",
        a: "Because the destination is hidden until clicked, which is a technique phishing relies on. Some corporate filters treat shorteners with suspicion for that reason. If you are emailing a cautious audience, state where the link goes.",
      },
      {
        q: "Why does a shortened URL make a better QR code?",
        a: "Because QR codes encode the URL itself — a longer URL needs more data modules, producing a denser pattern that is harder for a camera to read, especially when printed small. A short link produces a sparse, reliably scannable code.",
      },
    ],
  },

  "cron-expression": {
    title: "Cron Expression Explainer — Read Any Schedule",
    description:
      "Paste a cron expression and read what it actually does in plain English, with the next run times. Free and runs in your browser.",
    intro: [
      "Paste a cron expression and get a plain-English description of when it runs, so you can confirm a schedule before committing it.",
      "The standard five fields are minute, hour, day of month, month and day of week, in that order. Most confusion comes from the operators rather than the fields: an asterisk means every value, a slash defines a step so */15 in the minute field means every fifteen minutes, a comma lists specific values and a hyphen gives a range.",
      "The genuinely counterintuitive part is how day-of-month and day-of-week interact. When both are set to something other than an asterisk, cron runs the job if either matches — an OR, not an AND. So an expression specifying the 1st of the month and Monday runs on every 1st and additionally on every Monday, which is usually not what the author intended. If you want a job on the first Monday of the month, cron alone cannot express it; you need a day-of-week schedule plus a date check inside the job.",
      "Two operational cautions. Cron typically runs in the server's timezone, which is frequently UTC and rarely stated in the expression itself — a job set for 09:00 may run at a very different local hour, and daylight-saving transitions can cause a job to run twice or not at all. And a schedule of */90 in the minute field does not mean every ninety minutes; step values only cycle within a field's own range, so it simply means minute 0.",
    ],
    howto: [
      "Paste your cron expression.",
      "Read the plain-English description of the schedule.",
      "Check the next run times to confirm it matches what you intended.",
    ],
    faqs: [
      {
        q: "What do the five fields mean?",
        a: "In order: minute, hour, day of month, month, day of week. An asterisk means every value, a slash sets a step, a comma lists values and a hyphen gives a range.",
      },
      {
        q: "Why does my job run more often than expected?",
        a: "Most likely because you set both day-of-month and day-of-week. Cron treats those as OR, not AND, so a schedule naming the 1st and Monday runs on every 1st and on every Monday.",
      },
      {
        q: "How do I schedule the first Monday of the month?",
        a: "Standard cron cannot express it. Schedule it for every Monday and add a check at the start of the job that exits unless the date is 7 or lower.",
      },
      {
        q: "Which timezone does cron use?",
        a: "Usually the server's, which is often UTC and is not part of the expression. Confirm the server timezone before relying on a specific local time, and be aware that daylight-saving transitions can cause a job to run twice or be skipped.",
      },
    ],
  },

  "html-to-markdown": {
    title: "HTML to Markdown Converter — Both Directions",
    description:
      "Convert HTML into clean Markdown or Markdown back into HTML, preserving headings, lists, links and code blocks. Free, in-browser.",
    intro: [
      "Convert HTML into Markdown or Markdown into HTML, in either direction.",
      "The most common reason to convert HTML to Markdown is migration — moving content out of a CMS, a rich-text editor or a wiki into a file-based system where posts live in version control. Markdown is plain text, so it diffs cleanly in git, which HTML does not.",
      "Expect some loss going from HTML to Markdown, and it is a property of the formats rather than a shortcoming of the conversion. Markdown has no syntax for classes, inline styles, data attributes, custom elements or nested layout containers, so all of that is dropped. What survives is the semantic structure: headings, paragraphs, lists, links, images, emphasis, code blocks and blockquotes. If the original relied on styling to convey meaning, that meaning does not come through.",
      "Converting the other way is lossless in the sense that Markdown expresses less than HTML, so everything maps cleanly. Note that tables, strikethrough and task lists are GitHub Flavored Markdown extensions rather than original Markdown, so a stricter parser downstream may not render them.",
    ],
    howto: [
      "Paste HTML or Markdown into the input box.",
      "Choose the direction you want to convert.",
      "Copy the converted result.",
    ],
    faqs: [
      {
        q: "Will my formatting survive the conversion?",
        a: "Semantic structure does — headings, lists, links, images, emphasis, code blocks and blockquotes. Classes, inline styles, data attributes and layout containers do not, because Markdown has no syntax for them.",
      },
      {
        q: "Why convert HTML to Markdown at all?",
        a: "Usually to migrate content into a file-based system where posts live in version control. Markdown is plain text and diffs cleanly in git; HTML does not. It is also far easier to edit by hand.",
      },
      {
        q: "Are tables supported?",
        a: "Yes, using GitHub Flavored Markdown table syntax. Note that tables are a GFM extension rather than original Markdown, so a stricter parser downstream may not render them.",
      },
      {
        q: "Is my content uploaded?",
        a: "No. Conversion runs entirely in your browser, so unpublished drafts and internal documentation stay on your device.",
      },
    ],
  },

  // ---- SEO Tools ------------------------------------------------------------

  "meta-tag-generator": {
    title: "Meta Tag Generator — Title, Description & Robots",
    description:
      "Generate title, description, canonical and robots meta tags with live length checks against Google's truncation limits. Free, in-browser.",
    intro: [
      "Fill in your page details and get a complete block of meta tags ready to paste into your <head>, with live length indicators showing where Google will truncate.",
      "Both length limits are real costs in opposite directions. Google truncates titles at roughly 600 pixels of rendered width — around 55-60 characters, though wide letters consume the budget faster — and descriptions at about 155-160 characters. A title cut mid-phrase loses the differentiator you put at the end, which is usually the part that earns the click. A 70-character description wastes half the space you were given.",
      "The description does not affect rankings and has not for many years. It affects click-through rate, which is worth optimising on its own terms: it is effectively ad copy for a free listing. Google also rewrites descriptions frequently, pulling a passage from the page when it judges that a better match for the query — so a well-written on-page paragraph matters as much as the tag.",
      "One correction worth making, because it appears in a great deal of outdated advice: the meta keywords tag does nothing. Google stopped using it in 2009 and announced as much publicly. Including it is harmless but pointless, and it does tell competitors exactly which terms you are targeting.",
    ],
    howto: [
      "Enter your page title, description, canonical URL and indexing preference.",
      "Watch the length indicators and trim until both sit inside the safe range.",
      "Copy the generated tags into your page's <head>.",
    ],
    faqs: [
      {
        q: "How long should my title and description be?",
        a: "Titles around 50-60 characters, since Google truncates near 600 pixels of width rather than at a fixed count. Descriptions around 140-160. Put the distinctive words first in both, because the end is what gets cut.",
      },
      {
        q: "Does the meta description affect rankings?",
        a: "No, not directly, and it has not for many years. It affects click-through rate. Google also frequently replaces it with a passage from your page when that better matches the query.",
      },
      {
        q: "Should I include meta keywords?",
        a: "No. Google stopped using the keywords tag in 2009. It has no effect on ranking and simply publishes your target terms to anyone who views the source.",
      },
      {
        q: "What does the robots meta tag control?",
        a: "Whether a page may be indexed and whether its links are followed. noindex keeps it out of search results; nofollow stops link equity passing through. Note that a page blocked in robots.txt can never be seen, so a noindex tag on a blocked page is never read.",
      },
    ],
  },

  "open-graph-generator": {
    title: "Open Graph Generator — Social Link Preview Tags",
    description:
      "Generate Open Graph meta tags so links preview correctly on Facebook, LinkedIn, WhatsApp and Slack. Free and runs in your browser.",
    intro: [
      "Generate the Open Graph tags that control how your page appears when someone shares it — the title, description and image in the preview card.",
      "The failure mode here is invisible to you, which is why it persists on so many sites. Without Open Graph tags, a link shared to Slack, WhatsApp, LinkedIn or Facebook renders as a bare URL or picks an arbitrary image from the page — frequently a logo, an avatar or a tracking pixel. You never see this, because you are not the one sharing your own pages. The first sign of trouble is usually someone mentioning that your link 'looks broken'.",
      "One mistake accounts for most missing preview images: og:image must be an absolute URL including the protocol and domain. A relative path such as /og.png is silently ignored by every platform, producing a card with no image at all. The image should also be at least 1200x630 for a large card, publicly reachable without a login, and served over HTTPS.",
      "Open Graph covers most platforms because X and others fall back to it, but X will prefer its own twitter:card tags when present. If you want a large image card there specifically, set twitter:card to summary_large_image alongside your Open Graph tags. Platforms also cache preview data aggressively, so after fixing tags you generally need to use the platform's own debugger to force a refresh — otherwise the old broken card persists for days.",
    ],
    howto: [
      "Enter your page title, description, canonical URL and an absolute image URL.",
      "Choose the content type — usually website or article.",
      "Copy the generated tags into your <head>, then re-share to check the preview.",
    ],
    faqs: [
      {
        q: "Why does my link preview show no image?",
        a: "Almost always because og:image is a relative path. It must be an absolute URL including https:// and the domain. Also confirm the image is publicly reachable without a login and at least 1200x630.",
      },
      {
        q: "I fixed my tags but the old preview still shows — why?",
        a: "Platforms cache preview data aggressively, often for days. Use the platform's own debugging tool — Facebook's Sharing Debugger or LinkedIn's Post Inspector — to force a re-fetch.",
      },
      {
        q: "Do I need Twitter card tags as well as Open Graph?",
        a: "X falls back to Open Graph, so basic previews work without them. To control the card format specifically — a large image rather than a small thumbnail — add twitter:card set to summary_large_image.",
      },
      {
        q: "What image size should I use?",
        a: "1200x630 is the safe standard for a large card, giving a 1.91:1 ratio. Smaller images may render as a small square thumbnail or be dropped entirely.",
      },
    ],
  },

  "twitter-card-generator": {
    title: "Twitter Card Generator — X Link Preview Tags",
    description:
      "Generate twitter:card meta tags so your links preview as rich cards on X. Supports summary and large image formats. Free, in-browser.",
    intro: [
      "Generate the twitter:card tags that control how a link appears when shared on X, including the card type, title, description and image.",
      "There are two card types worth knowing. summary produces a small square thumbnail beside the text, while summary_large_image produces a full-width image above it. The large format takes up considerably more space in a timeline and generally earns more attention, which is why it is the usual choice for articles and product pages.",
      "X falls back to Open Graph tags when twitter-specific ones are absent, so a page with correct Open Graph markup already previews reasonably. The reason to add twitter:card anyway is control — without it you cannot specify the large image format, and X defaults to the small summary card.",
      "The most common bug here is subtle and easy to introduce in a framework. Metadata systems frequently merge tag blocks field by field, so a page that defines only Open Graph tags silently inherits site-wide Twitter tags from a layout — leaving every page sharing with the same generic title. Check a real page's rendered source rather than assuming your per-page values were applied. Images should be at least 1200x675 for the large card, and must be absolute URLs.",
    ],
    howto: [
      "Choose your card type — summary or summary_large_image.",
      "Enter the title, description and an absolute image URL.",
      "Copy the tags into your <head> and validate by sharing a test post.",
    ],
    faqs: [
      {
        q: "What is the difference between the two card types?",
        a: "summary shows a small square thumbnail next to the text. summary_large_image shows a full-width image above it, taking more timeline space and generally attracting more attention. Large image is the usual choice for articles.",
      },
      {
        q: "Do I need these if I already have Open Graph tags?",
        a: "X falls back to Open Graph, so basic previews work. Adding twitter:card gives you control over the format — without it you cannot request the large image card.",
      },
      {
        q: "Why does every page share with the same generic title?",
        a: "Usually because a framework merged metadata field by field: a page defining only Open Graph inherits the site-wide Twitter block from a layout. Check the rendered source of a real page rather than assuming per-page values applied.",
      },
      {
        q: "What image dimensions work best?",
        a: "At least 1200x675 for summary_large_image, giving a 16:9 ratio. For the small summary card a square image of at least 300x300 works. Both must be absolute URLs.",
      },
    ],
  },

  "schema-generator": {
    title: "Schema Markup Generator — JSON-LD Structured Data",
    description:
      "Generate valid schema.org JSON-LD for articles, FAQs, products, organisations and more. Free and runs entirely in your browser.",
    intro: [
      "Generate schema.org structured data as JSON-LD, ready to paste into a script tag. Structured data is how you tell search engines and AI answer engines what a page actually is, rather than leaving them to infer it from the text.",
      "JSON-LD is the format to use. Google explicitly recommends it over microdata and RDFa because it sits in a single script block rather than being woven through your markup, which means it can be generated, validated and changed without touching the page structure. Microdata still works but is meaningfully harder to maintain.",
      "The types with the clearest return are FAQPage, HowTo, Product, Article, Organization and BreadcrumbList. FAQPage is particularly worth adding now, because question-shaped content is what AI answer engines quote most readily — a well-marked FAQ block gives them a clean question and answer pair to lift.",
      "One rule matters more than any other: structured data must describe what is genuinely visible on the page. Marking up FAQs that do not appear, or a rating nobody gave, is a policy violation that can trigger a manual action removing all your rich results. This is the most common way sites lose rich snippets. Review markup in particular is aggressively policed — do not add aggregateRating unless you collect real ratings and display them.",
    ],
    howto: [
      "Choose the schema type that matches your page.",
      "Fill in the fields, using only information genuinely shown on the page.",
      "Copy the JSON-LD into a script tag in your <head>, then test it in Google's Rich Results Test.",
    ],
    faqs: [
      {
        q: "Which format should I use — JSON-LD, microdata or RDFa?",
        a: "JSON-LD. Google recommends it, and because it lives in a single script block it can be generated and updated without touching your markup. Microdata works but is much harder to maintain.",
      },
      {
        q: "Does structured data improve rankings?",
        a: "Not directly. It makes a page eligible for rich results — star ratings, FAQ dropdowns, breadcrumb trails — which raise click-through rate. It also helps AI answer engines understand and cite the page.",
      },
      {
        q: "Can I mark up content that is not visible on the page?",
        a: "No. Structured data must reflect what users actually see. Marking up hidden FAQs or invented ratings is a policy violation and can trigger a manual action removing all rich results from your site.",
      },
      {
        q: "How do I check my markup is valid?",
        a: "Use Google's Rich Results Test for eligibility and the Schema Markup Validator for general correctness. Search Console also reports structured-data errors it finds across your site once it is verified.",
      },
    ],
  },

  "heading-checker": {
    title: "Heading Structure Checker — H1 to H6 Outline",
    description:
      "Check a page's heading hierarchy for skipped levels, missing or duplicate H1s and structural problems. Free and runs in your browser.",
    intro: [
      "Extract a page's heading structure and see its outline, with skipped levels and missing or duplicated H1s flagged.",
      "Headings are the document's table of contents, and both search engines and screen readers rely on them for exactly that. Screen reader users navigate by jumping between headings rather than reading linearly — it is one of the most-used navigation methods — so a broken hierarchy is a genuine accessibility problem, not only an SEO nicety.",
      "The rule is that levels descend without gaps: an H1 for the page's subject, H2s for major sections, H3s nested under those. Jumping from H2 straight to H4 leaves a hole in the outline, and a screen reader user hears that a level is missing without knowing what belongs there.",
      "The most common cause of a broken hierarchy is choosing heading levels for their size. An H4 gets used because the design calls for smaller text, which breaks the structure for a purely visual reason. Choose the level that reflects the content's place in the hierarchy and set the size in CSS. Similarly, one H1 per page is the sensible convention — modern HTML technically permits more within sectioning elements, but a single H1 stating the page's subject remains clearest for everyone.",
    ],
    howto: [
      "Paste your page's HTML or enter its URL.",
      "Review the extracted outline from H1 through H6.",
      "Fix any skipped levels, missing H1 or duplicate top-level headings.",
    ],
    faqs: [
      {
        q: "Should a page have exactly one H1?",
        a: "One is the sensible convention — it states what the page is about. Modern HTML permits multiple H1s inside sectioning elements, but a single H1 remains clearest for search engines and screen reader users alike.",
      },
      {
        q: "Why does skipping a heading level matter?",
        a: "Screen reader users navigate by jumping between headings, so a gap in the sequence leaves them with a structure that does not make sense. It also weakens the outline search engines build from your page.",
      },
      {
        q: "Can I use a heading purely because I want smaller text?",
        a: "No — that is the most common cause of broken hierarchies. Pick the level that matches the content's position in the outline and control size with CSS.",
      },
      {
        q: "Do headings still matter for SEO?",
        a: "Yes, though less as a direct ranking factor than as structure. They tell search engines how a page is organised and which passages answer which questions, which matters increasingly for passage-level ranking and AI-generated answers.",
      },
    ],
  },

  "sitemap-generator": {
    title: "XML Sitemap Generator — Free Sitemap Builder",
    description:
      "Build a valid XML sitemap with URLs, last-modified dates, change frequency and priority. Free and runs entirely in your browser.",
    intro: [
      "Enter your URLs and generate a valid XML sitemap ready to upload and submit to Search Console.",
      "A sitemap helps search engines discover pages; it does not guarantee any of them will be indexed. That distinction matters because it explains the most common disappointment — submitting a sitemap and finding that coverage barely changed. Google treats a sitemap as a hint about what exists, then decides independently what is worth crawling and keeping.",
      "This means quality beats completeness, particularly on a newer site with limited crawl budget. A sitemap listing every URL including thin, near-duplicate and templated pages spreads that budget across low-value content, and Google may sample it, index little and slow its crawling of everything else. A smaller sitemap of genuinely distinct, substantial pages is crawled sooner and judged better. Excluded pages can stay live and internally linked — they simply are not being put forward.",
      "Two consistency rules avoid confusing signals. Every URL in a sitemap should be canonical, indexable and return a 200 — listing a page that redirects, 404s or carries a noindex tag sends contradictory instructions. And lastmod should be honest: setting every page's date to today on each build is ignored once Google notices the dates do not correspond to real changes.",
    ],
    howto: [
      "Add the URLs you want to submit, one per line.",
      "Set last-modified dates, change frequency and priority where useful.",
      "Copy or download the XML, upload it to your site root, and submit it in Search Console.",
    ],
    faqs: [
      {
        q: "Will a sitemap get my pages indexed?",
        a: "No. It helps search engines discover URLs; indexing remains their decision based on the page's quality and your site's authority. A sitemap is a hint, not an instruction.",
      },
      {
        q: "Should I include every page?",
        a: "No — include the pages you genuinely want ranked. Listing thin or near-duplicate pages spreads limited crawl budget across low-value content. A smaller sitemap of substantial pages is crawled sooner and judged better.",
      },
      {
        q: "Do changefreq and priority actually do anything?",
        a: "Very little. Google has said it largely ignores both, since they are self-reported and widely abused. lastmod is used when it is accurate; a build that stamps today's date on everything gets discounted.",
      },
      {
        q: "How many URLs can a sitemap hold?",
        a: "50,000 URLs or 50 MB uncompressed, whichever comes first. Beyond that, split into several sitemaps and reference them from a sitemap index file.",
      },
    ],
  },

  "robots-txt-generator": {
    title: "Robots.txt Generator — Crawl Rules, Free Online",
    description:
      "Build a valid robots.txt with allow and disallow rules, crawler-specific directives and a sitemap reference. Free, in-browser.",
    intro: [
      "Build a robots.txt file with the rules you need, including per-crawler directives and a sitemap reference.",
      "The single most important thing to understand is that Disallow prevents crawling, not indexing. A blocked URL can still appear in search results if other pages link to it — Google simply lists it without a description, because it was not permitted to read the page. This surprises people who used robots.txt specifically to hide something.",
      "The corollary is a genuine trap. To keep a page out of the index you must allow crawling and serve a noindex directive, because Google has to fetch the page to see that directive. Blocking it in robots.txt guarantees the noindex is never read, so the page can remain listed indefinitely. Blocking and noindexing together is self-defeating.",
      "Robots.txt is also public and provides no security whatsoever. Listing /admin/ or /internal-backup/ under Disallow tells anyone who reads the file exactly where to look — and the file is at a fixed, well-known location that everyone checks. Never use it to hide anything sensitive; use authentication. And take care with Disallow patterns: a rule blocking a directory that also contains your CSS or JavaScript prevents Google from rendering the page properly, which can damage rankings far more than whatever you were trying to block.",
    ],
    howto: [
      "Choose which crawlers the rules apply to, or use * for all.",
      "Add your allow and disallow paths, and reference your sitemap URL.",
      "Copy the file, upload it to your site root, and check it in Search Console's robots.txt report.",
    ],
    faqs: [
      {
        q: "Will Disallow keep a page out of Google?",
        a: "No. It blocks crawling, not indexing — a disallowed URL can still be listed if other pages link to it, just without a description. To exclude a page from the index, allow crawling and serve a noindex tag.",
      },
      {
        q: "Should I both block a page and add noindex?",
        a: "No, that combination is self-defeating. Google must crawl the page to see the noindex directive, and robots.txt prevents exactly that. Choose one: noindex to de-index, Disallow to save crawl budget.",
      },
      {
        q: "Is robots.txt a security measure?",
        a: "Not at all. The file is public and at a well-known location, so listing sensitive paths advertises them. Anything that needs protecting needs authentication.",
      },
      {
        q: "Can blocking directories hurt my rankings?",
        a: "Yes. If a blocked path also contains CSS or JavaScript, Google cannot render your pages properly and may judge them broken or mobile-unfriendly. Always allow the assets needed to render the page.",
      },
    ],
  },

  "slug-generator": {
    title: "URL Slug Generator — Clean, SEO-Friendly Slugs",
    description:
      "Turn any title into a clean, lowercase, hyphenated URL slug with accents and special characters handled correctly. Free, in-browser.",
    intro: [
      "Turn a title into a clean URL slug: lowercase, hyphen-separated, with punctuation removed and accented characters transliterated.",
      "Hyphens rather than underscores is the established convention, and it is not arbitrary — Google has stated it treats hyphens as word separators and underscores as word joiners, so hello_world may be read as a single token while hello-world reads as two words. For any slug you want matched against a multi-word query, hyphens are the correct choice.",
      "Shorter slugs generally work better than longer ones. Stripping filler words — a, the, of, and — keeps the meaningful terms without changing what the URL communicates, and a slug that survives being read aloud or printed is more useful than one carrying an entire headline. Keep the words that identify the content and drop the ones that only provide grammar.",
      "The most important operational rule: once a URL is published, changing its slug breaks every existing link and discards whatever ranking it accumulated. If you must change one, serve a 301 redirect from the old URL to the new one, which passes almost all of the accumulated signals. Changing slugs casually — particularly across a whole site during a redesign — is one of the more reliable ways to lose traffic.",
    ],
    howto: [
      "Paste your title or heading.",
      "The slug is generated instantly, lowercased and hyphenated with punctuation stripped.",
      "Copy it into your CMS or route definition.",
    ],
    faqs: [
      {
        q: "Hyphens or underscores?",
        a: "Hyphens. Google treats a hyphen as a word separator and an underscore as a word joiner, so hello_world can be read as one token while hello-world reads as two words. Hyphens are the long-established convention.",
      },
      {
        q: "How long should a slug be?",
        a: "Long enough to identify the content and no longer. Dropping filler words such as a, the and of keeps the meaningful terms. A slug that reads clearly when spoken or printed is about right.",
      },
      {
        q: "Can I change a slug after publishing?",
        a: "You can, but it breaks every existing link and discards the URL's accumulated ranking signals unless you add a 301 redirect from the old path to the new one. Avoid changing slugs without a good reason.",
      },
      {
        q: "How are accented and non-Latin characters handled?",
        a: "Accented Latin characters are transliterated — café becomes cafe — which keeps URLs readable everywhere. Non-Latin scripts can be used directly in modern URLs but display as percent-encoded text in many contexts, so transliteration is usually safer.",
      },
    ],
  },

  "keyword-density": {
    title: "Keyword Density Checker — Term Frequency Analysis",
    description:
      "Analyse which words and phrases appear most often in your text, with counts and percentages. Free and runs in your browser.",
    intro: [
      "Paste your content to see which words and phrases occur most frequently, with counts and percentages for single words and multi-word phrases.",
      "It is worth being direct about what this measures. Keyword density is not a ranking factor and has not been one for a long time. Search engines moved to semantic understanding years ago — they evaluate whether a page genuinely covers a topic, not whether a phrase hits a percentage target. Any advice recommending a specific density figure such as 2% is obsolete, and writing to hit it produces worse content.",
      "The genuinely useful application is diagnostic, and it runs in both directions. If your target term appears once in two thousand words, the page may not actually be about what you intended — that is worth knowing. And if it appears forty times, the writing has probably become repetitive in a way that reads badly to humans and looks like keyword stuffing to a search engine, which is a real quality signal and can be penalised.",
      "Pay more attention to the phrase counts than the single-word counts. Related terms and natural variations are what demonstrate genuine topical coverage: a page about running shoes that never mentions cushioning, pronation, or midsole is thin on the subject regardless of how often the exact phrase appears. Use this to check that your writing covers the topic, then trust the writing.",
    ],
    howto: [
      "Paste your article or page copy.",
      "Review the most frequent words and phrases with their counts and percentages.",
      "Check your main topic actually appears, and that nothing is repeated so often it reads badly.",
    ],
    faqs: [
      {
        q: "What keyword density should I aim for?",
        a: "None. Density is not a ranking factor and targeting a percentage produces worse writing. Use the numbers to confirm your topic is genuinely covered and that nothing is repeated to the point of reading badly.",
      },
      {
        q: "Can keyword stuffing hurt my rankings?",
        a: "Yes. Unnaturally repeated phrases are a recognised spam signal and can trigger a penalty. It also makes content unpleasant to read, which affects the engagement signals search engines do measure.",
      },
      {
        q: "What should I look at instead of density?",
        a: "Topical coverage — whether the related concepts a knowledgeable reader would expect are present. A page about running shoes that never mentions cushioning or pronation is thin on the subject however often the main phrase appears.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. The analysis runs entirely in your browser, so unpublished drafts stay on your device.",
      },
    ],
  },

  // ---- Calculators ----------------------------------------------------------

  "tip-calculator": {
    title: "Tip Calculator — Split the Bill and Tip, Free",
    description:
      "Work out the tip and split a bill between any number of people, with per-person totals. Free, instant and runs in your browser.",
    intro: [
      "Enter the bill, choose a tip percentage and the number of people, and get the tip, the total and what each person owes.",
      "Tipping norms vary enough between countries that guessing is genuinely risky. In the United States, 15-20% is standard for restaurant table service and is effectively part of the server's wage rather than a bonus. In much of Europe, service is usually included and rounding up or leaving 5-10% is generous. In Japan tipping is not customary and can cause awkwardness. Checking local convention matters more than the arithmetic.",
      "One detail that changes the number more than people expect: whether you tip on the pre-tax or post-tax total. In a jurisdiction with meaningful sales tax or VAT, tipping on the post-tax figure means tipping on the tax itself. Both conventions are in use and neither is wrong, but on a large bill the difference is real.",
      "For splitting, the per-person figure is the total divided evenly. When one person had considerably more than everyone else, an even split is a decision rather than a calculation — a common approach is to settle the notably larger items separately, then split what remains.",
    ],
    howto: [
      "Enter the bill amount.",
      "Choose your tip percentage and how many people are splitting.",
      "Read the tip, the total and the per-person amount.",
    ],
    faqs: [
      {
        q: "How much should I tip?",
        a: "It depends heavily on country. In the US, 15-20% is standard for table service. In much of Europe service is often included and 5-10% is generous. In Japan tipping is not customary. Check local convention rather than applying one habit everywhere.",
      },
      {
        q: "Should I tip on the pre-tax or post-tax total?",
        a: "Both conventions are used. Tipping on the pre-tax amount is arguably more logical, since tax is not part of the service. Where sales tax is high the difference is noticeable, so it is worth deciding deliberately.",
      },
      {
        q: "How do I split when one person ordered much more?",
        a: "An even split is a social choice, not an arithmetic one. A common approach is to settle notably expensive items separately and split the remainder evenly, which keeps things fair without itemising everything.",
      },
      {
        q: "Do I tip on a discounted bill?",
        a: "The usual convention is to tip on the original amount before a voucher or discount, since the server did the same work regardless of what you paid.",
      },
    ],
  },

  "discount-calculator": {
    title: "Discount Calculator — Sale Price and Savings",
    description:
      "Work out a sale price, the amount saved and the effective discount when offers stack. Free, instant and runs in your browser.",
    intro: [
      "Enter an original price and a discount percentage to get the final price and the amount saved.",
      "The arithmetic people most often get wrong is stacked discounts. Two successive 20% reductions are not 40% off — the second applies to the already-reduced price, so £100 becomes £80 and then £64, an effective discount of 36%. The same logic makes '50% off, then an extra 20% off' equal 60% off rather than 70%. Retailers rely on this reading better than it calculates.",
      "Percentage increase and decrease are similarly asymmetric, and the mistake is common enough to be worth stating. A price that rises 20% and then falls 20% does not return to where it started: £100 becomes £120, then £96. The reduction is applied to a larger base than the increase was, so you end up below the original.",
      "For comparing offers, convert everything to a unit price. 'Buy one get one free' is 50% off if you want two and nothing at all if you want one. '3 for 2' is a 33% discount at three units. A percentage off a higher starting price can easily be worse value than a smaller percentage off a lower one, which is what makes headline discount figures unreliable on their own.",
    ],
    howto: [
      "Enter the original price.",
      "Enter the discount percentage, or the sale price to find the percentage.",
      "Read the final price and the amount saved.",
    ],
    faqs: [
      {
        q: "Do two 20% discounts make 40% off?",
        a: "No. The second applies to the already-reduced price, so 100 becomes 80 and then 64 — an effective 36% off. Stacked discounts always total less than their sum.",
      },
      {
        q: "If a price rises 20% then falls 20%, is it back to the start?",
        a: "No, it ends 4% lower. 100 rises to 120, and 20% of 120 is 24, leaving 96. The decrease is calculated on a larger base than the increase was.",
      },
      {
        q: "How do I compare 'buy one get one free' with a percentage off?",
        a: "Convert both to a unit price. BOGOF is 50% off if you want two units and no discount at all if you want one. '3 for 2' is a 33% discount at three units. Comparing headline percentages alone is misleading.",
      },
      {
        q: "How do I find the discount percentage from two prices?",
        a: "Subtract the sale price from the original, divide by the original, and multiply by 100. Entering both prices here does it for you.",
      },
    ],
  },

  "mortgage-calculator": {
    title: "Mortgage Calculator — Monthly Payment & Interest",
    description:
      "Calculate your monthly mortgage payment, total interest and the full cost of the loan over its term. Free and runs in your browser.",
    intro: [
      "Enter the loan amount, interest rate and term to get the monthly payment, the total interest paid and the overall cost.",
      "The total interest figure is the one worth looking at, because it is routinely much larger than people expect. A 25-year mortgage at a moderate rate commonly costs more in interest than half the amount borrowed, and at higher rates the interest can approach or exceed the principal. Monthly affordability is what lenders discuss; total cost is what you actually pay.",
      "Understanding amortisation explains why overpaying early matters so much. Each payment covers the interest accrued that month plus whatever is left over, which reduces the principal. Early on, when the balance is largest, most of the payment is interest — in the first years of a long mortgage the balance barely moves. Because every future interest charge is calculated on the outstanding balance, an overpayment early removes interest from every remaining month, while the same amount paid in the final years saves almost nothing.",
      "This calculation covers principal and interest only. The actual monthly cost of owning a home also includes buildings insurance, property tax or council tax, any service charge or ground rent, and mortgage insurance where the deposit is small. Budgeting from the principal-and-interest figure alone reliably understates what you will pay, often substantially.",
    ],
    howto: [
      "Enter the amount borrowed, the annual interest rate and the term in years.",
      "Read the monthly payment, total interest and total repaid.",
      "Adjust the term or rate to compare scenarios before speaking to a lender.",
    ],
    faqs: [
      {
        q: "Why is the total interest so high?",
        a: "Because interest is charged on the outstanding balance every month over a long term. On a 25-year mortgage the interest commonly exceeds half the amount borrowed, and at higher rates it can approach the principal itself.",
      },
      {
        q: "Does overpaying early really save more?",
        a: "Yes, substantially. An overpayment reduces the balance that all future interest is calculated on, so paying early removes interest from every remaining month. The same amount paid near the end saves very little.",
      },
      {
        q: "Does this include tax, insurance and fees?",
        a: "No — it covers principal and interest only. Your real monthly cost also includes insurance, property or council tax, any service charge, and mortgage insurance if your deposit was small. Budget for those separately.",
      },
      {
        q: "Should I choose a shorter or longer term?",
        a: "A shorter term means higher monthly payments and dramatically less total interest. A longer term is more affordable monthly and much more expensive overall. Compare both here, and consider whether overpayments on a longer term give you flexibility with a similar outcome.",
      },
    ],
  },

  "calorie-calculator": {
    title: "Calorie & TDEE Calculator — Daily Energy Needs",
    description:
      "Estimate your BMR and daily calorie needs from height, weight, age and activity level. Free and runs entirely in your browser.",
    intro: [
      "Estimate your basal metabolic rate — the energy your body uses at complete rest — and your total daily energy expenditure once activity is accounted for.",
      "BMR is calculated here using the Mifflin-St Jeor equation, which research has generally found more accurate for the modern population than the older Harris-Benedict formula. It accounts for height, weight, age and sex. TDEE then multiplies BMR by an activity factor, from roughly 1.2 for a sedentary desk-based routine up to around 1.9 for heavy physical work or twice-daily training.",
      "The activity multiplier is where most of the error enters, and people consistently overestimate it. 'Moderately active' means genuine structured exercise several times a week, not a generally busy life. Choosing a multiplier one step too high can overstate your needs by several hundred calories a day, which is enough to explain why a deficit that looks correct on paper produces no change.",
      "Treat the result as a starting estimate rather than a measurement. Individual metabolic rates vary meaningfully from any formula's prediction, and no equation can account for body composition, medication, thyroid function or genetics. The practical approach is to use the figure as a baseline, track actual intake and weight over two or three weeks, and adjust based on what really happens. For any medical condition or a significant dietary change, speak to a doctor or dietitian.",
    ],
    howto: [
      "Enter your height, weight, age and sex.",
      "Choose the activity level that honestly matches your week.",
      "Read your BMR and TDEE, then adjust based on real results over a few weeks.",
    ],
    faqs: [
      {
        q: "What is the difference between BMR and TDEE?",
        a: "BMR is the energy your body uses at complete rest, keeping organs functioning. TDEE is BMR multiplied by an activity factor and represents your total daily burn including movement, exercise and digestion.",
      },
      {
        q: "How accurate is this?",
        a: "It is a good starting estimate, not a measurement. Individual metabolic rates vary from any formula's prediction, and body composition, medication and genetics all affect the real figure. Use it as a baseline and adjust from observed results.",
      },
      {
        q: "Which activity level should I choose?",
        a: "Be conservative — overestimating is the most common error. 'Moderately active' means structured exercise several times a week, not simply a busy life. One step too high can overstate your needs by several hundred calories a day.",
      },
      {
        q: "How big a deficit should I use to lose weight?",
        a: "A deficit of roughly 300-500 calories a day is generally considered sustainable. Larger deficits are harder to maintain and risk losing muscle alongside fat. Anyone with a medical condition should discuss changes with a doctor or dietitian first.",
      },
    ],
  },

  "gpa-calculator": {
    title: "GPA Calculator — Weighted Grade Point Average",
    description:
      "Calculate your GPA from course grades and credit hours, including weighted courses. Free, instant and runs in your browser.",
    intro: [
      "Enter each course's grade and credit hours to calculate your grade point average, weighted properly by credits.",
      "The weighting is what makes a GPA more than an average of letters. Each grade converts to points — typically A=4.0, B=3.0, C=2.0, D=1.0, F=0 — and is multiplied by that course's credit hours. Total the quality points, divide by total credits, and you have the GPA. This means a four-credit course affects your average twice as much as a two-credit one, which is why a poor grade in a major requirement hurts more than the same grade in a one-credit elective.",
      "Weighted GPA is a separate concept and the source of most confusion. Some institutions add points for advanced courses — an A in an AP or honours class might count as 5.0 rather than 4.0 — producing averages above 4.0. Unweighted GPA caps at 4.0 regardless of course difficulty. Which one an application asks for varies, and reporting the wrong one either undersells you or looks like an error.",
      "One practical note on cumulative GPA: as credits accumulate, each new course moves the average less. Early grades therefore carry disproportionate weight over a whole degree, and a low GPA becomes progressively harder to raise not because later grades matter less individually but because they are averaged against an increasingly large body of completed credits.",
    ],
    howto: [
      "Add each course with its grade and credit hours.",
      "Mark any weighted or advanced courses if your institution scales them.",
      "Read your GPA, and add previous totals for a cumulative figure.",
    ],
    faqs: [
      {
        q: "How is GPA calculated?",
        a: "Each grade becomes points (typically A=4.0, B=3.0, C=2.0, D=1.0, F=0), multiplied by that course's credit hours to give quality points. Total quality points divided by total credit hours is the GPA.",
      },
      {
        q: "What is the difference between weighted and unweighted GPA?",
        a: "Unweighted caps at 4.0 regardless of difficulty. Weighted adds points for advanced courses — an A in an AP class might count 5.0 — so weighted GPAs can exceed 4.0. Check which one an application is asking for.",
      },
      {
        q: "Why do credit hours matter?",
        a: "Because they weight each grade. A four-credit course influences your average twice as much as a two-credit one, so results in major requirements matter more than in small electives.",
      },
      {
        q: "Why is it hard to raise a low GPA later?",
        a: "Because each new course is averaged against all previously completed credits. As your total grows, any single course moves the average less — which is why early grades carry disproportionate weight across a degree.",
      },
    ],
  },

  "scientific-calculator": {
    title: "Scientific Calculator — Trig, Logs and Powers",
    description:
      "A full scientific calculator with trigonometry, logarithms, powers, roots and constants. Free, instant and runs in your browser.",
    intro: [
      "A scientific calculator covering trigonometric functions, logarithms, exponents, roots, factorials and the standard constants.",
      "The setting that causes most wrong answers is degrees versus radians. Trigonometric functions can interpret their input either way, and the same expression gives completely different results depending on the mode — sin(90) is 1 in degrees and about 0.894 in radians. Geometry problems are almost always in degrees; calculus and physics are usually in radians. Check the mode before trusting any trig result that looks surprising.",
      "The two logarithm buttons are also routinely confused. log is base 10 and ln is the natural logarithm, base e. They are not interchangeable: log(100) is 2 while ln(100) is about 4.6. Scientific and engineering formulas frequently specify one or the other, and substituting the wrong one produces an answer that is wrong by a constant factor and easy to miss.",
      "Operator precedence is worth watching in any expression you type as one line. Multiplication and division bind more tightly than addition and subtraction, and exponentiation more tightly still, so 2+3×4 is 14 rather than 20. When in doubt add brackets — they cost nothing and remove the ambiguity entirely.",
    ],
    howto: [
      "Check whether you need degrees or radians and set the mode.",
      "Enter your expression, using brackets to make precedence explicit.",
      "Read the result, and use the memory functions for multi-step work.",
    ],
    faqs: [
      {
        q: "Why is my trigonometry answer wrong?",
        a: "Almost always the degrees-versus-radians mode. sin(90) is 1 in degrees but about 0.894 in radians. Geometry uses degrees; calculus and physics usually use radians. Check the mode first.",
      },
      {
        q: "What is the difference between log and ln?",
        a: "log is base 10 and ln is the natural logarithm, base e (about 2.718). They differ by a constant factor — log(100) is 2 while ln(100) is roughly 4.6 — so substituting one for the other gives a wrong answer.",
      },
      {
        q: "Why does 2+3×4 give 14 and not 20?",
        a: "Because multiplication takes precedence over addition, so 3×4 is evaluated first. Use brackets — (2+3)×4 — when you want a different order.",
      },
      {
        q: "Does it handle very large or very small numbers?",
        a: "Yes, switching to scientific notation beyond the standard display range. Note that floating-point arithmetic has finite precision, so results of very long calculations can carry tiny rounding differences.",
      },
    ],
  },

  "sip-calculator": {
    title: "SIP Calculator — Project Investment Growth",
    description:
      "Project the future value of regular monthly investments with compound growth. See contributions versus returns. Free, in-browser.",
    intro: [
      "Enter a monthly contribution, an expected annual return and a time period to project what a systematic investment plan could grow to, split between what you contributed and what growth added.",
      "The split between those two figures is the most instructive output. Over short periods, contributions dominate and growth is a small addition. Over long periods the relationship inverts, and growth can exceed everything you put in. Seeing where that crossover happens explains compound growth better than any description of it.",
      "This is also why time in the market matters more than the amount invested. Starting ten years earlier with a smaller monthly amount frequently beats starting later with a larger one, because every year of growth compounds on all previous growth. Change the duration rather than the contribution in the projection and watch which moves the final figure more — the difference is usually striking.",
      "An important caveat: the expected return is an assumption, not a forecast. Real markets do not deliver a smooth annual percentage — they rise and fall, and sequence matters, particularly for money you may need at a specific time. Projections also ignore fund fees, which compound against you exactly as returns compound for you, and inflation, which means a future sum buys less than the same sum today. Treat the output as illustrating the shape of compound growth rather than predicting a balance.",
    ],
    howto: [
      "Enter your monthly investment amount.",
      "Set an expected annual return and the number of years.",
      "Compare total contributions against projected growth, and vary the duration to see its effect.",
    ],
    faqs: [
      {
        q: "How reliable is the projected figure?",
        a: "It is an illustration, not a forecast. It assumes a constant annual return, which no real market delivers, and ignores fees and inflation. Use it to understand how compounding behaves rather than to predict a balance.",
      },
      {
        q: "Why does starting earlier matter so much?",
        a: "Because each year's growth compounds on all previous growth. Ten extra years at a smaller monthly amount frequently beats a larger amount started later — duration usually moves the final figure more than contribution size.",
      },
      {
        q: "Are fees included?",
        a: "No. Fund management fees compound against you just as returns compound for you, and over decades even a small annual percentage makes a substantial difference. Subtract your fund's expense ratio from your expected return for a more realistic projection.",
      },
      {
        q: "Does this account for inflation?",
        a: "No — figures are nominal. A projected sum decades out will buy considerably less than the same amount today. To think in today's money, use a real return: your expected return minus expected inflation.",
      },
    ],
  },

  "income-tax-calculator": {
    title: "Income Tax Calculator — Estimate Tax by Slab",
    description:
      "Estimate income tax across bracket slabs and see your effective rate versus marginal rate. Free and runs in your browser.",
    intro: [
      "Enter your income to estimate tax across the applicable bracket slabs, with the total due and your effective rate.",
      "The most valuable thing this shows is the difference between your marginal rate and your effective rate. Income tax is progressive: each slab's rate applies only to the income falling inside that band, not to your whole income. Someone in a 30% bracket does not pay 30% of everything they earn — they pay 0% on the personal allowance, a lower rate on the next band, and 30% only on the portion above that threshold. The effective rate is almost always considerably lower than the marginal one.",
      "This corrects a genuinely costly misconception: that a pay rise pushing you into a higher bracket can leave you worse off. It cannot. Only the income above the threshold is taxed at the higher rate, so more gross income always means more net income. People have declined raises and overtime over this misunderstanding.",
      "Treat the result as an estimate. Real tax liability depends on deductions, allowances, credits, pension and retirement contributions, filing status, regional taxes, and which regime you have elected where a choice exists. Rules also change between tax years. Use this to understand the shape of your liability, then confirm the actual figure with your tax authority's own calculator or an accountant.",
    ],
    howto: [
      "Enter your gross annual income.",
      "Select the applicable regime or filing status where offered.",
      "Review the tax due per slab, the total, and your effective versus marginal rate.",
    ],
    faqs: [
      {
        q: "What is the difference between marginal and effective rate?",
        a: "Marginal is the rate on your next pound or dollar earned — your top bracket. Effective is total tax divided by total income, which is always lower because the earlier slabs are taxed at lower rates or not at all.",
      },
      {
        q: "Can a pay rise leave me worse off?",
        a: "No. Only the income above a bracket threshold is taxed at the higher rate, so gross increases always mean net increases. The belief that a raise can reduce take-home pay is a persistent and costly misunderstanding.",
      },
      {
        q: "How accurate is this estimate?",
        a: "It applies bracket rates to the income you enter. It cannot know your deductions, credits, pension contributions, filing status or regional taxes, all of which change the real figure. Treat it as indicative and confirm with your tax authority.",
      },
      {
        q: "Is my income data stored?",
        a: "No. The calculation runs entirely in your browser and nothing you enter is transmitted or saved.",
      },
    ],
  },

  "gst-calculator": {
    title: "GST Calculator — Add or Remove GST from a Price",
    description:
      "Add GST to a net price or extract it from a gross price, with the tax amount shown separately. Free and runs in your browser.",
    intro: [
      "Add GST to a price that excludes it, or work backwards to find the tax already contained in a GST-inclusive price.",
      "The reverse calculation is where errors happen. To remove GST from an inclusive price you divide rather than subtract the percentage. At 18%, an inclusive price of 118 contains 18 of tax — but subtracting 18% of 118 gives 21.24, which is wrong. The correct method is to divide by 1.18, giving a net price of 100 and tax of 18. Subtracting the percentage from the gross figure always overstates the tax.",
      "This matters commercially because invoices must state the net amount, the tax and the gross separately. Getting the reverse calculation wrong means the three figures do not reconcile, which causes problems at filing time and in any audit.",
      "The correct treatment depends on registration and location. Whether you must charge GST or VAT at all, at what rate, and whether a reverse-charge applies to a client in another jurisdiction are questions with country-specific answers that also depend on your registration status. This tool does the arithmetic; which rate applies to a given transaction is worth confirming once with an accountant and then applying consistently.",
    ],
    howto: [
      "Enter the price and choose whether it currently includes GST.",
      "Set the applicable GST rate.",
      "Read the net amount, the tax and the gross total.",
    ],
    faqs: [
      {
        q: "How do I remove GST from an inclusive price?",
        a: "Divide, do not subtract. At 18%, divide the gross by 1.18 to get the net. Subtracting 18% from the gross price overstates the tax and gives the wrong net figure.",
      },
      {
        q: "Why does subtracting the percentage give a different answer?",
        a: "Because the percentage was applied to the smaller net figure, not the larger gross one. Taking 18% of the gross removes more than was originally added, which is why division is the correct reverse operation.",
      },
      {
        q: "Which rate applies to my sale?",
        a: "That depends on your country, the goods or services involved and your registration status. Cross-border transactions often involve reverse-charge rules. Confirm the correct treatment for your situation with an accountant.",
      },
      {
        q: "Do I show GST separately on an invoice?",
        a: "Generally yes — most tax regimes require the net amount, the tax amount and the rate to be stated separately from the total. This is also why the reverse calculation must be exact.",
      },
    ],
  },

  "date-calculator": {
    title: "Date Calculator — Days Between Dates & Add Days",
    description:
      "Count the days between two dates, or add and subtract days, weeks and months from any date. Free and runs in your browser.",
    intro: [
      "Count the exact number of days between two dates, or add and subtract a period from a date to find the result.",
      "The first question to settle is whether the calculation is inclusive. The gap between the 1st and the 3rd is two days if you are counting elapsed time, and three if you are counting the days themselves. Both are correct for different purposes: a hotel charges two nights, while a three-day event running from the 1st to the 3rd occupies three calendar days. Deadlines and notice periods usually count elapsed days, but the wording matters and getting it wrong by one day can be consequential.",
      "Adding months is genuinely ambiguous rather than simply tricky, because months have different lengths. One month after 31 January cannot be 31 February, so implementations either clamp to the last valid day — 28 or 29 February — or roll over into March. Neither is wrong, but they disagree, and for contract dates and subscription renewals the difference is real. Adding days avoids the ambiguity entirely.",
      "Leap years are handled automatically. The rule is less simple than 'every four years': a year is a leap year if divisible by 4, except centuries, unless divisible by 400. So 1900 was not a leap year and 2000 was. Any date arithmetic spanning late February needs this, which is why doing it by hand is error-prone.",
    ],
    howto: [
      "Choose whether to count between two dates or add a period to one.",
      "Enter your dates or the number of days, weeks or months.",
      "Read the result, noting whether you need an inclusive or exclusive count.",
    ],
    faqs: [
      {
        q: "Is the day count inclusive?",
        a: "It counts elapsed days between the two dates, so the 1st to the 3rd is two days. If you need to count the calendar days themselves — for a three-day event — add one.",
      },
      {
        q: "What happens when I add a month to the 31st?",
        a: "It is genuinely ambiguous, since not every month has a 31st. Implementations either clamp to the last valid day of the target month or roll into the next. For contracts and renewals this difference matters, so adding days is safer when precision counts.",
      },
      {
        q: "Are leap years handled?",
        a: "Yes. A year is a leap year if divisible by 4, except centuries, unless divisible by 400 — so 1900 was not and 2000 was. Any calculation crossing late February depends on getting this right.",
      },
      {
        q: "Does this count working days?",
        a: "The main count is calendar days. Working-day calculations also need weekends excluded and public holidays applied, and holidays vary by country and region — so always confirm those against the relevant calendar.",
      },
    ],
  },

  // ---- Productivity ---------------------------------------------------------

  notes: {
    title: "Online Notes — Private Notepad in Your Browser",
    description:
      "A quick notepad that saves automatically in your browser. No account, no sync, nothing uploaded. Free and available instantly.",
    intro: [
      "A plain notepad that opens instantly and saves as you type. No account, no loading spinner, no sync conflict.",
      "Everything is stored in your browser's local storage, which is the whole design rather than a limitation. Nothing you write reaches a server, so there is no privacy policy governing your notes and nobody to trust with them. That makes it genuinely appropriate for the things people should not paste into a cloud notes app — a password hint, a half-formed idea about work, notes from a difficult conversation.",
      "The trade-off is real and worth stating plainly: your notes live in one browser on one device. They will not appear on your phone, they do not survive clearing site data, and they are gone when a private window closes. For a scratchpad, a shopping list or drafting a message, that is exactly the right trade. For anything you would be upset to lose, copy it somewhere with backups.",
    ],
    howto: [
      "Start typing — the note saves automatically as you go.",
      "Close the tab whenever you like; your text is waiting when you return.",
      "Copy anything important somewhere backed up, since notes live only in this browser.",
    ],
    faqs: [
      {
        q: "Where are my notes stored?",
        a: "In your browser's local storage on this device. They are never sent to a server, which is why there is no account and no privacy policy governing them.",
      },
      {
        q: "Will I lose my notes?",
        a: "They persist across visits and restarts, but they are deleted if you clear browsing data or site storage, and they do not survive a private window closing. Copy anything important somewhere backed up.",
      },
      {
        q: "Can I access them on another device?",
        a: "No. Local storage is per-device and per-browser, which is the same property that keeps them private with no account. Syncing would require a server holding your notes.",
      },
      {
        q: "Is there a length limit?",
        a: "Local storage is typically capped around 5-10 MB per site, which is a very large amount of plain text. You are unlikely to reach it with written notes.",
      },
    ],
  },

  todo: {
    title: "To-Do List — Simple Task Manager, No Signup",
    description:
      "A straightforward to-do list that saves in your browser. Add, complete and clear tasks with no account required. Free and instant.",
    intro: [
      "Add tasks, tick them off, clear what is done. It opens immediately and remembers your list between visits.",
      "The deliberate absence of features is the point. Most task managers accumulate projects, tags, priorities, due dates and recurring rules until maintaining the system becomes its own task — and the tool you were going to use to get organised becomes the thing you are avoiding. A list you can add to in two seconds gets used.",
      "One habit makes any list work better: write the next physical action rather than the project. 'Sort out the insurance' sits untouched for weeks because it is not clear what to do first. 'Find the policy number in the filing box' can actually be started. Vague items are the main reason lists stall, and the fix is in the wording rather than the tool.",
      "Tasks are stored in your browser, so nothing is uploaded and no account exists. That also means the list is tied to this browser on this device.",
    ],
    howto: [
      "Type a task and press enter to add it.",
      "Tick items off as you complete them.",
      "Clear completed tasks when the list gets long.",
    ],
    faqs: [
      {
        q: "Are my tasks saved?",
        a: "Yes, in your browser's local storage, so the list is there when you return. It is not synced to an account and does not survive clearing site data.",
      },
      {
        q: "Why are there no due dates or projects?",
        a: "Deliberate simplicity. Feature-heavy task managers often become a maintenance job in themselves. A list you can add to in two seconds is the one that actually gets used.",
      },
      {
        q: "How do I stop tasks sitting on the list for weeks?",
        a: "Write the next physical action rather than the project. 'Sort out the insurance' stalls because the first step is unclear; 'find the policy number in the filing box' can be started immediately.",
      },
      {
        q: "Can I use it on my phone and laptop together?",
        a: "Not as one synced list — storage is per-device and per-browser. That is the same property that keeps it private with no account.",
      },
    ],
  },

  kanban: {
    title: "Kanban Board — Free Drag-and-Drop Task Board",
    description:
      "Organise work across To Do, Doing and Done columns with drag and drop. Saves in your browser, no account needed. Free.",
    intro: [
      "A simple board with columns you drag cards between, saved automatically in your browser.",
      "Kanban originated in Toyota's manufacturing system and translates well to individual work because it makes one thing visible that a list cannot: how much you have started but not finished. A to-do list of thirty items looks the same whether two or twenty are in progress. A board shows the Doing column filling up.",
      "That visibility is the whole mechanism. The core discipline in Kanban is limiting work in progress — deliberately capping how many cards may sit in Doing at once, typically two or three. This feels restrictive and is the part most people skip, but it is what makes the method work: partly finished work delivers nothing, and constant context switching between many started tasks is slower than finishing them one at a time.",
      "The rule to adopt if you adopt only one: before starting anything new, finish or explicitly park something already in Doing. A board where everything drifts into Doing and nothing reaches Done is just a list with extra steps.",
    ],
    howto: [
      "Add cards to the To Do column.",
      "Drag a card to Doing when you start it — and keep that column short.",
      "Move it to Done on completion, and clear Done periodically.",
    ],
    faqs: [
      {
        q: "What is the point of limiting work in progress?",
        a: "Partly finished work delivers no value, and switching between many started tasks is slower than finishing them one at a time. Capping the Doing column at two or three forces completion before starting something new.",
      },
      {
        q: "How is this better than a to-do list?",
        a: "It makes started-but-unfinished work visible. A list of thirty items looks identical whether two or twenty are in progress; a board shows the Doing column filling up, which is the signal to stop starting things.",
      },
      {
        q: "Is my board saved?",
        a: "Yes, in your browser's local storage. It persists between visits on this device and is never uploaded to a server.",
      },
      {
        q: "Can I share a board with a team?",
        a: "No. Everything is stored locally with no account, so there is nothing to share from. It is designed for personal work rather than collaboration.",
      },
    ],
  },

  pomodoro: {
    title: "Pomodoro Timer — 25-Minute Focus Timer, Free",
    description:
      "A Pomodoro timer with work and break intervals, cycle tracking and an alert when each ends. Free, no signup, runs entirely in your browser.",
    intro: [
      "A focus timer following the Pomodoro technique: twenty-five minutes of work, a five-minute break, and a longer break after four cycles.",
      "The technique's real mechanism is not the interval length — it is that starting becomes cheap. Twenty-five minutes is short enough that beginning something you have been avoiding does not feel like a commitment, and an open-ended unpleasant task becomes a bounded one. Most of the benefit arrives at the moment you start, not from the specific number.",
      "The break is not optional padding, though it is what people skip first. Working through breaks to maintain momentum reliably produces a worse afternoon, because sustained focus depletes and recovers on a cycle. Stepping away — properly away, not to a different screen — is what makes the next interval work.",
      "Treat twenty-five minutes as a starting point rather than a rule. It comes from the original technique, not from research, and plenty of people work better in forty or fifty-minute blocks once the habit is established. The interval that holds your attention without becoming a slog is the correct one.",
    ],
    howto: [
      "Start a twenty-five minute work interval and put other tabs away.",
      "Take the five-minute break when it ends — away from your screen.",
      "After four cycles, take a longer break of fifteen to thirty minutes.",
    ],
    faqs: [
      {
        q: "Why twenty-five minutes?",
        a: "It is a convention from the original technique rather than a research finding. It works largely because it is short enough to make starting easy and bounded enough to make an unpleasant task feel finite.",
      },
      {
        q: "Can I change the intervals?",
        a: "Yes, and many people should. Forty or fifty-minute blocks suit deeper work once the habit is established. Use whatever length holds your attention without becoming a slog.",
      },
      {
        q: "Should I skip breaks when I am in flow?",
        a: "Occasionally finishing a thought is fine, but routinely working through breaks produces a worse afternoon. Focus depletes and recovers cyclically, and the break is what makes the next interval effective.",
      },
      {
        q: "Does the timer keep running if I switch tabs?",
        a: "Yes, the timer continues in the background. Browsers may throttle background tabs and delay a notification slightly, so keep the tab visible if exact timing matters.",
      },
    ],
  },

  "habit-tracker": {
    title: "Habit Tracker — Free Daily Streak Tracker",
    description:
      "Track daily habits and build streaks, saved in your browser with no account. Free, private and instantly available.",
    intro: [
      "Mark habits complete each day and watch the streak build. Everything is stored in your browser with no account.",
      "Visible streaks work because of loss aversion — an unbroken run becomes something you do not want to lose, and that reluctance is a stronger motivator than the original intention was. This is the mechanism behind most habit apps, and it is genuinely effective for the first weeks while a behaviour is still deliberate.",
      "The failure mode is worth planning for in advance. Streaks make missing a day feel like failure, and a broken streak frequently ends the habit entirely — the reasoning being that the run is ruined so there is no point continuing. The standard counter is a rule of never missing twice: one missed day is an accident, two is the start of stopping. Restart the same day rather than waiting for a Monday.",
      "For a new habit, make the daily target smaller than you think it should be. Consistency at a trivially achievable level establishes the behaviour far more reliably than an ambitious target attempted intermittently, and the size can always increase once the habit no longer requires deciding.",
    ],
    howto: [
      "Add the habits you want to track.",
      "Mark each one complete as you do it, day by day.",
      "If you miss a day, mark the next one — never miss twice in a row.",
    ],
    faqs: [
      {
        q: "Why do streaks help?",
        a: "Loss aversion — an unbroken run becomes something you do not want to break, and that reluctance outlasts the original motivation. It is most effective in the early weeks while the behaviour still requires deliberate effort.",
      },
      {
        q: "I broke my streak and gave up — how do I avoid that?",
        a: "Adopt a never-miss-twice rule. One missed day is an accident; two is the beginning of stopping. Restart the same day rather than waiting for a Monday or the first of the month.",
      },
      {
        q: "How long does a habit take to form?",
        a: "There is no reliable fixed number — the widely repeated twenty-one days has no good evidence behind it. Research suggests a wide range depending on the behaviour and person, often considerably longer. Consistency matters more than any target date.",
      },
      {
        q: "Is my data private?",
        a: "Yes. Everything is stored in your browser on this device and never uploaded, so no account exists and nobody else can see what you track.",
      },
    ],
  },

  "goal-tracker": {
    title: "Goal Tracker — Track Progress Toward Your Goals",
    description:
      "Set goals with measurable targets and track progress toward them. Saves in your browser, no account. Free and private.",
    intro: [
      "Set goals with a target you can measure and record progress against them over time.",
      "The single largest determinant of whether a goal is achieved is whether it is measurable. 'Get fitter' cannot be tracked, cannot tell you whether you are on course, and cannot be completed — so it stays open indefinitely. 'Run 5km without stopping by 30 September' can be checked at any point. Vagueness is why most goals quietly disappear rather than being abandoned.",
      "Tracking progress rather than only the outcome matters because the outcome usually arrives long after the effort. A goal that can only be evaluated at the end offers no feedback in between, and the middle is precisely where motivation fades. Recording partial progress gives you evidence that effort is producing movement.",
      "Set fewer goals than feels natural. Attention is the binding constraint, not intention — five simultaneous goals typically means five neglected ones, while two get done. Finish before adding more.",
    ],
    howto: [
      "Add a goal with a measurable target and a date.",
      "Record progress as you make it.",
      "Review regularly, and adjust the target rather than abandoning it if it proves unrealistic.",
    ],
    faqs: [
      {
        q: "What makes a goal trackable?",
        a: "A number and a date. 'Get fitter' cannot be measured or completed; 'run 5km without stopping by 30 September' can be checked at any point. Vagueness is the main reason goals quietly disappear.",
      },
      {
        q: "How many goals should I track at once?",
        a: "Fewer than feels natural — two or three. Attention is the limit rather than intention, and five simultaneous goals usually means five neglected ones.",
      },
      {
        q: "What if a target turns out to be unrealistic?",
        a: "Adjust it rather than abandoning it. A revised target you continue working toward is worth considerably more than an ambitious one you stopped tracking.",
      },
      {
        q: "Is my data stored anywhere else?",
        a: "No. Goals and progress are kept in your browser on this device and never uploaded.",
      },
    ],
  },

  "expense-tracker": {
    title: "Expense Tracker — Free Spending Log, No Account",
    description:
      "Log expenses by category and see where your money goes. Saves in your browser with nothing uploaded. Free and private.",
    intro: [
      "Record what you spend, categorise it, and see the totals build up over a period.",
      "Recording spending changes it, which is the main reason to do it. The effect is well documented in behavioural research: the act of writing a purchase down introduces a moment of deliberation that would not otherwise exist, and some purchases do not survive it. The record is useful, but the pause at the point of spending is where most of the benefit comes from.",
      "Log at the moment of spending rather than reconstructing later. Retrospective reconstruction reliably undercounts, and it undercounts exactly the category people most want to understand — the small, frequent, unmemorable purchases. Nobody forgets the rent; everyone forgets four coffees.",
      "Keep the categories few. A dozen categories produces precise data you will not review; five or six produces a picture you can actually act on. Everything stays in your browser, so no bank connection or account is involved and your financial detail is not shared with anyone.",
    ],
    howto: [
      "Add each expense with an amount and category as you spend.",
      "Review category totals at the end of the week or month.",
      "Adjust based on what the totals show rather than what you assumed.",
    ],
    faqs: [
      {
        q: "Does tracking spending actually change it?",
        a: "Generally yes. Writing a purchase down adds a moment of deliberation that some purchases do not survive. The pause at the point of spending tends to matter more than the record itself.",
      },
      {
        q: "Should I log as I go or at the end of the week?",
        a: "As you go. Reconstructing later reliably undercounts, and it misses the small frequent purchases that are usually the ones worth understanding.",
      },
      {
        q: "How many categories should I use?",
        a: "Five or six. Highly detailed categorisation produces precise data nobody reviews; a handful of broad categories produces a picture you can act on.",
      },
      {
        q: "Is my financial data private?",
        a: "Yes. Everything is stored in your browser on this device with no bank connection and no account. Nothing is uploaded.",
      },
    ],
  },

  "bookmark-manager": {
    title: "Bookmark Manager — Organise Links in Your Browser",
    description:
      "Save and organise links with titles and notes, stored in your browser. No account, nothing uploaded. Free and private.",
    intro: [
      "Save links with a title and a note about why you kept them, organised the way you choose.",
      "The note is the feature that matters. Most bookmark collections become unusable not because they are disorganised but because a title alone does not explain why something was saved — six months later 'Advanced Techniques' means nothing, and the link is never opened again. A single line of context at the moment of saving is what makes a collection retrievable.",
      "Bookmarks accumulate faster than they are read, which is normal and mostly harmless. What helps is deciding at save time whether something is a read-later item or a reference you will return to repeatedly, since those two need different treatment. Read-later items have a short shelf life; if you have not opened one in a few months, you were never going to.",
      "Everything is stored in your browser, so nothing is uploaded and no account is needed. That also means the collection is tied to this browser on this device.",
    ],
    howto: [
      "Add a link with a title and a short note on why you saved it.",
      "Organise into groups that match how you will look for things.",
      "Clear out read-later items you have not opened in a few months.",
    ],
    faqs: [
      {
        q: "Why add a note to a bookmark?",
        a: "Because titles alone stop making sense quickly. One line explaining why you saved something is the difference between a collection you use and one you never open again.",
      },
      {
        q: "How is this different from browser bookmarks?",
        a: "It keeps notes alongside links and is independent of your browser's own bookmark bar, which is useful for a working set you want separate from permanent bookmarks.",
      },
      {
        q: "Are my bookmarks synced between devices?",
        a: "No. They are stored in this browser on this device, which is what keeps them private with no account.",
      },
      {
        q: "What should I do about bookmarks I never read?",
        a: "Delete them. Read-later items have a short useful life — if you have not opened something in a few months, keeping it only makes the rest harder to search.",
      },
    ],
  },

  stopwatch: {
    title: "Online Stopwatch — Free Timer with Lap Times",
    description:
      "A precise stopwatch with lap and split times, accurate to the millisecond and running entirely in your browser. Free, instant and no signup.",
    intro: [
      "Start, stop and reset a stopwatch, recording lap times as you go.",
      "The distinction between lap and split time is worth knowing because they answer different questions. A lap time is the duration of one segment measured from the previous lap marker. A split is the total elapsed time at that point. Running four laps of 60, 62, 61 and 63 seconds gives splits of 60, 122, 183 and 246 — the laps show consistency, the splits show cumulative pace. Most stopwatches record both, and mixing them up makes performance look very different from reality.",
      "Timing runs in your browser using a high-resolution clock, which is accurate to well under a millisecond in principle. The practical limit is not the clock but you: human reaction time is roughly 200-250 milliseconds, so any manually started and stopped measurement carries far more error from the operator than from the timer. For anything where hundredths genuinely matter, automated triggering is the only reliable approach.",
      "Browsers throttle timers in background tabs to save power, so a stopwatch left running behind other windows may display less smoothly. The elapsed time remains correct because it is calculated from timestamps rather than counted frames.",
    ],
    howto: [
      "Press start to begin timing.",
      "Record laps as you go — each shows both the lap duration and total elapsed time.",
      "Stop when finished, and reset to clear.",
    ],
    faqs: [
      {
        q: "What is the difference between lap and split time?",
        a: "A lap is the duration of one segment since the last marker. A split is the total elapsed time at that point. Four 60-second laps give splits of 60, 120, 180 and 240 — laps show consistency, splits show cumulative pace.",
      },
      {
        q: "How accurate is it?",
        a: "The underlying clock is accurate to well under a millisecond. The real limit is human reaction time, roughly 200-250 milliseconds, which dominates any manually started measurement. For precision timing you need automated triggering.",
      },
      {
        q: "Does it keep running in a background tab?",
        a: "Yes. Browsers throttle background tabs so the display may update less smoothly, but elapsed time is calculated from timestamps and stays correct.",
      },
      {
        q: "Will I lose my time if the page reloads?",
        a: "Yes — reloading resets the stopwatch. Note important lap times elsewhere if you are timing something you cannot repeat.",
      },
    ],
  },

  countdown: {
    title: "Countdown Timer — Free Online Timer with Alarm",
    description:
      "Set a countdown to any duration or target date and get an alert when it finishes. Free, instant and runs entirely in your browser.",
    intro: [
      "Set a duration or a target date and watch the countdown, with an alert when it reaches zero.",
      "Useful for the ordinary things a kitchen timer covers — cooking, laundry, a limited break — and for the less ordinary ones where a visible deadline changes behaviour. A countdown on a meeting agenda item or a timeboxed task is a surprisingly effective constraint, because work expands to fill available time and a visible clock is what makes the limit real.",
      "For counting down to a date rather than a duration — a launch, an exam, a deadline — the display makes remaining time concrete in a way a calendar does not. 'Three weeks' and '19 days' describe the same period and prompt noticeably different urgency.",
      "One practical caution: browsers throttle background tabs aggressively to save battery, so an alert from a hidden tab can be delayed by seconds or, on mobile with the screen off, considerably longer. Keep the tab visible when the exact moment matters, and use your phone's own alarm for anything you genuinely cannot miss.",
    ],
    howto: [
      "Enter a duration, or pick a target date and time.",
      "Start the countdown and leave the tab visible if exact timing matters.",
      "An alert sounds when it reaches zero.",
    ],
    faqs: [
      {
        q: "Will the alarm fire if I switch tabs?",
        a: "Usually, but it can be delayed. Browsers throttle background tabs to save power, and on mobile with the screen off the delay can be significant. Keep the tab visible when the exact moment matters.",
      },
      {
        q: "Can I count down to a specific date?",
        a: "Yes — set a target date and time rather than a duration, and it counts down to that moment. Useful for launches, exams and deadlines.",
      },
      {
        q: "What happens if I reload the page?",
        a: "The countdown resets. Set it again after reloading, and avoid reloading while a timer you care about is running.",
      },
      {
        q: "Can I run more than one timer?",
        a: "One per tab. Open the page in several tabs if you need parallel timers, though be aware only the visible tab keeps perfect timing accuracy.",
      },
    ],
  },

  // ---- Text Tools -----------------------------------------------------------

  "remove-duplicate-lines": {
    title: "Remove Duplicate Lines — Deduplicate Any List",
    description:
      "Strip repeated lines from a list, with optional case-insensitive matching and whitespace trimming. Free, in-browser.",
    intro: [
      "Paste a list and remove repeated lines, keeping the first occurrence of each.",
      "The most common frustration is duplicates that are not removed because they are not actually identical. Trailing whitespace is invisible and makes two lines different to a computer that look the same to you. So does a capital letter, and so does a carriage return left behind by a Windows-style line ending on a file processed with Unix tools. Trimming whitespace and matching case-insensitively resolves nearly all of these.",
      "Deduplication is not the same as sorting, though the two are often confused. Removing duplicates here preserves the original order, keeping the first instance of each line. Some command-line workflows require sorted input to deduplicate, which reorders everything as a side effect — that is a limitation of those tools rather than a property of the operation.",
      "Useful for cleaning exported email lists, consolidating log lines, merging several lists into one, or preparing data before an import that will reject duplicate keys.",
    ],
    howto: [
      "Paste your list, one item per line.",
      "Choose whether to ignore case and trim whitespace.",
      "Copy the deduplicated result, which keeps the original order.",
    ],
    faqs: [
      {
        q: "Why were my duplicates not removed?",
        a: "Almost always invisible differences — trailing whitespace, inconsistent capitalisation, or a stray carriage return from a Windows line ending. Enable trimming and case-insensitive matching to catch these.",
      },
      {
        q: "Does this sort my list?",
        a: "No. Original order is preserved and the first occurrence of each line is kept. Sorting is a separate operation.",
      },
      {
        q: "Which duplicate is kept?",
        a: "The first occurrence. Later repeats are removed, so the earliest position in your list is what survives.",
      },
      {
        q: "Is there a size limit?",
        a: "No fixed limit — processing happens in your browser, so the practical ceiling is available memory. Lists of many thousands of lines are handled without difficulty.",
      },
    ],
  },

  "sort-lines": {
    title: "Sort Lines — Alphabetical & Numerical Line Sorter",
    description:
      "Sort lines alphabetically or numerically, ascending or descending, with case options. Free and runs in your browser.",
    intro: [
      "Paste a list and sort it alphabetically or numerically, in either direction.",
      "Alphabetical sorting of numbers is the classic surprise. Sorted as text, 10 comes before 2, because sorting compares character by character and '1' precedes '2'. A list of file names or version numbers sorted alphabetically produces an order that looks broken: v1, v10, v11, v2. Numerical sorting reads each line as a number and orders by value, which is what you want whenever the lines are quantities.",
      "Case sensitivity changes results too. A strict sort orders by character code, placing all uppercase letters before all lowercase ones — so Zebra precedes apple. That is rarely what a human wants from an alphabetical list, which is why case-insensitive sorting is usually the better default for names and words.",
      "Sorting is also a quick way to inspect data. Adjacent duplicates become obvious, and outliers at the top and bottom of a numerically sorted list are visible immediately — often faster than a formal check.",
    ],
    howto: [
      "Paste your lines into the box.",
      "Choose alphabetical or numerical, and ascending or descending.",
      "Copy the sorted result.",
    ],
    faqs: [
      {
        q: "Why does 10 sort before 2?",
        a: "Because alphabetical sorting compares character by character, and '1' comes before '2'. Switch to numerical sorting to order by value rather than by text.",
      },
      {
        q: "Why do capitals sort before lowercase?",
        a: "A strict sort orders by character code, and all uppercase letters have lower codes than lowercase ones — so Zebra precedes apple. Use case-insensitive sorting for a more natural alphabetical order.",
      },
      {
        q: "Are blank lines kept?",
        a: "They are grouped together in the sorted output. Removing them before sorting gives a cleaner result if they are not meaningful.",
      },
      {
        q: "Can I sort and deduplicate at once?",
        a: "Sorting and deduplication are separate operations here. Sorting makes duplicates adjacent and therefore easy to spot, then use the duplicate remover to strip them.",
      },
    ],
  },

  "reverse-text": {
    title: "Reverse Text — Flip Characters, Words or Lines",
    description:
      "Reverse text by character, word or line order, each doing something different. Free, instant and runs entirely in your browser with no signup.",
    intro: [
      "Reverse text at three different levels: character order, word order, or the order of lines.",
      "The three do genuinely different things. Reversing characters turns 'hello world' into 'dlrow olleh'. Reversing words gives 'world hello', with each word intact. Reversing lines flips a list end to end while leaving every line unchanged. Line reversal is the most practically useful of the three — it is how you flip a chronological log or export to show newest first.",
      "Character reversal is mostly used for puzzles, testing how software handles unusual input, or checking palindromes. One caveat: reversing characters can break text containing emoji or certain accented characters, because a single visible character may be built from several underlying code points. Reversing those splits the sequence and produces mangled output — a limitation of how text is encoded rather than of the tool.",
      "Word reversal is occasionally useful for reordering name formats, though it should be used carefully with names that do not follow a two-part first-and-last structure.",
    ],
    howto: [
      "Paste your text into the box.",
      "Choose whether to reverse characters, words or lines.",
      "Copy the reversed result.",
    ],
    faqs: [
      {
        q: "What is the difference between the three modes?",
        a: "Character reversal turns 'hello world' into 'dlrow olleh'. Word reversal gives 'world hello' with words intact. Line reversal flips a list end to end, leaving each line unchanged.",
      },
      {
        q: "Why did my emoji break when reversing characters?",
        a: "Because a single visible emoji is often built from several underlying code points. Reversing splits that sequence and produces mangled output — an encoding limitation rather than a fault in the tool.",
      },
      {
        q: "What is line reversal useful for?",
        a: "Flipping chronological order — turning an oldest-first log or export into newest-first without re-sorting by a date column.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Everything runs in your browser and nothing is transmitted.",
      },
    ],
  },

  "find-replace": {
    title: "Find & Replace — Bulk Text Replacement Online",
    description:
      "Find and replace text in bulk, with case-sensitive and whole-word matching to avoid corrupting longer words. Free and runs in your browser.",
    intro: [
      "Replace every occurrence of a string across a block of text at once.",
      "The mistake that causes the most damage is replacing a short string that appears inside longer words. Replacing 'cat' with 'dog' without whole-word matching turns 'category' into 'dogegory' and 'concatenate' into 'condogenate'. This is why the whole-word option matters: it requires a word boundary on both sides so only the standalone word matches.",
      "Case sensitivity is the other setting worth checking. A case-sensitive replacement of 'Apple' leaves 'apple' untouched, which is correct when you mean the company and wrong when you mean the fruit. A case-insensitive replacement catches both but writes a single replacement casing over every match, which can produce a lowercase word at the start of a sentence.",
      "Always check the match count before replacing. A number far higher than you expected almost always means the search string is matching inside longer words, and it is much easier to notice that before the replacement than to unpick it afterwards.",
    ],
    howto: [
      "Paste your text and enter the string to find.",
      "Enter the replacement, and set case-sensitive or whole-word matching as needed.",
      "Check the match count looks right, then replace and copy the result.",
    ],
    faqs: [
      {
        q: "Why did my replacement corrupt other words?",
        a: "Because the search string appeared inside longer words. Replacing 'cat' without whole-word matching turns 'category' into 'dogegory'. Enable whole-word matching so only the standalone word is replaced.",
      },
      {
        q: "When should I use case-sensitive matching?",
        a: "Whenever capitalisation carries meaning — a brand name, a code identifier, or a proper noun that also exists as a common word. Case-insensitive matching catches more but overwrites the original casing.",
      },
      {
        q: "Can I undo a replacement?",
        a: "Keep a copy of the original before replacing. The safest habit is checking the match count first — an unexpectedly high number is the warning sign.",
      },
      {
        q: "Does it support regular expressions?",
        a: "This performs plain string replacement, which is predictable and safe for ordinary edits. For pattern-based work, build and test the pattern in the Regex Tester first.",
      },
    ],
  },

  "text-repeater": {
    title: "Text Repeater — Repeat Text Any Number of Times",
    description:
      "Repeat any text a set number of times, with optional separators and line breaks. Useful for test data and layout checks. Free, in-browser.",
    intro: [
      "Repeat a word, phrase or block of text as many times as you need, with control over separators between repetitions.",
      "Most uses are practical rather than decorative: generating test data of a specific length, producing repeated rows to check how a layout handles overflow, filling a field to test a character limit, or creating placeholder content where lorem ipsum would be inappropriate.",
      "The separator setting does more work than it appears to. Repeating with a comma produces a list ready to paste into a query or a CSV column, while repeating with a newline produces rows. Repeating with no separator produces one long string, which is what you want for testing how a container handles an unbroken run of characters — a genuinely common source of layout bugs, since a long unbroken string does not wrap and can push a container wider than its parent.",
      "For testing character limits, remember that the separator counts toward the total. A hundred repetitions of a five-character word separated by commas is 600 characters, not 500.",
    ],
    howto: [
      "Enter the text you want repeated.",
      "Set how many times, and choose a separator if you need one.",
      "Copy the generated output.",
    ],
    faqs: [
      {
        q: "What is this actually useful for?",
        a: "Generating test data, filling fields to check character limits, producing repeated rows to test layout overflow, and creating placeholder content of a specific length.",
      },
      {
        q: "Do separators count toward the character total?",
        a: "Yes. A hundred repetitions of a five-character word joined by commas is 600 characters, not 500 — worth remembering when testing against a limit.",
      },
      {
        q: "Is there a maximum?",
        a: "No fixed limit, though very large outputs may be slow to render and awkward to copy. Everything is generated in your browser, so available memory is the practical ceiling.",
      },
      {
        q: "Why test with an unbroken string?",
        a: "Because long strings with no spaces do not wrap, and can push a container wider than its parent — a common layout bug that ordinary test text never reveals.",
      },
    ],
  },

  "emoji-picker": {
    title: "Emoji Picker — Search and Copy Any Emoji",
    description:
      "Search emoji by name or keyword and copy any of them in one click. Works on desktop where the system picker is awkward. Free and instant.",
    intro: [
      "Search for an emoji by name or keyword and copy it to your clipboard in one click — useful when a device's own picker is slow or missing, or when working on a desktop where the shortcut is awkward.",
      "Emoji are unicode characters rather than images, which explains most of their odd behaviour. The same character is drawn differently by each platform's font, so an emoji that reads as mildly amused on one phone can look considerably more pointed on another. Tone genuinely shifts between platforms, which is worth remembering before sending something ambiguous.",
      "New emoji are added by the Unicode Consortium roughly annually, and devices only display them after an operating system update that includes the new font. Someone on an older device sees an empty box rather than your character. If a message depends on an emoji being understood, favour a well-established one.",
      "The other thing worth knowing is that many emoji are built from several code points joined together — skin-tone modifiers, and family or profession emoji formed with a zero-width joiner. Systems that do not recognise the combination fall back to showing the component pieces separately, which is why a single emoji occasionally arrives as two or three.",
    ],
    howto: [
      "Search by name or keyword, or browse the categories.",
      "Click an emoji to copy it to your clipboard.",
      "Paste it wherever you need it.",
    ],
    faqs: [
      {
        q: "Why does the same emoji look different on other devices?",
        a: "Because emoji are characters, not images, and each platform draws them with its own font. The design — and sometimes the apparent tone — differs between Apple, Google, Microsoft and Samsung.",
      },
      {
        q: "Why does an emoji show as an empty box?",
        a: "That device's font does not include it, usually because the emoji is newer than the operating system. New emoji only appear after an OS update that ships the updated font.",
      },
      {
        q: "Why did one emoji arrive as several characters?",
        a: "Many emoji are composed of multiple code points joined together — skin tones and family emoji work this way. A system that does not recognise the combination falls back to displaying the components separately.",
      },
      {
        q: "Do emoji work in every application?",
        a: "Most modern applications handle them. Some older software and certain database configurations cannot store characters outside the basic range and will reject or mangle them.",
      },
    ],
  },

  "prompt-optimizer": {
    title: "AI Prompt Optimizer — Turn Ideas into Prompts",
    description:
      "Turn a rough idea into a clear AI prompt with context, format and constraints added. Works with any model. Free, no signup required.",
    intro: [
      "Describe roughly what you want and get back a more specific, better-structured prompt.",
      "Most disappointing AI output comes from underspecified prompts rather than model limitations. 'Write about marketing' gives a generic essay because that is genuinely all the request supports — the model has no way to know the audience, length, tone, format or purpose, so it produces something averaged across all of them. Adding those constraints changes the output far more than any phrasing trick.",
      "Four elements do most of the work. Context: who this is for and what it is for. Format: length, structure, whether you want prose, bullets or a table. Constraints: what to avoid, what to include, what tone to take. And an example of what good looks like, which communicates more than a paragraph of description.",
      "One widely repeated technique is worth being sceptical about: assigning a role such as 'you are an expert copywriter' does considerably less than commonly claimed. Specific instructions about the output outperform role-play framing. 'Write in short sentences, avoid marketing language, and assume the reader is technical' produces a more reliable result than any persona.",
    ],
    howto: [
      "Describe what you want, roughly and in your own words.",
      "Review the expanded prompt with its added context, format and constraints.",
      "Adjust anything that does not match your intent, then use it.",
    ],
    faqs: [
      {
        q: "Why does my AI output feel generic?",
        a: "Usually because the prompt is underspecified. Without an audience, length, tone and purpose, the model produces something averaged across all possibilities. Adding those constraints improves output more than rephrasing does.",
      },
      {
        q: "What should a good prompt include?",
        a: "Context about who and what it is for, the format you want, explicit constraints on tone and content, and ideally an example of good output. An example communicates more than a paragraph describing one.",
      },
      {
        q: "Does telling the model to act as an expert help?",
        a: "Less than commonly claimed. Specific instructions about the output outperform role-play framing — describing the sentence length, vocabulary and assumed reader works better than assigning a persona.",
      },
      {
        q: "Does this work with any AI model?",
        a: "Yes. The principles are model-agnostic — clarity, context and explicit constraints improve results across every current system.",
      },
    ],
  },

  // ---- Converters -----------------------------------------------------------

  "unit-converter": {
    title: "Unit Converter — Length, Weight and Temperature",
    description:
      "Convert between metric and imperial units for length, weight and temperature, with exact factors shown. Free, in-browser.",
    intro: [
      "Convert between metric and imperial units across length, weight and temperature in one place.",
      "Temperature behaves differently from every other conversion here, and it is worth understanding why. Length and weight scales share a zero point — zero metres is zero feet, zero kilograms is zero pounds — so converting is a single multiplication. Celsius and Fahrenheit do not: zero Celsius is 32 Fahrenheit. That offset means temperature conversion needs both a multiplier and an addition, which is also why a temperature difference converts differently from a temperature. A rise of 10°C is a rise of 18°F, not 50°F.",
      "Many imperial-to-metric factors are exact by definition rather than measured approximations. The inch is defined as precisely 2.54 centimetres and the pound as exactly 0.45359237 kilograms, both fixed by international agreement in 1959. Rounding those in a calculation introduces error that was not there in the definition.",
      "The unit worth being most careful with is the gallon, because the US and imperial versions differ substantially — a US gallon is about 3.79 litres and an imperial gallon about 4.55, a difference of roughly 20%. Recipes, fuel figures and container volumes all suffer from this, and the unit is rarely qualified in writing.",
    ],
    howto: [
      "Choose what you are converting — length, weight or temperature.",
      "Enter your value and pick the units to convert from and to.",
      "Read the result along with the conversion factor.",
    ],
    faqs: [
      {
        q: "Why does temperature need a formula rather than a factor?",
        a: "Because Celsius and Fahrenheit do not share a zero point. Scales starting from the same zero convert by multiplication alone. Zero Celsius is 32 Fahrenheit, so the conversion needs a multiplier and an offset.",
      },
      {
        q: "Is 1 inch exactly 2.54 cm?",
        a: "Yes, exactly — it was defined that way by international agreement in 1959. The pound is likewise exactly 0.45359237 kilograms. These are definitions rather than measurements.",
      },
      {
        q: "Is a US gallon the same as an imperial gallon?",
        a: "No, and the difference is large. A US gallon is about 3.79 litres, an imperial gallon about 4.55 — roughly 20% more. Since text rarely specifies which is meant, this causes real errors in recipes and fuel figures.",
      },
      {
        q: "How do I convert a temperature difference?",
        a: "Multiply by 9/5 without adding the offset. A rise of 10°C is a rise of 18°F. The +32 applies only when converting an absolute temperature, not a change in one.",
      },
    ],
  },

  "number-base-converter": {
    title: "Number Base Converter — Binary, Octal, Hex, Decimal",
    description:
      "Convert numbers between binary, octal, decimal and hexadecimal, seeing every representation at once. Free and runs in your browser.",
    intro: [
      "Convert a number between binary, octal, decimal and hexadecimal, seeing all representations at once.",
      "Hexadecimal exists because it maps cleanly onto binary: one hex digit is exactly four bits, so a byte is always two hex digits. That makes binary data compact and readable, which is why colour codes, memory addresses and byte dumps are all written in hex. Reading FF as 255 quickly becomes automatic once the four-bit mapping is clear.",
      "Octal survives mainly because of Unix file permissions, where each digit represents exactly three bits — read, write and execute. The 755 in chmod 755 is three octal digits: owner gets 7 (read, write, execute), group and others get 5 (read and execute). Understanding that mapping makes permission strings readable rather than memorised.",
      "Binary is where bit flags and masks become legible. A permissions or options value stored as a single integer is genuinely opaque in decimal and immediately clear in binary, where each set bit is a distinct flag. This is why debugging bitwise operations almost always starts by converting the values to binary.",
    ],
    howto: [
      "Enter your number in any base.",
      "Read the equivalent in binary, octal, decimal and hexadecimal.",
      "Use the binary view to inspect individual bits when debugging flags.",
    ],
    faqs: [
      {
        q: "Why is hexadecimal used so widely in programming?",
        a: "Because one hex digit is exactly four bits, so a byte is always two hex digits. That makes binary data compact and readable, which is why colour codes, memory addresses and byte values all use it.",
      },
      {
        q: "Why are Unix permissions written in octal?",
        a: "Because permissions come in groups of three bits — read, write, execute — and one octal digit is exactly three bits. So 755 gives the owner read, write and execute, and group and others read and execute.",
      },
      {
        q: "When is binary actually useful?",
        a: "For bit flags and masks. An options value stored as one integer is opaque in decimal and obvious in binary, where each set bit is a separate flag. Debugging bitwise operations usually starts with a binary conversion.",
      },
      {
        q: "What do the 0x and 0b prefixes mean?",
        a: "They mark the base in most programming languages — 0x for hexadecimal, 0b for binary and a leading 0 or 0o for octal. Without a prefix, a number is assumed decimal.",
      },
    ],
  },

  "roman-numeral-converter": {
    title: "Roman Numeral Converter — Both Directions, Free",
    description:
      "Convert numbers to Roman numerals and Roman numerals back to numbers, with subtractive notation handled. Free and runs in your browser.",
    intro: [
      "Convert an ordinary number into Roman numerals or read a Roman numeral back as a number.",
      "The system uses seven letters: I is 1, V is 5, X is 10, L is 50, C is 100, D is 500 and M is 1000. Values are generally added left to right, so XVI is 16. The exception is subtractive notation: when a smaller value precedes a larger one it is subtracted, so IV is 4 and IX is 9. This is why 1994 is MCMXCIV — M for 1000, CM for 900, XC for 90 and IV for 4.",
      "Subtractive notation follows rules that are commonly broken in casual use. Only I, X and C may be subtracted, and only from the next two larger values — so IV and IX are valid, IL and IC are not. This is why 49 is XLIX rather than IL, which trips people up because IL looks reasonable.",
      "The system has real limits: there is no zero and no way to write negative or fractional numbers, and standard notation stops at 3999 because representing 4000 would need four Ms. These constraints are exactly why positional systems with a zero replaced it for arithmetic. Roman numerals survive for clock faces, book chapters, film copyright dates, monarch numbering and Super Bowl editions.",
    ],
    howto: [
      "Enter a number, or a Roman numeral.",
      "The conversion appears instantly in the other direction.",
      "Check subtractive pairs such as IV, IX, XL and CM if a numeral looks unfamiliar.",
    ],
    faqs: [
      {
        q: "Why is 4 written IV rather than IIII?",
        a: "Because of subtractive notation — a smaller value before a larger one is subtracted. IIII does appear historically and still on some clock faces, but IV is the standard modern form.",
      },
      {
        q: "Why is 49 XLIX and not IL?",
        a: "Only I, X and C may be subtracted, and only from the next two larger values. IL is not valid, so 49 is built as XL (40) plus IX (9).",
      },
      {
        q: "What is the largest number I can write?",
        a: "3999 in standard notation, since 4000 would require four Ms. Larger numbers historically used a bar above a numeral to multiply it by 1000, but that is not part of standard modern usage.",
      },
      {
        q: "How do I write zero?",
        a: "You cannot. The system has no zero and no negative or fractional numbers, which is precisely why positional systems replaced it for arithmetic.",
      },
    ],
  },

  "timestamp-converter": {
    title: "Unix Timestamp Converter — Epoch to Date, Free",
    description:
      "Convert Unix timestamps to readable dates and back, in seconds or milliseconds with timezone handling. Free, in-browser.",
    intro: [
      "Convert a Unix timestamp into a readable date, or a date into a timestamp, in either seconds or milliseconds.",
      "Unix time counts seconds since 1 January 1970 UTC. Systems store it because it is one unambiguous integer with no timezone, no locale and no daylight-saving edge cases — and it is completely unreadable to humans, which is why anyone debugging logs or database records converts constantly.",
      "The seconds-versus-milliseconds distinction causes most errors. Traditional Unix time is seconds, but JavaScript's Date.now() returns milliseconds, and mixing them produces dates in 1970 or tens of thousands of years in the future. A quick check: a current timestamp in seconds is about 10 digits, in milliseconds about 13.",
      "Timezone is the other frequent confusion. A timestamp itself has no timezone — it is an absolute point in time. The timezone only appears when it is formatted for display, which is why the same stored value legitimately shows different local times to different users. Bugs here usually come from converting to local time somewhere in a pipeline and then storing the result as if it were still UTC.",
    ],
    howto: [
      "Paste a timestamp, or pick a date and time.",
      "Confirm whether your value is in seconds or milliseconds.",
      "Read the converted result in both UTC and your local timezone.",
    ],
    faqs: [
      {
        q: "Is my timestamp in seconds or milliseconds?",
        a: "Count the digits — a current timestamp is about 10 digits in seconds and 13 in milliseconds. JavaScript uses milliseconds while most backends and Unix tools use seconds, which is the usual source of the mix-up.",
      },
      {
        q: "Why did my converted date land in 1970?",
        a: "Because a millisecond value was read as seconds, dividing the elapsed time by a thousand and placing it just after the epoch. Switch the unit and it will convert correctly.",
      },
      {
        q: "What timezone is a Unix timestamp in?",
        a: "None — it is an absolute point in time, counted from 1970 UTC. Timezone only enters when formatting it for display, which is why the same value shows different local times to different users.",
      },
      {
        q: "What is the year 2038 problem?",
        a: "Systems storing Unix time in a signed 32-bit integer overflow in January 2038. Modern systems use 64-bit values and are unaffected, but legacy and embedded software may still be at risk.",
      },
    ],
  },

  "morse-code": {
    title: "Morse Code Translator — Text to Morse and Back",
    description:
      "Translate text into Morse code and Morse back into text, with standard timing conventions. Free and runs in your browser.",
    intro: [
      "Translate text into Morse code or decode Morse back into readable text.",
      "Morse encodes each letter as a sequence of short and long signals — dots and dashes. The letter assignments are not arbitrary: Samuel Morse and Alfred Vail studied letter frequency in English and gave the most common letters the shortest codes. E is a single dot and T a single dash, while rarer letters such as Q and Y take four signals each. It is an early and effective piece of compression.",
      "Timing carries as much meaning as the symbols. The standard proportions are: a dash is three times the length of a dot, the gap between symbols within a letter is one dot, the gap between letters is three dots, and the gap between words is seven. Get the gaps wrong and the same sequence of dots and dashes decodes into entirely different words, which is why written Morse needs explicit separators.",
      "SOS is the best-known sequence — three dots, three dashes, three dots — and it was chosen precisely because it is unmistakable and easy to send under stress. It does not stand for 'save our souls'; that expansion was invented afterwards. Morse remains in limited use in aviation navigation beacons and amateur radio, where it gets through in conditions that defeat voice.",
    ],
    howto: [
      "Type text to encode, or paste Morse to decode.",
      "Use spaces between letters and a slash or wider gap between words.",
      "Copy the translated result.",
    ],
    faqs: [
      {
        q: "Why is E a single dot?",
        a: "Because Morse and Vail assigned the shortest codes to the most frequent letters in English. E is the most common letter and gets one dot; rarer letters such as Q take four signals. It is an early form of compression.",
      },
      {
        q: "How important is timing?",
        a: "Essential. A dash is three dot-lengths, gaps within a letter are one dot, between letters three, and between words seven. Wrong gaps make the same dots and dashes decode into different words entirely.",
      },
      {
        q: "Does SOS stand for anything?",
        a: "No. It was chosen because three dots, three dashes, three dots is unmistakable and easy to send under stress. 'Save our souls' was invented after the fact.",
      },
      {
        q: "Is Morse code still used?",
        a: "In limited contexts — aviation navigation beacons broadcast identifiers in Morse, and amateur radio operators still use it because it gets through noise and weak signals that defeat voice transmission.",
      },
    ],
  },

  // ---- Image Tools ----------------------------------------------------------

  "image-cropper": {
    title: "Image Cropper — Crop Photos Online, Free",
    description:
      "Crop images to any area or fixed aspect ratio with a drag box. Runs in your browser, so photos are never uploaded. Free and instant.",
    intro: [
      "Drag a box over the part of the image you want to keep and crop to it, with optional fixed aspect ratios for common formats.",
      "Cropping is lossless in the sense that it removes pixels rather than degrading the ones that remain — but it does reduce resolution, and that has consequences. Cropping a 4000-pixel-wide photo down to a quarter of its area leaves a 2000-pixel image. That is still plenty for web use and marginal for large print, which is why heavily cropped photos look acceptable on screen and disappointing when enlarged.",
      "Fixed aspect ratios matter when a platform will crop for you if you do not. Uploading a 4:3 photo where a square is expected means the platform decides what to discard, usually by taking the centre — which frequently cuts through the subject. Cropping to the target ratio yourself keeps that decision.",
      "Everything happens in your browser via the Canvas API, so the image is never uploaded. That matters for the photos people most often need to crop: documents, ID scans and personal pictures.",
    ],
    howto: [
      "Open your image and drag the crop box over the area you want.",
      "Set a fixed aspect ratio if the destination requires one.",
      "Apply the crop and download the result.",
    ],
    faqs: [
      {
        q: "Does cropping reduce image quality?",
        a: "It removes pixels rather than degrading the remaining ones, so the kept area is unchanged. But the result has fewer pixels overall, so a heavily cropped photo has less resolution and will not enlarge or print as well.",
      },
      {
        q: "Why crop to a specific ratio myself?",
        a: "Because platforms crop automatically when the ratio does not match, usually from the centre — often straight through the subject. Cropping yourself keeps control of what is kept.",
      },
      {
        q: "Are my photos uploaded?",
        a: "No. Cropping runs in your browser via the Canvas API, so the image never leaves your device. It also works with the network disconnected.",
      },
      {
        q: "Can I undo a crop after downloading?",
        a: "Not from the cropped file — the removed pixels are gone. Keep your original and crop a copy.",
      },
    ],
  },

  "image-to-base64": {
    title: "Image to Base64 — Convert to Data URI, Free",
    description:
      "Convert an image into a Base64 data URI you can embed directly in HTML or CSS. Runs in your browser with no upload. Free.",
    intro: [
      "Convert an image into a Base64 data URI that can be embedded directly in HTML, CSS or JSON, removing the need for a separate file request.",
      "The trade-off is specific and worth understanding before using it. Base64 encoding inflates size by roughly 33%, because it represents three bytes using four characters. In exchange you eliminate one HTTP request. For a small icon that is usually a good trade; for anything substantial it is a bad one, since you are shipping a third more data and the embedded image cannot be cached separately from the document containing it.",
      "That caching point is the one people miss. A linked image is fetched once and reused across every page that references it. An inlined image is re-downloaded with every page that embeds it, and changing the document invalidates the image along with it. Inlining a large hero image can make a site measurably slower rather than faster.",
      "The genuinely good uses are small: icons, simple SVGs, a placeholder, or embedding an image in an email template or a self-contained HTML file where external references would not resolve. A rough guideline is to inline below a few kilobytes and link above it.",
    ],
    howto: [
      "Select your image file.",
      "Copy the generated data URI.",
      "Paste it into an img src, a CSS url() or a JSON field.",
    ],
    faqs: [
      {
        q: "Why does the Base64 version look bigger than my image?",
        a: "Because Base64 encodes three bytes as four characters, inflating size by about 33%. You trade extra bytes for one fewer HTTP request, which only pays off on small files.",
      },
      {
        q: "When should I inline an image rather than link it?",
        a: "For small assets — icons, simple SVGs, placeholders — and for self-contained files such as email templates where external references may not load. Below a few kilobytes is a reasonable rule.",
      },
      {
        q: "Does inlining hurt caching?",
        a: "Yes, and this is the main drawback. A linked image is cached once and reused everywhere; an inlined one is re-downloaded with every page embedding it, and changing the page invalidates the image too.",
      },
      {
        q: "Is my image uploaded?",
        a: "No. Encoding happens in your browser, so the file never leaves your device.",
      },
    ],
  },

  "color-palette": {
    title: "Image Color Palette — Extract Colors from a Photo",
    description:
      "Pull the dominant colour palette out of any image, with HEX and RGB values ready to copy. Free and runs in your browser.",
    intro: [
      "Extract the dominant colours from an image and get their HEX and RGB values.",
      "Useful for building a palette from a photograph, matching a design to an existing brand image, or pulling colours out of a screenshot when the original design file is not available.",
      "One caution when using an extracted palette directly in an interface: the colours that dominate a photograph are chosen for how they look together in that image, not for legibility as text or background. A palette lifted from a sunset is often several mid-tone colours with similar lightness, which look harmonious side by side and fail contrast requirements badly when used for text. Check any pair you intend to use for text against the contrast thresholds before committing.",
      "The extracted colours are also averages over regions rather than exact samples. Compression, particularly JPEG, shifts colours slightly, so a value extracted from a compressed screenshot may differ marginally from the original design. For matching a brand colour precisely, use the brand's stated value rather than one sampled from an image of it.",
    ],
    howto: [
      "Open the image you want to sample.",
      "Review the extracted dominant colours with their HEX and RGB values.",
      "Copy the values you need, and check contrast before using any pair for text.",
    ],
    faqs: [
      {
        q: "Can I use an extracted palette directly in a design?",
        a: "With care. Colours that dominate a photograph are chosen for harmony, not legibility — palettes from photos often share a similar lightness and fail text contrast requirements. Check any text pairing against the contrast thresholds first.",
      },
      {
        q: "Why is the extracted colour slightly different from the original?",
        a: "Extraction averages over regions, and lossy compression shifts colours slightly. For matching a brand colour exactly, use the brand's stated value rather than sampling an image of it.",
      },
      {
        q: "How are the dominant colours chosen?",
        a: "By grouping similar pixels and ranking the resulting clusters by how much of the image they cover, so the palette reflects what visually dominates rather than a simple pixel average.",
      },
      {
        q: "Is my image uploaded?",
        a: "No. The image is read into your browser and analysed locally — nothing is transmitted.",
      },
    ],
  },

  "text-to-handwriting": {
    title: "Text to Handwriting — Convert Typed Text, Free",
    description:
      "Turn typed text into realistic handwriting you can download as an image. Free, instant and runs entirely in your browser.",
    intro: [
      "Type or paste text and render it in a handwriting style you can download as an image, with control over the pen colour and paper.",
      "Most people use it for the visual effect: a handwritten-looking note in a presentation, a personal touch on a card or a social post, or mocking up a design that will eventually carry real handwriting.",
      "It is worth being clear about the limits of the illusion. Genuine handwriting varies constantly — every instance of a letter is slightly different, spacing drifts, the baseline wanders and pressure changes through a stroke. A font reproduces the same shapes every time, so a repeated word looks identical, which is the detail that gives it away on close inspection. Randomised variation helps and does not fully close the gap.",
      "One thing this should not be used for: anything that needs to pass as genuinely handwritten by a specific person. Submitting generated handwriting as coursework where handwriting is required, or using it to imitate someone's writing, is at best dishonest and potentially fraudulent. Use it for design and decoration.",
    ],
    howto: [
      "Type or paste your text.",
      "Choose the handwriting style, ink colour and paper background.",
      "Download the rendered image.",
    ],
    faqs: [
      {
        q: "Will it pass as real handwriting?",
        a: "At a glance in a design context, often. On close inspection, no — a font reproduces identical letterforms every time, while real handwriting varies with every stroke. Repeated words looking identical is the usual giveaway.",
      },
      {
        q: "Can I use this for homework that must be handwritten?",
        a: "No. Submitting generated handwriting where genuine handwriting is required is academic dishonesty, and imitating a specific person's writing can be fraud. Use it for design and decorative purposes.",
      },
      {
        q: "Can I use my own handwriting?",
        a: "Not directly here — the output uses handwriting-style fonts. Creating a font from your own writing requires a dedicated font-generation service.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Rendering happens in your browser and the text is never transmitted.",
      },
    ],
  },

  "placeholder-image": {
    title: "Placeholder Image Generator — Custom Mockup Images",
    description:
      "Generate placeholder images at any size with custom colours and label text, for mockups and layout testing. Free, in-browser.",
    intro: [
      "Generate a placeholder image at whatever dimensions you need, with a custom background colour and label text showing the size.",
      "Placeholders exist to test layout rather than to look good. Building a page against real photographs hides problems, because a real image is usually the right shape — a placeholder that states its own dimensions makes it immediately obvious when a container is displaying an image at the wrong aspect ratio or scaling it unexpectedly.",
      "Test the awkward cases deliberately. Generate a very wide image and a very tall one and put them through the same component: layouts that look correct with well-behaved images frequently break when a user uploads a panorama or a portrait screenshot. Finding that during development is considerably cheaper than finding it in production.",
      "Images are generated in your browser rather than requested from a placeholder service, which means they work offline and do not depend on a third-party host staying available — a real consideration, since several popular placeholder services have gone offline over the years and broken every mockup referencing them.",
    ],
    howto: [
      "Enter the width and height you need.",
      "Set the background colour and any label text.",
      "Download the image, or generate extreme aspect ratios to test your layout.",
    ],
    faqs: [
      {
        q: "Why use a placeholder instead of a real image?",
        a: "Because a labelled placeholder makes layout problems visible. When the image states its own dimensions, it is immediately obvious if a container is distorting or unexpectedly scaling it — which a well-shaped real photo hides.",
      },
      {
        q: "What sizes should I test with?",
        a: "Include deliberately awkward ones — a very wide panorama and a very tall portrait. Layouts that work with typical images frequently break on extremes, and users upload extremes.",
      },
      {
        q: "Does this depend on an external service?",
        a: "No. Images are generated in your browser, so they work offline and cannot break because a third-party placeholder host disappears — which has happened to several popular services.",
      },
      {
        q: "Can I use these in production?",
        a: "They are intended for mockups and testing. Shipping placeholder images to real users looks unfinished — replace them before release.",
      },
    ],
  },

  // ---- Social Media ---------------------------------------------------------

  "hashtag-generator": {
    title: "Hashtag Generator — Relevant Tags for Any Post",
    description:
      "Generate relevant hashtags from your topic or caption, mixing broad and specific tags. Free and runs in your browser.",
    intro: [
      "Enter a topic or caption and get a set of related hashtags to use on your post.",
      "The instinct to use the biggest possible tags is usually counterproductive. A hashtag with millions of posts buries a new post within seconds, and the audience browsing it is broad and unfocused. Smaller, more specific tags have fewer competing posts and an audience that chose that niche deliberately — so a post stays visible longer and reaches people more likely to care.",
      "A workable approach is a mix across tiers: a few large tags for reach, a majority of mid-sized ones where you can realistically stay visible, and several highly specific ones where your post may remain among the top results for hours. The specific tags frequently do most of the actual work.",
      "Two practical cautions. Tags must genuinely describe the content — unrelated popular tags are penalised by every major platform and can suppress a post's distribution entirely. And limits differ: Instagram permits thirty per post while other platforms perform better with a handful, so the same set should not be pasted everywhere.",
    ],
    howto: [
      "Enter your topic, niche or caption.",
      "Review the suggested tags and pick a mix of broad, mid-size and specific ones.",
      "Copy the set, removing any that do not genuinely describe your post.",
    ],
    faqs: [
      {
        q: "Should I use the most popular hashtags?",
        a: "Not exclusively. Tags with millions of posts bury a new post within seconds. Smaller, specific tags have less competition and a more deliberately interested audience, so posts stay visible longer.",
      },
      {
        q: "How many hashtags should I use?",
        a: "It depends on the platform. Instagram allows thirty and tolerates a fuller set; other platforms generally perform better with a handful. Do not paste the same set everywhere.",
      },
      {
        q: "Can hashtags hurt a post?",
        a: "Yes. Unrelated popular tags are treated as spam by every major platform and can suppress distribution. Every tag should genuinely describe the content.",
      },
      {
        q: "Do hashtags still work?",
        a: "Less than they once did, since platforms increasingly rely on content understanding and engagement signals to categorise posts. They still help with discovery in niche communities, but they are no longer the main distribution mechanism.",
      },
    ],
  },

  "fancy-text-generator": {
    title: "Fancy Text Generator — Unicode Styles for Bios",
    description:
      "Convert text into unicode styles that render as bold, italic or script in bios and posts. Free and runs in your browser.",
    intro: [
      "Convert ordinary text into styled variants — bold, italic, script, monospace and others — that can be pasted into bios, usernames and posts where formatting is not normally allowed.",
      "It is worth understanding what actually happens, because it explains every quirk. This is not real formatting. It substitutes unicode mathematical alphanumeric symbols that happen to look like styled Latin letters. A 'bold A' is a distinct character with its own code point, not the letter A with a bold attribute. That is precisely why it survives in places that strip formatting — the platform sees ordinary characters and has nothing to remove.",
      "The accessibility cost is real and frequently overlooked. Screen readers announce these symbols individually, read them as their unicode names, or skip them entirely, so a bio written in fancy text can be completely incomprehensible to a blind visitor. Search within a platform also fails, since a search for your name in plain letters will not match the styled characters. Keep your actual name and any essential information in plain text.",
      "Support varies by device. A phone or computer without a font covering those code points shows empty boxes instead, so some visitors see nothing but placeholder squares where your text should be.",
    ],
    howto: [
      "Type your text into the box.",
      "Pick a style from the generated variants.",
      "Copy and paste it — keeping your name and key details in plain text.",
    ],
    faqs: [
      {
        q: "Why does this work where formatting is not allowed?",
        a: "Because it is not formatting. It substitutes different unicode characters that resemble styled letters, so the platform sees ordinary text and has nothing to strip.",
      },
      {
        q: "Is fancy text bad for accessibility?",
        a: "Yes, meaningfully. Screen readers announce these symbols individually, read out their unicode names, or skip them. A bio in fancy text can be unreadable to a blind visitor, so keep essential information in plain text.",
      },
      {
        q: "Why do some people see boxes instead of my text?",
        a: "Their device's font does not cover those code points, so it renders placeholder squares. Support is good on current phones and inconsistent elsewhere.",
      },
      {
        q: "Will people find me if I search my styled name?",
        a: "Probably not. Platform search matches actual characters, and styled text uses different ones — so a search in plain letters will not match. Keep your username searchable.",
      },
    ],
  },

  "youtube-embed": {
    title: "YouTube Embed Generator — Custom Embed Code",
    description:
      "Generate YouTube embed code with start time, autoplay, loop and privacy-enhanced mode options. Free and runs in your browser.",
    intro: [
      "Paste a YouTube URL and generate the iframe embed code, with options for start time, autoplay, looping and related-video behaviour.",
      "The option most worth using is privacy-enhanced mode, which embeds from youtube-nocookie.com instead of youtube.com. It prevents YouTube setting tracking cookies until a visitor actually plays the video, which reduces what you need to disclose under GDPR and similar regimes, and means an embedded video does not require consent before it is watched. Playback is otherwise identical.",
      "Two behaviours that surprise people. Autoplay is blocked by every modern browser unless the video is muted, because unexpected sound is a bad experience — an autoplay embed that is not muted simply will not start. And looping requires the playlist parameter set to the same video id as well as the loop parameter; loop alone does nothing on a single video, which is a long-standing quirk of the embed API.",
      "Performance is the hidden cost. A YouTube iframe pulls in a substantial amount of JavaScript on page load whether or not anyone plays the video, and several embeds on one page measurably affect load time. If videos sit below the fold, consider a click-to-load facade — a thumbnail that swaps in the real iframe only when clicked.",
    ],
    howto: [
      "Paste the YouTube video URL.",
      "Set your options — start time, autoplay, loop and privacy-enhanced mode.",
      "Copy the generated iframe code into your page.",
    ],
    faqs: [
      {
        q: "What does privacy-enhanced mode do?",
        a: "It embeds from youtube-nocookie.com, which stops YouTube setting tracking cookies until someone actually plays the video. That reduces your consent and disclosure obligations under GDPR, with identical playback.",
      },
      {
        q: "Why does autoplay not work?",
        a: "Modern browsers block autoplay with sound. The video must be muted to start automatically — an unmuted autoplay embed simply will not play.",
      },
      {
        q: "Why does my loop setting do nothing?",
        a: "Looping a single video requires the playlist parameter set to that same video id alongside the loop parameter. The loop parameter alone has no effect, which is a long-standing quirk of the embed API.",
      },
      {
        q: "Do embeds slow down my page?",
        a: "Yes. Each iframe loads substantial JavaScript on page load whether or not the video is played. For videos below the fold, use a thumbnail facade that swaps in the real iframe on click.",
      },
    ],
  },

  "social-character-counter": {
    title: "Social Character Counter — Limits for Every Platform",
    description:
      "Count characters against each platform's posting limit, from X to LinkedIn and Instagram. Free and runs in your browser.",
    intro: [
      "Count your text against the character limits for each major platform, so a post is not truncated on publication.",
      "The limits differ enough that a post written for one platform frequently will not fit another. They also change, which is why checking against a current count is safer than relying on a remembered number.",
      "The subtlety worth knowing is that not every character counts as one. Many platforms count by unicode code points, so an emoji can consume two units, and characters outside the basic Latin range often count for more than their apparent length. A post that looks comfortably within a limit can be rejected because of the emoji in it — which is why a counter that measures what the platform measures beats counting letters yourself.",
      "Truncation position matters as much as the limit. Most feeds cut a longer post with a 'see more' link after the first line or two, so the opening sentence does the real work regardless of the full limit. Writing the most important point first is more valuable than using every available character.",
    ],
    howto: [
      "Paste or type your post.",
      "Check the count against each platform's limit.",
      "Trim if needed, keeping the most important point in the opening line.",
    ],
    faqs: [
      {
        q: "Why does my post exceed the limit when it looks short enough?",
        a: "Because not every character counts as one. Emoji and characters outside the basic Latin range often consume two or more units, so a post with several emoji can exceed a limit that the visible letter count suggests it meets.",
      },
      {
        q: "Do links count toward the limit?",
        a: "It depends on the platform — some replace URLs with a fixed-length token regardless of the real length, others count every character. Check the count shown for the platform you are posting to.",
      },
      {
        q: "Should I use the full character limit?",
        a: "Not necessarily. Most feeds truncate after a line or two with a 'see more' link, so the opening sentence carries the weight. Leading with your main point matters more than filling the limit.",
      },
      {
        q: "Is my draft uploaded?",
        a: "No. Counting happens in your browser, so unpublished drafts stay on your device.",
      },
    ],
  },

  "utm-builder": {
    title: "UTM Builder — Campaign Tracking URL Generator",
    description:
      "Build tagged campaign URLs with utm_source, medium and campaign parameters for analytics. Free and runs in your browser.",
    intro: [
      "Build a URL with UTM parameters so analytics can attribute the traffic it brings to a specific campaign, channel or piece of content.",
      "Three parameters do the essential work. utm_source is where the traffic came from — a specific site, platform or newsletter. utm_medium is the type of channel: email, social, cpc, referral. utm_campaign names the specific initiative. Two optional ones, utm_term and utm_content, distinguish keywords and creative variants when you need to compare them.",
      "Consistency matters more than the naming scheme itself, because analytics tools treat these values as case-sensitive strings. Facebook, facebook and FaceBook become three separate sources in your reports, splitting one channel across three rows and making comparison useless. Agreeing a convention — lowercase throughout is the usual choice — and writing it down prevents months of unusable data.",
      "One important caution: never put UTM parameters on internal links between pages of your own site. Doing so restarts the session attribution, overwriting the original source with your internal tag, so a visitor who arrived from a search engine is recorded as arriving from your own campaign. This silently destroys attribution data and is a common and costly mistake.",
    ],
    howto: [
      "Enter the destination URL.",
      "Fill in source, medium and campaign, keeping to a consistent lowercase convention.",
      "Copy the tagged URL and use it only in external links.",
    ],
    faqs: [
      {
        q: "What is the difference between source and medium?",
        a: "Source is where the traffic came from specifically — a named site, platform or newsletter. Medium is the type of channel, such as email, social or cpc. Source answers which, medium answers what kind.",
      },
      {
        q: "Does capitalisation matter?",
        a: "Yes. Analytics tools treat these values as case-sensitive, so Facebook and facebook become separate sources and split one channel across multiple rows. Agree a convention — usually all lowercase — and stick to it.",
      },
      {
        q: "Can I use UTM parameters on internal links?",
        a: "No, and this is an important one. Tagging internal links restarts session attribution and overwrites the original source, so a visitor from search is recorded as coming from your own campaign. It silently corrupts your data.",
      },
      {
        q: "Do UTM parameters affect SEO?",
        a: "They can create duplicate URLs for the same content, so ensure your canonical tag points at the clean version. Search engines generally handle this well, but a correct canonical removes any ambiguity.",
      },
    ],
  },

  // ---- PDF & File Tools -----------------------------------------------------

  "pdf-esign": {
    title: "Sign PDF — Add Your Signature Free Online",
    description:
      "Draw or type a signature and place it on any PDF page. Runs in your browser, so the document is never uploaded. Free.",
    intro: [
      "Draw or type a signature, place it where it belongs on the page, and download the signed PDF.",
      "The privacy consideration matters more here than for almost any other tool. Documents that need signing are contracts, agreements, tenancy paperwork and financial forms — exactly the documents that should not be uploaded to an unknown server. Signing happens in your browser using PDF-lib, so the file is read into memory on your own machine and never transmitted.",
      "Be clear about what this produces. It adds a visual signature image to the page — the electronic equivalent of signing a printout and scanning it. That is what the large majority of everyday agreements ask for and it is widely accepted for them. It is not a cryptographic digital signature backed by a certificate authority, which is a different mechanism that binds the signature to the document's contents and to a verified identity, and makes tampering detectable.",
      "If a process specifically requires a qualified or advanced electronic signature — some property, legal and government processes do — use a service built for that. For a freelance contract, a rental agreement or a form returned by email, a visual signature is normally what is wanted.",
    ],
    howto: [
      "Open your PDF and draw or type your signature.",
      "Position it on the correct page and adjust the size.",
      "Download the signed document.",
    ],
    faqs: [
      {
        q: "Is a signature added here legally binding?",
        a: "It is the electronic equivalent of signing a printout and scanning it, which is accepted for most everyday agreements. It is not a cryptographic digital signature tied to a verified identity, so a process explicitly requiring a qualified signature needs a dedicated service.",
      },
      {
        q: "Is my document uploaded?",
        a: "No. Signing runs in your browser using PDF-lib, so contracts and financial documents never leave your device.",
      },
      {
        q: "Can the signature be removed or altered afterwards?",
        a: "The signature is drawn into the page like any other image, so it cannot be casually deleted — but this is not tamper-evident the way a cryptographic signature is. It does not prove the document was unchanged after signing.",
      },
      {
        q: "Can several people sign the same document?",
        a: "Yes, sequentially — each person signs the version passed to them and forwards the result. There is no built-in workflow for requesting signatures, since nothing is stored on a server.",
      },
    ],
  },

  "image-converter": {
    title: "Image Converter — PNG, JPG and WebP Conversion",
    description:
      "Convert images between PNG, JPG and WebP with quality control. Runs in your browser with nothing uploaded. Free and instant.",
    intro: [
      "Convert images between PNG, JPG and WebP, with control over quality for the lossy formats.",
      "Choosing the target format is the decision that matters. JPEG suits photographs, where lossy compression is nearly invisible and the savings are substantial, but it cannot store transparency and produces visible artefacts around sharp edges and text. PNG is lossless and supports transparency, making it right for logos, screenshots and anything with text or flat colour — at a considerably larger file size for photographs. WebP handles both cases and is typically 25-35% smaller than an equivalent JPEG at matching quality, with support in every current browser.",
      "The rule that saves the most trouble: converting away from a lossy format never restores what was lost. A JPEG converted to PNG becomes lossless from that point on, but the compression artefacts already baked in remain — you get a larger file containing the same degraded image. Always convert from the highest-quality original you have.",
      "Converting a PNG with transparency to JPEG discards the alpha channel entirely, and transparent areas usually become black or white. If transparency matters, the target must be PNG or WebP.",
    ],
    howto: [
      "Open the image you want to convert.",
      "Choose the target format and set the quality for JPEG or WebP.",
      "Download the converted file.",
    ],
    faqs: [
      {
        q: "Which format should I convert to?",
        a: "JPEG for photographs. PNG when you need transparency or sharp edges such as logos, screenshots and text. WebP for web use, where it is usually 25-35% smaller than JPEG at matching quality.",
      },
      {
        q: "Does converting a JPEG to PNG improve quality?",
        a: "No. It stops further loss from that point but cannot recover artefacts already baked in — you get a larger file containing the same degraded image. Always convert from the best original available.",
      },
      {
        q: "What happens to transparency when converting to JPEG?",
        a: "It is discarded, since JPEG has no alpha channel. Transparent areas typically become black or white. Convert to PNG or WebP if transparency must be preserved.",
      },
      {
        q: "Are my images uploaded?",
        a: "No. Conversion runs in your browser via the Canvas API, so files never leave your device.",
      },
    ],
  },

  "social-image-resizer": {
    title: "Social Image Resizer — Sizes for Every Platform",
    description:
      "Resize images to the exact dimensions each social platform expects, from Instagram to YouTube. Free and runs in your browser.",
    intro: [
      "Resize an image to the exact dimensions a platform expects, so it is not cropped automatically on upload.",
      "Every platform expects something different and crops without asking when the ratio does not match. Instagram feed posts are 1080x1080 square or 1080x1350 portrait; stories and reels are 1080x1920. YouTube thumbnails are 1280x720. A LinkedIn banner is 1584x396, and Facebook cover images differ again. Uploading the wrong ratio means the platform decides what to discard, usually by taking the centre — frequently through the subject or the text.",
      "The safest habit is to design with the crop in mind rather than only the final size. Several platforms display a different crop in the feed than on the post page, and profile images are shown as circles on some surfaces and squares on others. Keeping important content away from the edges means it survives whichever crop is applied.",
      "Resizing here happens in your browser via the Canvas API, so nothing is uploaded. Note that enlarging a small image cannot add detail that was never captured — scaling up produces a soft result, so always start from the largest original you have.",
    ],
    howto: [
      "Open your image and choose the target platform and placement.",
      "Adjust the crop so important content stays clear of the edges.",
      "Download the correctly sized image.",
    ],
    faqs: [
      {
        q: "What size should an Instagram post be?",
        a: "1080x1080 for square feed posts, 1080x1350 for portrait, and 1080x1920 for stories and reels. Portrait occupies more vertical space in the feed, which is why many accounts prefer it.",
      },
      {
        q: "Why does the platform still crop my image?",
        a: "Because several platforms show a different crop in the feed than on the post page, and profile images may be circular on some surfaces. Keep important content away from the edges so it survives any crop.",
      },
      {
        q: "Can I enlarge a small image to fit?",
        a: "You can resize it, but detail that was never captured cannot be added — scaling up produces a soft, blurry result. Always start from the largest original you have.",
      },
      {
        q: "Are my images uploaded?",
        a: "No. Resizing runs entirely in your browser, so images never leave your device.",
      },
    ],
  },

  "screen-recorder": {
    title: "Screen Recorder — Record Your Screen in-Browser",
    description:
      "Record your screen, a window or a tab directly in the browser and download the video. No install, no upload. Free.",
    intro: [
      "Record your whole screen, a single window or one browser tab, then download the resulting video. No extension or installation is required.",
      "This uses the browser's built-in screen capture API, so recording happens locally and the video is never uploaded. That matters for the usual reasons people record a screen — demonstrating a bug in an internal system, walking a colleague through a process, capturing something with customer data visible.",
      "Choosing what to share affects quality. Recording a single tab produces a sharper result at a smaller file size than recording the entire screen, because only that content is captured and nothing else changes between frames. Tab capture also avoids accidentally recording notifications, messages and other windows — which is the most common cause of having to re-record.",
      "Two practical notes. Audio needs explicit permission and behaves differently per source: system audio can generally be captured from a tab, while capturing it from a whole screen is not supported in every browser. And recordings are held in memory until you download them, so a very long session on a machine with limited memory can fail — for anything lengthy, record in segments.",
    ],
    howto: [
      "Choose whether to record the screen, a window or a single tab.",
      "Enable audio if you need it, then start recording.",
      "Stop when finished and download the video file.",
    ],
    faqs: [
      {
        q: "Do I need to install anything?",
        a: "No. It uses the browser's built-in screen capture API, so there is no extension or software to install.",
      },
      {
        q: "Is my recording uploaded?",
        a: "No. Recording happens locally and the file is saved directly to your device. Nothing is transmitted.",
      },
      {
        q: "Can I record audio?",
        a: "Yes, with permission, though behaviour varies by source. System audio can generally be captured when recording a tab; capturing it from a whole screen is not supported in every browser.",
      },
      {
        q: "Why did my long recording fail?",
        a: "Recordings are held in memory until downloaded, so a very long session can exhaust available memory. Record in segments for anything lengthy, and prefer tab capture, which produces smaller files.",
      },
    ],
  },

  // ---- Games ----------------------------------------------------------------

  "game-2048": {
    title: "2048 — Play the Sliding Tile Puzzle Free",
    description:
      "Play 2048 in your browser — slide and merge numbered tiles to reach 2048. Free, no download and no signup required.",
    intro: [
      "Slide tiles in four directions; identical numbers merge when they collide. Keep merging to reach the 2048 tile.",
      "The game rewards a specific discipline rather than quick reactions. The reliable strategy is to pick one corner and keep your largest tile there permanently, building a descending row along one edge. This works because a large tile is only useful when something equal appears next to it, and a big tile wandering the board blocks merges everywhere while waiting.",
      "The rule that follows from this is the one that matters: never press the direction that would move your largest tile out of its corner. On most boards that means using three directions almost exclusively and only using the fourth when there is genuinely no alternative. Most losses trace back to a single careless press that dislodged the anchor tile.",
      "A new tile appears after every move — usually a 2, occasionally a 4 — which is why the board fills faster than expected when you are making moves that do not merge anything. A move that merges nothing still adds a tile, so aimless sliding is actively harmful.",
    ],
    howto: [
      "Use arrow keys or swipe to slide all tiles in one direction.",
      "Keep your largest tile pinned in one corner and build a descending row along that edge.",
      "Avoid the direction that would move the largest tile out of its corner.",
    ],
    faqs: [
      {
        q: "What is the best strategy?",
        a: "Pick a corner and keep your largest tile there permanently, building a descending row along one edge. Use three directions almost exclusively and only the fourth when there is no alternative.",
      },
      {
        q: "Why did I lose so suddenly?",
        a: "Usually one press that moved the largest tile out of its corner, which breaks the descending row and blocks merges across the board. Recovery from that position is difficult.",
      },
      {
        q: "What is the highest possible tile?",
        a: "In theory 131,072, though even 8192 is rare. The standard win is 2048, after which you can keep playing and merging.",
      },
      {
        q: "Is my score saved?",
        a: "Your best score is kept in your browser's local storage, so it persists on this device and browser. It is not synced to an account.",
      },
    ],
  },

  snake: {
    title: "Snake Game — Play the Classic Free Online",
    description:
      "Play the classic Snake game in your browser. Eat, grow and avoid your own tail. Free, no download and no signup.",
    intro: [
      "Guide the snake to the food, grow longer with each one, and avoid running into the walls or your own tail.",
      "The difficulty is self-inflicted in a way few games manage: every success makes the game harder, because the tail you must avoid is the length you earned. Early play is trivial and late play is a genuine spatial planning problem in a shrinking space.",
      "The strategy that separates long games from short ones is keeping your movement predictable. Experienced players trace consistent patterns — following the walls and sweeping the board systematically — rather than heading straight for each piece of food. A direct route is fastest and reliably leaves the tail coiled in a shape that traps you a few moves later.",
      "The rule worth internalising: always leave yourself an exit. Before entering any enclosed area, check there is a route out that your tail will not have closed by the time you get there. Most deaths in Snake are not sudden mistakes but the consequence of a decision made several moves earlier.",
    ],
    howto: [
      "Use arrow keys or swipe to change direction.",
      "Eat the food to grow — you cannot reverse into yourself.",
      "Sweep the board in consistent patterns and always leave an exit route.",
    ],
    faqs: [
      {
        q: "How do I get a higher score?",
        a: "Move in predictable patterns, following the walls and sweeping systematically rather than heading straight for the food. Direct routes leave your tail coiled in shapes that trap you a few moves later.",
      },
      {
        q: "Why do I keep trapping myself?",
        a: "Because deaths usually follow a decision made several moves earlier. Before entering an enclosed area, check there is an exit your tail will not have closed by the time you reach it.",
      },
      {
        q: "Does the snake speed up?",
        a: "The pace increases as you grow, which combined with the longer tail is what makes late play difficult. The board does not change size — your available space does.",
      },
      {
        q: "Can I play on a phone?",
        a: "Yes. Swipe to change direction, and the game runs in the browser with nothing to install.",
      },
    ],
  },

  "tic-tac-toe": {
    title: "Tic-Tac-Toe — Play Against an Unbeatable AI",
    description:
      "Play Tic-Tac-Toe against an AI using minimax that plays a perfect game — you can draw, but never win. Free and runs in your browser.",
    intro: [
      "Play X against a computer opponent that uses the minimax algorithm to evaluate every possible continuation and choose an optimal move.",
      "You cannot win. That is not a difficulty setting — Tic-Tac-Toe is a solved game, meaning the outcome under perfect play from both sides is known, and it is a draw. The board is small enough that a computer can search every position to the end of the game, so the AI never makes a mistake for you to exploit. Every game you play well ends in a draw, and every game you play imperfectly ends in a loss.",
      "That makes drawing the actual objective, and it is a genuinely useful exercise. Achieving a draw reliably means recognising every threat one move before it completes and understanding which openings create two threats at once — a fork, which is unanswerable because blocking one completes the other.",
      "The practical principles: take the centre when it is available, since it is part of four winning lines while a corner is part of three and an edge only two. Block any line where your opponent has two marks and a gap. And watch for moves that create two threats simultaneously, both to make them and to prevent them — that is where games are actually decided.",
    ],
    howto: [
      "Click a square to place your mark.",
      "Take the centre when available, and block any two-in-a-row immediately.",
      "Watch for forks — moves creating two threats at once — from both sides.",
    ],
    faqs: [
      {
        q: "Can I beat the AI?",
        a: "No. It uses minimax to play optimally, and Tic-Tac-Toe is a solved game where perfect play from both sides always draws. A draw is the best available result and means you also played perfectly.",
      },
      {
        q: "What is minimax?",
        a: "An algorithm that searches every possible continuation, assuming both players play optimally, and picks the move with the best guaranteed outcome. Tic-Tac-Toe is small enough to search completely, so the AI never errs.",
      },
      {
        q: "What is a fork?",
        a: "A move creating two winning threats at once. It is unanswerable, because blocking one lets the other complete. Creating and preventing forks is where the game is genuinely decided.",
      },
      {
        q: "Is the centre really the best opening?",
        a: "Yes. The centre square is part of four winning lines, a corner three and an edge only two, so it offers the most opportunities and blocks the most.",
      },
    ],
  },

  // ---- AI Tools -------------------------------------------------------------

  "resume-bullet-generator": {
    title: "Resume Bullet Generator — Turn Duties into Wins",
    description:
      "Turn plain job duties into achievement-focused resume bullets with strong verbs and measurable results. Free, no signup.",
    intro: [
      "Describe what you did in a role and get back resume bullets rewritten as achievements rather than responsibilities.",
      "The difference this targets is the single biggest improvement most resumes can make. 'Responsible for the monthly reporting process' describes a job description; 'rebuilt the monthly reporting process, cutting close time from four days to six hours' describes a person. Recruiters read dozens of the former, and they say nothing about whether you were good at it.",
      "Numbers do a disproportionate amount of work, and most people believe they have none. They usually do: how many people, how much money, what percentage faster, how many customers, how much reduced. Even approximate figures are more informative than none — 'roughly 40% faster' is credible and specific in a way that 'significantly improved' is not.",
      "Two things to keep in mind when using the output. Start each bullet with a strong verb and state the result, not the intention. And every claim must be true and defensible — anything on a resume is fair material for an interview question, and a bullet you cannot expand on convincingly is worse than one you never wrote.",
    ],
    howto: [
      "Describe a responsibility in plain language, including any numbers you know.",
      "Review the rewritten achievement-focused bullets.",
      "Edit for accuracy — keep only what you can defend in an interview.",
    ],
    faqs: [
      {
        q: "What makes a good resume bullet?",
        a: "A strong opening verb, a specific action, and a measurable result. 'Responsible for reporting' describes the job; 'rebuilt reporting, cutting close time from four days to six hours' describes you.",
      },
      {
        q: "What if I have no numbers?",
        a: "You probably have more than you think — team size, budget, customer count, percentage improvement, time saved. Approximate figures are fine and far more informative than 'significantly improved'.",
      },
      {
        q: "Should I use the output as written?",
        a: "No — edit it for accuracy first. Everything on a resume is fair material for interview questions, and a bullet you cannot expand on convincingly does more harm than good.",
      },
      {
        q: "How many bullets per role?",
        a: "Three to five for recent, relevant roles and fewer for older ones. Quality matters more than volume — a long list dilutes the strongest points.",
      },
    ],
  },

  "slogan-generator": {
    title: "Slogan Generator — Taglines for Your Brand, Free",
    description:
      "Generate catchy slogan and tagline ideas from your brand name and what you do. Free, unlimited and no signup required.",
    intro: [
      "Enter your brand name and what you do, and get slogan and tagline ideas to work from.",
      "Treat the output as raw material rather than finished copy. Generated slogans are a way to break a blank page and find angles you had not considered — occasionally one lands nearly intact, but most sessions produce a phrase or a direction worth developing rather than a finished line.",
      "What separates a working slogan from a forgettable one is usually specificity. Lines that could belong to any company in any industry — 'quality you can trust', 'excellence delivered' — communicate nothing because they claim what every competitor also claims. The test is simple: if a competitor could use your slogan without changing a word, it is not doing any work.",
      "One practical caution before committing to a line: check it is not already in use. Slogans can be trademarked, and adopting one close to an established brand's invites a legal problem and forces a rebrand later. Search the phrase and check the relevant trademark register before printing anything.",
    ],
    howto: [
      "Enter your brand name and a short description of what you do.",
      "Generate ideas and shortlist any with a promising angle.",
      "Refine the best into something only your business could say, then check it is not already in use.",
    ],
    faqs: [
      {
        q: "Will a generated slogan be usable as-is?",
        a: "Occasionally, but treat the output as raw material. Most sessions produce an angle or phrase worth developing rather than a finished line.",
      },
      {
        q: "What makes a slogan effective?",
        a: "Specificity. If a competitor could use it unchanged, it is not working. Lines like 'quality you can trust' communicate nothing because everyone claims the same thing.",
      },
      {
        q: "Can I trademark a slogan?",
        a: "In many jurisdictions yes, if it is distinctive and used in commerce. Equally important, check your chosen line is not already registered by someone else before you print anything.",
      },
      {
        q: "How long should a slogan be?",
        a: "Short enough to remember without effort — typically three to seven words. Longer lines may read well but rarely stick, and the point of a slogan is that it is recalled.",
      },
    ],
  },

  // ---- Career ---------------------------------------------------------------

  "cover-letter": {
    title: "Cover Letter Builder — Free, No Signup Required",
    description:
      "Build a structured cover letter section by section and export it ready to send. Free, with no account or watermark.",
    intro: [
      "Build a cover letter with a clear structure: an opening that states the role, a middle that connects your experience to what the job asks for, and a close that proposes a next step.",
      "The structural rule that improves most letters is to write about the employer rather than yourself. A letter that opens 'I am a motivated professional seeking an opportunity' is about the applicant's wants; one that opens by naming something specific about the company or the role is about the reader. Recruiters read a great many of the former.",
      "The middle section should not restate your resume, which they already have. Its job is to connect two or three specific requirements from the posting to specific things you have actually done, and to explain the parts a resume cannot — a career change, a gap, why you are applying to this organisation in particular.",
      "Keep it to one page and mirror the posting's own language. If the advert says 'stakeholder management' and your letter says 'client liaison', a hurried reader may not connect them. Where a real name is available, use it — 'Dear Hiring Manager' is acceptable and a name is better.",
    ],
    howto: [
      "Enter the role, the company and what drew you to it specifically.",
      "Connect two or three requirements from the posting to things you have actually done.",
      "Close with a clear next step, then export the finished letter.",
    ],
    faqs: [
      {
        q: "How long should a cover letter be?",
        a: "One page, typically three or four short paragraphs. Anything longer is rarely read in full, and a concise letter suggests you can identify what matters.",
      },
      {
        q: "Should I repeat my resume?",
        a: "No — they already have it. Use the letter to connect specific requirements to specific things you have done, and to explain what a resume cannot: a career change, a gap, or why this organisation in particular.",
      },
      {
        q: "Do I need a different letter for every application?",
        a: "The specific parts, yes — why this company and why this role. Those sentences are what make it worth reading. The structure and your background can be reused.",
      },
      {
        q: "What if I cannot find the hiring manager's name?",
        a: "'Dear Hiring Manager' is perfectly acceptable. Avoid 'To Whom It May Concern', which reads as dated and impersonal. A real name is better where the posting or company site provides one.",
      },
    ],
  },

  "salary-calculator": {
    title: "Salary Calculator — Compare Pay and Take-Home",
    description:
      "Convert between hourly, monthly and annual pay and compare offers on a consistent basis. Free and runs in your browser.",
    intro: [
      "Convert pay between hourly, weekly, monthly and annual figures so offers quoted differently can be compared on the same basis.",
      "Comparing offers on salary alone is the most common mistake in this area. Total compensation includes employer pension or retirement contributions, health insurance, bonus structure, equity, holiday allowance and any allowances — and these differ enough between employers that a lower headline salary can be worth meaningfully more. An extra few percent in pension contributions is real money with real compounding.",
      "Cost of living matters as much as the number when comparing across locations. A salary that is 30% higher in a city where housing costs twice as much leaves you worse off in practice. Compare what remains after housing and commuting rather than the gross figure.",
      "For negotiation, a range from several sources beats a single figure. Published salary data lags the market, varies by company size and industry, and often mixes seniority levels within one job title. Triangulate before anchoring yourself to a number in a conversation — and remember that the first figure named tends to anchor the whole discussion.",
    ],
    howto: [
      "Enter a salary figure at whatever frequency you have it.",
      "Read the equivalent hourly, weekly, monthly and annual amounts.",
      "Compare offers on total compensation and cost of living, not headline salary.",
    ],
    faqs: [
      {
        q: "How do I compare two offers properly?",
        a: "On total compensation, not salary. Include pension or retirement contributions, health cover, bonus, equity and holiday allowance. A lower headline salary with better benefits is frequently worth more.",
      },
      {
        q: "How do I compare salaries in different cities?",
        a: "Compare what remains after housing and commuting rather than gross pay. A 30% higher salary where housing costs twice as much leaves you worse off in real terms.",
      },
      {
        q: "How reliable is published salary data?",
        a: "Directionally useful, precisely unreliable. It lags the market, varies by company size and industry, and often mixes seniority levels under one title. Use several sources to build a range.",
      },
      {
        q: "Does this show take-home pay after tax?",
        a: "It converts between pay frequencies. Take-home depends on your tax code, allowances, pension contributions and local rates — use an income tax calculator for your specific jurisdiction for a net figure.",
      },
    ],
  },

  // ---- Freelancing ----------------------------------------------------------

  "invoice-generator": {
    title: "Invoice Generator — Free Professional Invoices",
    description:
      "Create professional invoices with line items, tax and payment terms, then download as PDF. Free, no signup or watermark.",
    intro: [
      "Create a professional invoice with itemised work, tax and payment terms, and download it as a PDF ready to send.",
      "The fields that cause real problems when omitted are worth naming. A unique invoice number is required for your own bookkeeping and by most tax regimes, and duplicated numbers cause genuine trouble at year end. An explicit issue date and a specific due date matter because 'due on receipt' is unenforceably vague — 'payable within 14 days, by 15 August 2026' gives you something concrete when chasing. Full contact details for both parties and a clear line-item breakdown complete the picture.",
      "Tax treatment depends on your country, your registration status and where your client is based, and getting it wrong is expensive. Whether you charge VAT or GST, at what rate, and whether a reverse-charge applies on cross-border work all have jurisdiction-specific answers. The invoice gives you the fields; what belongs in them is worth confirming once with an accountant and then applying consistently.",
      "On getting paid: state payment terms before starting work, not on the invoice. An invoice is a request for money under terms that were already agreed — if the first mention of a 30-day term arrives with the bill, you have no basis to insist on it. Everything is generated in your browser, so client details and rates are never uploaded.",
    ],
    howto: [
      "Enter your details, the client's details and a unique invoice number.",
      "Add line items with rates, and set tax and an explicit due date.",
      "Download the PDF and send it.",
    ],
    faqs: [
      {
        q: "What must an invoice include?",
        a: "A unique invoice number, issue date, explicit due date, full contact details for both parties, itemised work with rates, the total, any tax shown separately with its rate, and your payment details. Requirements vary by country.",
      },
      {
        q: "Do I need to charge VAT or GST?",
        a: "It depends on your country, registration status and your client's location. Cross-border work often involves reverse-charge rules shifting the obligation to the client. Confirm your specific situation with an accountant.",
      },
      {
        q: "What payment terms should I use?",
        a: "Fourteen or thirty days, stated as an explicit date rather than 'on receipt'. Agree terms before starting work — an invoice requests payment under terms already agreed, not new ones.",
      },
      {
        q: "Is my client data stored anywhere?",
        a: "No. Invoices are generated in your browser and nothing is uploaded. Any saved details stay in your browser's local storage on this device.",
      },
    ],
  },

  "time-tracker": {
    title: "Time Tracker — Free Billable Hours Tracker",
    description:
      "Track time against projects and see billable hours totalled up. Saves in your browser with no account. Free and private.",
    intro: [
      "Start and stop a timer against a project, and see hours accumulate per project over a period.",
      "Track as you work rather than reconstructing at the end of the week. Retrospective estimates are consistently wrong and almost always low — the ten minutes here and twenty minutes there disappear entirely, and those fragments are precisely the time freelancers most often fail to bill. Over a month the gap between tracked and remembered time is routinely substantial.",
      "Tracked time is also the best defence in a scope disagreement. When a client feels a project took longer than expected, a record showing where the hours went converts an argument about impressions into a conversation about facts — and it usually reveals the specific rounds of revisions or added requests that caused the overrun.",
      "The data is useful beyond billing. Tracking consistently for a few months reveals which kinds of work take far longer than you estimate, which is the information that makes fixed-price quotes profitable rather than a gamble. Most freelancers discover they systematically underestimate one particular category of work.",
      "Everything is stored in your browser, so client and project names are never uploaded.",
    ],
    howto: [
      "Create a project and start the timer when you begin work.",
      "Stop it when you switch tasks — track as you go rather than reconstructing later.",
      "Review totals per project when invoicing.",
    ],
    faqs: [
      {
        q: "Why track as I go instead of estimating later?",
        a: "Because retrospective estimates are consistently low. Short fragments of work vanish from memory entirely, and those are exactly the hours freelancers most often fail to bill.",
      },
      {
        q: "How does tracking help with scope disputes?",
        a: "It converts an argument about impressions into a discussion of facts. A record of where hours went usually identifies the specific revision rounds or added requests that caused an overrun.",
      },
      {
        q: "How does this help with fixed-price quotes?",
        a: "Tracking consistently for a few months shows which work reliably takes longer than you estimate. Most freelancers systematically underestimate one category, and knowing which makes fixed pricing profitable rather than a gamble.",
      },
      {
        q: "Is my project data private?",
        a: "Yes. Everything is stored in your browser on this device and never uploaded, so client and project names stay local.",
      },
    ],
  },
};
