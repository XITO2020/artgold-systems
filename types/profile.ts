export type FontFamily = 
  | 'serif' 
  | 'sans' 
  | 'mono' 
  | 'cursive' 
  | 'fantasy';

export interface UserProfile {
  id: string;
  fontColor: string;
  fontFamily: FontFamily;
  displayName: string;
}