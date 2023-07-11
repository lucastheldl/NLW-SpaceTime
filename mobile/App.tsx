import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import blur from "./src/assets/bg-blur.png";
import Stripes from "./src/assets/stripes.svg";
import Logo from "./src/assets/logo.svg";

import { styled } from "nativewind";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";

const StyleStripes = styled(Stripes);

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/2325b6014536822947b0",
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "2325b6014536822947b0",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  if (!fontsLoaded) {
    //melhor criar um component abaixo
    return null;
  }

  return (
    <ImageBackground
      source={blur}
      imageStyle={{ position: "absolute", left: "-100%" }}
      className="bg-gray-900 px-8 flex-1 items-center relative py-10"
    >
      <StyleStripes className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <Logo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            className="font-alt text-sm uppercase text-black"
            onPress={() => signInWithGithub()}
          >
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com amor no NLW.
      </Text>
      <StatusBar style="light" />
    </ImageBackground>
  );
}
