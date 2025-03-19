"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { GetClerkUsers } from "@/api/helpers/clerk-fetch-user";

export default function ProgressUserBar() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    GetClerkUsers().then((res) => {
      setProgress(res as number);
    });
  }, []);

  return (
    <div className="max-w-md   mx-auto pb-8">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white text-xs">
          Limited spots available at this price
        </span>
        <span className="text-white text-xs font-medium">
          {progress}% claimed
        </span>
      </div>
      <Progress value={progress} className="h-1.5 bg-white  ease-in " />
    </div>
  );
}
