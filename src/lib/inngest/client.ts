import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "founder-dashboard" });

export type InngestEvents = {
  "gmail/sync.user": {
    data: {
      userId: string;
    };
  };
};
