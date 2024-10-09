
import { View, Text, HStack, Spinner, Button, Box, Pressable, Image, ButtonText, VStack } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import { bikeRepairService } from '../service/BikeRepairService'
import { useLoadingStore } from '../store/LoadingStore';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from '../components/StackNavigator';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { BikeRepairServiceScreenStyle } from '../style/BikeReapirSericeScreenStyle';
import { useUserStore } from '../store/UserStore';

interface BikeRepairService {
  name: string;
  image: string[];
  owner: string;
}

const BikeRepairServiceScreen = () => {

  const [allBikeRepairServices, setAllBikeRepairServices] = useState<BikeRepairService[]>([]);
  const { isLoading, setIsLoading } = useLoadingStore();
  const navigation = useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  const { t } = useTranslation();
  const { user } = useUserStore();

  useEffect(() => {
    setIsLoading(true);
    const saveData = async () => {
      const bikeRepairServices = await bikeRepairService.getAllBikeRepairServices();
      if (bikeRepairServices && bikeRepairServices.length > 0) {
        setAllBikeRepairServices(bikeRepairServices);
      }
      setIsLoading(false);
    };
    saveData();
  }, []);

  const renderBikeRepairServiceItem = (itemData: ListRenderItemInfo<{ name: string; image: string[]; owner: string }>) => {
    return (
      <Box>
        <Pressable
          onPress={() => navigation.navigate("BikeRepairServicesDetailsScreen", { owner: itemData.item.owner })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: itemData.item.image[0] }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
              alt="image"
            />
            <Text fontSize={18} style={{ alignSelf: "center" }}>{itemData.item.name}</Text>
          </View>
        </Pressable>
      </Box>
    );
  };

  function filterServices(allBikeRepairServices: BikeRepairService[]): void {

    const sortedServices = [...allBikeRepairServices].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    setAllBikeRepairServices(sortedServices);
  }

  return (
    <View>
      {isLoading ? (
        <HStack space="sm" alignItems="center" justifyContent="center">
          <Spinner size={"large"} />
          <Text size="lg">{t("Please Wait")}</Text>
        </HStack>
      ) : (
        <View >
          {user && (

            <HStack style={BikeRepairServiceScreenStyle.addEditButtons}>
              <Button onPress={() => navigation.navigate("AddBikeRepairService")}>
                <ButtonText>Add</ButtonText>
              </Button>
              <Button onPress={() => navigation.navigate("EditBikeRepairService", { owner: user?.private.username })}>
                <ButtonText>Modify</ButtonText>
              </Button>
              <Button onPress={() => filterServices(allBikeRepairServices)}>
                <ButtonText>Sort</ButtonText>
              </Button>
            </HStack>

          )}
          <FlatList
            data={allBikeRepairServices}
            renderItem={renderBikeRepairServiceItem}
            keyExtractor={(item) => item.name}
          />
        </View>
      )}
    </View>
  )
}

export default BikeRepairServiceScreen