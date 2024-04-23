import { StyleSheet, View } from "react-native";
import React from "react";

import { Dimensions } from "react-native";
import { Platform } from "react-native";

import { brands } from "../data";
import { Image, Pressable, Text } from "native-base";
import Carousel from "react-native-reanimated-carousel";

const CarouselCards = ({ setSelectedBrand }: { setSelectedBrand: any }) => {
  const width = Dimensions.get("window").width;

  return (
    <View>
      <Carousel
        loop={false}
        width={width}
        height={200}
        autoPlay={false}
        data={brands}
        scrollAnimationDuration={800}
        autoPlayInterval={5000}
        pagingEnabled={true}
        snapEnabled={true}
        renderItem={({ item }) => (
          <Pressable alignItems="center" justifyContent="center">
            <Image
              defaultSource={500}
              source={{
                uri: "https://www.realmenrealstyle.com/wp-content/uploads/2023/08/Watch-Details.jpg",
              }}
              alt="watch brand"
              style={{
                aspectRatio: 16 / 9,
                height: "100%",
                minWidth: "100%",
                borderRadius: 10,
              }}
            />
            <Text
              fontSize={"5xl"}
              fontWeight="bold"
              color="white"
              position="absolute"
              textAlign="center"
            >
              {item.brandName}
            </Text>
          </Pressable>
        )}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.85,
          parallaxScrollingOffset: 70,
        }}
        style={{
          paddingBottom: 10,
        }}
        onSnapToItem={(index) => {
          setSelectedBrand(brands[index].brandName);
        }}
      />
      {/* <Carousel
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 60}
        ref={isCarousel}
        data={brands}
        renderItem={_renderItem}
        hasParallaxImages={true}
        vertical={false}
        onSnapToItem={(index) => {
          setSelectedBrand(brands[index].brandName);
          setIndex(index);
        }}
      />
      <Pagination
        dotsLength={brands.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      /> */}
    </View>
  );
};

export default CarouselCards;
