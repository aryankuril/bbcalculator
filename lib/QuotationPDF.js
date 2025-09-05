import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

// Read the logo file from /public/images and convert to base64
const logoPath = path.resolve('./public/images/emaillogo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoUrl = `data:image/png;base64,${logoBase64}`;

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: '#fff',
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#212121',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1 solid #eee',
    paddingBottom: 10,
    marginBottom: 24,
  },
  leftHeader: { flexDirection: 'column' },
  logo: { width: 80, height: 54 },
  rightHeader: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    fontSize: 10,
    color: '#606060',
    marginTop: 12,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    border: '1 solid #e1e1e1',
    borderRadius: 8,
    padding: 20,
    marginBottom: 42,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1 solid #f7f7f7',
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  lastRow: { borderBottomWidth: 0 },
  leftCol: { fontWeight: 700, width: '65%' },
  labelRegular: { fontWeight: 400 },
  rightCol: {
    width: '35%',
    textAlign: 'right',
    fontWeight: 700,
    color: '#222',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTop: '1 solid #e1e1e1',
  },
  totalLabel: { fontWeight: 700, fontSize: 15, color: '#222' },
  totalValue: { fontWeight: 700, fontSize: 15, color: '#222', textAlign: 'right' },
  phoneLink: { color: '#606060', textDecoration: 'none', fontSize: 10 },
});

const QuotationPDF = ({ costItems, total }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.leftHeader}>
          <Image src={logoUrl} style={styles.logo} />
        </View>
        <View style={styles.rightHeader}>
          <Link src="tel:+919819167856" style={styles.phoneLink}>
            +91 98191 67856
          </Link>
          <Text>hello@bombayblokes.com</Text>
          <Text>www.bombayblokes.com</Text>
        </View>
      </View>

      {/* Main Title */}
      <Text style={styles.mainTitle}>Quotation Summary</Text>

      {/* Card/Table */}
      <View style={styles.card}>
        {costItems.map((item, idx) => (
          <View
            key={idx}
            style={[styles.row, idx === costItems.length - 1 ? styles.lastRow : null]}
          >
            <Text style={styles.leftCol}>
              {item.type}: <Text style={styles.labelRegular}>{item.value}</Text>
            </Text>
            <Text style={styles.rightCol}>{Number(item.price).toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated Cost:</Text>
          <Text style={styles.totalValue}>{Number(total).toLocaleString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;
