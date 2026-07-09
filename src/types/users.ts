export interface AdminUser {
  id: string;
  name: string;
  slack_user_id: string;
  role: "employee" | "admin";
  is_escalation_contact: boolean;
  active: boolean;
}
