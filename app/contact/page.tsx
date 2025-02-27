"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, User, Mail, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/text-area";
import { Layout } from "@/components/layout-page";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const inputVariants = {
  focus: { scale: 1.05, boxShadow: "0 0 0 2px rgba(255,255,255,0.3)" },
};

export default function ContactPage() {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    if (image) {
      console.log("Image:", image.name);
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Success",
      description: "Your message has been sent successfully.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#06b6d4] via-[#3b82f6] to-[#1d4ed8]">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-xl"
              style={{
                perspective: "1000px",
              }}
              whileHover={{
                rotateX: 5,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Get in Touch
              </h1>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div whileFocus="focus" variants={inputVariants}>
                      <label htmlFor="name" className="block text-white mb-2">
                        Name
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          {...register("name")}
                          className="bg-white border-white/10 text-white pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div whileFocus="focus" variants={inputVariants}>
                      <label htmlFor="email" className="block text-white mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="bg-white border-white/10 text-white pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <label htmlFor="message" className="block text-white mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        {...register("message")}
                        className="bg-white border-white/10 text-black pl-10 h-40"
                      />
                      <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    </div>
                    {errors.message && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </motion.div>

                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <label htmlFor="image" className="block text-white mb-2">
                      Upload Image (optional)
                    </label>
                    <div className="relative">
                      <Input
                        id="image"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/5 border-white/10 text-white w-full h-12 flex items-center justify-center"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        {image ? "Change Image" : "Choose Image"}
                      </Button>
                      {image && (
                        <div className="mt-2 flex items-center">
                          <span className="text-white truncate">
                            {image.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="ml-2 text-white hover:text-white/80"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-3 rounded-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="h-6 w-6 border-t-2 border-blue-500 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-white"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-6xl mb-4"
                  >
                    👋
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-4">
                    Thanks for reaching out!
                  </h2>
                  <p>
                    We've received your message and will get back to you soon.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
