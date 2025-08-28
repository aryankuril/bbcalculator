// lib/QuotationPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Link } from '@react-pdf/renderer';


// If your logo is a static file, import it. Otherwise, replace below with your own logo path or data URI.
const logoUrl = 'https://i.postimg.cc/J723TYzC/FINAL-LOGO-05.png';



const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: '#fff',
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#212121',
  },
  // Header Layout
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1 solid #eee',
    paddingBottom: 10,
    marginBottom: 24,
  },
  leftHeader: {
    flexDirection: 'column',
  },
  logo: {
    width: 80,
    height: 54,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 0.2,
    lineHeight: 1.1,
  },
  rightHeader: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    fontSize: 10,
    color: '#606060',
    marginTop: 12,
  },
  // Main Title
  mainTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18,
    color: '#222',
  },
  // Quotation Card
  card: {
    backgroundColor: '#fff',
    border: '1 solid #e1e1e1',
    borderRadius: 8,
    padding: 20,
    marginBottom: 42,
    // enforces shadow if needed: boxShadow: '0 1px 3px #e2e2e2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1 solid #f7f7f7',
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  leftCol: {
    fontWeight: 700,
    width: '65%',
  },
  labelRegular: {
    fontWeight: 400,
  },
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
  totalLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: '#222',
  },
  totalValue: {
    fontWeight: 700,
    fontSize: 15,
    color: '#222',
    textAlign: 'right',
  },
  // Signature section
  signatureSection: {
    marginTop: 60,
    alignItems: 'flex-end',
    width: '100%',
  },
  signatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 10,
    color: '#686868',
    textAlign: 'right',
    marginRight: 18,
    marginBottom: 3,
  },
  signLine: {
    borderTop: '1 solid #888',
    width: 120,
    marginTop: 8,
    marginBottom: 2,
  },
  signLabel: {
    fontWeight: 500,
    fontSize: 11,
    color: '#232323',
    marginTop: 6,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
    color: '#868686',
    letterSpacing: 0.2,
  },
   phoneLink: {
    color: '#606060',
    textDecoration: 'none', // remove underline if you don’t want it
    fontSize: 10,
  },
});

const QuotationPDF = ({ costItems, total }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.leftHeader}>
          {/* If you want to use an Image, uncomment below and ensure logoUrl is set */}
          <Image src={logoUrl} style={styles.logo} />

  
          {/* <Text style={styles.brandName}>BOMBAY{'\n'}BLOKES</Text> */}
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
            style={[
              styles.row,
              idx === costItems.length - 1 ? styles.lastRow : null,
            ]}
            key={idx}
          >
            <Text style={styles.leftCol}>
              <Text>{item.type}</Text>
              {': '}
              <Text style={styles.labelRegular}>{item.value}</Text>
            </Text>
            <Text style={styles.rightCol}>{Number(item.price).toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated Cost:</Text>
          <Text style={styles.totalValue}>{Number(total).toLocaleString()}</Text>
        </View>
      </View>

      {/* Footer */}
      {/* <Text style={styles.footer}>Thank you</Text> */}
    </Page>
  </Document>
);

export default QuotationPDF;
