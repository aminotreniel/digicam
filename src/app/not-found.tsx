import Link from "next/link";
import CameraArt from "@/components/camera/CameraArt";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="shell grid place-items-center py-28">
      <div className="max-w-md text-center">
        <div className="mx-auto w-56 opacity-70">
          <CameraArt form="compact" body="#8b8580" bodyDark="#54504c" trim="#c9c3bb" uid="404" seed="404" brand="GRAIN" model="404" powered={false} />
        </div>
        <p className="label mt-8 text-accent">Error 404 · No card inserted</p>
        <h1 className="display mt-4 text-[clamp(32px,5vw,52px)]">That frame doesn&rsquo;t exist</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          The page you were after has either sold out or never existed. The archive is still here.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/shop" variant="accent" size="lg">Browse the archive</Button>
          <Button href="/" variant="outline" size="lg">Home</Button>
        </div>
      </div>
    </div>
  );
}
