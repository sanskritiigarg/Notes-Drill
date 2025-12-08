/**
 * Split text into chunks for better AI processing
 * @param {string} text - Fill text to chunk
 * @param {number} chunkSize - Target size (words) per chunk
 * @param {number} overlap - Number of words to overlap between chunk to keep track of context
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length == 0) {
    return [];
  }

  //Clean text while preserving paragraph structure
  // g flag in regex for global search
  const cleanedText = text
    .replace(/\r\n/g, '\n') //Convert Windows line breaks to Unix
    .replace(/\s+/g, ' ') // Collapse multiple whitespaces into single space
    .replace(/\n /g, '\n') //Remove space after newline
    .replace(/ \n/g, '\n') //Remove space before newline
    .trim();

  // Split by paragraphs by paragraphs(single or double newlines)
  const paragraphs = cleanedText.split(/\n+/).filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  const pushChunk = (words, joinStr = '\n\n') => {
    chunks.push({
      content: words.join(joinStr),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
  };

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);

    // If single paragraph size > chunk size, save current chunk & split para into chunks
    if (paragraphWords.length > chunkSize) {
      if (currentChunk.length > 0) {
        pushChunk(currentChunk);
        currentChunk = [];
        currentWordCount = 0;
      }

      // Split large paragraph into word -based chunks
      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkwords = paragraphWords.slice(i, i + chunkSize);
        pushChunk(chunkwords, ' ');

        if (i + chunkSize >= paragraphWords.length) break;
      }
    }
    // if paragraph + currentChunk > chunkSize, save curr chunk
    else if (paragraphWords.length + currentWordCount > chunkSize && currentChunk.length > 0) {
      pushChunk(currentChunk);

      // create overlap with prev chunk
      const prevWords = currentChunk.join(' ').split(/\s+/);
      const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlap + paragraphWords.length;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWords.length;
    }
  }

  // add last chunk
  if (currentChunk.length > 0) {
    pushChunk(currentChunk);
  }

  // Fallback: if no chunks created, split by words
  if (chunks.length === 0 && cleanedText.length > 0) {
    const words = cleanedText.split(/\s+/);
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      pushChunk(chunkWords, ' ');

      if (i + chunkSize >= words.length) break;
    }
  }

  return chunks;
};

/**
 * Find relevant chunks based on keyword mathing
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxChunks - Maximum chunks to return
 * @returns {Array<Object>}
 */

export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  // Common words to exclude
  const stopWords = new Set([
    'the',
    'is',
    'at',
    'which',
    'on',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'with',
    'to',
    'for',
    'of',
    'as',
    'by',
    'this',
    'that',
    'it',
  ]);

  // Extract and clean query words
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // If no relevant query, return clean chunk objects without Mongoose metadata
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    //Score each query word
    for (const word of queryWords) {
      // Exact word match -> higher score
      const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      score += exactMatches * 3;

      // Partial word match -> lower score
      const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += partialMatches * 1.5;
    }

    // Bonus: Multiple query words found
    const uniqueWords = queryWords.filter((word) => content.includes(word)).length;
    if (uniqueWords > 1) {
      score += uniqueWords * 2;
    }

    // Normalize by content length(Relevance per unit length)
    const normalizedScore = score / Math.sqrt(contentWords);

    // Small bonus for earlier chunks
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    // Return clean object without Mongoose metadata
    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWords,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0 || chunk.rawScore > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
