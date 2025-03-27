"use client";

import { Copy, CopyCheck, Link, Facebook, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function Share() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fullURL = encodeURIComponent(
    process.env.NEXT_PUBLIC_BASE_URI + pathname
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullURL);
      toast.success("Copy link sản phẩm thành công.");
      setCopied(true);
      setTimeout(() => setOpen(false), 1000);
    } catch (err) {
      toast.error("Copy thất bại, vui lòng thử lại!");
      console.log("Copy thất bại", err);
    }
  };

  const shareOnFacebook = () => {
    const fbShareURL = `https://www.facebook.com/sharer/sharer.php?u=${fullURL}`;
    window.open(fbShareURL, "_blank");
  };

  const shareOnZalo = () => {
    const zaloShareURL = `https://zalo.me/share?url=${fullURL}`;
    window.open(zaloShareURL, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="cursor-pointer">
          <Link />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ link</DialogTitle>
          <DialogDescription>
            Chia sẻ cho nhiều người biết hơn về sản phẩm này.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={decodeURIComponent(fullURL)}
              readOnly
            />
          </div>
          <Button
            onClick={handleCopy}
            size="sm"
            className="px-3 cursor-pointer"
          >
            <span className="sr-only">Copy</span>
            {copied ? <CopyCheck /> : <Copy />}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={shareOnFacebook}
            variant="outline"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </Button>
          <Button
            onClick={shareOnZalo}
            variant="outline"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Zalo</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
