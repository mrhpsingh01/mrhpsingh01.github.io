"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, SealCheck, X } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { certificates, type Certificate } from "@/config/certificates";

const cloudAndInfraCertTitles = [
  "Manage Kubernetes in Google Cloud",
  "Create and Manage Cloud SQL for PostgreSQL Instances",
  "Kubernetes on AMD Instinct GPUs - From Zero to AI Inference",
  "Databricks Accredited Generative AI Fundamentals",
  "AI Engineer for Developers Associate",
  "GitHub Foundations",
  "AI Skills Passport",
  "Web Development Fundamentals",
];

const aiAndLlmCertTitles = [
  "Building with the Claude API",
  "AI Fluency for Builders",
  "Claude 101",
  "Claude Code 101",
  "Introduction to Claude Cowork",
  "AI Foundations",
  "Artificial Intelligence Fundamentals",
  "Data Fundamentals",
];

function getCertList(titles: string[]): Certificate[] {
  return titles
    .map((title) => certificates.find((c) => c.title === title))
    .filter((c): c is Certificate => c !== undefined);
}

const cloudRow = getCertList(cloudAndInfraCertTitles);
const aiRow = getCertList(aiAndLlmCertTitles);

function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer border border-border/60 shadow-xs"
          aria-label="Close modal"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          {cert.badge && (
            <div className="relative flex size-10 shrink-0 items-center justify-center">
              <Image
                src={cert.badge}
                alt={cert.issuer}
                width={40}
                height={40}
                className="size-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-wider text-accent">
              {cert.issuer}
            </span>
            <h3
              id="cert-modal-title"
              className="text-base sm:text-lg font-bold font-serif tracking-tight text-foreground leading-snug line-clamp-2"
            >
              {cert.title}
            </h3>
          </div>
        </div>

        {/* Certificate Display Area */}
        {cert.certificateImage ? (
          <div className="relative mt-4 w-full overflow-hidden rounded-xl border border-border/80 bg-background/60 p-1.5 sm:p-2.5 shadow-xs flex items-center justify-center">
            <Image
              src={cert.certificateImage}
              alt={`${cert.title} certificate`}
              width={1000}
              height={700}
              className="w-full h-auto max-h-[56vh] object-contain rounded-lg"
              priority
            />
          </div>
        ) : (
          <div className="relative mx-auto mt-4 flex size-32 items-center justify-center rounded-2xl border border-border/70 bg-background/80 p-4 shadow-xs">
            {cert.badge ? (
              <Image
                src={cert.badge}
                alt={cert.title}
                width={120}
                height={120}
                className="size-full object-contain drop-shadow-sm"
                priority
              />
            ) : (
              <SealCheck size={72} weight="duotone" className="text-accent" />
            )}
          </div>
        )}

        {cert.note && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed text-center sm:text-left">
            {cert.note}
          </p>
        )}

        {/* Actions Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-border/60">
          {cert.certificateFile && (
            <a
              href={cert.certificateFile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted hover:border-foreground/30 active:scale-95"
            >
              <span>Open Document</span>
              <ArrowUpRight size={15} weight="bold" />
            </a>
          )}

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-accent-strong hover:shadow-md active:scale-95"
            >
              <span>Verify Credential</span>
              <ArrowUpRight size={15} weight="bold" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-muted px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CertPill({
  cert,
  onSelect,
}: {
  cert: Certificate;
  onSelect: (cert: Certificate) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(cert)}
      className="group inline-flex items-center gap-3 rounded-full border border-black/10 dark:border-white/10 bg-white/95 dark:bg-card/95 px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xs transition-all duration-150 hover:border-accent hover:shadow-md hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer text-left"
      title={`Click to view ${cert.title}`}
    >
      {cert.badge ? (
        <div className="relative flex size-8 sm:size-9 shrink-0 items-center justify-center">
          <Image
            src={cert.badge}
            alt={cert.title}
            width={36}
            height={36}
            className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center text-accent">
          <SealCheck size={28} weight="duotone" />
        </span>
      )}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap text-xs font-semibold text-foreground/90 group-hover:text-accent transition-colors">
            {cert.title}
          </span>
          <ArrowUpRight
            size={12}
            className="text-accent shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
          />
        </div>
        <span className="text-[10.5px] font-mono text-muted-foreground">
          {cert.issuer}
        </span>
      </div>
    </button>
  );
}

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <Container className="py-2">
      {/* Section Heading matching Tech Stack */}
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-foreground">
          Certifications
        </h2>
        <p className="text-xs text-muted-foreground font-mono">
          [ Verified credentials in Cloud, Kubernetes, Generative AI &amp; LLM Engineering ]
        </p>
      </div>

      {/* Rotating Marquee Lines for Certifications */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Cloud & Infrastructure */}
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-blue-600" />
            Cloud, Infrastructure &amp; Data
          </div>

          <div className="marquee-container">
            <div
              className="marquee"
              style={{
                animation: "marquee-left 36s linear infinite",
              }}
            >
              {[0, 1, 2].map((copyIndex) =>
                cloudRow.map((cert, idx) => (
                  <CertPill
                    key={`cloud-${copyIndex}-${idx}`}
                    cert={cert}
                    onSelect={setSelectedCert}
                  />
                )),
              )}
            </div>
          </div>
        </div>

        {/* Row 2: AI Systems & LLM APIs */}
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-amber-500" />
            AI Systems &amp; LLM Foundations
          </div>

          <div className="marquee-container">
            <div
              className="marquee"
              style={{
                animation: "marquee-right 40s linear infinite",
              }}
            >
              {[0, 1, 2].map((copyIndex) =>
                aiRow.map((cert, idx) => (
                  <CertPill
                    key={`ai-${copyIndex}-${idx}`}
                    cert={cert}
                    onSelect={setSelectedCert}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedCert && (
        <CertificateModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </Container>
  );
}
