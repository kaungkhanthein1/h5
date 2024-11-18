import { useRef, useState } from "react";

const withFilterTag = (WrapperCompo: any) => {
  const HOC = (props: any) => {
    const secondDivRef = useRef<any>(null);
    const [isSecondDivAtTop, setIsSecondDivAtTop] = useState<any>(false);
    return (
      <WrapperCompo
        {...props}
        secondDivRef={secondDivRef}
        isSecondDivAtTop={isSecondDivAtTop}
        setIsSecondDivAtTop={setIsSecondDivAtTop}
      />
    );
  };
  return HOC;
};

export default withFilterTag;
