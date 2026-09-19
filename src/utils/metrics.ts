/**
 * Reading metrics derived from a post body at build time, so an author never
 * fills `readMinutes` or `wordCount` in by hand.
 */

export function extractText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
		.replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/[*_~>#-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/*
  Scripts written without spaces between words, split by reading cost.

  Han carries a whole morpheme per glyph and is read slowest. Kana are phonetic
  and read roughly twice as fast, which is why a rate per *script* beats a rate
  per language: Japanese prose mixes both in a ratio that varies by text, and
  Chinese is Han-only, so both fall out of the same arithmetic with no language
  detection and no locale argument.

  Hangul is deliberately in neither. Korean puts spaces between eojeol, so it
  already counts correctly as words — folding it in here would break the one
  East Asian locale that was never broken.
*/
const HAN = /[㐀-䶿一-鿿豈-﫿]/g;
const KANA = /[぀-ヿㇰ-ㇿｦ-ﾟ]/g;

export interface TextStats {
	/** Whitespace-separated words, once spaceless characters are removed. */
	words: number;
	hanChars: number;
	kanaChars: number;
	/** The figure shown to the reader: words for spaced scripts, characters otherwise. */
	units: number;
}

/**
 * Counts a body in whichever unit its script actually uses.
 *
 * Splitting on whitespace alone reports a whole Japanese or Chinese post as a
 * dozen "words", because those scripts do not separate words with spaces — the
 * Japanese translation of a 349-word Spanish post counted 14. Mixed bodies are
 * handled by counting each part in its own unit and adding them.
 */
export function countText(markdown: string): TextStats {
	const text = extractText(markdown);
	if (!text) return { words: 0, hanChars: 0, kanaChars: 0, units: 0 };

	const hanChars = (text.match(HAN) ?? []).length;
	const kanaChars = (text.match(KANA) ?? []).length;
	const words = text
		.replace(HAN, ' ')
		.replace(KANA, ' ')
		.split(/\s+/)
		.filter(Boolean).length;

	return { words, hanChars, kanaChars, units: words + hanChars + kanaChars };
}

/*
  220 words per minute is a common average for adult silent reading of Latin
  prose. The character rates are the usual cited ranges for each script, taken
  near the middle: Han around 300/min, kana around 600/min.

  These are approximations and the UI says so by prefixing the result with "~".
*/
const WORDS_PER_MINUTE = 220;
const HAN_CHARS_PER_MINUTE = 300;
const KANA_CHARS_PER_MINUTE = 600;

export function deriveMetrics(stats: TextStats) {
	const minutes =
		stats.words / WORDS_PER_MINUTE +
		stats.hanChars / HAN_CHARS_PER_MINUTE +
		stats.kanaChars / KANA_CHARS_PER_MINUTE;

	return {
		/*
		  Rounded, not ceilinged. The Japanese translation of this post lands at
		  2.03 minutes; ceiling turned that into "~3 min", overstating a two
		  minute read by half while the Spanish original showed "~2". For a
		  figure the UI already hedges with "~", rounding is the honest choice.
		*/
		readMinutes: Math.max(1, Math.round(minutes)),
		wordCount: stats.units,
	};
}
