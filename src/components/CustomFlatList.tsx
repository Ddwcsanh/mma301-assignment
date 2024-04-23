import React from "react";
import { Animated, FlatListProps, View } from "react-native";
import { useFlatListHook } from "../hooks/useFlatListHook";

type CustomFlatListProps<T> = Omit<FlatListProps<T>, "ListHeaderComponent"> & {
  HeaderComponent?: JSX.Element;
  StickyElementComponent: JSX.Element;
  TopListElementComponent: JSX.Element;
};

function CustomFlatList<T>({
  style,
  ...props
}: CustomFlatListProps<T>): React.ReactElement {
  const [
    scrollY,
    styles,
    onLayoutHeaderElement,
    onLayoutTopListElement,
    onLayoutStickyElement,
  ] = useFlatListHook();

  return (
    <View style={style}>
      <Animated.View
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}
      >
        {props.StickyElementComponent}
      </Animated.View>

      <Animated.View
        style={styles.topElement}
        onLayout={onLayoutTopListElement}
      >
        {props.TopListElementComponent}
      </Animated.View>

      <Animated.FlatList<any>
        showsVerticalScrollIndicator={false}
        {...props}
        ListHeaderComponent={
          <Animated.View onLayout={onLayoutHeaderElement}>
            {props.HeaderComponent}
          </Animated.View>
        }
        ListHeaderComponentStyle={[
          props.ListHeaderComponentStyle,
          styles.header,
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          }
        )}
      />
    </View>
  );
}

export default CustomFlatList;
