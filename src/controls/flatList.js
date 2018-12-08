import React, { PureComponent } from 'react';
import { FlatList as RNFlatList, RefreshControl, Dimensions, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import NativeTachyons from 'react-native-style-tachyons';


const windowHeight =Dimensions.get('window').height;

const mapStateToProps = (state) => ({ refreshing: state.appInfo.refreshing, });

class _FlatList extends PureComponent {
  static propTypes = {
    refreshing: PropTypes.bool.isRequired,
    onEndReached: PropTypes.func,
    initialOffset: PropTypes.number,
    data: PropTypes.array.isRequired,
  }


  // Se hizo esta implementación manual de el metodo onEndReached porque solo se manda a llamar una vez, y si llegara 
  // a haber problemas de conexión, ya no habria forma de que se volviera a llamar
  handleScroll = _.debounce(async (position) => {
    const { contentHeight, loadingBottom, refreshing } = this.state;
    const { onEndReached } = this.props;
    if (!loadingBottom && !refreshing && position >= contentHeight - windowHeight*2) {
      this.setState({ loadingBottom: true });
      onEndReached && await onEndReached();
      this.setState({ loadingBottom: false });
    }
  }, 25)


  handleSizeChange = (contentWidth, contentHeight) => {
    this.setState({ contentHeight });
  }

  render() {
    const { refreshing, onEndReached: ignored, loadFromServer, data, ...remainingProps } = this.props;
    return (
      <View style={{ flex: 1 }}>
        { !_.isEmpty(data)
          ? <RNFlatList
            ref={(ref) => { this.flatListRef = ref; }}
            {...remainingProps}
            data={data}
            refreshControl={<RefreshControl refreshing={refreshing} colors={['orange']}/>}
            onContentSizeChange= {this.handleSizeChange}
            onScroll={ (event) => this.handleScroll(event.nativeEvent.contentOffset.y)} />
          : <Text cls='mt6 tc ph4'>No hay elementos para mostrar</Text>
        }
      </View>

    );
  }
}


export const FlatList = connect(mapStateToProps)(NativeTachyons.wrap(_FlatList));
