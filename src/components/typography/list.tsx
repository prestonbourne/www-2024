import React, { ReactNode } from "react";

type UnorderedListProps = {
  children?: ReactNode;
};

export const UnorderedList: React.FC<UnorderedListProps> = ({ children }) => {
  return <ul className="list-disc ml-6 my-4">{children}</ul>;
};

export const ListItem: React.FC = ({
  children,
}: React.HTMLAttributes<HTMLLIElement>) => {
  return <li className="my-2 text-base">{children}</li>;
};
