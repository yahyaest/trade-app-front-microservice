export interface Task {
 id: number;
 name: string;
 description: string;
 task_type: string;
 cron_expression: string;
 retry_number: number;
 enabled: boolean;
 status: string;
 periodic_task: number;
 user: string;
 args: Object;
 begin_date: string;
 end_date: string;
 creation_date: string;
 last_update: string;
}
