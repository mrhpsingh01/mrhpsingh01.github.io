import Image from "next/image";

interface PhoneFrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}

/** A real phone screenshot in a simple device outline. */
export function PhoneFrame({
  src,
  alt,
  width,
  height,
  className = "",
  sizes = "(min-width: 1024px) 190px, 36vw",
}: PhoneFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-[2.25rem] border-[6px] border-[#1e2240] bg-[#1e2240] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="h-auto w-full rounded-[1.75rem]"
      />
    </div>
  );
}
