"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Indicator } from "./Indicator";
import { Alert } from "./Alert";
import { api } from "@/lib/api";

interface CvUploaderProps {
  fileName: string;
  onChange: (fileName: string) => void;
}

export default function CvUploader({ fileName, onChange }: CvUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    status: "success" | "danger" | "warning" | "default";
    title: string;
    description: string;
  } | null>(null);

  const handleFileUpload = async (file: File) => {
    setAlertInfo(null);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setAlertInfo({
        status: "danger",
        title: "Invalid File Format",
        description: "Only PDF (.pdf) files are allowed for CV upload.",
      });
      return;
    }

    setIsUploading(true);
    setAlertInfo({
      status: "warning",
      title: "Analyzing CV & Parsing Profile Details",
      description: "Please wait a moment while the AI parses your resume. Your profile details, experiences, education, languages, and projects will update automatically.",
    });

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response: any = await api.upload("/api/cvs/upload", formData);

      if (response.success && (response.data?.cvPath || response.data?.viewUrl)) {
        onChange(response.data.cvPath || response.data.viewUrl);
        setAlertInfo({
          status: "success",
          title: "CV Uploaded Successfully",
          description: "Your resume has been uploaded. AI extraction is now running to populate your profile details, education, languages, projects, and experiences automatically.",
        });
      } else {
        setAlertInfo({
          status: "danger",
          title: "Upload Failed",
          description: "Failed to upload CV file to MongoDB GridFS.",
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setAlertInfo({
        status: "danger",
        title: "Upload Error",
        description: err.message || "Failed to upload CV file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getDisplayName = (path: string) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const getFileUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <Card>
      <Card.Header>
        <div>
          <Card.Title>Curriculum Vitae (CV)</Card.Title>
          <Card.Description>Upload your resume (PDF format only)</Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="space-y-6">
        {alertInfo && (
          <Alert
            status={alertInfo.status}
            title={alertInfo.title}
            description={alertInfo.description}
          />
        )}


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
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-default-600">Uploading your PDF to MongoDB GridFS...</p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-accent/15 text-accent rounded-full mb-3 shadow-sm">
                <Icon icon="solar:cloud-upload-bold" className="text-2xl" />
              </div>
              <h4 className="text-sm font-bold text-default-800 dark:text-default-250">
                {dragOver ? "Drop PDF to upload!" : "Drag & drop your PDF CV here"}
              </h4>
              <p className="text-xs text-default-450 mt-1">Supports PDF format only (up to 20MB)</p>

              <input 
                type="file" 
                id="cv-file" 
                className="hidden" 
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
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
            </>
          )}
        </div>

        {/* Uploaded File status */}
        {fileName && (
          <div className="flex items-center justify-between p-3.5 bg-blue-50/20 dark:bg-slate-800/20 border border-blue-100/50 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <Icon icon="solar:document-bold" className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-default-800 dark:text-default-200 truncate">
                  {getDisplayName(fileName)}
                </p>
                <a
                  href={getFileUrl(fileName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <Icon icon="solar:download-minimalistic-bold" className="text-xs" />
                  View / Download Saved CV
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Indicator status="success" label="Saved on DB" />
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
