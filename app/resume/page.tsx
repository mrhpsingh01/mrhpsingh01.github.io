import type { Metadata } from "next";
import Link from "next/link";
import { certificates, groupCertificates } from "@/config/certificates";
import { education } from "@/config/education";
import { experience } from "@/config/experience";
import { getProject, type Project } from "@/config/projects";
import { writing } from "@/config/research";
import {
  resumeHighlightSlug,
  resumeMoreSlugs,
  resumeSelectedSlugs,
  resumeSkills,
  resumeSummary,
  resumeWorkSlugs,
} from "@/config/resume";
import { mailto, profile } from "@/content/profile";
import { PrintButton } from "@/components/resume/PrintButton";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Resume | Harmanpreet Singh",
  description:
    "Curriculum vitae and resume of Harmanpreet Singh: ML/AI Researcher at University of Georgia, production full-stack engineering at Stylabs Technologies and Lykan Technologies, education, selected systems projects, and publications.",
};

function ResumeSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-7 first:border-t-0 print:py-4">
      <h2 id={id} className="kicker mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function lookup(slugs: string[]): Project[] {
  return slugs
    .map((slug) => getProject(slug))
    .filter((project): project is Project => project !== undefined);
}

/** One project on the resume. The highlighted project is shown with expanded highlights. */
function ProjectItem({ project }: { project: Project }) {
  const lead = project.slug === resumeHighlightSlug;

  const highlights = lead
    ? [
        "Built an end-to-end platform around my thesis model: Kafka streaming, FastAPI, React digital-twin viewer, resident simulator, anomaly review, LangGraph assistant and Kubernetes deployment.",
        "Replaced joint multimodal training with independently trained lightweight view experts and local competence weighting, outperforming 4 jointly trained fusion baselines while running at ~1/6th inference cost (591 vs 3,631 MFLOPs).",
        "Achieved state-of-the-art results across 5 CASAS smart-home testbeds (+8.7 macro-F1 on Cairo, +4.1 on Kyoto, +2.7 on Orange4Home, +1.3 on Aruba).",
      ]
    : null;

  return (
    <li
      className={
        lead
          ? "border-l-[3px] border-accent bg-tint px-5 py-4 print:border-0 print:bg-transparent print:p-0"
          : ""
      }
    >
      {lead ? <p className="kicker mb-2">Latest project</p> : null}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className={lead ? "text-[1.35rem]" : "text-[1.15rem]"}>
          <Link href={`/projects/${project.slug}`} className="hover:text-accent font-semibold">
            {project.title}
          </Link>
        </h3>
        <p className="label-mono">
          {project.contextLabel || project.categoryLabel}
          {project.period ? `, ${project.period}` : ""}
        </p>
      </div>
      <p className="mt-1 text-[0.9375rem] text-muted">{project.description}</p>
      {lead && highlights ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] marker:text-accent">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : project.role ? (
        <p className="mt-1 text-[0.9375rem]">
          <span className="label-mono">Role: </span>
          {project.role}
        </p>
      ) : null}
      {lead && project.tech ? (
        <p className="mt-3 text-[0.8125rem] text-muted">Stack: {project.tech.join(", ")}.</p>
      ) : null}
    </li>
  );
}

