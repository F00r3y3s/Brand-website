import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | AInar Legal Agreement",
    description: "Review AInar's comprehensive Terms of Service for our premium digital solutions and AI advisory services in the UAE markets.",
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
