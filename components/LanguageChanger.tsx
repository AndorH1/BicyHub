import React, { useEffect, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    Modal,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import i18next, { getAllLanguageFlagsService, languageResources } from '../service/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../service/LanguageList.json';
import { HStack, Image } from '@gluestack-ui/themed';

interface LanguageChangerProps {
    visible: boolean;
    onClose: () => void;
}

const LanguageChanger: React.FC<LanguageChangerProps> = ({ visible, onClose }) => {
    const [languageFlags, setLanguageFlags] = useState<{ name: string, flag: string }[]>([]);
    const height = Dimensions.get("window").height;

    const findByName = (name: string): { name: string, flag: string } | undefined => {
        return languageFlags.find(flag => flag.name === name);
    };


    useEffect(() => {

        const saveData = async () => {
            const allFlags = await getAllLanguageFlagsService();
            if (allFlags && allFlags.length > 0) {
                setLanguageFlags(allFlags);
            }
        };
        saveData();
    }, [])


    const changeLng = (lng: string) => {

        i18next.changeLanguage(lng);
        onClose();
    };

    return (
        <View >
            <Modal visible={visible} onRequestClose={onClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: height / 4 }}>
                    <FlatList
                        data={Object.keys(languageResources)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => changeLng(item)}
                                style={{ marginVertical: 20 }}>
                                <HStack>
                                    <View>
                                        <Image
                                            source={{ uri: findByName(item)?.flag }}
                                            style={{ width: 30, height: 30, marginRight: 10 }}
                                            alt='flagImage'
                                        />
                                    </View>
                                    <Text style={{ fontSize: 30 }}>
                                        {languagesList[item as keyof typeof languagesList].nativeName}
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>

    );
}

export default LanguageChanger