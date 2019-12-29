export default interface Sound {
  id: string;
  name: string;
  path: string;
  tags?: object;
  order?: number;
  isNew?: boolean;
}
