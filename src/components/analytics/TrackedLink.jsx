"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";

export default function TrackedLink({ event, params, external = false, children, ...props }) {
    const onClick = () => track(event, params);

    if (external) {
        return (
            <a {...props} onClick={onClick}>
                {children}
            </a>
        );
    }

    return (
        <Link {...props} onClick={onClick}>
            {children}
        </Link>
    );
}
