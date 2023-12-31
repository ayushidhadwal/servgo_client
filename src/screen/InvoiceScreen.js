import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Divider, Title} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';
import {useTranslation} from 'react-i18next';

import Colors from '../constants/Colors';
import {TextRow} from '../components/TextRow';

const InvoiceScreen = () => {
  const {lang} = useSelector(state => state.lang);
  const {serviceOrdered} = useSelector(state => state.request);

  const {t} = useTranslation('langChange');
  const tableHead = [
    t('serviceTable'),
    t('priceTable'),
    t('qtyTable'),
    t('totalTable'),
  ];

  const tableData = serviceOrdered.serviceDetails.map(m => {
    const service = `${m[`${lang}_service_name`]}, ${
      m[`${lang}_subcategory_name`]
    }, ${m[`${lang}_child_category_name`]},\n(${m.service_desc})`;

    const price = `${serviceOrdered.currency} ${m.st_service_price}`;
    const qty = Number(m.st_qty);
    const total = (Number(m.st_service_price) * qty).toFixed(2);
    const totalPrice = `${serviceOrdered.currency} ${total}`;

    return [service, price, qty, totalPrice];
  });

  const wallet = parseFloat(
    serviceOrdered.booking_details.wallet_pay.replace(',', ''),
  );

  return (
    <ScrollView style={styles.screen}>
      <Title style={styles.title}>
        {t('invoiceNo')} : #{serviceOrdered.booking_details.booking_id}
      </Title>
      {/* <View style={styles.card}>
        <Text style={[styles.bold, { fontSize: RFValue(14) }]}>
          {t('serviceProvide')}
        </Text>
        <Divider style={styles.marginVertical} /> */}
      {/*<TextRow*/}
      {/*  heading={"Store Name"}*/}
      {/*  desc={serviceOrdered.booking_details.company_name}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Addess"}*/}
      {/*  desc={serviceOrdered.booking_details.address}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Email"}*/}
      {/*  desc={serviceOrdered.booking_details.email}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Contact No."}*/}
      {/*  desc={*/}
      {/*    serviceOrdered.booking_details.phone_code +*/}
      {/*    "-" +*/}
      {/*    serviceOrdered.booking_details.mobile*/}
      {/*  }*/}
      {/*/>*/}
      {
        /* <Text style={{ fontWeight: "bold" }}>
          {serviceOrdered.setting.application_name}
        </Text>
        <Text style={{ flexWrap: "wrap" }}>
          {serviceOrdered.setting.address}
      //   </Text>
      // </View> */
        <View style={styles.card}>
          <Text style={{fontWeight: 'bold'}}>
            {serviceOrdered.setting.application_name}
          </Text>
          <Text style={{flexWrap: 'wrap'}}>
            {serviceOrdered.setting.address}
          </Text>
          <Text style={{flexWrap: 'wrap', fontWeight: 'bold'}}>
            {serviceOrdered.setting.servgo_trn}
          </Text>
        </View>
      }
      <View style={[styles.card, {marginVertical: RFValue(10)}]}>
        <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
          {t('custInfo')}
        </Text>
        <Divider style={styles.marginVertical} />
        <TextRow
          heading={t('name')}
          desc={serviceOrdered.booking_details.user_name}
        />
        <TextRow
          heading={t('mob')}
          desc={serviceOrdered.booking_details.addr_phonenumber}
        />
        <TextRow
          heading={t('address')}
          desc={`${serviceOrdered.booking_details.addr_username}\n${serviceOrdered.booking_details.addr_address}
            ${serviceOrdered.booking_details.addr_city}
            ${serviceOrdered.booking_details.addr_country}`}
        />
      </View>
      <View style={[styles.card]}>
        <Text style={[styles.bold, {fontSize: RFValue(13)}]}>
          {t('serviceDesc')} :
        </Text>
        <Divider style={styles.marginVertical} />
        {/*<DataTable>*/}
        {/*  <DataTable.Header>*/}
        {/*    <DataTable.Title>Service Name</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Price</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Qty</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Service Price</DataTable.Title>*/}
        {/*  </DataTable.Header>*/}
        {/*  {serviceOrdered.serviceDetails.map((i, index) => (*/}
        {/*    <DataTable.Row key={index}>*/}
        {/*      <DataTable.Cell>{i.subcategory_name}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>AED {i.st_service_price}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>{i.st_qty}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>*/}
        {/*        {i.st_service_price * i.st_qty}*/}
        {/*      </DataTable.Cell>*/}
        {/*    </DataTable.Row>*/}
        {/*  ))}*/}
        {/*</DataTable>*/}
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            data={tableHead}
            flexArr={[4, 2, 1, 2]}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows
            data={tableData}
            flexArr={[4, 2, 1, 2]}
            textStyle={styles.text}
          />
        </Table>
        <View style={{paddingTop: RFValue(5)}}>
          <TextRow
            heading={t('serviceTotal')}
            desc={
              serviceOrdered.currency +
              ' ' +
              serviceOrdered.booking_details.final_service_price
            }
            style={{fontWeight: 'bold'}}
          />
        </View>
        <Divider />
        {wallet > 0 && (
          <TextRow
            heading={t('walletPay')}
            desc={' - ' + serviceOrdered.booking_details.wallet_pay}
          />
        )}
        <TextRow
          heading={t('vat') + '(5%)'}
          desc={' + ' + serviceOrdered.booking_details.vat_amount}
        />
        <TextRow
          heading={t('amtPaid')}
          desc={
            serviceOrdered.currency +
            ' ' +
            serviceOrdered.booking_details.price_paid
          }
          style={{fontWeight: 'bold'}}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11)},
  row: {height: 28},
});

export default InvoiceScreen;
