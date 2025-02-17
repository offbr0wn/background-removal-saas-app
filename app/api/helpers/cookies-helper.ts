import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
const MAX_API_USAGE = 5;
export const setApiUsageCookie = () => {
  let currentUsage = parseInt(Cookies.get("api_usage") || "0", 10);

  if (currentUsage >= MAX_API_USAGE) {
    toast({
      description: "API limit reached. Please sign up and create an account.",
    });

    return false; // Prevent API call
  }

  Cookies.set("api_usage", (currentUsage + 1).toString(), {
    expires: 30, // 30 days
    path: "/",
  });

  return true; // Allow API call
};
