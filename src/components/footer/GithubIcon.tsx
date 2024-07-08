import React from "react";
import { Link } from "../markdown";
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
      className="inline-flex items-center gap-2 text-sm text-sub-text"
      href="https://github.com/prestonbourne/www-2024"
      rel="noreferrer"
      target="_blank"
    >
      <GitHubLogoIcon />
        <span>
          {commit ? `#${commit}` : "Source"}
        </span>
    </Link>
  );
};

export default GithubIcon;
