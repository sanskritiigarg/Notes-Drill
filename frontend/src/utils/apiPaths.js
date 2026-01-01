export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    PROFILE: '/api/users/profile',
    UPDATE_PASSWORD: '/api/users/change-password',
  },
  DOCUMENT: {
    UPLOAD: '/api/documents/upload',
    GET_ALL_DOCS: '/api/documents/',
    DOC_BY_ID: (id) => `/api/documents/${id}`,
  },
  FLASHCARDS: {
    GET_ALL_FOR_USER: '/api/flashcards',
    GET_ALL_FOR_DOC: (documentId) => `/api/flashcards/${documentId}`,
    GET_BY_ID: (id) => `/api/flashcards/flashcard/${id}`,
    REVIEW_FLASHCARD: (cardId) => `/api/flashcards/${cardId}/review`,
    STAR_FLASHCARD: (cardId) => `/api/flashcards/${cardId}/star`,
    DELETE: (id) => `/api/flashcards/${id}`,
  },
  QUIZ: {
    GET_QUIZ_FOR_DOC: (documentId) => `/api/quizzes/${documentId}`,
    GET_QUIZ_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
    SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,
    GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/results`,
    DELETE_QUIZ: (id) => `/api/quizzes/${id}`,
  },
  PROGRESS: {
    DASHBOARD: '/api/progress/dashboard',
  },
  AI: {
    GENERATE_FLASHCARDS: '/api/ai/generate-flashcards',
    GENERATE_QUIZ: '/api/ai/generate-quiz',
    GENERATE_SUMMARY: '/api/ai/generate-summary',
    EXPLAIN_CONCEPT: '/api/ai/explain-concept',
    CHAT: '/api/ai/chat',
    CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
  },
};
