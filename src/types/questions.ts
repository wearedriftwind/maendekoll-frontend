export interface Question {
  id: string;
  text: string;
  response_type: string;
  active: boolean;
  frequency: string | null;
  weekday: number | null;
  send_time: string | null;
  channel_type: string | null;
  created_by: string | null;
  created_at: string;
}
