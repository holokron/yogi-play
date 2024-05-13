import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Props {
  children: any;
}

export default function SoundsNavHeader({
  children,
}: Props): React.ReactElement<Props> {
  return (
    <div className="flex justify-center">
      <Tabs value="favourites">
        <TabsList>
          <TabsTrigger value="favourites" className="uppercase">
            {children}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
