export interface Resources {
    id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
  referenceKeys?: string;
  referenceNoteLinks?: string;
  keyPoints?: string;
  revisionCount : number;
}
