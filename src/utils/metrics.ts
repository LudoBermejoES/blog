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

export function countWords(markdown: string): number {
	const text = extractText(markdown);
	if (!text) return 0;
	return text.split(/\s+/).filter(Boolean).length;
}

/**
 * 220 wpm is a common average for adult silent reading of general prose.
 * The upstream version also invented tokenCount, aiLatencyMs and aiConfidence
 * for the old AI-terminal layout; nothing renders those now.
 */
export function deriveMetrics(words: number) {
	const safeWords = Math.max(words, 1);
	return {
		readMinutes: Math.max(1, Math.ceil(safeWords / 220)),
		wordCount: words,
	};
}
