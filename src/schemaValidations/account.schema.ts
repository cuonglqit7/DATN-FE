import z, { boolean } from "zod";

export const AccountRes = z
  .object({
    data: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      email_verified_at: z.string(),
      avatar: z.string(),
      gender: z.string(),
      dob: z.date(),
      phone: z.string(),
      address: z.string(),
      remember_token: z.string(),
      google_id: z.string(),
      status: boolean(),
    }),
    message: z.string(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
  avatar: z.string().url().max(256).optional(), // Avatar phải là URL hợp lệ, có thể không có
  gender: z.enum(["Male", "Female", "Other"]), // Giới hạn giá trị cho gender
  dob: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ), // Chuyển đổi chuỗi thành Date nếu cần
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"), // Kiểm tra số điện thoại hợp lệ
  address: z.string().max(512).optional(), // Giới hạn độ dài
  remember_token: z.string().max(256).optional(),
  google_id: z.string().max(256).optional(),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
