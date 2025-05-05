"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetailResType } from "@/schemaValidations/detailproduct.schema";
import { getUser } from "@/server/user";
import { formatDate } from "@/lib/formatDate";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { formatRating } from "@/lib/formatRating";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/sessionContext";
import { RatingStarsInput } from "@/app/san-pham/[cate_slug]/[slug]/RatingStarsInput";
import { toast } from "sonner";

interface TabsDetailProductProps {
  product: ProductDetailResType;
}

export function TabsProductDetail({ product }: TabsDetailProductProps) {
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewsWithUsers, setReviewsWithUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { sessionToken } = useSession();

  const attributes = product.attributes;

  // Hàm lấy thông tin người dùng hiện tại
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Không thể lấy thông tin người dùng: ${res.status}`);
      }
      const data = await res.json();
      console.log("Current user data:", data); // Debug
      return data.data; // Giả định { data: { id, name, avatar } }
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  // Hàm lấy danh sách đánh giá từ server
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/reviews/products/${product.id}/reviews`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Không thể lấy danh sách đánh giá: ${res.status}`);
      }
      const data = await res.json();
      console.log("Reviews data:", data); // Debug
      return data.reviews || []; // Sửa để khớp với { reviews: [...] }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Hàm cập nhật danh sách đánh giá với thông tin người dùng
  const fetchUserDataForReviews = async (reviews: any[]) => {
    try {
      console.log("Processing reviews:", reviews); // Debug
      const reviewsData = await Promise.all(
        reviews.map(async (review) => {
          // User đã được load từ server (with('user:id,name'))
          // Chỉ cần lấy avatar nếu cần
          try {
            const res = await getUser(review.user_id);
            return {
              ...review,
              user: { ...review.user, avatar: res.data.avatar },
            };
          } catch (error) {
            console.error(
              `Error fetching user avatar ${review.user_id}:`,
              error
            );
            return { ...review, user: review.user || { name: "Ẩn danh" } };
          }
        })
      );
      console.log("Reviews with user data:", reviewsData); // Debug
      setReviewsWithUsers(reviewsData);

      // Kiểm tra xem người dùng hiện tại đã đánh giá chưa
      if (currentUser?.id) {
        const hasReviewed = reviewsData.some(
          (review) => review.user_id === currentUser.id
        );
        setHasReviewed(hasReviewed);
        console.log("Has reviewed:", hasReviewed); // Debug
      }
    } catch (error) {
      console.error("Error processing reviews:", error);
    }
  };

  // Kiểm tra trạng thái mua hàng, lấy thông tin người dùng, và lấy đánh giá ban đầu
  useEffect(() => {
    const initialize = async () => {
      try {
        // Lấy thông tin người dùng
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);

        // Kiểm tra trạng thái mua hàng
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/check-purchased?product_id=${product.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(
            `Không thể kiểm tra trạng thái mua hàng: ${res.status}`
          );
        }
        const data = await res.json();
        setCanReview(data.purchased);
        console.log("Can review:", data.purchased); // Debug

        // Lấy danh sách đánh giá
        const reviews = await fetchReviews();
        await fetchUserDataForReviews(reviews);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    if (sessionToken && product.id) {
      initialize();
    }
  }, [product.id, sessionToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!product.id) {
      setErrorMessage("Không tìm thấy sản phẩm. Vui lòng thử lại.");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    if (comment.length < 10) {
      setErrorMessage("Nội dung đánh giá phải có ít nhất 10 ký tự.");
      return;
    }
    if (comment.length > 1000) {
      setErrorMessage("Nội dung đánh giá không được vượt quá 1000 ký tự.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setErrorMessage("Vui lòng chọn số sao từ 1 đến 5.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      product_id: Number(product.id),
      comment: comment.trim(),
      rating: Math.floor(rating),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Submit review error:", errorData); // Debug
        if (res.status === 422) {
          const errors = errorData.errors || {};
          const firstError = Object.values(errors)[0] as string[] | undefined;
          const errorMessage =
            firstError?.[0] ||
            errorData.message ||
            "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
          throw new Error(errorMessage);
        } else if (res.status === 401) {
          throw new Error("Vui lòng đăng nhập để gửi đánh giá.");
        } else if (res.status === 403) {
          throw new Error("Bạn đã đánh giá sản phẩm này rồi.");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("Submit review success:", result); // Debug
      toast.success(result.message);
      setComment("");
      setRating(5);

      // Refetch danh sách đánh giá mới từ server
      const newReviews = await fetchReviews();
      await fetchUserDataForReviews(newReviews);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.message || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="description" className="m-auto">
      <TabsList className="grid w-full grid-cols-3 border">
        <TabsTrigger value="description" className="cursor-pointer">
          Giới thiệu sản phẩm
        </TabsTrigger>
        <TabsTrigger value="info" className="cursor-pointer">
          Thông tin sản phẩm
        </TabsTrigger>
        <TabsTrigger value="reviews" className="cursor-pointer">
          Đánh giá
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="w-full">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
          </CardHeader>
          <CardContent>{product.description ?? "Chưa có mô tả"}</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="info">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {attributes.map((attribute: any, index: number) => (
                <li key={index}>
                  {attribute.attribute_name}: {attribute.attribute_value}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reviews">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Đánh giá của người dùng</CardTitle>
            <CardDescription>
              Các đánh giá của người dùng đã mua {product.product_name} từ Tea
              Bliss.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <div className="text-center text-4xl text-yellow-500">
                {formatRating(product.product_reviews_avg_rating)} trên 5
                <div className="flex justify-center">
                  <RatingStars rating={product.product_reviews_avg_rating} />
                </div>
              </div>
              <div>
                {canReview && !hasReviewed ? (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Đánh giá sản phẩm
                    </h4>
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={handleSubmit}
                    >
                      <textarea
                        placeholder="Viết đánh giá của bạn (10-1000 ký tự)..."
                        className="border rounded p-2 min-h-[100px] resize-y"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={1000}
                      />
                      <RatingStarsInput
                        value={rating}
                        onChange={(value: number) =>
                          setRating(Math.floor(value))
                        }
                      />
                      {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                      )}
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    {hasReviewed
                      ? "Bạn đã đánh giá sản phẩm này."
                      : "Bạn cần đăng nhập hoặc mua sản phẩm này để viết đánh giá."}
                  </p>
                )}
              </div>
            </div>
            <hr className="my-4" />
            <div>
              {reviewsWithUsers.length > 0 ? (
                <ul>
                  {reviewsWithUsers.map((review, index) => (
                    <li
                      key={index}
                      className="p-2 mt-4 border shadow rounded-md"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={review.user?.avatar || "/default-avatar.png"}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="font-bold text-md">
                              {review.user?.name || "Ẩn danh"}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>
                      <div className="mt-2">{review.comment}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có đánh giá nào được duyệt cho sản phẩm này.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
