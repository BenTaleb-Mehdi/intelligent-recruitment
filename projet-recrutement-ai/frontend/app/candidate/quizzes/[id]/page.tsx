"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card } from "@/components/candidate/Card";
import { Button } from "@/components/candidate/Button";
import { Chip } from "@/components/candidate/Chip";
import { Alert } from "@/components/candidate/Alert";
import { api } from "@/lib/api";

export default function CandidateQuizRoom() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load quiz from database
  const loadQuiz = async () => {
    try {
      const res: any = await api.get("/api/candidates/quizzes");
      if (res.success && Array.isArray(res.data)) {
        const found = res.data.find((q: any) => q.id === params.id);
        if (found) {
          setQuiz(found);
          setQuestions(found.questions || []);
          if (found.duration) {
            setTimeLeft(found.duration * 60);
          }
        }
      }
    } catch (e) {
      console.error("Error loading quiz:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [params.id]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || finished || loading) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, finished, loading]);

  // Format time (MM:SS)
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const currentQ = questions[currentQuestion];
  const correctArr = useMemo(() => {
    if (!currentQ) return [];
    if (Array.isArray(currentQ.correctAnswers)) return currentQ.correctAnswers.map((x: any) => Number(x));
    if (Array.isArray(currentQ.correctAnswer)) return currentQ.correctAnswer.map((x: any) => Number(x));

    const val = currentQ.correctAnswer !== undefined ? currentQ.correctAnswer : currentQ.correctAnswers;
    const num = typeof val === "number" ? val : parseInt(val, 10);
    if (isNaN(num)) return [];

    const indices: number[] = [];
    for (let i = 0; i < 8; i++) {
      if ((num & (1 << i)) !== 0) {
        indices.push(i);
      }
    }
    return indices.length > 0 ? indices : [num >= 0 ? num : 0];
  }, [currentQ]);

  const isMultipleChoice = correctArr.length > 1;

  const handleSelectOption = (optIdx: number) => {
    if (finished) return;
    const currentSelected = selectedAnswers[currentQuestion] || [];

    if (isMultipleChoice) {
      // Checkbox mode (multiple choice)
      const exists = currentSelected.includes(optIdx);
      const updated = exists
        ? currentSelected.filter((i) => i !== optIdx)
        : [...currentSelected, optIdx];
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: updated,
      });
    } else {
      // Radio mode (single choice)
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: [optIdx],
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx] || [];
      let correctArr: number[] = [];
      if (Array.isArray(q.correctAnswers)) {
        correctArr = q.correctAnswers;
      } else if (Array.isArray(q.correctAnswer)) {
        correctArr = q.correctAnswer;
      } else if (typeof q.correctAnswer === "number") {
        correctArr = [q.correctAnswer];
      }

      const sSorted = [...selected].sort();
      const cSorted = [...correctArr].sort();
      const isExactMatch =
        sSorted.length === cSorted.length &&
        sSorted.every((val, index) => val === cSorted[index]);

      if (isExactMatch || (correctArr.length > 0 && selected.some((s) => correctArr.includes(s)))) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);

    try {
      const response: any = await api.post(`/api/candidates/quizzes/${params.id}/submit`, {
        score: finalScore
      });
      if (response.success) {
        setFinished(true);
      }
    } catch (err) {
      console.error("Error submitting quiz result:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-default-450 font-bold max-w-3xl mx-auto py-24">
        <Icon icon="solar:spinner-bold" className="animate-spin text-3xl mx-auto mb-2 text-accent" />
        Loading Quiz Room...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-danger font-bold max-w-3xl mx-auto py-24">
        No questions found for this quiz.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-default-100 dark:border-default-50/10 pb-4">
        <div>
          <span className="text-xs font-semibold text-default-450 uppercase tracking-wider">Assessment Room</span>
          <h1 className="text-xl font-bold tracking-tight">{quiz?.title || "React Core Architecture Quiz"}</h1>
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
            status={score >= 70 ? "success" : "warning"}
            title={score >= 70 ? "Quiz Passed Successfully!" : "Quiz Completed"}
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
                <span className={`text-4xl font-black ${score >= 70 ? "text-success" : "text-warning"}`}>
                  {score}%
                </span>
                <p className="text-xs text-default-450 font-medium mt-1">Final Score Grade</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-default-400 uppercase tracking-wider">Feedback Summary</h4>
                <p className="text-sm text-default-550 leading-relaxed">
                  {score >= 70
                    ? "Excellent frontend capabilities. Your score confirms a high density of matching skills required by sponsor company. We have updated your employability index accordingly."
                    : "Review some missing core principles. You can retake another AI-generated skills evaluation in 7 days to improve this matching rating."}
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
                <span>Evaluation Question {currentQuestion + 1} of {questions.length}</span>
                <Chip variant="soft">
                  {isMultipleChoice ? "Choix Multiple (Checkboxes)" : "Choix Unique (Radio)"}
                </Chip>
              </div>

              {/* Question Text */}
              <h3 className="text-base font-bold text-default-900 dark:text-default-50 leading-relaxed">
                {questions[currentQuestion]?.text}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {Array.isArray(questions[currentQuestion]?.options) && 
                  questions[currentQuestion].options.map((opt: string, optIdx: number) => {
                    const currentSelected = selectedAnswers[currentQuestion] || [];
                    const isSelected = currentSelected.includes(optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={[
                          "w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between cursor-pointer",
                          isSelected
                            ? "border-accent bg-accent/5 text-accent font-semibold shadow-sm shadow-accent/5"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/10 hover:border-accent/40 dark:hover:border-slate-700 hover:bg-blue-50/20 dark:hover:bg-slate-800/20",
                        ].join(" ")}
                      >
                        <span>{opt}</span>

                        {isMultipleChoice ? (
                          /* Square Checkbox for Multiple Answers */
                          <div className={[
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ml-3 transition-all",
                            isSelected ? "border-accent bg-accent text-white shadow-sm" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
                          ].join(" ")}>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        ) : (
                          /* Round Radio Button for Single Answer */
                          <div className={[
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all",
                            isSelected ? "border-accent bg-accent text-white shadow-sm" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
                          ].join(" ")}>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })
                }
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

              {currentQuestion === questions.length - 1 ? (
                <Button
                  startIcon="solar:verified-check-bold"
                  variant="primary"
                  onClick={handleSubmit}
                  isDisabled={!selectedAnswers[currentQuestion] || selectedAnswers[currentQuestion].length === 0}
                >
                  Finish & Submit
                </Button>
              ) : (
                <Button
                  endIcon="solar:alt-arrow-right-bold"
                  variant="primary"
                  onClick={handleNext}
                  isDisabled={!selectedAnswers[currentQuestion] || selectedAnswers[currentQuestion].length === 0}
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
