import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Card, Searchbar} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import * as homeActions from '../../store/actions/home';
import {SUB_IMG_URL} from '../../constants/base_url';
import I18n from '../../i18n';

const SearchItem = ({onPress, image, title}) => {
  return (
    <Card onPress={onPress} style={styles.cardContainer}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imgContainer}>
          <Image
            resizeMode="stretch"
            source={{uri: SUB_IMG_URL + image}}
            style={styles.img}
          />
        </View>
        <Text style={styles.itemStyle} numberOfLines={3}>
          {title}
        </Text>
      </View>
    </Card>
  );
};

const AllServiceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {searchData} = useSelector(state => state.home);
  const {lang} = useSelector(state => state.lang);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilteredDataSource([...searchData]);
  }, [searchData]);

  const onSearchHandler = searchText => {
    if (lang === 'en') {
      setFilteredDataSource(
        searchData.filter(item =>
          item.en_subcategory_name
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      );
    }
    setSearch(searchText);
  };

  const setSearchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(homeActions.getSearch());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    setSearchData();
  }, [setSearchData]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _renderItem = ({item}) => {
    return (
      <SearchItem
        onPress={() =>
          navigation.navigate('SubCategories', {
            serviceId: item.id,
            serviceNameEN: item.en_service_name,
            serviceNameAR: item.ar_service_name,
          })
        }
        image={item.image}
        title={
          lang === 'en' ? item.en_subcategory_name : item.ar_subcategory_name
        }
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={I18n.t('search')}
        onChangeText={onSearchHandler}
        value={search}
        style={styles.textInputStyle}
        autoFocus={true}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredDataSource}
        keyExtractor={item => item.id + item.en_subcategory_name}
        renderItem={_renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    fontSize: 14,
    paddingHorizontal: 12,
    flexShrink: 1,
    alignSelf: 'center',
  },
  textInputStyle: {
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  cardContainer: {
    marginHorizontal: 12,
    padding: 12,
    marginBottom: RFValue(8),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  imgContainer: {
    width: 55,
    height: 45,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllServiceScreen;
