import { VStack, Toast, ToastTitle, ToastDescription, } from "@gluestack-ui/themed";
import React from "react";

interface InformationToastProps {
    text: string;
    id: string;
}

const InformationToast: React.FC<InformationToastProps> = ({
    id,
    text,
}) => {
    return (
        <Toast nativeID={"toast-" + id} action="info" variant="solid" >
            <VStack space="xs">
                <ToastTitle>Info</ToastTitle>
                <ToastDescription>
                    {text}
                </ToastDescription>
            </VStack>
        </Toast>
    );
};

export default InformationToast;