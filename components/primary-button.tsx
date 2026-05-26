import { PropsWithChildren } from "react";

import { Button } from "@/components/button";

type PrimaryButtonProps = PropsWithChildren<{
  onPress?: () => void;
}>;

export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return <Button onPress={onPress}>{children}</Button>;
}
