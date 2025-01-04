import React from "react";
import { Link } from "@/components/typography";
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
      className="text-sm flex flex-row items-center"
      href="https://github.com/prestonbourne/www-2024"
      rel="noreferrer"
      target="_blank"
    >
      <GitHubLogoIcon className="mr-1" />
      <span>{commit ? `#${commit}` : "Source"}</span>
    </Link>
  );
};

export default GithubIcon;
