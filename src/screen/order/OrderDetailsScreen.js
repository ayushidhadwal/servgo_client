import React from 'react';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Rows, Table } from 'react-native-table-component';
import { RFValue } from 'react-native-responsive-fontsize';

import { useOrderDetails } from '../../hooks/order/useOrderDetails';
import { Loader } from '../../components/common/Loader';
import i18next from 'i18next';

const TextRow = ({ title, description }) => {
  return (
    <HStack>
      <Text flex={1} flexShrink={1} fontWeight="bold">
        {title}
      </Text>
      <Text flex={1}>{description}</Text>
    </HStack>
  );
};

const OrderDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [orderDetails, loading] = useOrderDetails(id);

  const ProductTableHead = ['Product Name', 'Price', 'Qty', 'Sub Total'];

  const ProductTableData = orderDetails.OrderItem.map(m => [
    m.title,
    `${orderDetails.currency}` + ' ' + m.order_price,
    m.order_qty,
    `${orderDetails.currency}` + ' ' + m.order_price,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <VStack space={1} m={4}>
          <TextRow title={i18next.t('langChange:orderId' + ':')} description={orderDetails.orderId} />
          <TextRow
            title={i18next.t('langChange:paymentStatus' + ':')}
            description={orderDetails.paymentStatus}
          />
          <TextRow
            title={i18next.t('langChange:orderStatus' + ':')}
            description={orderDetails.status} />
          <TextRow
            title={i18next.t('langChange:orderAddress' + ':')}
            description={`${orderDetails.addrName}, ${orderDetails.addrAddress}, ${orderDetails.addrCity}, ${orderDetails.addrCountry}`}
          />
          <TextRow
            title={i18next.t('langChange:transactionId' + ':')}
            description={orderDetails.transactionId}
          />
          <TextRow
            title={i18next.t('langChange:totalPrice' + ':')}
            description={orderDetails.totalPrice} />
          <TextRow
            title={i18next.t('langChange:pricePaid' + ':')}
            description={orderDetails.pricePaid} />
          <TextRow
            title={i18next.t('langChange:vatAmount' + ':')}
            description={orderDetails.vatAmount} />
          <TextRow
            title={i18next.t('langChange:walletPay' + ':')}
            description={orderDetails.walletPay} />
          <TextRow
            title={i18next.t('langChange:deliveryCharges' + ':')}
            description={orderDetails.deliveryCharges}
          />
          <TextRow
            title={i18next.t('langChange:deliveryAgent' + ':')}
            description={orderDetails.deliveryAgent}
          />
          <TextRow
            title={i18next.t('langChange:walletRefund' + ':')}
            description={orderDetails.walletRefund}
          />
          <TextRow
            title={i18next.t('langChange:deliveryBoyName' + ':')}
            description={orderDetails.DeliveryBoyName}
          />
          <TextRow
            title={i18next.t('langChange:deliveryBoyNumber' + ':')}
            description={orderDetails.DeliveryBoyNumber}
          />
          <TextRow
            title={i18next.t('langChange:sellerName' + ':')}
            description={orderDetails.sellerName} />
          <TextRow
            title={i18next.t('langChange:sellerAddress' + ':')}
            description={orderDetails.sellerAddress}
            />
          <TextRow
            title={i18next.t('langChange:currency' + ':')}
            description={orderDetails.currency} />
        </VStack>

        {orderDetails.OrderItem.length > 0 && (
          <Box m={4}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row
                data={ProductTableHead}
                style={styles.head}
                textStyle={styles.text}
                flexArr={[4, 2, 1, 2]}
              />
              <Rows
                data={ProductTableData}
                textStyle={styles.text}
                flexArr={[4, 2, 1, 2]}
              />
            </Table>
          </Box>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, fontSize: RFValue(11) },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28 },
});

export default OrderDetailsScreen;
