import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | AInar Agency Content Protection",
    description: "Read AInar's privacy policy to understand how we protect your data and ensure strict compliance with UAE data protection regulations.",
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
