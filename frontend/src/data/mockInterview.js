export const mockQuestions = [
  {
    id: 1,
    day: 12,
    topic: 'Prompt Engineering Fundamentals',
    difficulty: 'Foundation',
    adaptiveCue: 'Local demo question grounded in Day 12 of the curriculum',
    question:
      'You need an LLM to return consistent JSON for a support-ticket router. How would you structure the prompt, and what failure cases would you plan for?',
  },
  {
    id: 2,
    day: 12,
    topic: 'Prompt Engineering Fundamentals',
    difficulty: 'Applied follow-up',
    adaptiveCue: 'Follow-up based on your previous reasoning',
    question:
      'Suppose the same prompt works in testing but becomes unreliable with long customer messages. How would you diagnose and improve it without immediately changing models?',
  },
  {
    id: 3,
    day: 11,
    topic: 'RAG End-to-End & LLM API Basics',
    difficulty: 'Core concept',
    adaptiveCue: 'Local demo question grounded in Day 11 of the curriculum',
    question:
      'Walk me through a retrieval-augmented generation pipeline from document ingestion to the final answer. Where can relevance be lost?',
  },
  {
    id: 4,
    day: 11,
    topic: 'RAG End-to-End & LLM API Basics',
    difficulty: 'Adaptive probe',
    adaptiveCue: 'Mock follow-up that deepens the previous retrieval question',
    question:
      'Your retriever returns semantically similar chunks, but the final answers are still factually wrong. What would you measure and change first?',
  },
  {
    id: 5,
    day: 22,
    topic: 'Multi-Agent Orchestration',
    difficulty: 'System design',
    adaptiveCue: 'Local demo question grounded in Day 22 of the curriculum',
    question:
      'Design a small research agent that can search notes, summarize evidence, and stop safely. What state, tools, and guardrails would it need?',
  },
  {
    id: 6,
    day: 22,
    topic: 'Multi-Agent Orchestration',
    difficulty: 'Scenario follow-up',
    adaptiveCue: 'Testing practical judgment and control flow',
    question:
      'The agent keeps calling the same tool with slightly different inputs. How would you detect the loop and recover while preserving useful work?',
  },
  {
    id: 7,
    day: 25,
    topic: 'Chatbot Evaluation & Testing',
    difficulty: 'Evaluation design',
    adaptiveCue: 'Local demo question grounded in Day 25 of the curriculum',
    question:
      'How would you create an evaluation set for an AI interview assistant? Include both answer quality and product-safety criteria.',
  },
  {
    id: 8,
    day: 25,
    topic: 'Chatbot Evaluation & Testing',
    difficulty: 'Synthesis',
    adaptiveCue: 'Final question combines all four learning areas',
    question:
      'If offline scores improve but candidates report a worse interview experience, how would you investigate the mismatch and decide what to ship?',
  },
]

export const mockCoverageDays = mockQuestions.reduce((days, question) => {
  if (!days.some((item) => item.day === question.day)) {
    days.push({ day: question.day, title: question.topic })
  }
  return days
}, [])

export const mockFeedback = {
  score: 82,
  summary:
    'A strong practical performance with clear systems thinking. You connected implementation choices to user impact and handled adaptive follow-ups with good structure.',
  strengths: [
    'Breaks ambiguous AI problems into testable components',
    'Explains agent guardrails with practical failure modes',
    'Communicates trade-offs clearly and concisely',
  ],
  gaps: [
    'Retrieval evaluation could include more ranking metrics',
    'Model-quality answers need clearer acceptance thresholds',
  ],
  nextSteps: [
    'Build a small RAG evaluation set with hard negatives',
    'Practice defining latency, quality, and safety thresholds',
    'Compare agent loop-recovery strategies in one prototype',
  ],
  competencies: [
    { label: 'Technical depth', value: 84 },
    { label: 'Problem solving', value: 88 },
    { label: 'Communication', value: 79 },
  ],
}
