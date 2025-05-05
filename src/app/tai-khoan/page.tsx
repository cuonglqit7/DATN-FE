"use client";

import { useSession } from "@/contexts/sessionContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { formatDate } from "@/lib/formatDate";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  gender: "Male" | "Female" | "Other" | null;
  dob: string | null;
  phone: string | null;
  address: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
  google_id: string | null;
}

export default function Page() {
  const { sessionToken } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
              : data.errors || "Không thể tải thông tin người dùng"
          );
        }

        setUser(data.data);
        setFormData(data.data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionToken) {
      fetchUser();
    } else {
      setError("Vui lòng đăng nhập để xem thông tin tài khoản");
      setLoading(false);
    }
  }, [sessionToken]);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setFormData({ ...user, [field]: user?.[field as keyof User] });
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData(user || {});
  };

  const handleUpdate = async (e: React.FormEvent, field: string) => {
    e.preventDefault();
    setLoading(true);

    try {
      let body: FormData | string;
      const headers: HeadersInit = { Authorization: `Bearer ${sessionToken}` };

      if (field === "avatar" && formData[field] instanceof File) {
        const formDataToSend = new FormData();
        if (formData[field].size > 2 * 1024 * 1024) {
          throw new Error("Ảnh không được lớn hơn 2MB");
        }
        formDataToSend.append("avatar", formData[field]);
        body = formDataToSend;
        console.log("Dữ liệu gửi đi (avatar):", [...formDataToSend.entries()]);
      } else {
        const dataToSend = { [field]: formData[field] };
        if (field === "status") {
          dataToSend[field] = formData[field] ? 1 : 0;
        }
        body = JSON.stringify(dataToSend);
        headers["Content-Type"] = "application/json";
        console.log("Dữ liệu gửi đi:", dataToSend);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`,
        {
          method: "PUT",
          headers,
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors || "Không thể cập nhật thông tin");
      }

      setUser(data.data);
      setEditingField(null);
      toast.success("Cập nhật thông tin thành công");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Đang tải...</div>;
  }

  if (error || !user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          {error || "Không có thông tin tài khoản"}
        </p>
        {error === "Vui lòng đăng nhập để xem thông tin tài khoản" && (
          <Button
            className="mt-4"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Thông tin tài khoản
      </h2>
      <div className="flex items-center flex-col md:flex-row gap-4 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || ""} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left space-y-2">
          {editingField === "name" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "name")}
              className="flex gap-2"
            >
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Tên"
              />
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("name")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div>
          <Label className="font-semibold">Giới tính</Label>
          {editingField === "gender" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "gender")}
              className="flex gap-2"
            >
              <select
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as
                      | "Male"
                      | "Female"
                      | "Other"
                      | null,
                  })
                }
                className="border rounded p-2 w-full"
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-700">
                {user.gender
                  ? user.gender === "Male"
                    ? "Nam"
                    : user.gender === "Female"
                    ? "Nữ"
                    : "Khác"
                  : "Chưa cung cấp"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("gender")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div>
          <Label className="font-semibold">Ngày sinh</Label>
          {editingField === "dob" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "dob")}
              className="flex gap-2"
            >
              <Input
                type="date"
                value={formData.dob || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
              />
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-700">
                {user.dob ? formatDate(user.dob) : "Chưa cung cấp"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("dob")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div>
          <Label className="font-semibold">Số điện thoại</Label>
          {editingField === "phone" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "phone")}
              className="flex gap-2"
            >
              <Input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Số điện thoại"
              />
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-700">{user.phone || "Chưa cung cấp"}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("phone")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div>
          <Label className="font-semibold">Địa chỉ</Label>
          {editingField === "address" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "address")}
              className="flex gap-2"
            >
              <Input
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Địa chỉ"
              />
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-700">{user.address || "Chưa cung cấp"}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("address")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {/* <div>
          <Label className="font-semibold">Ảnh đại diện</Label>
          {editingField === "avatar" ? (
            <form
              onSubmit={(e) => handleUpdate(e, "avatar")}
              className="flex gap-2"
            >
              <Input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error("Ảnh không được lớn hơn 2MB");
                      return;
                    }
                    setFormData({ ...formData, avatar: file });
                  } else {
                    toast.error("Vui lòng chọn một file ảnh");
                  }
                }}
              />
              <Button type="submit" disabled={loading || !formData.avatar}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-700">
                {user.avatar ? "Đã có ảnh" : "Chưa cung cấp"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit("avatar")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div> */}
        <div>
          <Label className="font-semibold">Trạng thái tài khoản</Label>
          <p className={user.status ? "text-green-600" : "text-red-500"}>
            {user.status ? "Hoạt động" : "Không hoạt động"}
          </p>
        </div>
        <div>
          <Label className="font-semibold">Ngày tạo tài khoản</Label>
          <p className="text-gray-700">{formatDate(user.created_at)}</p>
        </div>
        <div>
          <Label className="font-semibold">Email đã xác minh</Label>
          <p className="text-gray-700">
            {user.email_verified_at
              ? `Xác minh vào ${formatDate(user.email_verified_at)}`
              : "Chưa xác minh"}
          </p>
        </div>
      </div>
    </div>
  );
}
