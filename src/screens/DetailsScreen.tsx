import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Icon, Rating } from "react-native-elements";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import { Watch, getWatchDetail } from "../data";
import { getItem, setItem } from "../utils/asyncStorage";
import {
  Box,
  Divider,
  HStack,
  IconButton,
  Pressable,
  Slide,
} from "native-base";

const DetailsScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [favoriteWatches, setFavoriteWatches] = useState<Watch[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { watchId } = route.params;
  const watch = getWatchDetail(watchId);
  const [isOpen, setIsOpen] = useState(false);

  const onNotify = async () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const onPressFavorite = async (item: Watch) => {
    console.log("onPressFavorite", item.id, favoriteWatches.length);
    if (favoriteWatches.findIndex((watch) => watch.id === item.id) !== -1)
      return;

    setFavoriteWatches([...favoriteWatches, item]);
    await setItem("favorite", [...favoriteWatches, item]);
    await onNotify();
  };

  const onPressUnfavorite = async (item: Watch) => {
    console.log("onPressUnfavorite", item.id);
    if (favoriteWatches.findIndex((watch) => watch.id === item.id) === -1)
      return;

    const updatedFavoriteWatches = favoriteWatches.filter(
      (watch) => watch.id !== item.id
    );
    setFavoriteWatches(updatedFavoriteWatches);
    await setItem("favorite", updatedFavoriteWatches);
    await onNotify();
  };

  const checkIsFavorite = (itemId: string) => {
    return favoriteWatches.findIndex((watch) => watch.id === itemId) !== -1;
  };

  useEffect(() => {
    (async () => {
      const data = await getItem("favorite");
      setFavoriteWatches(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsFavorite(checkIsFavorite(watchId));
    })();
  }, [setFavoriteWatches, favoriteWatches]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const data = await getItem("favorite");
      console.log("Focus on Detail", data.length);
      setFavoriteWatches(data);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Slide in={isOpen} placement="bottom">
        <Box
          w="100%"
          height={90}
          position="absolute"
          bottom={0}
          borderRadius="xs"
          backgroundColor={"tomato"}
        >
          <Pressable
            onPress={() => setIsOpen(false)}
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HStack
              space={2}
              alignItems={"center"}
              paddingLeft={2}
              paddingBottom={4}
            >
              {isFavorite ? (
                <>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                  >
                    Added to favourite
                  </Text>
                  <IconButton
                    borderRadius={"full"}
                    style={{ backgroundColor: "#ffffff2c" }}
                    _pressed={{ opacity: 0.6 }}
                    icon={
                      <AntDesign name="arrowright" size={24} color="white" />
                    }
                    onPress={() => {
                      navigation.navigate("Favourite");
                    }}
                  />
                </>
              ) : (
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Removed from favourite
                </Text>
              )}
            </HStack>
          </Pressable>
        </Box>
      </Slide>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{ uri: watch?.image }}
        />
        <TouchableOpacity
          style={styles.favoriteIcon}
          key={watch?.id}
          onPress={() => {
            isFavorite ? onPressUnfavorite(watch) : onPressFavorite(watch);
          }}
        >
          <AntDesign
            name={isFavorite ? "heart" : "hearto"}
            size={35}
            color="tomato"
            style={{ opacity: 0.8 }}
          />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={styles.name}>{watch?.watchName}</Text>
          <View style={styles.cardStats}>
            <View>
              <View style={styles.cardStatsItem}>
                <FeatherIcon color="#48496c" name="watch" size={14} />
                <Text style={styles.cardStatsItemText}>{watch?.brandName}</Text>
              </View>
              {watch?.automatic && (
                <View style={styles.cardStatsItem}>
                  <FeatherIcon color="#48496c" name="zap" size={14} />
                  <Text style={styles.cardStatsItemText}>Automatic</Text>
                </View>
              )}
              <View style={styles.cardStatsItem}>
                <Rating
                  imageSize={18}
                  readonly
                  fractions="{1}"
                  startingValue={watch?.rating}
                />
                <Text style={styles.cardStatsItemText}>
                  ({watch?.rating.toFixed(1) ?? 0})
                </Text>
                <Text style={styles.cardStatsItemText}>
                  {watch?.feedbacks?.length ?? 0} Reviews
                </Text>
              </View>
            </View>
            <Text style={styles.cardPrice}>
              ${watch?.price.toLocaleString("en-US")}
            </Text>
          </View>
          <Text style={styles.about}>About</Text>
          <Text style={styles.description}>{watch?.description}</Text>
          <Text style={styles.feedbacks}>
            Reviews ({watch?.feedbacks?.length ?? 0})
          </Text>
          <ScrollView contentContainerStyle={styles.container}>
            {watch?.feedbacks?.map(
              ({ rating, comment, author, date }, index) => {
                return (
                  <View
                    key={index}
                    // onPress={() => {
                    //   // handle onPress
                    // }}
                  >
                    <View style={styles.feedbackCard}>
                      <View>
                        <View style={styles.feedbackCardTitleWrapper}>
                          <Text style={styles.feedbackCardTitle}>{author}</Text>
                          <View style={styles.feedbackCardStatsItem}>
                            <FeatherIcon
                              color="#636a73"
                              name="clock"
                              style={{ marginRight: 1 }}
                            />
                            <Text style={styles.feedbackCardStatsItemText}>
                              {new Date(date)
                                .toLocaleDateString()
                                .split("/")
                                .join("-") +
                                " " +
                                new Date(date).toTimeString().slice(0, 5)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.feedbackCardStats}>
                          <View style={styles.feedbackCardStatsItem}>
                            <Rating
                              imageSize={16}
                              readonly
                              fractions="{1}"
                              startingValue={rating}
                            />
                          </View>
                        </View>
                        <View style={styles.feedbackCardStatsItem}>
                          <EvilIcons name="comment" size={20} color="black" />
                          <Text style={styles.feedbackCardComment}>
                            {comment}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {index !== (watch.feedbacks?.length ?? 0) - 1 && (
                      <Divider my="3" />
                    )}
                  </View>
                );
              }
            )}
          </ScrollView>
        </View>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Buy now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    //height: '50%',
    height: 400,
    aspectRatio: 1,
    shadowColor: "#000",
    marginVertical: 30,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  info: {
    padding: 20,
    paddingBottom: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  about: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  feedbacks: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
  },
  card: {},
  cardContent: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  shareButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "tomato",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  cardPrice: {
    fontSize: 30,
    fontWeight: "700",
    color: "tomato",
    marginBottom: 5,
  },
  cardStats: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feedbackCardTitleWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardStatsItem: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardStatsItemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#48496c",
    marginLeft: 4,
  },
  // Feedback
  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  feedbackCardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  feedbackCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  feedbackCardStats: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feedbackCardStatsItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  feedbackCardStatsItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#636a73",
    marginLeft: 1,
  },
  feedbackCardComment: {
    fontSize: 13,
    fontWeight: "500",
    color: "#636a73",
    marginLeft: 1,
    maxWidth: "95%",
  },
  feedbackCardAction: {
    marginLeft: "auto",
  },
  favoriteIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    padding: 10,
    top: 10,
    end: 10,
    backgroundColor: "#ffffff",
  },
});
