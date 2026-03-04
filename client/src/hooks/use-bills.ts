import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "./use-toast";

// Helper to log and parse safely
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Invalid response format from server for ${label}`);
  }
  return result.data;
}

export function useBills() {
  return useQuery({
    queryKey: [api.bills.list.path],
    queryFn: async () => {
      const res = await fetch(api.bills.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bills");
      const data = await res.json();
      return parseWithLogging(api.bills.list.responses[200], data, "bills.list");
    },
  });
}

export function useExtractBill() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.bills.extract.path, {
        method: api.bills.extract.method,
        body: formData,
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.bills.extract.responses[400], data, "bills.extract.error");
          throw new Error(error.message);
        }
        throw new Error("Failed to extract bill data");
      }
      return parseWithLogging(api.bills.extract.responses[200], data, "bills.extract.success");
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGenerateBill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: z.infer<typeof api.bills.generate.input>) => {
      const validated = api.bills.generate.input.parse(input);
      const res = await fetch(api.bills.generate.path, {
        method: api.bills.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.bills.generate.responses[400], data, "bills.generate.error");
          throw new Error(error.message);
        }
        throw new Error("Failed to generate bill");
      }
      return parseWithLogging(api.bills.generate.responses[201], data, "bills.generate.success");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bills.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useVerifyBill() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.bills.verify.path, {
        method: api.bills.verify.method,
        body: formData,
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.bills.verify.responses[400], data, "bills.verify.error");
          throw new Error(error.message);
        }
        throw new Error("Failed to verify document");
      }
      return parseWithLogging(api.bills.verify.responses[200], data, "bills.verify.success");
    },
    onError: (error) => {
      toast({
        title: "Verification Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
