"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Key } from "@heroui/react";
import { Label, ListBox, Select, Pagination } from "@heroui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import data from "@/data/applicants.json";

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Nouveau" | "Entretien" | "En cours" | "Refusé";
  appliedDate: string;
  skills: string[];
  experience: string;
  rating: number;
}

const statusStyles: Record<Applicant["status"], string> = {
  Nouveau: "bg-blue-50 text-blue-700 border-blue-100/80",
  Entretien: "bg-amber-50 text-amber-700 border-amber-100/80",
  "En cours": "bg-purple-50 text-purple-700 border-purple-100/80",
  Refusé: "bg-rose-50 text-rose-700 border-rose-100/80",
};

const ALL_STATUSES: Applicant["status"][] = ["Nouveau", "Entretien", "En cours", "Refusé"];

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Key[]>(ALL_STATUSES);
  const [minScore, setMinScore] = React.useState<Key>("0");

  const applicants = data.applicants as Applicant[];

  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 5;

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.skills.some((s) => s.toLowerCase().includes(q));

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(a.status);
      const matchesScore = a.rating >= Number(minScore);

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [searchQuery, selectedStatuses, minScore, applicants]);

  // Reset page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery, selectedStatuses, minScore]);

  const paginatedApplicants = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filteredApplicants.slice(start, start + PAGE_SIZE);
  }, [filteredApplicants, pageIndex]);

  const pageCount = Math.ceil(filteredApplicants.length / PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const paginationStart = filteredApplicants.length > 0 ? pageIndex * PAGE_SIZE + 1 : 0;
  const paginationEnd = Math.min((pageIndex + 1) * PAGE_SIZE, filteredApplicants.length);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/jobs"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidats - Offre #{jobId}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Consultez et gérez les candidatures reçues pour cette offre.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-center bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
          {filteredApplicants.length} candidat{filteredApplicants.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
        <div className="relative flex-1">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou compétence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-medium"
          />
        </div>

        <Select
          className="w-full sm:w-[220px]"
          placeholder="Sélectionner les statuts"
          selectionMode="multiple"
          value={selectedStatuses}
          onChange={(keys) => setSelectedStatuses(keys as Key[])}
        >
          <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
            <Select.Value className="text-left" />
            <Select.Indicator>
              <Icon icon="solar:alt-arrow-down-linear" className="w-3 h-3 text-slate-400" />
            </Select.Indicator>
          </Select.Trigger>
          <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 mt-1 min-w-[220px]">
            <ListBox selectionMode="multiple" className="text-xs font-medium text-slate-600">
              {ALL_STATUSES.map((status) => (
                <ListBox.Item
                  key={status}
                  id={status}
                  textValue={status}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center"
                >
                  {status}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="w-full sm:w-[160px]"
          placeholder="Note minimum"
          selectedKey={minScore}
          onSelectionChange={(key) => setMinScore(key ?? "0")}
        >
          <Select.Trigger className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 h-10 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
            <div className="flex items-center gap-1.5">
              <Select.Value className="text-left" />
            </div>
            <Select.Indicator>
              <Icon icon="solar:alt-arrow-down-linear" className="w-3 h-3 text-slate-400" />
            </Select.Indicator>
          </Select.Trigger>
          <Select.Popover className="border border-slate-200/80 shadow-lg rounded-xl bg-white p-1 z-30 mt-1 min-w-[160px]">
            <ListBox className="text-xs font-medium text-slate-600">
              <ListBox.Item id="0" textValue="Toutes les notes" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                Toutes les notes
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="3" textValue="3+" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                3+
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="3.5" textValue="3.5+" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                3.5+
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="4" textValue="4+" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                4+
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="4.5" textValue="4.5+" className="px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer flex justify-between items-center">
                4.5+
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Candidat
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Contact
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Statut
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Compétences
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Expérience
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Note
                </th>
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Date
                </th>
                <th className="text-center font-bold text-slate-400 uppercase tracking-wider py-3.5 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.length > 0 ? (
                paginatedApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {applicant.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-600">{applicant.email}</span>
                        <span className="text-slate-400">{applicant.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none ${statusStyles[applicant.status]}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {applicant.experience}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="solar:star-bold"
                          className="w-3.5 h-3.5 text-amber-400"
                        />
                        <span className="font-semibold text-slate-700">
                          {applicant.rating}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(applicant.appliedDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/recruiter/jobs/${jobId}/applicants/${applicant.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100/80 rounded-lg transition-all"
                      >
                        <Icon icon="solar:eye-linear" className="w-3.5 h-3.5" />
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 px-4 text-center text-slate-400"
                  >
                    Aucun candidat trouvé pour cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredApplicants.length > 0 && (
        <Pagination size="sm">
          <Pagination.Summary>
            {paginationStart} à {paginationEnd} sur {filteredApplicants.length} résultats
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={pageIndex === 0}
                onPress={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              >
                <Pagination.PreviousIcon />
                Précédent
              </Pagination.Previous>
            </Pagination.Item>
            {pages.map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === pageIndex + 1}
                  onPress={() => setPageIndex(p - 1)}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={pageIndex >= pageCount - 1}
                onPress={() => setPageIndex((prev) => Math.min(pageCount - 1, prev + 1))}
              >
                Suivant
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}
