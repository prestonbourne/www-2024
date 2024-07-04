import React from "react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

function getLatestCommit() {
  const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
  const label = sha ? sha.slice(0, 7) : null;
  return label;
}

const GithubIcon: React.FC = () => {
  const commit = getLatestCommit();

  return (
    <Link
      className="inline-flex items-center gap-1.5 justify-self-end"
      href="https://github.com/prestonbourne/www-2024"
      rel="noreferrer"
      target="_blank"
    >
      <GitHubLogoIcon />
        <span className="hidden text-zinc-350 dark:text-zinc-450 sm:inline">
          {commit ? `#${commit}` : "Source"}
        </span>
    </Link>
  );
};

export default GithubIcon;
