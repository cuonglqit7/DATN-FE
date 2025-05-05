"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/sessionContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RePaymentProps {
  orderId: string;
}

export default function RePayment({ orderId }: RePaymentProps) {
  const { sessionToken } = useSession();
  const [payment, setPayment] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getPayment = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments/order/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      const payload = await res.json();

      setPayment(payload.data);
    };
    getPayment();
  }, [sessionToken]);

  const handlePayment = () => {
    if (payment) {
      router.push(payment.url_payment);
    }
  };
  return (
    <Button
      onClick={handlePayment}
      variant={"outline"}
      className="text-white cursor-pointer bg-green-400 hover:bg-green-500  transition-all"
    >
      Thay toán ngay
    </Button>
  );
}
