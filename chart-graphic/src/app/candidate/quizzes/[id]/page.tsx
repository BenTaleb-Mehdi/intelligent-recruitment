"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Chip } from "@/components/charts/atoms/Chip";
import { Indicator } from "@/components/charts/atoms/Indicator";
import { Alert } from "@/components/charts/molecules/Alert";

const QUIZ_QUESTIONS = [
  {
    question: "What is the primary advantage of Next.js App Router Server Components over standard Client Components?",
    options: [
      "They allow direct access to backend resources and databases without APIs.",
      "They reduce the bundle size sent to the client by rendering static content on the server.",
      "They automatically cache client-side component state parameters.",
      "They execute purely inside the user's browser runtime environment.",
    ],
    correctAnswer: 1,
  },
  {
    question: "How does React 19's compiler handle optimization natively compared to older versions?",
    options: [
      "It eliminates the need for manual useMemo and useCallback hooks in most cases.",
      "It parses external CSS styles and optimizes Tailwind color values automatically.",
      "It wraps all components with server-side hydration scripts.",
      "It checks prop types dynamically during runtime compilation.",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the correct way to import HeroUI v3 global styles inside a Next.js Tailwind CSS v4 environment?",
    options: [
      "Add a NextUIProvider wrapper in root layout files.",
      "Use @import \"@heroui/styles\" directly in your main CSS entry point.",
      "Import a legacy tailwind.config.js configuration file.",
      "Link external bootstrap stylesheets inside HTML headers.",
    ],
    correctAnswer: 1,
  },
  {
    question: "In React Aria Components (which HeroUI is built on), how are tooltips linked to trigger buttons?",
    options: [
      "Using ID selectors inside standard document script queries.",
      "Wrapping both elements inside a unified TooltipTrigger container.",
      "Setting ref attributes and state callbacks manually on mouse events.",
      "Passing absolute page coordinate offsets inside styling props.",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which Tailwind utility class is used to style elements only when dark mode is enabled on the document?",
    options: [
      "theme-dark:bg-slate-900",
      "dark:bg-slate-900",
      "media-dark:bg-[#151a22]",
      "css-dark:color-slate-900",
    ],
    correctAnswer: 1,
  },
];

export default function CandidateQuizRoom() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, finished]);

  // Format time (MM:SS)
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const handleSelectOption = (optIdx: number) => {
    if (finished) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optIdx,
    });
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(Math.round((correctCount / QUIZ_QUESTIONS.length) * 100));
    setFinished(true);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-default-100 dark:border-default-50/10 pb-4">
        <div>
          <span className="text-xs font-semibold text-default-450 uppercase tracking-wider">Assessment Room</span>
          <h1 className="text-xl font-bold tracking-tight">React Core Architecture Quiz</h1>
        </div>
        {!finished && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-slate-800 rounded-xl font-mono text-sm font-bold text-accent">
            <Icon icon="solar:clock-circle-bold" className="text-base shrink-0 animate-spin" />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      {finished ? (
        // Results Screen
        <div className="space-y-6">
          <Alert
            status={score >= 80 ? "success" : "warning"}
            title={score >= 80 ? "Quiz Passed Successfully!" : "Quiz Completed"}
            description={`You achieved a compatibility rating of ${score}% in technical skills.`}
          />

          <Card>
            <Card.Header>
              <div>
                <Card.Title>AI Evaluation Grade Card</Card.Title>
                <Card.Description>Summary report generated by AI models</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="space-y-6">
              <div className="text-center py-6 bg-blue-50/10 dark:bg-[#1a202c]/30 rounded-xl border border-blue-100/50 dark:border-slate-850">
                <span className={`text-4xl font-black ${score >= 80 ? "text-success" : "text-warning"}`}>
                  {score}%
                </span>
                <p className="text-xs text-default-450 font-medium mt-1">Final Score Grade</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Feedback Summary</h4>
                <p className="text-sm text-default-550 leading-relaxed">
                  {score >= 80
                    ? "Excellent frontend capabilities. Your score confirms a high density of matching skills required by ViteTech Solutions. We have updated your employability index accordingly."
                    : "Review some missing core principles (Next.js server-side configurations). You can retake another AI-generated skills evaluation in 7 days to improve this matching rating."}
                </p>
              </div>
            </Card.Content>
            <Card.Footer className="flex justify-between gap-4">
              <Link href="/candidate/quizzes" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Assessments
                </Button>
              </Link>
              <Link href="/candidate/dashboard" className="flex-1">
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </div>
      ) : (
        // Active Quiz Screen
        <div className="space-y-6">
          {/* Question Counter Card */}
          <Card>
            <Card.Content className="p-6 space-y-6">
              <div className="flex justify-between items-center text-xs font-semibold text-default-450 border-b border-default-100 dark:border-default-50/10 pb-4">
                <span>Evaluation Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                <Chip variant="soft">Single Choice QCM</Chip>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold text-default-900 dark:text-default-50 leading-relaxed">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {QUIZ_QUESTIONS[currentQuestion].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestion] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={[
                        "w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between",
                        isSelected
                          ? "border-accent bg-accent/5 text-accent font-semibold shadow-sm shadow-accent/5"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/10 hover:border-accent/40 dark:hover:border-slate-700 hover:bg-blue-50/20 dark:hover:bg-slate-800/20",
                      ].join(" ")}
                    >
                      <span>{opt}</span>
                      <div className={[
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3",
                        isSelected ? "border-accent bg-accent" : "border-slate-300 dark:border-slate-700",
                      ].join(" ")}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card.Content>
            {/* Nav controls footer */}
            <Card.Footer className="justify-between border-t border-slate-100 dark:border-slate-800/80">
              <Button
                startIcon="solar:alt-arrow-left-bold"
                variant="outline"
                onClick={handlePrev}
                isDisabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion === QUIZ_QUESTIONS.length - 1 ? (
                <Button
                  startIcon="solar:verified-check-bold"
                  variant="primary"
                  onClick={handleSubmit}
                  isDisabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Finish & Submit
                </Button>
              ) : (
                <Button
                  endIcon="solar:alt-arrow-right-bold"
                  variant="primary"
                  onClick={handleNext}
                  isDisabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Next Question
                </Button>
              )}
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
}
