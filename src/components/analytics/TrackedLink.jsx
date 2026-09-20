"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";

export default function TrackedLink({
    event,
    params,
    external = false,
    onClick,
    children,
    ...props
}) {
    const handleClick = (e) => {
        track(event, params);
        onClick?.(e);
    };

    if (external) {
        return (
            <a {...props} onClick={handleClick}>
                {children}
            </a>
        );
    }

    return (
        <Link {...props} onClick={handleClick}>
            {children}
        </Link>
    );
}
