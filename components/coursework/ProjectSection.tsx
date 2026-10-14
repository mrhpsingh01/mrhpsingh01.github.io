import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CourseProject } from "@/content/coursework/types";
import { Reveal } from "@/components/ui/Reveal";
import { TagList } from "@/components/ui/Tag";
import { LazyDemo } from "./LazyDemo";

function Column({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className={`rounded-2xl border-2 border-ink ${tone} p-5 sm:p-6`}>
      <h4 className="label-mono">{title}</h4>
      <ul className="mt-3 space-y-2 text-[0.9375rem] text-black font-medium">
        {items.map((item) => (
          <li key={item} className="pl-4 -indent-4 before:mr-2 before:content-['+'] before:text-accent">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One coursework project: write-up, working demo, and the notes about what was changed. */
export function ProjectSection({ project, index }: { project: CourseProject; index: number }) {
  return (
    <section
      id={project.slug}
      aria-labelledby={`${project.slug}-heading`}
      className="scroll-mt-28 border-t border-line py-14 first:border-t-0 sm:py-20"
    >
      <Reveal>
        <p className="label-mono">Project {index + 1}</p>
        <h2 id={`${project.slug}-heading`} className="text-title mt-2 max-w-[24ch]">
          {project.title}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] text-black font-medium">{project.summary}</p>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-ink bg-p3 p-5">
            <dt className="label-mono text-fg">Stack</dt>
            <dd className="mt-1.5">
              <TagList items={project.stack} label={`${project.title}: stack`} />
            </dd>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-p4 p-5">
            <dt className="label-mono text-fg">Who and when</dt>
            <dd className="mt-1 text-[0.9375rem]">
              {project.teamNote}
              {project.period ? `, ${project.period}` : ""}
            </dd>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-p2 p-5 sm:col-span-2 lg:col-span-1">
            <dt className="label-mono text-fg">My contribution</dt>
            <dd className="mt-1 text-[0.9375rem]">{project.contribution}</dd>
          </div>
        </dl>
      </Reveal>

      <div className="chunk mt-10 bg-surface">
        <div className="border-b-[2.5px] border-ink p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="label-mono">Working demo</p>
              <h3 className="text-subtitle mt-1">{project.demo.heading}</h3>
            </div>
            <p className="pill bg-p3 font-mono text-fg">
              Runs in your browser
            </p>
          </div>
          <p className="mt-3 max-w-[70ch] text-[0.9375rem]">
            <span className="font-medium text-accent-strong">Try this: </span>
            {project.demo.tryThis}
          </p>
          <p className="mt-1 max-w-[70ch] text-[0.875rem] text-black font-medium">{project.demo.honesty}</p>
        </div>
        <div className="p-4 sm:p-6">
          <LazyDemo id={project.demo.id} />
        </div>
      </div>

      <Reveal className="mt-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Column title="What the original did" items={project.original} tone="bg-p1" />
          <Column title="How it works" items={project.howItWorks} tone="bg-p2" />
          <Column title="Added for this showcase" items={project.touches} tone="bg-p5" />
        </div>
        {project.notes.length > 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-ink bg-p4 p-5 sm:p-6">
            <h4 className="label-mono">Notes</h4>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {project.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {project.relatedProject ? (
          <p className="mt-6">
            <Link
              href={`/projects/${project.relatedProject.slug}`}
              className="link-inline inline-flex items-center gap-1"
            >
              {project.relatedProject.label}
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
