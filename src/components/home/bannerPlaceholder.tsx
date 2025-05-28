import { useState } from "react";

type ImageWithPlaceholderProps = {
  src: any;
  alt: string;
  width: any;
  height: any;
  className: any;
};

const ImageWithPlaceholder = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageWithPlaceholderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`banner-container`}
      style={{ width: width, height: height }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{ width: width, height: height }}
        className={`${className} image-placeholder ${
          !isLoading ? "image-loaded" : ""
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
