import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Rating } from "react-native-elements";
import FeatherIcon from "react-native-vector-icons/Feather";
import { CheckBox } from "react-native-elements";
import { Watch } from "../../data";
import { getItem, setItem } from "../../utils/asyncStorage";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Button, FormControl, Modal, Pressable } from "native-base";

type ItemProps = {
  item: Watch;
  isActive: boolean;
  onPressWatchCard: (index: string) => any;
  onPressCheckbox: (index: string) => any;
};

const Item = ({
  item,
  isActive,
  onPressWatchCard,
  onPressCheckbox,
}: ItemProps) => {
  return (
    <View style={[styles.cardWrapper, isActive && styles.cardActive]}>
      {/* <View style={{ alignSelf: "center" }}>
        <CheckBox checked={isActive} onPress={() => onPressCheckbox(item.id)} />
      </View> */}
      <Pressable
        key={item.id}
        onPress={() => {
          onPressWatchCard(item.id);
        }}
        style={[styles.card]}
      >
        <View style={styles.cardTop}>
          <Image
            alt={item.watchName}
            resizeMode="contain"
            style={styles.cardImg}
            source={{ uri: item.image }}
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.watchName}</Text>
            <Text style={styles.cardPrice}>
              ${item.price.toLocaleString("en-US")}
            </Text>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.cardStatsItem}>
              <FeatherIcon color="#48496c" name="watch" size={14} />
              <Text style={styles.cardStatsItemText}>{item.brandName}</Text>
            </View>
            {item.automatic && (
              <View style={styles.cardStatsItem}>
                <FeatherIcon color="#48496c" name="zap" size={14} />
                <Text style={styles.cardStatsItemText}>Automatic</Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>
              {(item.feedbacks?.length as number) > 0
                ? item.feedbacks?.length + " Reviews"
                : ""}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  marginHorizontal: 5,
                  verticalAlign: "bottom",
                  marginTop: "auto",
                }}
              >
                {item.rating.toFixed(1) ?? 0}
              </Text>
              <Rating
                imageSize={14}
                readonly
                fractions="{1}"
                startingValue={item.rating}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default function FavoriteScreen({ navigation }: { navigation: any }) {
  const isFocused = useIsFocused();
  const [favoriteWatches, setFavoriteWatches] = useState<Watch[]>([]);
  const [selectedWatchIds, setSelectedWatchIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const checkIsActive = (itemId: string) => {
    return selectedWatchIds.findIndex((watchId) => watchId === itemId) !== -1;
  };

  const onPressWatchCard = (watchId: string) =>
    navigation.navigate("Details", {
      watchId,
    });

  const onPressDelete = async () => {
    console.log("Click Delete button");

    // const updatedFavoriteWatches = favoriteWatches.filter(
    //   (watch) => !selectedWatchIds.includes(watch.id)
    // );

    setFavoriteWatches([]);
    setSelectedWatchIds([]);
    await setItem("favorite", []);
  };

  const onPressCheckbox = (itemId: string) => {
    console.log("Click Favorite card", itemId);
    if (selectedWatchIds.includes(itemId)) {
      setSelectedWatchIds(
        selectedWatchIds.filter((watchId) => watchId !== itemId)
      );
    } else {
      setSelectedWatchIds([...selectedWatchIds, itemId]);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getItem("favorite");
      const dataWithKey = data.map((data: Watch, index: number) => ({
        key: `${index}`,
        ...data,
      }));
      setFavoriteWatches(dataWithKey);
    })();
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setSelectedWatchIds([]);
      const data = await getItem("favorite");
      console.log("Focus on Favorite", data.length);
      setFavoriteWatches(data);
    });

    return unsubscribe;
  }, [navigation]);

  const EmptyComponent = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.titleStyle}>
          Oops! There's no favorite watch here!
        </Text>
      </View>
    );
  };

  // ================================================================================================

  const closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...favoriteWatches];
    const prevIndex = favoriteWatches.findIndex(
      (item: any) => item.key === rowKey
    );
    newData.splice(prevIndex, 1);
    setFavoriteWatches(newData);
    await setItem("favorite", newData);
  };

  const HiddenItemWithActions = (props: any) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false,
      }).start();
    }

    return (
      <Animated.View
        style={[
          {
            alignItems: "center",
            backgroundColor: "#ffffff",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            // paddingLeft: 15,
            // margin: 5,
            marginBottom: 40,
            borderRadius: 10,
            minHeight: 240,
            maxHeight: "90%",
          },
          { height: rowHeightAnimatedValue },
        ]}
      >
        {!leftActionActivated && (
          <TouchableOpacity
            style={[
              {
                alignItems: "flex-end",
                bottom: 0,
                justifyContent: "center",
                position: "absolute",
                top: 0,
                width: 75,
                paddingRight: 17,
              },
              {
                backgroundColor: "#1f65ff",
                right: 75,
              },
            ]}
            onPress={onClose}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              style={{
                height: 25,
                width: 25,
                marginRight: 7,
              }}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              {
                alignItems: "flex-end",
                bottom: 0,
                justifyContent: "center",
                position: "absolute",
                top: 0,
                width: 75,
                paddingRight: 17,
              },
              {
                backgroundColor: "#f63939",
                right: 0,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              },
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                {
                  alignItems: "flex-end",
                  bottom: 0,
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  width: 75,
                  paddingRight: 17,
                },
                {
                  backgroundColor: "red",
                  right: 0,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                },
              ]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  { height: 25, width: 25, marginRight: 7 },
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={25}
                  color="#fff"
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data: any, rowMap: any) => {
    const rowActionAnimatedValue = new Animated.Value(60);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 60 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          marginBottom: 10,
        }}
      >
        <Text style={styles.title}> Favorite ({favoriteWatches.length})</Text>
        {favoriteWatches.length > 0 && (
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Clear</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        _backdrop={{
          _dark: {
            bg: "coolGray.800",
          },
          bg: "warmGray.500",
        }}
      >
        <Modal.Content maxWidth="350" maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Remove all favourite</Modal.Header>
          <Modal.Body>
            Are you sure you want to remove all favourite watches?
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                colorScheme="#f63939"
                onPress={() => {
                  setShowModal(false);
                  onPressDelete();
                }}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* {favoriteWatches.length > 0 && (
        <View style={styles.search}>
          <Text style={styles.searchInput}>
            {selectedWatchIds.length} selected
          </Text>

          {selectedWatchIds.length > 0 && (
          <TouchableOpacity onPress={onPressDelete}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Clear</Text>
            </View>
          </TouchableOpacity>
          )}
        </View>
      )} */}
      {/* <FlatList
        style={styles.container}
        data={favoriteWatches}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            isActive={checkIsActive(item.id)}
            onPressWatchCard={onPressWatchCard}
            onPressCheckbox={onPressCheckbox}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyComponent}
      /> */}
      <SwipeListView
        showsVerticalScrollIndicator={false}
        data={favoriteWatches}
        style={{ paddingTop: 5, paddingHorizontal: 10, paddingBottom: 10 }}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            isActive={checkIsActive(item.id)}
            onPressWatchCard={onPressWatchCard}
            onPressCheckbox={onPressCheckbox}
          />
        )}
        renderHiddenItem={(data, rowMap) => {
          return renderHiddenItem(data, rowMap);
        }}
        leftOpenValue={0}
        rightOpenValue={-150}
        disableRightSwipe
        ListEmptyComponent={EmptyComponent}
        // onRowDidOpen={onRowDidOpen}
        // leftActivationValue={100}
        // rightActivationValue={-200}
        // leftActionValue={0}
        // rightActionValue={-500}
        // onLeftAction={onLeftAction}
        // onRightAction={onRightAction}
        // onLeftActionStatusChange={onLeftActionStatusChange}
        // onRightActionStatusChange={onRightActionStatusChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  cardWrapper: {
    // width: "100%",
    flexDirection: "row",
    // borderColor: "transparent",
    // borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
  },
  titleStyle: {
    paddingTop: "50%",
    alignSelf: "center",
    color: "black",
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  /** Card */
  card: {
    width: "100%",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: "#fff",
    // margin: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    // borderWidth: 1,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardActive: {
    borderColor: "tomato",
  },
  cardTop: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardImg: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 20,
  },
  cardBody: {
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#2d2d2d",
    width: "80%",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "tomato",
  },
  cardStats: {
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: -12,
  },
  cardStatsItem: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardStatsItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#48496c",
    marginLeft: 4,
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#e9e9e9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardFooterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#909090",
  },
  /** Search */
  search: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginRight: 12,
    marginLeft: 12,
  },
  /** Input */
  input: {
    height: 44,
    backgroundColor: "#f0f6fb",
    paddingLeft: 44,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    position: "absolute",
    width: 44,
    height: 44,
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 12,
    backgroundColor: "#f63939",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
