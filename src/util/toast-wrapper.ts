import { useToast } from "@/components/ui/use-toast";

export function wrapWithToast({
  toast,
  callback,
  resourceText,
}: {
  toast: ReturnType<typeof useToast>["toast"];
  callback: () => Promise<void | null>;
  resourceText: string;
}) {
  toast({
    title: `Generating ${resourceText}`,
    description: `Please wait while your ${resourceText} is being created`,
    variant: "default",
  });
  callback()
    .then(() => {
      toast({
        title: `${resourceText} Created`,
        description: `The ${resourceText} has been generated`,
        variant: "default",
      });
    })
    .catch(() => {
      toast({
        title: "Something happened",
        description: `We could not generate the ${resourceText}`,
        variant: "destructive",
      });
    });
}
