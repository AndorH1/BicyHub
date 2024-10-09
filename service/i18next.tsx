import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from '../locales/en.json'
import hu from '../locales/hu.json'
import ro from '../locales/ro.json'
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

export const languageResources = {
    en: { translation: en },
    hu: { translation: hu },
    ro: { translation: ro },
}

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: languageResources,
})

export async function getAllLanguageFlagsService(): Promise<{ name: string, flag: string }[] | null> {

    try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, "languageFlags"));
        const allFlags: { name: string, flag: string }[] = [];

        querySnapshot.forEach((doc) => {

            const data = doc.data();
            const name = data.name;
            const flag = data.flag;

            allFlags.push({ name, flag });
        });

        return allFlags;
    } catch (error) {
        console.error("Error fetching language flags:", error);
        return null;
    }

}

export default i18next;