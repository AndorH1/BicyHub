import {
  Modal,
  Text,
  HStack,
  Input,
  VStack,
  Select,
  Button,
  InputField,
  ButtonText,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  ChevronDownIcon,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  Icon,
  SelectItem,
} from "@gluestack-ui/themed"
import React, { useState } from "react";
import { Bike, LogSchema, logType } from "../types/DataTypes";
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid"
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface propsType {
  modalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  bike: Bike;
}

const AddLogModal = (props: propsType) => {

  const [date, setDate] = useState("");
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const [type, setType] = useState<logType>("ACTIVITY");
  const [description, setDescription] = useState("");
  const {t} = useTranslation();

  const submit = async () => {
    const log = {
      id: uuidv4(),
      date: date,
      distance: distance,
      cost: cost,
      type: type,
      description: description,
    };

    if (LogSchema.parse(log)) {
      if (!props.bike.log) {
        props.bike.log = [];
      }
      props.bike.log.push(log);
      const docref = doc(FIRESTORE_DB, "testBikes", props.bike.id);
      try {
        await updateDoc(docref, {
          log: props.bike.log,
        });
        props.setModalVisible(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal
      avoidKeyboard={true}
      isOpen={props.modalVisible}
      onClose={() => props.setModalVisible(false)}
    >
      <Modal.Header backgroundColor={config.tokens.colors.white} width={"80%"}>
        <Text fontSize={20}>{t("Add Log")}</Text>
      </Modal.Header>
      <Modal.Body backgroundColor={config.tokens.colors.white}>
        <VStack
          marginTop={2}>
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text>{t("Date")}:</Text>
            <Input
              width={"50%"}
            >
              <InputField placeholder={t("Insert date")}
                onChangeText={(text) => setDate(text)}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>{t("Distance")}:</Text>
            <Input
              width={"50%"}
            >
              <InputField placeholder={t("Distance in km")}
                onChangeText={(text) => setDistance(Number(text))}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>{t("Cost")}:</Text>
            <Input
              width={"50%"}>
              <InputField placeholder={t("Insert cost in euro")}
                onChangeText={(text) => setCost(Number(text))}></InputField>
            </Input>
          </HStack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text>{t("Type")}:</Text>

            <Select minWidth={"$1/2"}>
              <SelectTrigger>
                <SelectInput placeholder={t("Select option")} />

                <Icon as={ChevronDownIcon} />

              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="SERVICE" value="SERVICE" />
                  <SelectItem label="CRASH" value="CRASH" />
                  <SelectItem label="ACTIVITY" value="ACTIVITY" />
                  <SelectItem label="CHANGE" value="CHANGE" />
                  <SelectItem label="UPGRADE" value="UPGRADE" />
                </SelectContent>
              </SelectPortal>
            </Select>

          </HStack>
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text>{t("Description")}:</Text>
            <Input
              width={"50%"}
            >
              <InputField placeholder={t("Insert description")}
                onChangeText={(text) => setDescription(text)}></InputField>
            </Input>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Button onPress={() => props.setModalVisible(false)}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
            <Button
              onPress={() => {
                submit();
              }}
            >
              <ButtonText>{t("Submit")}</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Modal.Body>
    </Modal>
  );
};

export default AddLogModal;
