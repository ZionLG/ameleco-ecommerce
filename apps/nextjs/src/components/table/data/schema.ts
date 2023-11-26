import type { z } from "zod";

import type { RouterOutputs } from "@ameleco/api";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
// export const taskSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   status: z.string(),
//   label: z.string(),
//   priority: z.string(),
// });

export type usersSchema = RouterOutputs["auth"]["getUsers"]["data"];

export type userSchema = RouterOutputs["auth"]["getUsers"]["data"][number];
