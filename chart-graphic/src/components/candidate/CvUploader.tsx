"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "@/components/charts/molecules/Card";
import { Button } from "@/components/charts/atoms/Button";
import { Indicator } from "@/components/charts/atoms/Indicator";

interface CvUploaderProps {
  fileName: string;
  onChange: (fileName: string) => void;
}

export default function CvUploader({ fileName, onChange }: CvUploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0].name);
    }
  };

  return (
    <Card>
      <Card.Header>
        <div>
          <Card.Title>Curriculum Vitae (CV)</Card.Title>
          <Card.Description>Primary resume parsed by AI for skill matching</Card.Description>
        </div>
        <Icon icon="solar:document-text-bold-duotone" className="text-xl text-accent" />
      </Card.Header>
      <Card.Content className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[180px]",
            dragOver
              ? "border-accent bg-accent/5"
              : "border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/10 hover:border-accent/40 dark:hover:border-slate-700",
          ].join(" ")}
        >
          <div className="p-3 bg-accent/15 text-accent rounded-full mb-3 shadow-sm">
            <Icon icon="solar:cloud-upload-bold" className="text-2xl" />
          </div>
          <h4 className="text-sm font-bold text-default-800 dark:text-default-250">
            {dragOver ? "Drop file to upload!" : "Drag & drop your CV file here"}
          </h4>
          <p className="text-xs text-default-450 mt-1">Supports PDF, DOCX or TXT up to 10MB</p>
          <input 
            type="file" 
            id="cv-file" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0].name);
              }
            }} 
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4" 
            onClick={() => document.getElementById("cv-file")?.click()}
          >
            Browse Files
          </Button>
        </div>

        {/* Uploaded File status */}
        {fileName && (
          <div className="flex items-center justify-between p-3.5 bg-blue-50/20 dark:bg-slate-800/20 border border-blue-100/50 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <Icon icon="solar:document-bold" className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-default-800 dark:text-default-200 truncate">{fileName}</p>
                <p className="text-[10px] text-default-400 font-semibold uppercase">Parsed by AI Matcher • 2 mins ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Indicator status="success" label="Active" />
              <button
                onClick={() => onChange("")}
                className="p-1.5 text-default-400 hover:text-danger rounded-lg transition-colors"
                title="Remove file"
              >
                <Icon icon="solar:trash-bin-trash-bold" className="text-base" />
              </button>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
