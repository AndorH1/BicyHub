import { VStack, Toast, ToastTitle, ToastDescription, } from "@gluestack-ui/themed";
import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorAlertProps {
  text: string;
  id: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  id,
  text,
}) => {
  const {t} = useTranslation();
  return (
    <Toast nativeID={"toast-" + id} action="error" variant="solid" >
      <VStack space="xs">
        <ToastTitle>{t("Error")}</ToastTitle>
        <ToastDescription>
          {text}
        </ToastDescription>
      </VStack>
    </Toast>
  );
};

export default ErrorAlert;