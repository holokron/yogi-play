import Navigation from "@/components/Navigation";

export interface Props {
  children?: any;
}

export default function DefaultTemplate({ children }: Props): JSX.Element {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
