import { Batch } from './batch';

export class Associate {
  selected: boolean; // used to identify if user has selected this associate in the table
  id: number; // unique identifier - not shown in application
  firstName: string;
  lastName: string;
  absent: boolean;
  batch: Batch;
  marketingStartDate: Date;
  stagingStartDate: Date;
  confirmationDate: Date;
  projectStartDate: Date;
  stagingEndDate: Date;
  numberInterviews: number;
  repanelCount: number;
  clientName: string;
}
