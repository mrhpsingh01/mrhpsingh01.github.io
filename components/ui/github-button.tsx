'use client';

import React from 'react';
import { GithubLogo } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface GitHubButtonProps {
  href?: string;
  className?: string;
}

export const GitHubButton: React.FC<GitHubButtonProps> = ({
  href = 'https://github.com/mrhpsingh01/portfolio',
  className,
}) => {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="group relative inline-flex items-center justify-center w-36 h-10 select-none cursor-pointer rounded-xl transition-all duration-200 active:scale-95 hover:brightness-105"
        aria-label="View Harmanpreet's portfolio on GitHub"
      >
        {/* Ambient colored backdrop glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-35 blur-md pointer-events-none" />

        {/* Outer subtle shadow */}
        <div className="absolute inset-0 rounded-xl bg-black/30 blur-xs pointer-events-none" />

        {/* Main button body with static iridescent gradient */}
        <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/30 bg-gradient-to-r from-[#d9dfec] via-[#4338ca] to-[#1e1b4b] shadow-inner">
          {/* Specular sheen / glass overlay */}
          <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/25 via-transparent to-black/25 pointer-events-none" />
          <span className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
        </div>

        {/* Content layer */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 px-3 z-10 pointer-events-none">
          <GithubLogo
            weight="fill"
            className="size-5 text-white fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          />
          <span className="text-sm font-semibold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            GitHub
          </span>
        </div>
      </a>
    </div>
  );
};

export default GitHubButton;
