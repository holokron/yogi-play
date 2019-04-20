export default interface User {
  id: string;
  displayName: string;
  email: string;
  sounds?: Record<string, boolean>;
}
