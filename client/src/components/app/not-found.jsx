import Image from "next/image";

import Giraffe from "~/giraffe.png";

export default function NotFound({ message = "404 - Not found", description }) {
  return (
    <div className="flex flex-col items-center justify-center h-full my-auto space-y-4 text-sm select-none">
      <Image
        src={Giraffe}
        alt="404 - Not found"
        width={160}
        className="pointer-events-none"
        draggable={true}
      />
      <div className="text-center">
        <p className="font-semibold">{message}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