export default function ResumePage() {
  const selected = lookup(resumeSelectedSlugs);
  const work = lookup(resumeWorkSlugs);
  const more = lookup(resumeMoreSlugs);

  return (
    <div className="editorial-page container-page py-12 sm:py-16 print:py-0">
      <div className="no-print mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker mb-3">Curriculum vitae</p>
          <h1 className="text-display font-serif text-4xl sm:text-5xl font-bold">Resume</h1>
          <p className="mt-3 text-muted">
            Content last updated October 2026. Use the button to print this page or save it as a PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrintButton />
          <ButtonLink href="/work" variant="secondary">
            Explore my work
          </ButtonLink>
        </div>
      </div>

      <article
        aria-label={`Resume of ${profile.name}`}
        className="max-w-[820px] border-t-4 border-double border-fg pt-8 print:max-w-none print:border-0 print:p-0"
      >
        <header className="pb-6">
          <p className="font-serif-heading text-[2.4rem] leading-none font-bold">{profile.name}</p>
          <p className="mt-1 text-muted">
            {profile.role} &middot; {profile.location}
          </p>
          <p className="mt-2 break-words text-[0.9375rem]">
            <a href={mailto} className="link-inline">
              {profile.email}
            </a>
            {" | "}
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-inline">
              github.com/mrhpsingh01
            </a>
            {" | "}
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-inline">
              linkedin.com/in/harmanuga
            </a>
          </p>
        </header>

        {/* 1. Summary */}
        <ResumeSection id="r-summary" title="Summary">
          <p className="max-w-[68ch] leading-relaxed text-[0.96rem]">{resumeSummary}</p>
        </ResumeSection>

        {/* 2. Experience */}
        <ResumeSection id="r-experience" title="Experience">
          <div className="space-y-8">
            {experience.map((job) => (
              <div key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[1.15rem] font-semibold">
                    {job.website ? (
                      <a
                        href={job.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent underline decoration-border hover:decoration-accent underline-offset-4 transition-colors"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                    {", "}
                    {job.role}
                  </h3>
                  <p className="label-mono">{job.periodLong || job.periodShort}</p>
                </div>
                <p className="text-xs text-muted mb-2">{job.locationLong || job.locationShort}</p>
                {job.details && (
                  <ul className="mt-2.5 list-disc space-y-2 pl-5 marker:text-accent text-[0.9375rem] leading-relaxed">
                    {job.details.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                {job.tech && job.tech.length > 0 && (
                  <p className="mt-2.5 text-[0.875rem] text-muted">
                    <span className="font-semibold text-fg">Stack:</span> {job.tech.join(", ")}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* 3. Education */}
        <ResumeSection id="r-education" title="Education">
          <ul className="space-y-5">
            {education.map((entry) => (
              <li key={entry.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-[1.05rem]">
                    {entry.degree}, {entry.school}
                  </h3>
                  <p className="label-mono">{entry.periodLong || entry.periodShort}</p>
                </div>
                <p className="text-xs text-muted">{entry.locationLong || entry.locationShort}</p>
                {entry.details && (
                  <ul className="mt-2 space-y-1 text-[0.9375rem] text-muted">
                    {entry.details.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
                {entry.coursework && (
                  <p className="mt-1 text-[0.9375rem] text-muted">
                    <span className="font-medium text-fg">Coursework:</span>{" "}
                    {entry.coursework.join(", ")}.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </ResumeSection>

        {/* 4. Selected projects */}
        <ResumeSection id="r-projects" title="Selected projects">
          <ul className="space-y-5">
            {selected.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </ul>
        </ResumeSection>

        {/* 5. Work projects */}
        <ResumeSection id="r-work" title="Work projects">
          <ul className="space-y-5">
            {work.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </ul>
        </ResumeSection>

        {/* 6. Research & Publications */}
        <ResumeSection id="r-writing" title="Research &amp; Publications">
          <ul className="space-y-3.5">
            {writing.map((entry) => (
              <li key={entry.title}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="label-mono">[{entry.kind}]</span>
                  <p className="font-semibold text-[0.98rem]">
                    {entry.href ? (
                      <Link href={entry.href} className="hover:text-accent">
                        {entry.title}
                      </Link>
                    ) : (
                      entry.title
                    )}
                  </p>
                </div>
                <p className="text-[0.9375rem] text-muted mt-0.5">{entry.venue}</p>
                {entry.note && (
                  <p className="text-[0.875rem] text-muted mt-0.5">{entry.note}</p>
                )}
              </li>
            ))}
          </ul>
        </ResumeSection>

        {/* 7. Skills */}
        <ResumeSection id="r-skills" title="Skills">
          <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-[11rem_1fr] text-[0.9375rem]">
            {resumeSkills.map((skill) => (
              <div key={skill.group} className="contents">
                <dt className="font-semibold text-fg">{skill.group}</dt>
                <dd className="text-muted">{skill.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        {/* 8. Certifications */}
        {certificates.length > 0 && (
          <ResumeSection id="r-certifications" title="Certifications">
            <ul className="space-y-4">
              {groupCertificates(certificates).map((group) => (
                <li key={group.issuer}>
                  <h3 className="font-semibold text-[0.98rem]">{group.issuer}</h3>
                  <ul className="mt-1 space-y-1 text-[0.9375rem]">
                    {group.items.map((item) => (
                      <li key={item.title}>
                        <span>
                          <span>{item.title}</span>
                          {item.note ? (
                            <span className="text-muted">{`, ${item.note.toLowerCase()}`}</span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </ResumeSection>
        )}

        {/* 9. Additional Systems & Independent Projects */}
        <ResumeSection id="r-more" title="Additional Systems &amp; Course Projects">
          <ul className="space-y-4">
            {more.map((project) => (
              <ProjectItem key={project.slug} project={project} />
            ))}
          </ul>
        </ResumeSection>
      </article>
    </div>
  );
}
