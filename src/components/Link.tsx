"use client"
import React from "react";
import NextLink, {LinkProps as NextLinkProps} from "next/link";

type LinkProps = NextLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };
  

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
    return (
        <NextLink href={href} className="link-animation" {...props}>
            {children}
        </NextLink>
    );
};