"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Loader2, User } from "lucide-react";
import { uploadFile, updateUserProfile } from "@/utils/client-api";
import { useUserStore } from "@/utils/store/user-store";
import { IUser } from "@/utils/interface/user.types";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}

export function UpdateUserModal({
  isOpen,
  onClose,
  user,
}: UpdateUserModalProps) {
  const setUser = useUserStore((state) => state.setUser); // Get the setUser function from the store

  const [name, setName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user.avatar_url
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsChanged(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsChanged(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile);
      }

      const data = await updateUserProfile(
        name || undefined,
        avatarUrl !== user.avatar_url ? avatarUrl : undefined
      );

      setUser({
        ...user,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      });

      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile! Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">
            Update Profile
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-4">
              {avatarPreview ? (
                <Image
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="text-sm"
            >
              Change Profile Picture
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Full Name*
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="h-12 mt-2 text-base"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 mt-2 text-base"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <Label className="text-base font-medium">Account Type</Label>
              <Input
                value={
                  user?.type?.charAt(0)?.toUpperCase() + user?.type?.replace('_', ' ')?.toUpperCase()?.slice(1)
                }
                className="h-12 mt-2 text-base bg-gray-50"
                disabled
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isChanged}
              className="h-12 px-6 from-blue-400 to-blue-500 bg-gradient-to-r text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
