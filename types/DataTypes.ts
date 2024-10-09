import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(5),
  email: z.string().email(),
  profilePic: z.string().optional(),
  creationDate: z.string(),
  phoneNumber: z.string().optional(),
  favorites: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
  country: z.string(),
  city: z.string(),
});

export const UserWithInteractionsSchema = z.object({
  private: UserSchema,
  public: z.object({
    Reviews: z.array(
      z.object({
        userName: z.string(),
        review: z.string(),
        profPic: z.string(),
      })
    ),
    likes: z.array(z.string()).optional(),
  }),
});

export type User = z.infer<typeof UserWithInteractionsSchema>;

export type BikeType = "ASPHALT" | "CROSS" | "TANDEM";
export type LogType = {
  id: string;
  type: "SERVICE" | "CRASH" | "ACTIVITY" | "CHANGE" | "UPGRADE";
  date: string;
  description: string;
  distance: number;
  pics?: string[];
  cost?: number;
}[];
export const BikeSchema = z.object({
  id: z.string(),
  owner: z.string(),
  ownerUid: z.string(),
  name: z.string().min(3),
  type: z.enum(["ASPHALT", "CROSS", "TANDEM"]),
  pictures: z.array(z.string()),
  modelYear: z
    .number()
    .lt(new Date().getFullYear() + 1)
    .gt(1900),
  components: z.record(z.string().min(3), z.string().min(3)),
  description: z.string().min(1),
  prevOwners: z.array(z.string().min(1)).optional(),
  value: z.number().optional(),
  secretKey: z.string(),
  log: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["SERVICE", "CRASH", "ACTIVITY", "CHANGE", "UPGRADE"]),
        date: z.string(),
        description: z.string().min(1),
        pics: z.array(z.string()).optional(),
        distance: z.number(),
        cost: z.number().optional(),
      })
    )
    .optional(),
});

export type Bike = z.infer<typeof BikeSchema>;

export const LogSchema = z.object({
  id: z.string(),
  type: z.enum(["SERVICE", "CRASH", "ACTIVITY", "CHANGE", "UPGRADE"]),
  date: z.date(),
  description: z.string().min(1),
  pics: z.array(z.string()).optional(),
  distance: z.number(),
  cost: z.number().optional(),
});

export type logType = "SERVICE" | "CRASH" | "ACTIVITY" | "CHANGE" | "UPGRADE";

export const CommentSchema = z.object({
  writerUsername: z.string(),
  date: z.string(),
  text: z.string(),
  profilePic: z.string(),
});

export type CommentType = z.infer<typeof CommentSchema>;

export const PostSchema = z.object({
  id: z.string(),
  ownerUid: z.string(),
  userName: z.string(),
  profilePic: z.string(),
  date: z.string(),
  text: z.string().min(1),
});

export const PostWithInteractionsSchema = z.object({
  post: PostSchema,
  interactions: z.object({
    likes: z.number(),
    comments: z.array(CommentSchema).optional(),
  }),
});

export type Post = z.infer<typeof PostWithInteractionsSchema>;

export const UserChatSchema = z.object({
  UserInfo: z.object({
    displayName: z.string(),
    profPic: z.string(),
    username: z.string(),
    lastMessage: z.string(),
  }),
});

export type UserChatType = z.infer<typeof UserChatSchema>;

export const MessageSchema = z.object({
  date: z.object({}),
  sender: z.string(),
  text: z.string(),
});

export type MessageType = z.infer<typeof MessageSchema>;

export const BikeRepairSchema = z.object({
  id: z.string(),
  owner: z.string(),
  name: z.string(),
  rating: z.number(),
  image: z.array(z.string()),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  description: z.string(),
});

export type BikeRepairType = z.infer<typeof BikeRepairSchema>;