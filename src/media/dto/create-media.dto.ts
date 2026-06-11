export class CreateMediaDto {
    entityType: string;
  
    entityId: number;
  
    fileType: 'icon' | 'image';
  
    fileUrl: string;
  
    originalName?: string;
  
    description?: string;
  }