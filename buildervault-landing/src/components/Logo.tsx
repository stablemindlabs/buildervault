export const LOGO_URL =
  "https://raw.githubusercontent.com/stablemindlabs/buildervault/main/public/buildervault-logo-v3.svg";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={LOGO_URL} alt="BuilderVault logo" className={className} />;
}