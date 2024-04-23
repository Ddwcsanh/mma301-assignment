import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const SearchBar = ({
  searchPhrase,
  setSearchPhrase,
  onSubmitSearch,
}: {
  searchPhrase: string;
  setSearchPhrase: any;
  onSubmitSearch: (search: string) => any;
}) => {
  return (
    <View style={styles.search}>
      <View style={styles.searchInput}>
        <View style={styles.inputWrapper}>
          <TextInput
            // onTextInput={() => {
            //   onSubmitSearch(searchPhrase);
            // }}
            placeholder="Enter watch name"
            placeholderTextColor="#9eadba"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            style={styles.input}
          />

          <View style={styles.inputIcon}>
            <FeatherIcon color="#9eadba" name="search" size={16} />
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          onSubmitSearch(searchPhrase);
          Keyboard.dismiss();
        }}
      >
        <View style={styles.btn}>
          <Text style={styles.btnText}>Search</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchInput: {
    flexGrow: 5,
    flexShrink: 1,
    flexBasis: 0,
    marginRight: 12,
  },
  /** Input */
  input: {
    height: 50,
    backgroundColor: "#f0f6fb",
    paddingLeft: 50,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    position: "absolute",
    width: 50,
    height: 50,
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
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#222",
    borderColor: "#222",
  },
  btnText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
