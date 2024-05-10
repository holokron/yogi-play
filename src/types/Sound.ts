export default interface Sound {
  id: string;
  name: string;
  path: string;
  tags?: Record<string, boolean>;
  order?: number;
  isNew?: boolean;
}
